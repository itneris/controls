import { ReactNode, createContext, useCallback, useMemo, useState } from "react";
import { FieldSettings } from "../../types/FieldSetting";
import { createFormFieldsContext } from "./useFields";

export type FormFieldsContextType<T> = {
    fieldsSettings: FieldSettings<T>[],
    registerField: (field: FieldSettings<T>) => void
}

const FormFieldsProvider = <T,>(props: { children: ReactNode}) => {
    const { children } = props;

    const [fieldsSettings, setFieldsSettings] = useState<FieldSettings<T>[]>([]);

    const FormFieldsContext = createFormFieldsContext<T>();

    const registerField = useCallback((field: FieldSettings<T>) => {
        setFieldsSettings(prev => {
            if (prev.find(p => p.name === field.name)) {
                return prev.map(p => p.name === field.name ? field : p);
            }
            
            return  [...prev, field];
        });
    }, []);

    const contextValue = useMemo(() => {
        return {
            fieldsSettings,
            registerField
        };
    }, [fieldsSettings, registerField]);

    return (
        <FormFieldsContext.Provider 
            value={contextValue}
        >
            {children}
        </FormFieldsContext.Provider>
    );
};

export default FormFieldsProvider;