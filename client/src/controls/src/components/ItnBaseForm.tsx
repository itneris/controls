import React, { useCallback, useImperativeHandle, useState, useEffect } from "react";
import ItnControl from "./ItnControl";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { LooseObject } from "../base/LooseObject";
import { Validation } from "../base/Validation";
import IBaseFormProps from "../props/IBaseFormProps";
import { FieldDescription } from "../base/FieldDescription";

export interface IFormContext {
    getField: (field: string) => React.ReactNode | null;
}


export const FormContext = React.createContext<IFormContext | null>(null);

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
        },
        setEntity(newEntity: LooseObject) {
            setEntity(newEntity);
            setValidation([]);
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
                (typeof val === "string" && val === "") ||
                (Array.isArray(val) && val.length === 0);

            if (field.required && valIsNull) {
                newValidation.push(new Validation(field.property, `Поле обязательно для заполнения`));
            }

            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val, entity ?? {});
                if (error !== null) {
                    newValidation.push(new Validation(field.property, error))
                }
            }

            if (field.type === "date" && val !== null) {
                if (field.maxDate !== null && new Date(val) > field.maxDate) {
                    newValidation.push(new Validation(field.property, `Значение не может быть больше ${field.maxDate.toLocaleDateString("ru-RU")}`))
                } else if (field.minDate !== null && new Date(val) < field.minDate) {
                    newValidation.push(new Validation(field.property, `Значение не может быть меньше ${field.minDate.toLocaleDateString("ru-RU")}`))
                }
            }

            if (field.type === "password" && field.enablePasswordCheck && val !== null) {
                const legitPwd = /\d/.test(val) &&
                    /[a-z]/.test(val) &&
                    /[A-Z]/.test(val) &&
                    /[!@#$%^&*()-+<>]/.test(val) &&
                    val.length >= field.passwordLength;
                if (!legitPwd) {
                    newValidation.push(new Validation(field.property, `Пароль должен состоять из ${field.passwordLength} символов, включать цифру, нижний и верхний регистры и непрописной сивол (!@#$%^&*()-+<>)`))
                }
            }

            if (field.type === "number" && val !== null) {
                if (isNaN(+val)) {
                    newValidation.push(new Validation(field.property, `Некорректное числовое значение`))
                } else if (!field.allowNegative && +val < 0) {
                    newValidation.push(new Validation(field.property, `Значение должно быть больше 0`))
                } else if (!field.allowDecimals && !Number.isInteger(+val)) {
                    newValidation.push(new Validation(field.property, `Значение должно быть целым числом`))
                } else  if (field.max !== null && +val > field.max) {
                    newValidation.push(new Validation(field.property, `Значение не может быть больше ${field.max}`))
                } else if (field.min !== null && +val < field.min) {
                    newValidation.push(new Validation(field.property, `Значение не может быть меньше ${field.min}`))
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

    const renderField = useCallback((field: FieldDescription) => {
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
                        props.viewOnly!,
                        entity ?? {}
                    )
                }
            </React.Fragment>;
        } else {
            const controlHidden = typeof field.hidden === "function" ? field.hidden(entity ?? {}) : field.hidden;
            if (controlHidden) {
                return null;
            }

            const contolDefaultValue =
                (["file", "date", "time"]).includes(field.type) ? null :
                    field.type !== "select" && field.type !== "autocomplete" ? "" :
                        field.multiple ? [] :
                            null;

            const controlValue = entity![field.property] ?? contolDefaultValue;
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
                autocompleteInputValue={props.autoCompleteInputValues![field.property]}
                onAutocompleteInputChange={field.searchAsType ? (value, event) => props.onAutocompleteInputChange!(field.property, value, event) : undefined}
                autocompleteLoading={field.searchAsType ? props.controlsLoading![field.property] === true : undefined}
                autocompleteCreatable={field.autocompleteCreatable}
                onAutocompleteOptionAdded={field.onAutocompleteOptionAdded}
                helperText={field.helperText}
                multiple={field.multiple}
            />
        }
    }, [props, validation, entity, handleChange])

    const renderFieldByName = useCallback((name: string) => {
        const field = fields.find(_ => _.property === name);
        if (!field) {
            return null;
        }
        const controlHidden = typeof field.hidden === "function" ? field.hidden(entity ?? {}) : field.hidden;
        if (controlHidden) {
            return <></>;
        }
        return renderField(field);
    }, [renderField, fields])

    return (
        <>
            <Paper
                elevation={props.hidePaper ? 0 : undefined}
                sx={props.hidePaper ? { backgroundColor: "transparent" } : { paddingX: 2, paddingY: 2 }}
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
                                props.children === undefined ?
                                    fields.map(renderField) :
                                    <FormContext.Provider value={{ getField: renderFieldByName }}>
                                        {props.children}
                                    </FormContext.Provider>
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
    controlsLoading: {},
    autoCompleteInputValues: {}
}

export default ItnBaseForm;