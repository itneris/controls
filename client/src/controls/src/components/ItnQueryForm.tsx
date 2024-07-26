import React, { useCallback, useImperativeHandle, useState, useRef, useMemo, useEffect, forwardRef, useContext } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { createEntity, deleteEntity, getDict, getEntity, updateEntity, getAutocompleteDict } from "../queries/dataQueries";
import { AxiosError } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";
import { IQueryFormRef } from "../base/IQueryFormRef";
import { LooseBoolObject } from "../base/LooseBoolObject";
import { AutoCompleteValue } from "../base/AutoCompleteValue";
import { UrlParams } from "../base/UrlParams";
import { LooseTimeoutObject } from "../base/LooseTimeoutObject";
import { ItnSelectOption } from "../base/ItnSelectOption";
import { FieldDescription } from "../base/FieldDescription";
import { EMPTY_FUNC } from "../const/utils";
import { ItnFormGlobalContext } from "../localization/ItnFromProvider";

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
        entity: initialEntity = null,
        id = null,
        type = "auto",
        hidePaper = false,
        header = null,
        variant = "outlined",
        disableSave = false,
        disableDelete = false,
        deleteBtnText,
        saveBtnText,
        cancelBtnText,
        urlParams = null,
        onError = null,
        sendAsMultipartFormData = false,
        onSavingStateChange = EMPTY_FUNC,
        onAfterLoad = EMPTY_FUNC,
        fieldBuilder,
        apiUrl,
        onAfterDelete = null,
        children,
        headerContent,
        footerContent
    } = props;

    const { locale } = useContext(ItnFormGlobalContext);

    const baseFormRef = useRef<IFormRef<T>>(null);
    const autoCompleteTimeouts = useRef<LooseTimeoutObject>({});

    const queryClient = useQueryClient();
    const entityQueryKey = useMemo(() => [apiUrl, id], [apiUrl, id]);

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

        if (id === null && initialEntity === null) {
            return "create";
        } else {
            return "edit";
        }
    }, [initialEntity, id, type]);
    
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [autocompleteSearchValues, setAutocompleteSearchValues] = useState<AutoCompleteValue>({});
    const [controlsLoading, setControlsLoading] = useState<LooseBoolObject>({});
    //const [queriesEnabled, setQueriesEnabled] = useState<string[]>([]);

    const formWithFiles = useMemo(() => {
        return fieldBuilder.GetFields().some(_ => _.type === "file");
    }, [fieldBuilder]);

    const { data: formData, ...formDataQuery } = useQuery({
        queryKey: entityQueryKey,
        queryFn: getEntity<T>(apiUrl ?? "/", id ?? ""),
        enabled: formType !== "create" && initialEntity == null && !!apiUrl,
        initialData: initialEntity
    });

    useEffect(() => {
        if (formDataQuery.isFetchedAfterMount && !!formData) {
            onAfterLoad && onAfterLoad(formData);
        }
    }, [formDataQuery.isFetchedAfterMount, onAfterLoad, formData]);

    const controlsForFetch = useMemo(() => {
        return fieldBuilder.GetFields()
            .filter(_ =>
                _.selectApiUrl !== null &&
                (type !== "view" || _.type === "select") &&
                (_.type === "autocomplete" || _.type === "select") &&
                (typeof (_.hidden) === "function" ? !_.hidden(formData ?? {} as T) : !_.hidden) &&
                (_.type === "select" || (typeof (_.disabled) === "function" ? !_.disabled(formData ?? {} as T) : !_.disabled))
            );
    }, [fieldBuilder, type, formData]);

    const getAutoCompleteQueryKey = useCallback((field: FieldDescription<T>) => {
        return [
            field.property,
            field.selectApiUrl,
            !field.searchAsType ? null : (autocompleteSearchValues[field.property as string] || "")
        ]
    }, [autocompleteSearchValues]);

    const autocompleteQueries = useQueries({ 
        queries: controlsForFetch
            .map(_ => {
                return {
                    queryKey: getAutoCompleteQueryKey(_),
                    queryFn: _.type === "autocomplete" ? getAutocompleteDict : getDict
                };
            })
    });

    const queryStatuses = autocompleteQueries.map(_ => _.status);

    useEffect(() => {
        controlsForFetch.forEach(_ => {
            if (controlsLoading[_.property as string] === false) {
                return;
            }

            const queryKey = getAutoCompleteQueryKey(_);
            const state = queryClient.getQueryState(queryKey);

            if (!state || state.status === "pending") {
                return;
            }

            setControlsLoading(old => ({
                ...old,
                [_.property]: false
            }));

            if (state.status === "error") {
                return;
            }

            const data = queryClient.getQueryData(queryKey) as ItnSelectOption[];
            if (data) {
                const options = data.length === 0 ?
                    [] :
                    _.searchAsType ?
                        [
                            ...data,
                            { id: "empty", label: locale.autocompleteControl.helperText, blocked: true } as ItnSelectOption
                        ] :
                        data;

                fieldBuilder.SetSelectOptions(_.property, options);
            }
        });
    }, [autocompleteQueries, controlsForFetch, queryClient, fieldBuilder, getAutoCompleteQueryKey, queryStatuses, controlsLoading])

    const entityRef = useRef(formData);
    useEffect(() => { entityRef.current = formData }, [formData]);
    const autocompleteQueriesRef = useRef(autocompleteQueries);
    useEffect(() => { autocompleteQueriesRef.current = autocompleteQueries }, [autocompleteQueries]);

    useEffect(() => {
        setControlsLoading(prevLoadingState => {
            autocompleteQueriesRef.current.forEach(_ => _.refetch());
            if (Object.keys(prevLoadingState).length === 0) {
                let loadingState: LooseBoolObject = {};
                fieldBuilder.GetFields()
                    .filter(f =>
                        f.selectApiUrl !== null &&
                        (type !== "view" || f.type === "select") &&
                        (f.type === "select" || (typeof (f.disabled) === "function" ? !f.disabled(entityRef.current ?? {} as T) : !f.disabled))
                    )
                    .forEach(f => loadingState[f.property as string] = true);


                return loadingState;
            }

            return prevLoadingState;
        });
    }, [fieldBuilder, type]);

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

    const handleSave = (newEntity: T, addedUrlParams: UrlParams | null = null) => {
        let allParams: UrlParams | null = null;
        if (urlParams !== null) {
            allParams = { ...urlParams };
        }
        if (addedUrlParams !== null) {
            allParams = { ...allParams, ...addedUrlParams };
        }
        if (formType === "create") {
            createQuery.mutate({ entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        } else {
            updateQuery.mutate({ id: id ?? newEntity["id" as keyof T] as string, entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        }
    };

    const handleDelete = (id: string, addedUrlParams: UrlParams | null = null) => {
        let allParams: UrlParams | null = null;
        if (urlParams !== null) {
            allParams = { ...urlParams };
        }
        if (addedUrlParams !== null) {
            allParams = { ...allParams, ...addedUrlParams };
        }

        deleteQuery.mutate({ id: id, urlParams: allParams });
    }; 

    const handleAutoCompleteInputChange = useCallback((prop: keyof T, value: string, event: "input" | "clear" | "reset") => {
        if (type === "view") {
            return;
        }

        const disabledProp = fieldBuilder.GetFields().find(_ => _.property === prop)?.disabled;
        const isDisabled = typeof (disabledProp) === "function" ? disabledProp(formData ?? {} as T) : disabledProp;
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
                setControlsLoading(old => ({ ...old, [prop]: true }));
                setAutocompleteSearchValues(oldValue => ({
                    ...oldValue,
                    [prop]: value
                }));
            }, 300);
        }
    }, [type, autocompleteSearchValues, fieldBuilder, formData, queryClient, entityQueryKey]);

    
    const isFormLoaded = useMemo(() => {
        if (formType === "create" || initialEntity != null || !apiUrl) {
            return true;
        }
        
        return !formDataQuery.isFetching && formData != null;
    }, [formDataQuery.isFetching, formData, formType, initialEntity, apiUrl]);

    return (
        <ItnBaseForm
            fieldBuilder={fieldBuilder}
            viewOnly={formType === "view"}
            cancelBtnText={cancelBtnText ?? locale.common.cancelButtonText}
            deleteBtnText={deleteBtnText ?? locale.common.removeButtonText}
            entity={formData}
            errorLoading={formDataQuery.isError ? locale.form.loadError.replace("{0}", formDataQuery.error.message) : undefined}
            header={header}
            hidePaper={hidePaper}
            isLoading={!isFormLoaded}
            isSaving={isSaving}
            noPadding={noPadding}
            onCancel={onCancel}
            onChange={onChange}
            onDelete={disableDelete ? undefined : handleDelete}
            onSave={disableSave ? undefined : handleSave}
            ref={baseFormRef}
            saveBtnText={saveBtnText ?? locale.common.saveButtonText}
            variant={variant}
            headerContent={headerContent}
            footerContent={footerContent}
            controlsLoading={controlsLoading}
            onAutocompleteInputChange={handleAutoCompleteInputChange}
        >
            {children}
        </ItnBaseForm>
    );
};

const ItnQueryForm = forwardRef(ItnQueryFormInner);
export default ItnQueryForm;