import React, { useCallback, useImperativeHandle, useState, useEffect } from "react";
import ItnControl from "./ItnControl";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { LooseObject } from "../base/LooseObject";
import { Validation } from "../base/Validation";
import IBaseFormProps from "../props/IBaseFormProps";
import fi from "date-fns/esm/locale/fi";

const ItnBaseForm = React.forwardRef<IFormRef, IBaseFormProps>((props, ref) => {
    const fields = props.fieldBuilder.Build();

    const getDefaultValues = useCallback(() => {
        let initEntity: LooseObject = {};
        fields.forEach(f => {
            initEntity[f.property] = f.defaultValue ?? null;
        });
        return initEntity;
    }, [fields]);

    const [entity, setEntity] = useState<LooseObject | null>(props.entity ?? getDefaultValues());
    const [validation, setValidation] = useState<Validation[]>([]);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return entity!;
        },
        validate() {
            return validateControls();
        },
        addError(field, error) {
            setValidation([...validation, { property: field, message: error }]);
        }
    }));

    useEffect(() => setEntity(props.entity ?? getDefaultValues()), [props.entity]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = useCallback((field: string, value: any) => {
        const newEntity = {
            ...entity,
            [field]: value
        };
        setValidation(validation.filter(_ => _.property !== field));
        setEntity(newEntity);
        props.onChange && props.onChange(field, value);
    }, [props.onChange, entity, setEntity, validation]); // eslint-disable-line react-hooks/exhaustive-deps

    const validateControls = useCallback(() => {
        let newValidation: Validation[] = []; 
        fields.forEach(field => {
            const val = entity![field.property];
            const valIsNull =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val === "");

            if (field.required && valIsNull) {
                newValidation.push(new Validation(field.property, `Поле "${field.label}" обязательно для заполнения`));
            }

            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val, entity ?? {});
                if (error !== null) {
                    newValidation.push(new Validation(field.property, error))
                }
            }

            if (field.type === "date") {
                if (field.maxDate !== null && new Date(val) > field.maxDate) {
                    newValidation.push(new Validation(field.property, `Поле "${field.label}" не может быть больше ${field.maxDate.toLocaleDateString("ru-RU")}`))
                } else if (field.minDate !== null && new Date(val) < field.minDate) {
                    newValidation.push(new Validation(field.property, `Поле "${field.label}" не может быть меньше ${field.minDate.toLocaleDateString("ru-RU")}`))
                }
            }

            if (field.type === "number") {
                if (isNaN(+val)) {
                    newValidation.push(new Validation(field.property, `Некорректное числовое значение`))
                } else if (!field.allowNegative && val.includes("-")) {
                    newValidation.push(new Validation(field.property, `Значение должно быть больше 0`))
                } else if (!field.allowDecimals && (val.includes(".") || val.includes(","))) {
                    newValidation.push(new Validation(field.property, `Значение должно быть целым числом`))
                } else  if (field.max !== null && +val > field.max) {
                    newValidation.push(new Validation(field.property, `Поле "${field.label}" не может быть больше ${field.max}`))
                } else if (field.min !== null && +val < field.min) {
                    newValidation.push(new Validation(field.property, `Поле "${field.label}" не может быть меньше ${field.min}`))
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
                    (props.header || props.onDelete) &&
                    <Box alignItems="center" display="flex" justifyContent="space-between" mb={2}>
                        {
                            props.header ?
                                <Typography variant="h6">{props.header}</Typography> :
                                <div></div>
                        }
                        {
                            props.onDelete ?
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
                {
                    props.headerContent !== null &&
                    <Box mb={2}>
                        {props.headerContent}
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
                                                validation.find(_ => _.property === field.property) !== undefined,
                                                validation.find(_ => _.property === field.property)?.message,
                                                props.isSaving!,
                                                props.viewOnly!
                                            )
                                        }
                                    </React.Fragment>;
                                } /*else if (props.viewOnly) {
                                    return <Box key={"fc-" + field.property} height="32px" display="flex" gap={2}>
                                        <Typography variant="body2"><b>{field.label}</b></Typography>
                                        <Typography variant="body2">{entity![field.property]}</Typography>
                                    </Box>;
                                } */else {
                                    const controlHidden = typeof field.hidden === "function" ? field.hidden(entity ?? {}) : field.hidden;
                                    if (controlHidden) {
                                        return null;
                                    }

                                    const controlValue = entity![field.property] ?? (["file", "date", "time", "autocomplete"].includes(field.type) ? null : "");
                                    const controlDisabled = typeof field.disabled === "function" ? field.disabled(entity ?? {}) : field.disabled;

                                    return <ItnControl
                                        key={"fc-" + field.property}
                                        type={field.type}
                                        disableNewPasswordGenerate={field.disableNewPasswordGenerate}
                                        variant={props.variant!}
                                        onChange={(value) => handleChange(field.property, value)}
                                        value={controlValue}
                                        allowNullInSelect={field.allowNullInSelect}
                                        selectNullLabel={field.selectNullLabel}
                                        noOptionsText={field.noOptionsText ?? "Ничего не найдено"}
                                        passwordLength={field.passwordLength}
                                        placeholder={field.placeholder}
                                        disabled={controlDisabled || props.isSaving || props.viewOnly}
                                        display={field.display}
                                        error={validation.find(_ => _.property === field.property) !== undefined}
                                        errorText={validation.find(_ => _.property === field.property)?.message}
                                        items={field.items}
                                        label={field.label}
                                        max={field.max}
                                        min={field.min}
                                        allowDecimals={field.allowDecimals}
                                        allowNegative={field.allowNegative}
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
                                        onAutocompleteInputChange={field.searchAsType ? (value, event) => props.onAutocompleteInputChange!(field.property, value, event) : undefined}
                                        autocompleteLoading={field.searchAsType ? props.controlsLoading![field.property] === true : undefined}
                                        autocompleteCreatable={field.autocompleteCreatable}
                                        onAutocompleteOptionAdded={field.onAutocompleteOptionAdded}
                                        helperText={field.helperText}
                                    />                                
                                }
                            })
                    }
                </Box>
                {
                    props.footerContent !== null &&
                    <Box mt={2}>
                        {props.footerContent}
                    </Box>
                }
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
    viewOnly: false,
    headerContent: null,
    footerContent: null,
    onAutocompleteInputChange: () => { },
    controlsLoading: {}
}

export default ItnBaseForm;