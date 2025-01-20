import React from "react";
import { ItnSelectOption } from "../base/ItnSelectOption";
import { FileImageProperties } from "./FileImageProperties";
import ItnFormFile from "../base/ItnFormFile";

export type ControlProps<T> = {   
    value: T;
    onChange?: (value: T) => void,
    disabled?: boolean;
    isError?: boolean;
    label?: string;
    helperText?: string;
    errorText?: string;
    name: string;
}

export type ControlPropsWithPlaceholder<T> = ControlProps<T> & {
    placeholder?: string;
}

export type ControlPropsWithEnter<T> = ControlPropsWithPlaceholder<T> & {
    onEnter?: () => void;
}

export type TextControlProps = ControlPropsWithEnter<string> & {
    variant?: "standard" | "outlined" | "filled",
    multiline?: boolean,
    lines?: number,
    maxLines?: number,
    name?: string
}

export type PasswordControlProps = ControlPropsWithEnter<string> & {
    variant?: "standard" | "outlined" | "filled",
    disableNewPasswordGenerate?: boolean,
    name?: string,
    passwordLength?: number,
    disablePasswordCheck?: boolean
}

export type BoolControlProps = ControlProps<boolean> & {
}

export type DateControlProps = ControlProps<string> & {
    minDate?: Date,
    maxDate?: Date,
}

export type SelectControlProps  = ControlProps<string> & {    
    variant?: "standard" | "outlined" | "filled",
    items?: ItnSelectOption[];
    multiple?: boolean;
    allowNullInSelect?: boolean;
    selectNullLabel?: string;
    loading?: boolean;
    name: string;
}

export type NumberControlProps = ControlPropsWithEnter<number | null> & {
    variant?: "standard" | "outlined" | "filled",
    allowNegative?: boolean;
    allowDecimals?: boolean;
    name?: string;
    min?: number;
    max?: number;
}

export type FileControlProps = ControlProps<ItnFormFile> & {
    accept?: string,
    imageProperties?: FileImageProperties,
    maxFileSize?: number,
}

export type CustomControlProps<T> = ControlPropsWithPlaceholder<T> & {
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