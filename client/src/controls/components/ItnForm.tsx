import React, { useCallback, useImperativeHandle, useState, useRef, useMemo } from "react";
import ItnControl from "./ItnControl";
import IFormProps from "../props/IFormProps";
import { QueryClientProvider } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Save } from "@mui/icons-material";
import { LooseObject } from "../base/LooseObject";

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

    return <ItnForm ref={form} {...props} />;/*
    if (props.queryClient) {
        return (
            <QueryClientProvider client={props.queryClient}>
                <ItnForm ref={form} {...props} />
            </QueryClientProvider>
        );
    } else {
        return <ItnForm ref={form} {...props} />;
    }*/
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

    const [entity, setEntity] = useState<LooseObject | null>(props.entity ?? null);
    const [loading, setLoading] = useState<boolean>(formType !== "create");
    const [saving, setSaving] = useState<boolean>(false);

    const fields = useMemo(() => props.fieldBuilder.Build(), []); // eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = useCallback((field: string, value: any) => {
        const newEntity = {
            ...entity,
            [field]: value
        };
        setEntity(newEntity);
        props.onChange && props.onChange(field, value);
    }, [props.onChange, entity, setEntity]); // eslint-disable-line react-hooks/exhaustive-deps

    const validateControls = useCallback(() => {
        return true;
    }, [fields, entity]);

    const handleSaveClick = useCallback(() => {
        if (!validateControls()) {
            return;
        }
        setSaving(true);
        ///
        setSaving(false);
        props.onSave && props.onSave();
    }, [entity, validateControls, props.onSave, setSaving]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Paper
                elevation={props.hidePaper ? 0 : undefined}
            >
                {
                    props.header &&
                    <Box alignItems="center" display="flex">
                        <Typography variant="h6">{props.header}</Typography>
                    </Box>
                }
                <Box display="flex" gap={2} flexDirection="column">
                    {
                        fields.map((field) => {
                            if (loading) {
                                return <Skeleton height="32px" />
                            } else if (field.custom) {
                                return field.custom;
                            } else if (formType === "view") {
                                return <Box height="32px" display="flex" gap={2}>
                                    <Typography variant="body2"><b>{field.label}</b></Typography>
                                    <Typography variant="body2">{entity![field.property]}</Typography>
                                </Box>;
                            } else {
                                return <ItnControl
                                    key={"fc-" + field.property}
                                    type={field.type}
                                    variant={props.variant!}
                                    onChange={(value) => handleChange(field.property, value)}
                                    value={entity![field.property]}
                                    allowNullInSelect={field.allowNullInSelect}
                                    selectNullLabel={field.selectNullLabel}
                                    noOptionsText={field.noOptionsText!}
                                    onClick={field.onClick}
                                    passwordLength={field.passwordLength}
                                    placeholder={field.placeholder}
                                    disabled={field.disabled}
                                    display={field.display}
                                    //error={field.error}
                                    //errorText={field.errorText}
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
                            disabled={saving}
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
                            disabled={saving}
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