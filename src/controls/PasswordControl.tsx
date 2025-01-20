import { Loop, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, FormControl, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import { ItnFormGlobalContext } from "../providers/ItnFromProvider";
import { PasswordControlProps } from "../types/ControlProps";
import { generatePassword } from "../util/generatePassword";

function PasswordControl(props: PasswordControlProps) {
    const { locale } = useContext(ItnFormGlobalContext);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange && props.onChange(e.target.value)
    }, [props.value, props.onChange]);

    const checkEnter = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            props.onEnter && props.onEnter();
        }
    }, [props.onEnter]);

    const handlePasswordGenerate = useCallback(() => {
        props.onChange && props.onChange(generatePassword(props.passwordLength));
    }, [props.onChange, props.passwordLength]); 

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box display="flex" width="100%">
            <FormControl
                fullWidth
                error={props.isError}
            >
                <TextField
                    variant={props.variant ?? "outlined"}
                    fullWidth
                    autoComplete="off"
                    value={props.value}
                    onChange={handleChange}
                    placeholder={props.placeholder}
                    label={props.label}
                    size="small"
                    error={props.isError}
                    helperText={props.isError ? props.errorText : (props.helperText ?? "")}
                    slotProps={{
                        input: {
                            type: showPassword ? 'text' : 'password',
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <Tooltip title={locale.passwordControl.visibilityToggleText}>
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }
                    }}
                    disabled={props.disabled}
                    onKeyUp={checkEnter}
                    name={props.name}
                />
            </FormControl>
            {
                !props.disableNewPasswordGenerate &&
                <IconButton onClick={handlePasswordGenerate}>
                    <Tooltip title={locale.passwordControl.generateButtonText}>
                        <Loop />
                    </Tooltip>
                </IconButton>
            }
        </Box>
    );
}

export default PasswordControl;