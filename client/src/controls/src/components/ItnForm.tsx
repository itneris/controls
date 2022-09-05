import React, { useCallback, useImperativeHandle, useState, useRef, useMemo } from "react";
import ItnControl from "./ItnControl";
import IFormProps from "../props/IFormProps";
import { QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Save } from "@mui/icons-material";
import { LooseObject } from "../base/LooseObject";
import { createEntity, getEntity, updateEntity } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import { Validation } from "../base/Validation";

const ItnFormWithQuery = React.forwardRef<IFormRef,IFormProps>((props, ref) => {
    const form = useRef<IFormRef | null>(null);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return form.current!.getCurrentValues();
        },
        validate() {
            return form.current!.validate();
        }
    }));

    if(props.queryClient) {
        return (
            <QueryClientProvider client={props.queryClient}>
                <ItnForm ref={form} {...props} />
            </QueryClientProvider>
        );
    } else {
        return <ItnForm ref={form} {...props} />;
    }
});

const ItnForm = React.forwardRef<IFormRef, IFormProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return entity!;
        },
        validate() {
            return validateControls();
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
    const [validaion, setValidation] = useState<Validation[]>([]);

    const fields = useMemo(() => props.fieldBuilder.Build(), []); // eslint-disable-line react-hooks/exhaustive-deps

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
        onSettled: () => setIsSaving(false)
    });
    const updateQuery = useMutation(updateEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSettled: () => setIsSaving(false)
    });

    const handleChange = useCallback((field: string, value: any) => {
        const newEntity = {
            ...entity,
            [field]: value
        };
        setValidation(validaion.filter(_ => _.property === field));
        setEntity(newEntity);
        props.onChange && props.onChange(field, value);
    }, [props.onChange, entity, setEntity, validaion]); // eslint-disable-line react-hooks/exhaustive-deps

    const validateControls = useCallback(() => {
        let validation: Validation[] = []; 
        fields.forEach(field => {
            const val = entity![field.property];
            const valIsNull =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val === "");
            if (field.required && valIsNull) {
                validaion.push(new Validation(field.property, `Поле "${field.label}" обязательно для заполнения`))
            }
            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val);
                if (error !== null) {
                    validaion.push(new Validation(field.property, error))
                }
            }
        });
        setValidation(validaion);
        return validation.length === 0;
    }, [fields, entity]);

    const handleSaveClick = useCallback(() => {
        if (!validateControls()) {
            return;
        }
        setIsSaving(true);
        if (formType === "create") {
            createQuery.mutate(entity!);
        } else {
            updateQuery.mutate(entity!);
        }
        setIsSaving(false);
        props.onSave && props.onSave();
    }, [entity, validateControls, props.onSave, setIsSaving, entity, formType]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Paper
                elevation={props.hidePaper ? 0 : undefined}
                sx={props.hidePaper ? undefined : { paddingX: 2, paddingY: 2 }}
            >
                {
                    props.header &&
                    <Box alignItems="center" display="flex">
                        <Typography variant="h6">{props.header}</Typography>
                    </Box>
                }
                <Box display="flex" gap={2} flexDirection="column">
                    {
                        errorLoading !== null ?
                            <Typography variant="body2">{errorLoading}</Typography> :
                            fields.map((field) => {
                                if (isLoading) {
                                    return <Skeleton key={"fc-" + field.property} height="32px" />
                                } else if (field.custom) {
                                    return <React.Fragment key={"fc-" + field.property}>
                                        {field.custom(entity![field.property], (value) => handleChange(field.property, value))}
                                    </React.Fragment>;
                                } else if (formType === "view") {
                                    return <Box key={"fc-" + field.property} height="32px" display="flex" gap={2}>
                                        <Typography variant="body2"><b>{field.label}</b></Typography>
                                        <Typography variant="body2">{entity![field.property]}</Typography>
                                    </Box>;
                                } else {
                                    return <ItnControl
                                        key={"fc-" + field.property}
                                        type={field.type}
                                        variant={props.variant!}
                                        onChange={(value) => handleChange(field.property, value)}
                                        value={entity![field.property] ?? ""}
                                        allowNullInSelect={field.allowNullInSelect}
                                        selectNullLabel={field.selectNullLabel}
                                        noOptionsText={field.noOptionsText!}
                                        onClick={field.onClick}
                                        passwordLength={field.passwordLength}
                                        placeholder={field.placeholder}
                                        disabled={field.disabled || isSaving}
                                        display={field.display}
                                        error={validaion.find(_ => _.property === field.property) !== undefined}
                                        errorText={validaion.find(_ => _.property === field.property)?.message}
                                        items={field.items}
                                        label={field.label}
                                        max={field.max}
                                        min={field.min}
                                        maxDate={field.maxDate}
                                        minDate={field.minDate}
                                        tooltip={field.tooltip}
                                    />                                
                                }
                            })
                    }
                </Box>
            </Paper>
            {
                (!props.disableSave || props.onCancel) &&
                <Box display="flex" mt={2} justifyContent={!props.disableSave && props.onCancel ? "space-between" : "flex-end"}>
                    {
                        props.onCancel &&
                        <Button
                            startIcon={<Backspace />}
                            disabled={isSaving}
                            variant="contained"
                            onClick={props.onCancel}
                        >
                            Отмена
                        </Button>
                    }
                    {
                        !props.disableSave &&
                        <Button
                            startIcon={<Save />}
                            disabled={isSaving}
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveClick}
                        >
                            Сохранить
                        </Button>
                    }
                </Box>
            }
        </>
    );
});

ItnForm.defaultProps = {
    onChange: null,
    noPadding: false,
    onSave: null,
    onCancel: null,
    entity: null,
    id: null,
    type: "auto",
    hidePaper: false,
    header: null,
    variant: "outlined",
    disableSave: false
}

export default ItnFormWithQuery;