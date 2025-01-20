import React from "react";
import { ItnSelectOption } from "../base/ItnSelectOption";
import { FileImageProperties } from "./FileImageProperties";

export type FormControlProps<T> = {    
    disabled?: boolean;
    isError?: boolean;
    label?: string;
    helperText?: string;
    errorText?: string;
    name: string;
    required?: boolean | ((data: T) => boolean);
    validate?: <K extends keyof T>(value: T[K], data: T) => string | undefined;
    hidden?: boolean | ((data: T) => boolean);
}

export type FormControlPropsWithPlaceholder<T> = FormControlProps<T> & {
    placeholder?: string;
}

export type FormControlPropsWithEnter<T> = FormControlPropsWithPlaceholder<T> & {
    onEnter?: () => void;
}

export type FormTextControlProps<T> = FormControlPropsWithEnter<T> & {
    variant?: "standard" | "outlined" | "filled",
    multiline?: boolean,
    lines?: number,
    maxLines?: number,
    name?: string
}

export type FormPasswordControlProps<T> = FormControlPropsWithEnter<T> & {
    variant?: "standard" | "outlined" | "filled",
    disableNewPasswordGenerate?: boolean,
    name?: string,
    passwordLength?: number,
    disablePasswordCheck?: boolean
}

export type FormBoolControlProps<T> = FormControlProps<T> & {
}

export type FormDateControlProps<T> = FormControlProps<T> & {
    minDate?: Date,
    maxDate?: Date,
}

export type FormSelectControlProps<T>  = FormControlProps<T> & {    
    variant?: "standard" | "outlined" | "filled",
    items?: ItnSelectOption[];
    multiple?: boolean;
    allowNullInSelect?: boolean;
    selectNullLabel?: string;
    loading?: boolean;
    name: string;
}

export type FormNumberControlProps<T> = FormControlPropsWithEnter<T> & {
    variant?: "standard" | "outlined" | "filled",
    allowNegative?: boolean;
    allowDecimals?: boolean;
    name?: string;
    min?: number;
    max?: number;
}

export type FormFileControlProps<T> = FormControlProps<T> & {
    accept?: string,
    imageProperties?: FileImageProperties,
    maxFileSize?: number,
}

export type FormCustomControlProps<T> = FormControlPropsWithPlaceholder<T> & {
    entity: unknown,
    control: (props: {        
        disabled?: boolean;
        isError?: boolean;
        errorText?: string;
        onChange?: (value: T) => void,
        value: T;
        entity: unknown;
    }) => React.ReactElement;
}