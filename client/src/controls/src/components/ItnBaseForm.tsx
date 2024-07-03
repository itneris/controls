import React, { useCallback, useImperativeHandle, useState, useEffect, useMemo, forwardRef, useContext } from "react";
import { IFormRef } from "../base/IFormRef";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Backspace, Delete, Save } from "@mui/icons-material";
import { Validation } from "../base/Validation";
import IBaseFormProps from "../props/IBaseFormProps";
import FormContext from "../context/FormContext";
import { EMPTY_BOOL_OBJ, EMPTY_FUNC, getDefaultValues } from "../const/utils";
import { ItnFormGlobalContext } from "../localization/ItnFromProvider";
import ItnFormField from "./ItnFormField";

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
        deleteBtnText,
        saveBtnText,
        cancelBtnText,
        viewOnly = false,
        headerContent = null,
        footerContent = null,
        onAutocompleteInputChange = EMPTY_FUNC,
        controlsLoading = EMPTY_BOOL_OBJ,
        fieldBuilder,
        children
    } = props;

    const { locale } = useContext(ItnFormGlobalContext);

    const [validation, setValidation] = useState<Validation<T>[]>([]);
    const [entity, setEntity] = useState(initialEntity ?? getDefaultValues(fieldBuilder.GetFields()));
    const [isEntityLoaded, setIsEntityLoaded] = useState(true);

    useEffect(() => {
        if (isLoading) {
            setIsEntityLoaded(false);
            return;
        }
        
        setEntity(initialEntity ?? getDefaultValues(fieldBuilder.GetFields()));
        setIsEntityLoaded(true);
    }, [initialEntity, fieldBuilder, isLoading]);


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
                newValidation.push(new Validation(field.property, locale.form.fieldRequired));
            }

            if (field.validation !== null && !valIsNull) {
                const error = field.validation(val,  entity);
                if (error !== null) {
                    newValidation.push(new Validation(field.property, error))
                }
            }

            if (field.type === "date" && val !== null) {
                if (field.maxDate !== null && new Date(val as Date) > field.maxDate) {
                    const error = locale.form.maxValueError.replace("{0}", locale.formatters.date(field.maxDate));
                    newValidation.push(new Validation(field.property, error));
                } else if (field.minDate !== null && new Date(val as Date) < field.minDate) {
                    const error = locale.form.minValueError.replace("{0}", locale.formatters.date(field.minDate));
                    newValidation.push(new Validation(field.property, error));
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
                    const error = locale.form.passwordError.replace("{0}", field.passwordLength.toString());
                    newValidation.push(new Validation(field.property, error));
                }
            }

            if (field.type === "number" && val !== null && val !== undefined) {
                if (isNaN(+val)) {
                    newValidation.push(new Validation(field.property, locale.form.incorrectNumber))
                } else if (!field.allowNegative && +val < 0) {
                    newValidation.push(new Validation(field.property, locale.form.onlyPositiveNumber))
                } else if (!field.allowDecimals && !Number.isInteger(+val)) {
                    newValidation.push(new Validation(field.property, locale.form.onlyIntegerNumber))
                } else  if (field.max !== null && +val > field.max) {
                    const error = locale.form.maxValueError.replace("{0}", locale.formatters.number(field.max));
                    newValidation.push(new Validation(field.property, error))
                } else if (field.min !== null && +val < field.min) {
                    const error = locale.form.minValueError.replace("{0}", locale.formatters.number(field.min));
                    newValidation.push(new Validation(field.property, error))
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

    const renderFieldByName = useCallback((name: string) => {
        const field = fieldBuilder.GetFields().find(_ => _.property === name);
        if (!field) {
            return null;
        }
        const controlHidden = typeof field.hidden === "function" ? field.hidden(entity) : field.hidden;
        if (controlHidden) {
            return <></>;
        }
        return (            
            <ItnFormField
                entity={entity}
                isSaving={isSaving}
                viewOnly={viewOnly}
                field={field}
                acLoading={controlsLoading[field.property.toString()]}
                onAcInput={onAutocompleteInputChange}
                variant={variant}
                customControl={field.custom}
                isLoading={isLoading || !isEntityLoaded}
                onChange={handleChange}
                validation={validation}
                property={field.property}
            />
        );
    }, [
        entity, 
        isSaving,
        viewOnly, 
        controlsLoading, 
        onAutocompleteInputChange, 
        variant, 
        isLoading, 
        isEntityLoaded, 
        handleChange, 
        validation, 
        fieldBuilder
    ])

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
                                    {deleteBtnText ?? locale.common.removeButtonText}
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
                                    fieldBuilder.GetFields().map(f => {
                                        return (
                                            <ItnFormField
                                                key={"fc-" + f.property.toString()}
                                                entity={entity}
                                                isSaving={isSaving}
                                                viewOnly={viewOnly}
                                                field={f}
                                                acLoading={controlsLoading[f.property.toString()]}
                                                onAcInput={onAutocompleteInputChange}
                                                variant={variant}
                                                customControl={f.custom}
                                                isLoading={isLoading || !isEntityLoaded}
                                                onChange={handleChange}
                                                validation={validation}
                                                property={f.property}
                                            />
                                        )
                                    }) :
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
        </>
    );
};

const ItnBaseForm = forwardRef(ItnBaseFormInner);
export default ItnBaseForm;