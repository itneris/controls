import React, { useCallback, useImperativeHandle, useState, useEffect, useRef, useMemo, forwardRef } from "react";
import ItnControl from "./ItnControl";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { Validation } from "../base/Validation";
import IBaseFormProps from "../props/IBaseFormProps";
import { FieldDescription } from "../base/FieldDescription";
import FormContext from "../context/FormContext";
import { EMPTY_BOOL_OBJ, EMPTY_FUNC, getDefaultValues } from "../const/utils";

declare module "react" {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
    ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

function ItnBaseFormInner<T>(props: IBaseFormProps<T>, ref: React.ForwardedRef<IFormRef<T>>) {
    const {
        onChange = EMPTY_FUNC,
        noPadding = false,
        onSave = null,
        onDelete = null,
        onCancel = null,
        entity: initialEntity = null,
        hidePaper = false,
        header = null,
        variant = "outlined",
        isLoading = false,
        isSaving = false,
        errorLoading = null,
        deleteBtnText = "Удалить",
        saveBtnText = "Сохранить",
        cancelBtnText = "Отмена",
        viewOnly = false,
        headerContent = null,
        footerContent = null,
        onAutocompleteInputChange = EMPTY_FUNC,
        controlsLoading = EMPTY_BOOL_OBJ,
        fieldBuilder,
        children
    } = props;

    const [validation, setValidation] = useState<Validation<T>[]>([]);
    const [entity, setEntity] = useState(initialEntity ?? getDefaultValues(fieldBuilder.GetFields()));

    useEffect(() => {
        setEntity(initialEntity ?? getDefaultValues(fieldBuilder.GetFields()));
    }, [initialEntity, fieldBuilder]);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return entity;
        },
        validate(onErrors) {
            return validateControls(onErrors);
        },
        addError(field, error) {
            setValidation([...validation, { property: field, message: error }]);
        },
        setEntity(newEntity: T) {
            setEntity(newEntity);
            setValidation([]);
        }
    }));

    const handleChange = useCallback((field: keyof T, value: any) => {
        setValidation(oldVal => oldVal.filter(_ => _.property !== field));
        setEntity(oldEntity => ({ ...oldEntity, [field]: value }));
        onChange && onChange(field, value);        
    }, [onChange]); 

    const validateControls = (onErrors?: (validationErrors: Validation<T>[]) => void) => {
        let newValidation: Validation<T>[] = []; 
        fieldBuilder.GetFields().forEach(field => {
            const val = entity[field.property];
            const valIsNull =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val === "") ||
                (Array.isArray(val) && val.length === 0);

            const fieldRequired = typeof field.required === "function" ? field.required(entity) : field.required;
            if (fieldRequired && valIsNull) {
                newValidation.push(new Validation(field.property, `Поле обязательно для заполнения`));
            }

            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val,  entity);
                if (error !== null) {
                    newValidation.push(new Validation(field.property, error))
                }
            }

            if (field.type === "date" && val !== null) {
                if (field.maxDate !== null && new Date(val as Date) > field.maxDate) {
                    newValidation.push(new Validation(field.property, `Значение не может быть больше ${field.maxDate.toLocaleDateString("ru-RU")}`))
                } else if (field.minDate !== null && new Date(val as Date) < field.minDate) {
                    newValidation.push(new Validation(field.property, `Значение не может быть меньше ${field.minDate.toLocaleDateString("ru-RU")}`))
                }
            }

            if (field.type === "password" && field.enablePasswordCheck && val !== null) {
                const pwd = val as string;
                const legitPwd = /\d/.test(pwd) &&
                    /[a-z]/.test(pwd) &&
                    /[A-Z]/.test(pwd) &&
                    /[!@#$%^&*()\-+<>]/.test(pwd) &&
                    pwd.length >= field.passwordLength &&
                    !/[а-я]/.test(pwd) &&
                    !/[А-Я]/.test(pwd);

                if (!legitPwd) {
                    newValidation.push(new Validation(field.property, `Пароль должен состоять из ${field.passwordLength} символов, включать цифру, нижний и верхний регистры латинского алфавита и непрописной символ (!@#$%^&*()-+<>)`))
                }
            }

            if (field.type === "number" && val !== null && val !== undefined) {
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

        const valid = newValidation.length === 0;
        if (!valid) {
            onErrors && onErrors(newValidation);
        }
        return valid;
    };

    const handleSaveClick = useCallback(() => {
        if (!validateControls()) {
            return;
        }
        onSave && onSave(entity);
    }, [validateControls, onSave]);

    const handleDeleteClick = useCallback(() => {
        const id = entity["id" as keyof T] as string;
        onDelete && onDelete(id);
    }, [onDelete]); 

    const renderField = useCallback((field: FieldDescription<T>) => {
        const prop = field.property as string;
        if (isLoading) {
            return <Skeleton key={"fc-" + prop} height="32px" />
        } else if (field.custom) {
            return <React.Fragment key={"fc-" + prop}>
                {
                    field.custom(
                        entity[field.property],
                        (value) => handleChange(field.property, value),
                        validation.find(_ => _.property === field.property) !== undefined,
                        validation.find(_ => _.property === field.property)?.message,
                        isSaving!,
                        viewOnly!,
                        entity
                    )
                }
            </React.Fragment>;
        } else {
            const controlHidden = typeof field.hidden === "function" ? field.hidden(entity) : field.hidden;
            if (controlHidden) {
                return null;
            }

            const controlDefaultValue =
                (["file", "date", "time"]).includes(field.type) ? null :
                    field.type !== "select" && field.type !== "autocomplete" ? "" :
                        field.multiple ? [] :
                            null;

            const controlValue = entity[field.property] ?? controlDefaultValue;
            const controlDisabled = typeof field.disabled === "function" ? field.disabled(entity) : field.disabled;

            return (
                <ItnControl
                    key={"fc-" + prop}
                    type={field.type}
                    disableNewPasswordGenerate={field.disableNewPasswordGenerate}
                    variant={variant}
                    onChange={(value) => handleChange(field.property, value)}
                    value={controlValue}
                    allowNullInSelect={field.allowNullInSelect}
                    selectNullLabel={field.selectNullLabel}
                    noOptionsText={field.noOptionsText ?? "Ничего не найдено"}
                    passwordLength={field.passwordLength}
                    placeholder={field.placeholder}
                    disabled={controlDisabled || isSaving || viewOnly}
                    display={field.display}
                    error={validation.find(_ => _.property === field.property) !== undefined}
                    errorText={validation.find(_ => _.property === field.property)?.message}
                    items={field.items}
                    label={typeof (field.label) === "function" ? field.label(entity) : field.label}
                    max={field.max}
                    min={field.min}
                    allowDecimals={field.allowDecimals}
                    allowNegative={field.allowNegative}
                    maxDate={field.maxDate}
                    minDate={field.minDate}
                    tooltip={field.tooltip}
                    accept={field.accept}
                    maxFileSize={field.maxFileSize}
                    imageProperties={field.imageProps ?? undefined}
                    multiline={field.multiline}
                    lines={field.lines}
                    maxLines={field.maxLines}
                    onAutocompleteInputChange={field.searchAsType ? (value, event) => onAutocompleteInputChange!(field.property, value, event) : undefined}
                    autocompleteLoading={controlsLoading[prop] === true}
                    autocompleteCreatable={field.autocompleteCreatable}
                    onAutocompleteOptionAdded={field.onAutocompleteOptionAdded}
                    helperText={field.helperText}
                    multiple={field.multiple}
                    onEnter={field.onEnterKeyPress}
                    name={field.property.toString()}
                />
            );
        }
    }, [validation, handleChange, onAutocompleteInputChange, controlsLoading, isLoading, isSaving, variant, viewOnly, entity])

    const renderFieldByName = useCallback((name: string) => {
        const field = fieldBuilder.GetFields().find(_ => _.property === name);
        if (!field) {
            return null;
        }
        const controlHidden = typeof field.hidden === "function" ? field.hidden(entity) : field.hidden;
        if (controlHidden) {
            return <></>;
        }
        return renderField(field);
    }, [renderField, fieldBuilder])

    const formContextValue = useMemo(() => {
        return { getField: renderFieldByName };
    }, [renderFieldByName]);

    return (
        <>
            <Paper
                elevation={hidePaper ? 0 : undefined}
                sx={hidePaper ? { backgroundColor: "transparent" } : noPadding ? {} : { paddingX: 2, paddingY: 2 }}
            >
                {
                    (header || onDelete) &&
                    <Box alignItems="center" display="flex" justifyContent="space-between" mb={2}>
                        {
                            header ?
                                <Typography variant="h6">{header}</Typography> :
                                <div></div>
                        }
                        {
                            onDelete ?
                                <Button
                                    color="error"
                                    onClick={handleDeleteClick}
                                    startIcon={<Delete />}
                                    disabled={isSaving}
                                    variant="contained"
                                >
                                    {deleteBtnText}
                                </Button> :
                                <div></div>

                        }
                    </Box>
                }
                {
                    headerContent !== null &&
                    <Box mb={2}>
                        {headerContent}
                    </Box>
                }
                <Box display="flex" gap={2} flexDirection="column">
                    {
                        errorLoading !== null ?
                            <Typography variant="body2">{errorLoading}</Typography> :
                                children === undefined ?
                                fieldBuilder.GetFields().map(renderField) :
                                        <FormContext.Provider value={formContextValue}>
                                            {children}
                                        </FormContext.Provider>
                    }
                </Box>
                {
                    footerContent !== null &&
                    <Box mt={2}>
                        {footerContent}
                    </Box>
                }
            </Paper>
            {
                (onSave || onCancel) &&
                <Box display="flex" mt={2} justifyContent="space-between">
                    {
                        onCancel ?
                            <Button
                                startIcon={<Backspace />}
                                disabled={isSaving}
                                variant="contained"
                                onClick={onCancel}
                            >
                                {cancelBtnText}
                            </Button> :
                            <Box />
                    }
                    {
                        onSave ?
                            <Button
                                startIcon={<Save />}
                                disabled={isSaving}
                                variant="contained"
                                color="secondary"
                                onClick={handleSaveClick}
                            >
                                {saveBtnText}
                            </Button> :
                            <Box />
                    }
                </Box>
            }
        </>
    );
};

const ItnBaseForm = forwardRef(ItnBaseFormInner);
export default ItnBaseForm;