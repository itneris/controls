import React from "react";

export default interface IControlProps {
    /**
     * Type of rendered control
     * */
    type: "select" | "autocomplete" | "number" | "string" | "date" | "checkbox" | "chip" | "password";
    value: any;
    //name,
    disabled?: boolean;
    //options,
    placeholder?: string | null;
    error?: boolean,
    errorText?: string | null;
    label?: string | null;
    onClick?: (() => void) | null;
    variant: "outlined" | "standard" | "filled";
    onChange?: ((value: any) => void) | null;
    tooltip?: string | null;
    items?: Array<ItnSelectOption>;
    min?: number | null;
    max?: number | null;
    minDate?: Date | null;
    maxDate?: Date | null;
    passwordLength?: number;
    allowNullInSelect?: boolean;
    selectNullLabel?: string | null;
    noOptionsText?: string;
    display?: boolean | (() => boolean)
}

export class ItnSelectOption {
    id: string;
    label: string;
    blocked: boolean;

    constructor(id: string, label: string, blocked: boolean = false) {
        this.id = id;
        this.label = label;
        this.blocked = blocked;
    }
}