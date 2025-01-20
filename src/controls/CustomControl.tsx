import {
    FormControlLabel
} from "@mui/material";
import { CustomControlProps } from "../types/ControlProps";

function CustomControl<T>(props: CustomControlProps<T>) {    
    const controlRender = props.control({
        value: props.value,
        onChange: props.onChange,
        isError: props.isError,
        disabled: props.disabled,
        entity: props.entity,
        errorText: props.errorText
    });

    return (
        <FormControlLabel
            label={props.label}                        
            control={controlRender}
        />
    );
}

export default CustomControl;