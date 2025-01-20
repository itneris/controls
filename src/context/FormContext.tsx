import React from "react";
import { FieldSettings } from "../types/FieldSetting";
import { Validation } from "../base/Validation";

type OnInputChangedType<T> = (field: keyof T, value: T[keyof T]) => void;
type OnEnterPressType<T> = (field: FieldSettings<T>) => void;

export type FormContextType<T> = {
    errors: Validation[],
    onInputChanged: OnInputChangedType<T>,
    onEnterPress: OnEnterPressType<T>,
    isSubmitting: boolean,
    viewOnly: boolean,
    loading: boolean,
    entity: T,
    variant: "standard" | "outlined" | "filled"
}

const FormContext = React.createContext<FormContextType<unknown> | null>(null);
export default FormContext;