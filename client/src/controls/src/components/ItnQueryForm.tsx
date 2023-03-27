import React, { useCallback, useImperativeHandle, useState, useRef, useMemo, useEffect } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { LooseObject } from "../base/LooseObject";
import { createEntity, deleteEntity, getDict, getEntity, updateEntity, getAutocompleteDict } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";
import { IQueryFormRef } from "../base/IQueryFormRef";
import { LooseTimeoutObject } from "../base/LooseTimeoutObject";
import { dataURLtoFile } from "../base/Helpers";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    }
});

const ItnQueryFormWrapper = React.forwardRef<IQueryFormRef, IQueryFormProps>((props, ref) => {
    const form = useRef<IQueryFormRef>(null);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return form.current!.getCurrentValues();
        },
        validate(onErrors) {
            return form.current!.validate(onErrors);
        },
        saveEntity(urlParams) {
            form.current!.saveEntity(urlParams);
        },
        deleteEntity(urlParams) {
            form.current!.deleteEntity(urlParams);
        },
        addError(field, error) {
            form.current!.addError(field, error);
        },
        setEntity(entity) {
            form.current!.setEntity(entity);
        }
    }));

    return <QueryClientProvider client={props.queryClient ?? queryClient} contextSharing >
        <ItnQueryForm ref={form} {...props} />
    </QueryClientProvider>
});


