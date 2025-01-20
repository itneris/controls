import { useCallback, useMemo } from 'react';
import { BoolControl, CustomControl, DateControl, DateTimeControl, PasswordControl, SelectControl, TextControl, TimeControl } from '../controls';
import FileControl from '../controls/FileControl';
import NumberControl from '../controls/NumberControl';
import { FieldSettings } from '../types/FieldSetting';
import ItnFormFile from '../base/ItnFormFile';

export type IntFormControlProps<T> = {
    entity: T;
    onChange?: <Key extends keyof T>(field: Key, value: T[Key]) => void;
    onEnter?: () => void;
    field: FieldSettings<T>;
    error?: string;
    disabled: boolean;
}

const ItnFormControl = <T,>(props: IntFormControlProps<T>) => {
    const {
        field,
        error,
        disabled,
        entity,
        onChange
    } = props;

    const onInputChanged = useCallback((value: any) => {
        onChange && onChange(field.name as keyof T, value);
    }, [field, onChange]);

    
    const controlHidden = useMemo(() => {
        return typeof field.hidden === "function" ? 
            field.hidden(entity) : 
            field.hidden;
    }, [field, entity]);

    const value = useMemo(() => {
        return entity[field.name as keyof T];
    }, [field, entity]);

    if (controlHidden) {
        return null;
    }

    if (field.type === "text") {
        return (
            <TextControl 
                disabled={disabled}
                isError={!!error}
                name={field.name as string}
                value={value as string}
                errorText={error}
                onChange={onInputChanged}
                helperText={field.helperText}
                label={field.label}
                lines={field.lines}
                maxLines={field.maxLines}
                multiline={field.multiline}
                onEnter={props.onEnter}
                placeholder={field.placeholder}
                variant={field.variant}
            />
        );
    }

    if (field.type === "custom") {
        return (
            <CustomControl
                disabled={disabled}
                isError={!!error}
                value={value}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                control={field.control}
                entity={entity}
                name={field.name}
                helperText={field.helperText}
                placeholder={field.placeholder}
            />
        )
    }

    if (field.type === "datetime") {
        return (
            <DateTimeControl
                disabled={disabled}
                isError={!!error}
                value={value as string}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                maxDate={field.maxDate}
                minDate={field.minDate}       
            />
        );
    }

    if (field.type === "date") {
        return (
            <DateControl
                disabled={disabled}
                isError={!!error}
                value={value as string}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                maxDate={field.maxDate}
                minDate={field.minDate}       
            />
        );
    }

    if (field.type === "time") {
        return (
            <TimeControl
                disabled={disabled}
                isError={!!error}
                value={value as string}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                maxDate={field.maxDate}
                minDate={field.minDate}       
            />
        );
    }

    if (field.type === "bool") {
        return (
            <BoolControl 
                disabled={disabled}
                isError={!!error}
                value={value as boolean}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
            />
        );
    }

    if (field.type === "file") {
        return (
            <FileControl
                disabled={disabled}
                isError={!!error}
                value={value as ItnFormFile}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                accept={field.accept}
                imageProperties={field.imageProperties}
                maxFileSize={field.maxFileSize}
            />
        );
    }

    if (field.type === "number") {
        return (
            <NumberControl 
                disabled={disabled}
                isError={!!error}
                value={value as number}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                allowDecimals={field.allowDecimals}
                max={field.max}
                min={field.min}
                allowNegative={field.allowNegative}
                onEnter={props.onEnter}
                placeholder={field.placeholder}
                variant={field.variant}
            />
        );
    }

    if (field.type === "select") {
        return (
            <SelectControl
                disabled={disabled}
                isError={!!error}
                value={value as string}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                variant={field.variant}
                items={field.items}
                allowNullInSelect={field.allowNullInSelect}
                loading={field.loading}
                multiple={field.multiple}
                selectNullLabel={field.selectNullLabel}
            />
        );
    }  

    if (field.type === "password") {
        return (
            <PasswordControl
                disabled={disabled}
                isError={!!error}
                value={value as string}
                onChange={onInputChanged}
                errorText={error}
                label={field.label}
                name={field.name}
                helperText={field.helperText}
                onEnter={props.onEnter}
                placeholder={field.placeholder}
                variant={field.variant}
                disableNewPasswordGenerate={field.disableNewPasswordGenerate}
                disablePasswordCheck={field.disablePasswordCheck}
                passwordLength={field.passwordLength}
            />
        );
    }

    return "Unsupported field type";
}

export default ItnFormControl;