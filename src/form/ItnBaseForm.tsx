import { useCallback, useImperativeHandle, useState, useMemo, useContext } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { Validation } from "../base/Validation";
import { ItnFormGlobalContext } from "../providers/ItnFromProvider";
import { ItnFormProps } from "../types/BaseFormProps";
import useFields from "../providers/FormFieldsProvider/useFields";
import { DEFAULT_PASSWORD_LENGTH } from "../util/generatePassword";
import FormContext, { FormContextType } from "../context/FormContext";
import { FieldSettings } from "../types/FieldSetting";

function ItnBaseForm<T>(props: ItnFormProps<T>) {
    const {
        onPropertyChange,
        onEntityChange,
        onEnter,
        noPadding = false,
        onSave,
        onDelete = null,
        onCancel = null,
        entity = null,
        hidePaper = false,
        header,
        variant = "outlined",
        isLoading = false,
        isSaving = false,
        errorLoading,
        deleteBtnText,
        saveBtnText,
        cancelBtnText,
        viewOnly = false,
        headerContent,
        footerContent,
        children,
        ref
    } = props;

    const fields = useFields<T>();

    const { locale } = useContext(ItnFormGlobalContext);

    const [validation, setValidation] = useState<Validation[]>([]);


    useImperativeHandle(ref, () => ({
        validate(onErrors) {
            return validateControls(onErrors);
        },
        addError(field, error) {
            setValidation([...validation, { property: field, message: error }]);
        }
    }));

    const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setValidation(oldVal => oldVal.filter(_ => _.property !== field));

        let newEntity: T = { 
            ...entity!, 
            [field]: value 
        };
        if (onPropertyChange) {
            newEntity = onPropertyChange(field, value);
        }
        
        onEntityChange && onEntityChange(newEntity);        
    }, [entity, onPropertyChange, onEntityChange]); 

    const validateControls = (onErrors?: (validationErrors: Validation[]) => void) => {
        let newValidation: Validation[] = []; 
        fields.fieldsSettings.forEach(field => {
            const val = entity![field.name as keyof T];
            const valIsNull =
                val === undefined ||
                val === null ||
                (typeof val === "string" && val === "") ||
                (Array.isArray(val) && val.length === 0);

            const fieldRequired = typeof field.required === "function" ? field.required(entity!) : field.required;
            if (fieldRequired && valIsNull) {
                newValidation.push(new Validation(field.name, locale.form.fieldRequired));
            }

            if (field.validate && !valIsNull) {
                const error = field.validate(val, entity!);
                if (error) {
                    newValidation.push(new Validation(field.name, error))
                }
            }

            if ((field.type === "datetime" || field.type === "date") && val !== null) {
                if (field.maxDate && new Date(val as Date) > field.maxDate) {
                    const error = locale.form.maxValueError.replace("{0}", locale.formatters.date(field.maxDate));
                    newValidation.push(new Validation(field.name, error));
                } else if (field.minDate && new Date(val as Date) < field.minDate) {
                    const error = locale.form.minValueError.replace("{0}", locale.formatters.date(field.minDate));
                    newValidation.push(new Validation(field.name, error));
                }
            }

            if (field.type === "password" && !field.disablePasswordCheck && val !== null) {
                const passwordLength = field.passwordLength || DEFAULT_PASSWORD_LENGTH;
                const pwd = val as string;
                const legitPwd = /\d/.test(pwd) &&
                    /[a-z]/.test(pwd) &&
                    /[A-Z]/.test(pwd) &&
                    /[!@#$%^&*()\-+<>]/.test(pwd) &&
                    pwd.length >= passwordLength &&
                    !/[а-я]/.test(pwd) &&
                    !/[А-Я]/.test(pwd);

                if (!legitPwd) {
                    const error = locale.form.passwordError.replace("{0}", passwordLength.toString());
                    newValidation.push(new Validation(field.name, error));
                }
            }

            if (field.type === "number" && val !== null && val !== undefined) {
                if (isNaN(+val)) {
                    newValidation.push(new Validation(field.name, locale.form.incorrectNumber))
                } else if (!field.allowNegative && +val < 0) {
                    newValidation.push(new Validation(field.name, locale.form.onlyPositiveNumber))
                } else if (!field.allowDecimals && !Number.isInteger(+val)) {
                    newValidation.push(new Validation(field.name, locale.form.onlyIntegerNumber))
                } else  if (field.max && +val > field.max) {
                    const error = locale.form.maxValueError.replace("{0}", locale.formatters.number(field.max));
                    newValidation.push(new Validation(field.name, error))
                } else if (field.min && +val < field.min) {
                    const error = locale.form.minValueError.replace("{0}", locale.formatters.number(field.min));
                    newValidation.push(new Validation(field.name, error))
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
        onSave && onSave(entity!);
    }, [validateControls, onSave]);

    const handleDeleteClick = useCallback(() => {
        const id = entity!["id" as keyof T] as string;
        onDelete && onDelete(id);
    }, [onDelete]); 

    const handleEnter = useCallback((_field: FieldSettings<T>) => {
        onEnter && onEnter(entity!);
    }, [entity]);

    const formContextValue = useMemo(() => {
        return {
            errors: validation,
            onInputChanged: handleChange,
            onEnterPress: handleEnter,
            isSubmitting: isSaving,
            viewOnly,
            loading: isLoading,
            entity: entity || {} as T,
            variant
        } satisfies FormContextType<T>;
    }, [
        entity, 
        validation, 
        handleChange, 
        handleEnter, 
        isSaving, 
        isLoading, 
        viewOnly, 
        variant
    ]);

    return (
        <FormContext.Provider value={formContextValue}>
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
                                    {deleteBtnText ?? locale.common.removeButtonText}
                                </Button> :
                                <div></div>

                        }
                    </Box>
                }
                {
                    headerContent &&
                    <Box mb={2}>
                        {headerContent}
                    </Box>
                }
                <Box display="flex" gap={2} flexDirection="column">
                    {
                        !!errorLoading ?
                            <Typography variant="body2">{errorLoading}</Typography> :
                            children
                    }
                </Box>
                {
                    footerContent &&
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
                                {cancelBtnText ?? locale.common.cancelButtonText}
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
                                {saveBtnText ?? locale.common.saveButtonText}
                            </Button> :
                            <Box />
                    }
                </Box>
            }
        </FormContext.Provider>
    );
};

export default ItnBaseForm;