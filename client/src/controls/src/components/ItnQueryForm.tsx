import React, { useCallback, useImperativeHandle, useState, useRef, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { LooseObject } from "../base/LooseObject";
import { createEntity, deleteEntity, getEntity, updateEntity } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";
import { IQueryFormRef } from "../base/IQueryFormRef";

const dataURLtoFile = (src: string, name: string) => {
    const arr = src.split(',');
    const mime = arr[0]!.match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], name, { type: mime });
}


const ItnQueryForm = React.forwardRef<IQueryFormRef, IQueryFormProps>((props, ref) => {
    const baseFormRef = useRef<IFormRef | null>(null);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return baseFormRef.current!.getCurrentValues();
        },
        validate() {
            return baseFormRef.current!.validate();
        }, 
        saveEntity() {
            handleSave(baseFormRef.current!.getCurrentValues());
        },
        deleteEntity() {
            handleDelete(baseFormRef.current!.getCurrentValues().id)
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

    const formWithFiles = useMemo(() => {
        return props.fieldBuilder.Build().some(_ => _.type === "file");
    }, [props.fieldBuilder]);

    useQuery<AxiosResponse<LooseObject>, AxiosError>(
        [props.apiUrl, props.id],
        getEntity(props.apiUrl ?? "/", props.id ?? ""),
        {
            enabled: formType !== "create" && props.entity == null,
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
            createQuery.mutate({ entity: newEntity, useFormData: formWithFiles });
        } else {
            updateQuery.mutate({ entity: newEntity, useFormData: formWithFiles });
        }
    }, [createQuery, updateQuery, formType, formWithFiles]); // eslint-disable-line react-hooks/exhaustive-deps

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