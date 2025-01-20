import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from "@mui/material";
import { useCallback, useContext, useMemo } from "react";
import { SelectControlProps } from "../types/ControlProps";
import { ItnFormGlobalContext } from "../providers/ItnFromProvider";

function SelectControl(props: SelectControlProps) {
    const { locale } = useContext(ItnFormGlobalContext);

    const handleChange = useCallback((e: SelectChangeEvent) => {
        props.onChange && props.onChange(e.target.value);
    }, [props.value, props.onChange]);

    
    const currentValue = useMemo(() => {
        if (props.loading) {
            return props.multiple ? ["null"] : "null";
        }

        return props.value as string | string[] ?? (props.multiple ? [] : "");
    }, [props.value, props.loading, props.multiple]);

    return (
        <FormControl size="small" fullWidth>
            <InputLabel error={props.isError} id="sel">{props.label}</InputLabel>
            <Select
                labelId={"sel-" + props.name}
                variant={props.variant}
                fullWidth
                label={props.label}
                size="small"
                error={props.isError}
                disabled={props.disabled}
                value={currentValue as string}
                onChange={handleChange}
                multiple={props.multiple}
            >
                <MenuItem disabled={props.allowNullInSelect ? false : true} value={props.loading ? "null" : ""}>
                    {
                        props.loading ? locale.common.loadingText :
                            (
                                props.selectNullLabel ||
                                locale.common.chooseText.replace("{0}", (props.label ?? locale.common.defaultValueText))
                            )
                    }
                </MenuItem>
                {
                    props.items?.map((item) => {
                        return <MenuItem key={"opt-" + item.id} value={item.id}>
                            {item.label}
                        </MenuItem>
                    })
                }
            </Select>
            <FormHelperText error={props.isError}>{props.isError ? props.errorText : (props.helperText ?? "")}</FormHelperText>
        </FormControl>
    );
}

export default SelectControl;