const ItnQueryForm = React.forwardRef<IQueryFormRef, IQueryFormProps>((props, ref) => {
    const baseFormRef = useRef<IFormRef | null>(null);
    const autoCompleteTimeouts = useRef<LooseTimeoutObject>({});

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return baseFormRef.current!.getCurrentValues();
        },
        validate(onErrors) {
            return baseFormRef.current!.validate(onErrors);
        }, 
        saveEntity(urlParams) {
            handleSave(baseFormRef.current!.getCurrentValues(), urlParams);
        },
        deleteEntity(urlParams) {
            handleDelete(baseFormRef.current!.getCurrentValues().id, urlParams)
        },
        addError(field, error) {
            baseFormRef.current!.addError(field, error);
        },
        setEntity(entity) {
            baseFormRef.current!.setEntity(entity);
        }
    }));

    const formType = useMemo(() => {
        if (props.type !== "auto") {
            return props.type;
        }

        if (props.id === null && props.entity === null) {
            return "create";
        } else {
            return "edit";
        }
    }, [props.entity, props.id, props.type]); 

    let fieldBuilder = props.fieldBuilder;

    const [entity, setEntity] = useState<LooseObject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(formType !== "create" && props.entity === null);
    const [errorLoading, setErrorLoading] = useState<string | null>(null); 
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [controlsLoading, setControlsLoading] = useState<LooseObject>({});
    const [autocompleteSearchValues, setAutocompleteSearchValues] = useState<LooseObject>({});
    //const [queriesEnabled, setQueriesEnabled] = useState<string[]>([]);

    useEffect(() => {
        setEntity(props.entity || null);
    }, [props.entity])

    const formWithFiles = useMemo(() => {
        return fieldBuilder.Build().some(_ => _.type === "file");
    }, [fieldBuilder]);

    useQuery<AxiosResponse<LooseObject>, AxiosError>(
        [props.apiUrl, props.id],
        getEntity(props.apiUrl ?? "/", props.id ?? ""),
        {
            enabled: formType !== "create" && props.entity == null && !!props.apiUrl,
            onError: (err) => {
                setErrorLoading(`Ошибка загрузки данных: ${err.message}`);
            },
            onSuccess: (response) => {
                let newEntity = response.data;
                for (let key in newEntity) {
                    if (newEntity[key] !== null && newEntity[key].name && newEntity[key].data) {
                        newEntity[key] = dataURLtoFile(newEntity[key].data, newEntity[key].name);
                    }
                }
                setEntity(newEntity);
                props.onAfterLoad && props.onAfterLoad(newEntity);
            },
            onSettled: () => {
                setIsLoading(false);
            }
        }
    );

    const autocompleteQueries = useQueries({
        queries: fieldBuilder.Build()
            .filter(_ =>
                _.selectApiUrl !== null &&
                (props.type !== "view" || _.type === "select") &&
                (_.type === "autocomplete" || _.type === "select") &&
                (typeof (_.hidden) === "function" ? !_.hidden(entity ?? {}) : !_.hidden) &&
                (typeof (_.disabled) === "function" ? !_.disabled(entity ?? {}) : !_.hidden)
            )
            .map(_ => ({
                queryKey: [_.property, _.selectApiUrl, !_.searchAsType ? null : (autocompleteSearchValues[_.property] || "")],
                queryFn: _.type === "autocomplete" ? getAutocompleteDict : getDict,
                enabled: props.type !== "view",
                onSuccess: (response: AxiosResponse) => {
                    const options = response.data.length === 0 ?
                        [] :
                            _.searchAsType ? 
                            [
                                ...response.data,
                                { id: null, label: "Вводите текст для поиска", disabled: true }
                            ] :
                            response.data;

                    fieldBuilder = fieldBuilder.SetSelectOptions(_.property, options);
                },
                onSettled: () => {
                    //setQueriesEnabled(oldState => [...oldState, _.property]);
                    setControlsLoading((oldState) => ({
                        ...oldState,
                        [_.property]: false
                    }));
                }
            }))
    });

    useEffect(() => {
        autocompleteQueries.forEach(_ => _.refetch());
        if (Object.keys(controlsLoading).length === 0) {
            let loadingState: LooseObject = {};
            fieldBuilder.Build()
                .filter(f => f.selectApiUrl !== null)
                .forEach(f => loadingState[f.property] = true);
            

            setControlsLoading(loadingState);
        }
    }, [fieldBuilder]); // eslint-disable-line react-hooks/exhaustive-deps

    const createQuery = useMutation(createEntity(props.apiUrl!, props.sendAsMultipartFormData!), {
        onMutate: () => {
            setIsSaving(true);
            props.onSavingStateChange!(true);
        },
        onSuccess: (response) => props.onAfterSave && props.onAfterSave(response.data),
        onError: (error) => props.onError && props.onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            props.onSavingStateChange!(true);
        }
    });

    const updateQuery = useMutation(updateEntity(props.apiUrl!, props.sendAsMultipartFormData!), {
        onMutate: () => {
            setIsSaving(true);
            props.onSavingStateChange!(true);
        },
        onSuccess: (response) => props.onAfterSave && props.onAfterSave(response.data),
        onError: (error) => props.onError && props.onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            props.onSavingStateChange!(true);
        }
    });

    const deleteQuery = useMutation(deleteEntity(props.apiUrl!), {
        onMutate: () => {
            setIsSaving(true);
            props.onSavingStateChange!(true);
        },
        onSuccess: (response) => props.onAfterDelete && props.onAfterDelete(response.data),
        onError: (error) => props.onError && props.onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            props.onSavingStateChange!(true);
        }
    });

    const handleSave = useCallback((newEntity: LooseObject, urlParams: LooseObject | null = null) => {
        let allParams: LooseObject | null = null;
        if (props.urlParams !== null) {
            allParams = { ...props.urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }
        if (formType === "create") {
            createQuery.mutate({ entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        } else {
            updateQuery.mutate({ id: props.id ?? newEntity.id, entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        }
    }, [createQuery, updateQuery, formType, formWithFiles, props.urlParams, props.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = useCallback((id: string, urlParams: LooseObject | null = null) => {
        let allParams: LooseObject | null = null;
        if (props.urlParams !== null) {
            allParams = { ...props.urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }

        deleteQuery.mutate({ id: id, urlParams: allParams });
    }, [deleteQuery, props.urlParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAutoCompleteInputChange = useCallback((prop: string, value: string, event: "input" | "clear" | "reset") => {
        if (event === "input" || event === "clear") {
            if (autoCompleteTimeouts.current[prop] !== undefined) {
                clearTimeout(autoCompleteTimeouts.current[prop]);
            }

            autoCompleteTimeouts.current[prop] = setTimeout(() => {
                //autocompleteQueries.forEach(_ => _.refetch());
                setControlsLoading((oldState) => ({
                    ...oldState,
                    [prop]: true
                }));
                setAutocompleteSearchValues(oldValue => ({
                    ...oldValue,
                    [prop]: value
                }));
            }, 300);
        }
    }, []);

    return (
        <ItnBaseForm
            fieldBuilder={fieldBuilder}
            viewOnly={formType === "view"}
            cancelBtnText={props.cancelBtnText}
            deleteBtnText={props.deleteBtnText}
            entity={entity}
            errorLoading={errorLoading}
            header={props.header}
            hidePaper={props.hidePaper}
            isLoading={isLoading}
            isSaving={isSaving}
            noPadding={props.noPadding}
            onCancel={props.onCancel}
            onChange={props.onChange}
            onDelete={props.disableDelete ? undefined : handleDelete}
            onSave={props.disableSave ? undefined : handleSave}
            ref={baseFormRef}
            saveBtnText={props.saveBtnText}
            variant={props.variant}
            headerContent={props.headerContent}
            footerContent={props.footerContent}
            controlsLoading={controlsLoading}
            onAutocompleteInputChange={handleAutoCompleteInputChange}
        >
            {props.children}
        </ItnBaseForm>
    );
});

ItnQueryForm.defaultProps = {
    onChange: null,
    noPadding: false,
    onAfterSave: null,
    onCancel: null,
    entity: null,
    id: null,
    type: "auto",
    hidePaper: false,
    header: null,
    variant: "outlined",
    disableSave: false,
    disableDelete: false,
    deleteBtnText: "Удалить",
    saveBtnText: "Сохранить",
    cancelBtnText: "Отмена",
    urlParams: null,
    onError: null,
    sendAsMultipartFormData: false,
    onSavingStateChange: () => { }
}

export default ItnQueryFormWrapper;