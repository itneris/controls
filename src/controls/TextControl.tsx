import { TextField } from "@mui/material";
import React, { useCallback } from "react";
import { TextControlProps } from "../types/ControlProps";

function InputControl(props: TextControlProps) {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange && props.onChange(e.target.value)
    }, [props.value, props.onChange]);

    const checkEnter = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            props.onEnter && props.onEnter();
        }
    }, [props.onEnter]);

    return (
        <TextField
            autoComplete="off"
            onKeyUp={checkEnter}
            variant={props.variant ?? "outlined"}
            disabled={props.disabled}
            fullWidth
            placeholder={props.placeholder ?? ""}
            value={props.value}
            onChange={handleChange}
            label={props.label}
            error={props.isError}
            size="small"
            helperText={props.isError ? props.errorText : (props.helperText ?? "")}
            multiline={props.multiline}
            rows={props.lines}
            maxRows={props.maxLines}
            name={props.name}
        />
    );
}

export default InputControl;