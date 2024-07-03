import { ReactNode } from "react";
import { ItnSelectOption } from "..";
import { FileImageProperties } from "../props/IFileControlProps";

export type CustomControlFunction<T> = ((value: any, onChange: ((value: any) => void), isError: boolean, errorText: string | undefined, isSaving: boolean, isView: boolean, entity: T) => ReactNode) | null;
export type ValidationFunction<T> = ((value: any, entity: T) => string | null) | null;

export class FieldDescription<T> {
    property: keyof T;
    order: number;
    type: "string" | "number" | "select" | "autocomplete" | "date" | "checkbox" | "chip" | "password" | "file" | "time" | "datetime" | "wysiwyg" = "string";
    disabled: boolean | ((entity: T) => boolean) = false;
    hidden: boolean | ((entity: T) => boolean) = false;
    placeholder: string | null = null;
    error: boolean = false;
    errorText: string | null = null;
    label: string | ((entity: T) => string) | null = null;
    onClick: (() => void) | null = null;
    variant: "outlined" | "standard" | "filled" = "outlined";
    tooltip: string | null = null;
    helperText: string | null = null;
    custom: CustomControlFunction<T> = null;
    items: ItnSelectOption[] = [];
    min: number | null = null;
    max: number | null = null;
    allowDecimals: boolean = false;
    allowNegative: boolean = false;
    minDate: Date | null = null;
    maxDate: Date | null = null;
    passwordLength: number = 8;
    allowNullInSelect: boolean = false;
    selectNullLabel: string | null = null;
    noOptionsText: string | null = null;
    display: boolean | (() => boolean) = true;
    validation: ValidationFunction<T> = null;
    required: boolean | ((entity: T) => boolean) = false;
    accept: string = "*";
    imageProps: FileImageProperties | null = null;
    maxFileSize: number = 4096 * 1000;
    lines: number | null = null;
    maxLines: number | null = null;
    multiline: boolean = false;
    defaultValue: any | null = null;
    selectApiUrl: string | null = null;
    disableNewPasswordGenerate: boolean = false;
    enablePasswordCheck: boolean = false;
    searchAsType: boolean = false;
    autocompleteCreatable: boolean = false;
    onAutocompleteOptionAdded: ((value: string) => void) | null = null;
    multiple: boolean = false;
    onEnterKeyPress: () => void = () => { };

    //Content-editor
    availableFonts?: string[];
    minHeight?: string;
    buttonList?: any[];
    onWysiwygImageSave?: (data: File) => Promise<string>;

    constructor(order: number, property: keyof T) {
        this.property = property;
        this.order = order;
    }
}
