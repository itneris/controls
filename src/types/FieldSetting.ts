
import { FormBoolControlProps, FormControlProps, FormCustomControlProps, FormDateControlProps, FormFileControlProps, FormNumberControlProps, FormPasswordControlProps, FormSelectControlProps, FormTextControlProps } from "./FormControlProps";

export type ControlType = "select" | "text" | "bool" | "custom" | "date" | 
    "number" | "time" | "datetime" | "file" | "password";

type CommonSettings<T> = FormControlProps<T> & {
    type: ControlType;
} 

export type BoolSettings<T> = FormBoolControlProps<T> & {
    type: "bool"
}

type SelectSettings<T> = FormSelectControlProps<T> & {
    type: "select"
}

type TextSettings<T> = FormTextControlProps<T> & {
    type: "text"
}

type CustomSettings<T> = FormCustomControlProps<T> & {
    type: "custom"
}

type DateSettings<T> = FormDateControlProps<T> & {
    type: "date" | "datetime" | "time"
}

type NumberSettings<T> = FormNumberControlProps<T> & {
    type: "number"
}

type FileSettings<T> = FormFileControlProps<T> & {
    type: "file"
}

type PasswordSettings<T> = FormPasswordControlProps<T> & {
    type: "password"
}

export type FieldSettings<T> = CommonSettings<T> & (
    BoolSettings<T> |
    SelectSettings<T> |
    TextSettings<T> |
    CustomSettings<any> |
    DateSettings<T> |
    NumberSettings<T> |
    FileSettings<T> |
    PasswordSettings<T>
)
