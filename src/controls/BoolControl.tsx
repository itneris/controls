import {
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { useCallback } from "react";
import { BoolControlProps } from "../types/ControlProps";

function BoolControl(props: BoolControlProps) {
    const handleChange = useCallback(() => {
        props.onChange && props.onChange(!props.value);
    }, [props.value, props.onChange]);

    return (
        <FormControlLabel
            label={props.label}                        
            control={
                <Checkbox
                    disabled={props.disabled}
                    checked={!!props.value}
                    color="secondary"
                    onChange={handleChange}
                />
            }
        />
    );
}

export default BoolControl;