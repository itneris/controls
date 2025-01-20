import React, { useContext } from "react";
import { FormFieldsContextType } from "./FormFieldsProvider";
import once from "../../util/once";

export const createFormFieldsContext = once(<T,>() => React.createContext({} as FormFieldsContextType<T>));

export default function useFields<T>() {
    const fields = useContext(createFormFieldsContext<T>());
    if (!fields) {
        throw new Error("Form control must be used inside a Form");
    }
    return fields as FormFieldsContextType<T>;
}