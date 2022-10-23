import { ReactNode } from "react";
import { ItnSelectOption } from "../props/IControlProps";
import { LooseObject } from "./LooseObject";

export class FieldDescription implements LooseObject {
    property: string;
    order: number;
    type: "string" | "number" | "select" | "autocomplete" | "date" | "checkbox" | "chip" | "password" | "file" | "time" | "datetime" = "string";
    disabled: boolean | ((entity: LooseObject) => boolean) = false;
    hidden: boolean | ((entity: LooseObject) => boolean) = false;
    placeholder: string | null = null;
    error: boolean = false;
    errorText: string | null = null;
    label: string | null = null;
    onClick: (() => void) | null = null;
    variant: "outlined" | "standard" | "filled" = "outlined";
    tooltip: string | null = null;
    helperText: string | null = null;
    custom: ((value: any, onChange: ((value: any) => void), isError: boolean, errorText: string | undefined, isSaving: boolean, isView: boolean) => ReactNode) | null = null;
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
    validation: ((value: any, entity: LooseObject) => string | null) | null = null;
    required: boolean = false;
    accept: string = "*";
    maxFileSize: number = 4096 * 1000;
    withImagePreview: boolean = false;
    isAvatar: boolean = false;
    cropImageToSize: [number, number] | null = null;
    lines: number | null = null;
    maxLines: number | null = null;
    multiline: boolean = false;
    defaultValue: any | null = null;
    selectApiUrl: string | null = null;
    disableNewPasswordGenerate: boolean = false;
    searchAsType: boolean = false;
    autocompleteCreatable: boolean = false;
    onAutocompleteOptionAdded: ((value: string) => void) | null = null;
    multiple: boolean = false;

    constructor(order: number, property: string) {
        this.property = property;
        this.order = order;
    }
}
