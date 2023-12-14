import React, { useCallback, useImperativeHandle, useState, useRef, useMemo, useEffect, forwardRef } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { createEntity, deleteEntity, getDict, getEntity, updateEntity, getAutocompleteDict } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";
import { IQueryFormRef } from "../base/IQueryFormRef";
import { LooseBoolObject } from "../base/LooseBoolObject";
import { AutoCompleteValue } from "../base/AutoCompleteValue";
import { UrlParams } from "../base/UrlParams";
import { LooseTimeoutObject } from "../base/LooseTimeoutObject";

declare module "react" {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}


function ItnQueryFormInner<T>(props: IQueryFormProps<T>, ref: React.ForwardedRef<IQueryFormRef<T>>) {
    const {
        onChange = null,
        noPadding = false,
        onAfterSave = null,
        onCancel = null,
        entity = null,
        id = null,
        type = "auto",
        hidePaper = false,
        header = null,
        variant = "outlined",
        disableSave = false,
        disableDelete = false,
        deleteBtnText = "Удалить",
        saveBtnText = "Сохранить",
        cancelBtnText = "Отмена",
        urlParams =null,
        onError = null,
        sendAsMultipartFormData = false,
        onSavingStateChange = () => { },
        onAfterLoad = () => { },
        fieldBuilder,
        apiUrl,
        onAfterDelete = null,
        children,
        headerContent,
        footerContent
    } = props;

    const baseFormRef = useRef<IFormRef<T>>(null);
    const autoCompleteTimeouts = useRef<LooseTimeoutObject>({});
    const controlsLoading = useRef<LooseBoolObject>({});

    const queryClient = useQueryClient();

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return baseFormRef.current!.getCurrentValues();
        },
        validate(onErrors) {
            return baseFormRef.current!.validate(onErrors);
        },
        saveEntity(urlParams) {
            handleSave(baseFormRef.current!.getCurrentValues(), urlParams ?? null);
        },
        deleteEntity(urlParams) {
            handleDelete(baseFormRef.current!.getCurrentValues()["id" as keyof T] as string, urlParams)
        },
        addError(field, error) {
            baseFormRef.current!.addError(field, error);
        },
        setEntity(entity) {
            baseFormRef.current!.setEntity(entity);
        },
        refetch() {
            formDataQuery.refetch();
        }
    }));

    const formType = useMemo(() => {
        if (type !== "auto") {
            return type;
        }

        if (id === null && entity === null) {
            return "create";
        } else {
            return "edit";
        }
    }, [entity, id, type]);
    
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [autocompleteSearchValues, setAutocompleteSearchValues] = useState<AutoCompleteValue>({});
    //const [queriesEnabled, setQueriesEnabled] = useState<string[]>([]);

    const formWithFiles = useMemo(() => {
        return fieldBuilder.Build().some(_ => _.type === "file");
    }, [fieldBuilder]);

    const { data: formData, ...formDataQuery } = useQuery({
        queryKey: [apiUrl, id],
        queryFn: getEntity<T>(apiUrl ?? "/", id ?? ""),
        enabled: formType !== "create" && entity == null && !!apiUrl,
        initialData: entity
    });

    useEffect(() => {
        if (formDataQuery.isFetchedAfterMount) {
            onAfterLoad && onAfterLoad(formData);
        }
    }, [formDataQuery.isFetchedAfterMount, onAfterLoad, formData]);

    useEffect(() => {
        queryClient.setQueryData<T>([apiUrl, id], () => entity ?? undefined);
    }, [entity]);

    const autocompleteQueries = useQueries({ 
        queries: fieldBuilder.Build()
            .filter(_ =>
                _.selectApiUrl !== null &&
                (type !== "view" || _.type === "select") &&
                (_.type === "autocomplete" || _.type === "select") &&
                (typeof (_.hidden) === "function" ? !_.hidden(entity ?? {} as T) : !_.hidden) &&
                (_.type === "select" || (typeof (_.disabled) === "function" ? !_.disabled(entity ?? {} as T) : !_.disabled))
            )
            .map(_ => ({
                queryKey: [_.property, _.selectApiUrl, !_.searchAsType ? null : (autocompleteSearchValues[_.property as string] || "")],
                queryFn: _.type === "autocomplete" ? getAutocompleteDict : getDict,
                enabled: type !== "view",
                onSuccess: (response: AxiosResponse) => {
                    const options = response.data.length === 0 ?
                        [] :
                            _.searchAsType ? 
                            [
                                ...response.data,
                                { id: null, label: "Вводите текст для поиска", disabled: true }
                            ] :
                            response.data;

                    fieldBuilder.SetSelectOptions(_.property, options);
                },
                onSettled: () => {
                    //setQueriesEnabled(oldState => [...oldState, _.property]);
                    controlsLoading.current = {
                        ...controlsLoading.current,
                        [_.property]: false
                    };
                }
            }))
    });

    useEffect(() => {
        autocompleteQueries.forEach(_ => _.refetch());
        if (Object.keys(controlsLoading.current).length === 0) {
            let loadingState: LooseBoolObject = {};
            fieldBuilder.Build()
                .filter(f =>
                    f.selectApiUrl !== null &&
                    (type !== "view" || f.type === "select") &&
                    (f.type === "select" || (typeof (f.disabled) === "function" ? !f.disabled(entity ?? {} as T) : !f.disabled))
                )
                .forEach(f => loadingState[f.property as string] = true);
            

            controlsLoading.current = loadingState;
        }
    }, [fieldBuilder, type]); // eslint-disable-line react-hooks/exhaustive-deps

    const createQuery = useMutation({
        mutationFn: createEntity<T>(apiUrl!, sendAsMultipartFormData!), 
        onMutate: () => {
            setIsSaving(true);
            onSavingStateChange(true);
        },
        onSuccess: (response) => onAfterSave && onAfterSave(response.data),
        onError: (error) => onError && onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            onSavingStateChange(false);
        }
    });

    const updateQuery = useMutation({
        mutationFn: updateEntity<T>(apiUrl!, sendAsMultipartFormData!), 
        onMutate: () => {
            setIsSaving(true);
            onSavingStateChange(true);
        },
        onSuccess: (response) => onAfterSave && onAfterSave(response.data),
        onError: (error) => onError && onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            onSavingStateChange(false);
        }
    });

    const deleteQuery = useMutation({
        mutationFn: deleteEntity<T>(apiUrl!), 
        onMutate: () => {
            setIsSaving(true);
            onSavingStateChange(true);
        },
        onSuccess: (response) => onAfterDelete && onAfterDelete(response.data),
        onError: (error) => onError && onError((error as AxiosError)?.response?.data),
        onSettled: () => {
            setIsSaving(false);
            onSavingStateChange(false);
        }
    });

    const handleSave = useCallback((newEntity: T, urlParams: UrlParams | null = null) => {
        let allParams: UrlParams | null = null;
        if (urlParams !== null) {
            allParams = { ...urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }
        if (formType === "create") {
            createQuery.mutate({ entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        } else {
            updateQuery.mutate({ id: id ?? newEntity["id" as keyof T] as string, entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        }
    }, [createQuery, updateQuery, formType, formWithFiles, urlParams, id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = useCallback((id: string, urlParams: UrlParams | null = null) => {
        let allParams: UrlParams | null = null;
        if (urlParams !== null) {
            allParams = { ...urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }

        deleteQuery.mutate({ id: id, urlParams: allParams });
    }, [deleteQuery, urlParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAutoCompleteInputChange = useCallback((prop: keyof T, value: string, event: "input" | "clear" | "reset") => {
        if (type === "view") {
            return;
        }

        const disabledProp = fieldBuilder.Build().find(_ => _.property === prop)?.disabled;
        const isDisabled = typeof (disabledProp) === "function" ? disabledProp(entity ?? {} as T) : disabledProp;
        if (isDisabled) {
            return;
        }

        if ((autocompleteSearchValues[prop as string] ?? "") === value) {
            return;
        }

        if (event === "input" || event === "clear") {
            if (autoCompleteTimeouts.current[prop as string] !== undefined) {
                clearTimeout(autoCompleteTimeouts.current[prop as string]);
            }

            autoCompleteTimeouts.current[prop as string] = setTimeout(() => {
                //autocompleteQueries.forEach(_ => _.refetch());
                controlsLoading.current = {
                    ...controlsLoading.current,
                    [prop]: true
                };
                setAutocompleteSearchValues(oldValue => ({
                    ...oldValue,
                    [prop]: value
                }));
            }, 300);
        }
    }, [type, autocompleteSearchValues, fieldBuilder]);

    return (
        <ItnBaseForm
            fieldBuilder={fieldBuilder}
            viewOnly={formType === "view"}
            cancelBtnText={cancelBtnText}
            deleteBtnText={deleteBtnText}
            entity={formData}
            errorLoading={formDataQuery.isError ? `Ошибка загрузки данных: ${formDataQuery.error.message}` : undefined}
            header={header}
            hidePaper={hidePaper}
            isLoading={formDataQuery.isFetching}
            isSaving={isSaving}
            noPadding={noPadding}
            onCancel={onCancel}
            onChange={onChange}
            onDelete={disableDelete ? undefined : handleDelete}
            onSave={disableSave ? undefined : handleSave}
            ref={baseFormRef}
            saveBtnText={saveBtnText}
            variant={variant}
            headerContent={headerContent}
            footerContent={footerContent}
            controlsLoading={controlsLoading.current}
            onAutocompleteInputChange={handleAutoCompleteInputChange}
        >
            {children}
        </ItnBaseForm>
    );
};

const ItnQueryForm = forwardRef(ItnQueryFormInner);
export default ItnQueryForm;