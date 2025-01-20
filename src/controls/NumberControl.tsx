import { TextField } from "@mui/material";
import React, { useCallback } from "react";
import { NumberControlProps } from "../types/ControlProps";

function NumberControl(props: NumberControlProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(e.currentTarget.value === "" ? null : +e.currentTarget.value)
    }, [props.value, props.onChange]);

    
        const handleNumberKeyPress = useCallback((e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                props.onEnter && props.onEnter();
                return;
            }
    
            const isNumber = /[0-9]/.test(e.key);
            if (isNumber) {
                return;
            }
    
            if (props.allowDecimals && (e.key === "." || e.key === ",")) {
                return;
            }
    
            if (props.allowNegative && e.key === "-" && (e.target as HTMLInputElement).value === "") {
                return;
            }
    
            e.preventDefault();
        }, [props.onEnter, props.allowDecimals, props.allowNegative]);

    return (
        <TextField
            autoComplete="off"
            value={props.value}
            onChange={handleChange}
            label={props.label}
            onKeyUp={handleNumberKeyPress}
            fullWidth
            variant={props.variant}
            type="number"
            placeholder={props.placeholder ?? ""}
            error={props.isError}
            helperText={props.isError ? props.errorText : (props.helperText ?? "")}
            disabled={props.disabled}
            size="small"
            name={props.name}
        />
    );
}

export default NumberControl;