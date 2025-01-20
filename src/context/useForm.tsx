import { useContext } from "react";
import FormContext, { FormContextType } from "./FormContext";

export function useForm<T>() {
    const context = useContext(FormContext);
    return context as FormContextType<T>;
}