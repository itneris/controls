import React, { useCallback, useImperativeHandle, useState, useRef, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { LooseObject } from "../base/LooseObject";
import { createEntity, deleteEntity, getEntity, updateEntity } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";

const ItnQueryForm = React.forwardRef<IFormRef, IQueryFormProps>((props, ref) => {
    const baseFormRef = useRef<IFormRef | null>(null);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return baseFormRef.current!.getCurrentValues();
        },
        validate() {
            return baseFormRef.current!.validate();
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

    const [entity, setEntity] = useState<LooseObject | null>(props.entity ?? {});
    const [isLoading, setIsLoading] = useState<boolean>(formType !== "create" && props.entity === null);
    const [errorLoading, setErrorLoading] = useState<string | null>(null); 
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useQuery<AxiosResponse<LooseObject>, AxiosError>(
        [props.apiUrl, props.id],
        getEntity(props.apiUrl ?? "/", props.id ?? ""),
        {
            enabled: formType !== "create" && props.entity == null,
            onError: (err) => {
                setErrorLoading(`Ошибка загрузки данных: ${err.message || (err?.response?.data ?? "").toString()}`);
            },
            onSuccess: (response) => {
                setEntity(response.data);
            },
            onSettled: () => {
                setIsLoading(false);
            }
        }
    );

    const createQuery = useMutation(createEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: () => props.onAfterSave && props.onAfterSave(),
        onSettled: () => setIsSaving(false)
    });
    const updateQuery = useMutation(updateEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: () => props.onAfterSave && props.onAfterSave(),
        onSettled: () => setIsSaving(false)
    });
    const deleteQuery = useMutation(deleteEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: () => props.onAfterDelete && props.onAfterDelete(),
        onSettled: () => setIsSaving(false)
    });

    const handleSave = useCallback((newEntity: LooseObject) => {
        if (formType === "create") {
            createQuery.mutate(newEntity);
        } else {
            updateQuery.mutate(newEntity);
        }
    }, [createQuery, updateQuery, formType]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = useCallback((id: string) => {
        deleteQuery.mutate(id);
    }, [deleteQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ItnBaseForm
            fieldBuilder={props.fieldBuilder}
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
        />
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
    disableDelete: true,
    deleteBtnText: "Удалить",
    saveBtnText: "Сохранить",
    cancelBtnText: "Отмена"
}

export default ItnQueryForm;