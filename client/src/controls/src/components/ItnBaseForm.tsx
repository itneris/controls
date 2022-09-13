import React, { useCallback, useImperativeHandle, useState, useMemo, useEffect } from "react";
import ItnControl from "./ItnControl";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { LooseObject } from "../base/LooseObject";
import { Validation } from "../base/Validation";
import IBaseFormProps from "../props/IBaseFormProps";

const ItnBaseForm = React.forwardRef<IFormRef, IBaseFormProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return entity!;
        },
        validate() {
            return validateControls();
        }
    }));

    const fields = props.fieldBuilder.Build();

    const getDefaultValues = useCallback(() => {
        let initEntity: LooseObject = {};
        fields.forEach(f => {
            initEntity[f.property] = f.defaultValue ?? null;
        });
        return initEntity;
    }, [props.fieldBuilder]);

    const [entity, setEntity] = useState<LooseObject | null>(props.entity ?? getDefaultValues());
    const [validaion, setValidation] = useState<Validation[]>([]);

    useEffect(() => setEntity(props.entity ?? getDefaultValues()), [props.entity]);


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
        let newValidation: Validation[] = []; 
        fields.forEach(field => {
            const val = entity![field.property];
            const valIsNull =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val === "");
            if (field.required && valIsNull) {
                newValidation.push(new Validation(field.property, `Поле "${field.label}" обязательно для заполнения`))
            }
            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val);
                if (error !== null) {
                    newValidation.push(new Validation(field.property, error))
                }
            }
        });
        setValidation(newValidation);
        return newValidation.length === 0;
    }, [fields, entity]);

    const handleSaveClick = useCallback(() => {
        if (!validateControls()) {
            return;
        }
        props.onSave && props.onSave(entity!);
    }, [entity, validateControls, props.onSave]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDeleteClick = useCallback(() => {
        props.onDelete && props.onDelete(entity!.id);
    }, [entity, props.onDelete, entity]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Paper
                elevation={props.hidePaper ? 0 : undefined}
                sx={props.hidePaper ? undefined : { paddingX: 2, paddingY: 2 }}
            >
                {
                    props.header &&
                    <Box alignItems="center" display="flex" justifyContent="space-between">
                        <Typography variant="h6">{props.header}</Typography>
                        {
                            !props.onDelete ?
                                <Button
                                    color="error"
                                    onClick={handleDeleteClick}
                                    startIcon={<Delete />}
                                    disabled={props.isSaving}
                                    variant="contained"
                                >
                                    {props.deleteBtnText}
                                </Button> :
                                <div></div>

                        }
                    </Box>
                }
                <Box display="flex" gap={2} flexDirection="column">
                    {
                        props.errorLoading !== null ?
                            <Typography variant="body2">{props.errorLoading}</Typography> :
                            fields.map((field) => {
                                if (props.isLoading) {
                                    return <Skeleton key={"fc-" + field.property} height="32px" />
                                } else if (field.custom) {
                                    return <React.Fragment key={"fc-" + field.property}>
                                        {
                                            field.custom(
                                                entity![field.property],
                                                (value) => handleChange(field.property, value),
                                                props.isSaving!,
                                                props.viewOnly!
                                            )
                                        }
                                    </React.Fragment>;
                                } else if (props.viewOnly) {
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
                                        value={entity![field.property] === null || entity![field.property] === undefined ? (field.type === "file" ? null : "") : entity![field.property]}
                                        allowNullInSelect={field.allowNullInSelect}
                                        selectNullLabel={field.selectNullLabel}
                                        noOptionsText={field.noOptionsText!}
                                        passwordLength={field.passwordLength}
                                        placeholder={field.placeholder}
                                        disabled={field.disabled || props.isSaving}
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
                                        accept={field.accept}
                                        cropImageToSize={field.cropImageToSize}
                                        isAvatar={field.isAvatar}
                                        maxFileSize={field.maxFileSize}
                                        withImagePreview={field.withImagePreview}
                                        multiline={field.multiline}
                                        lines={field.lines}
                                        maxLines={field.maxLines}
                                    />                                
                                }
                            })
                    }
                </Box>
            </Paper>
            {
                (props.onSave || props.onCancel) &&
                <Box display="flex" mt={2} justifyContent={props.onSave && props.onCancel ? "space-between" : "flex-end"}>
                    {
                        props.onCancel &&
                        <Button
                            startIcon={<Backspace />}
                            disabled={props.isSaving}
                            variant="contained"
                            onClick={props.onCancel}
                        >
                            {props.cancelBtnText}
                        </Button>
                    }
                    {
                        props.onSave &&
                        <Button
                            startIcon={<Save />}
                            disabled={props.isSaving}
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveClick}
                        >
                            {props.saveBtnText}
                        </Button>
                    }
                </Box>
            }
        </>
    );
});

ItnBaseForm.defaultProps = {
    onChange: null,
    noPadding: false,
    onSave: null,
    onDelete: null,
    onCancel: null,
    entity: null,
    hidePaper: false,
    header: null,
    variant: "outlined",
    isLoading: false,
    isSaving: false,
    errorLoading: null,
    deleteBtnText: "Удалить",
    saveBtnText: "Сохранить",
    cancelBtnText: "Отмена",
    viewOnly: false
}

export default ItnBaseForm;