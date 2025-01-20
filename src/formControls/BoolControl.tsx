import useFields from "../providers/FormFieldsProvider/useFields";
import { useEffect, useMemo, useRef } from "react";
import { FieldSettings } from "../types/FieldSetting";
import { useForm } from "../context/useForm";
import ControlSkeleton from "./ControlSkeleton";
import ItnFormControl from "../form/ItnFormControl";
import { FormBoolControlProps } from "../types/FormControlProps";

function BoolControl<T>(props: FormBoolControlProps<T>) {
    const fields = useFields<T>();

    const { 
        isSubmitting, 
        viewOnly, 
        onEnterPress, 
        onInputChanged, 
        errors,
        entity,
        loading
    } = useForm<T>();

    const field = useMemo(() => {
        return {
            ...props,
            type: "bool"
        } satisfies FieldSettings<T>
    }, [props]);

    const fieldsRef = useRef(fields);
    useEffect(() => {
        fieldsRef.current.registerField(field);
    }, [field]);

    if (loading) {
        return (
            <ControlSkeleton />
        );
    }

    return (
        <ItnFormControl<T>
            onChange={onInputChanged}
            onEnter={() => onEnterPress(field)}
            field={field}
            error={errors.find(x => x.property === props.name)?.message}
            disabled={props.disabled || isSubmitting || viewOnly}
            entity={entity}
        />
    );
}

export default BoolControl;