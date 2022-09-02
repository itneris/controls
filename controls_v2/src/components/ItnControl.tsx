import React, { useCallback, useMemo, useState } from "react";
import {
    TextField,
    Box,
    Select,
    MenuItem,
    Checkbox,
    FormControl,
    FormHelperText,
    InputAdornment,
    IconButton,
    Typography,
    Button,
    Autocomplete,
    FormLabel,
    Tooltip
} from "@mui/material";
import {
    Loop,
    Visibility,
    VisibilityOff,
    Send
} from "@mui/icons-material";
//import DatePicker from "./DatePicker";
import IControlProps, { ItnSelectOption } from "../props/IControlProps";

const generatePassword = (length: number): string => {
    const small = "abcdefghijklmnopqrstuvwxyz";
    const nonAlpha = "!@#$%^&*()-+<>";
    const big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const nums = "1234567890"
    const chars = small + nonAlpha + big + nums;

    let pass = "";
    for (let i = 0; i < (length || 8); i++) {
        const charPos = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(charPos);
    }

    if (/\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[!@#$%^&*()-+<>]/.test(pass)) {
        return pass;
    } else {
        return generatePassword(length);
    }
}

function ItnControl(props: IControlProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handlePasswordGenerate = useCallback(() => {
        props.onChange(generatePassword(props.passwordLength));
    }, [props.onChange, props.passwordLength])

    const control = useMemo(() => {
        switch (props.type) {
            case 'select':
                return <Select
                    variant={props.variant}
                    fullWidth
                    disabled={props.disabled}
                    value={props.value}
                    onChange={event => props.onChange(event.target.value)}
                    displayEmpty
                >
                    <MenuItem disabled={props.allowNullInSelect ? false : true} value="">
                        <Typography variant='body2'>{props.selectNullLabel || `Выберите ${props.label}`}</Typography>
                    </MenuItem>
                    {
                        props.items.map((item) => {
                            return <MenuItem key={name + "-o-" + item.id} value={item.id}>
                                <Typography variant='body2'>{item.label}</Typography>
                            </MenuItem>
                        })
                    }
                </Select>;
            case 'autocomplete':
                return <Autocomplete<ItnSelectOption>
                    getOptionLabel={option => (option as ItnSelectOption).label}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    fullWidth
                    disabled={props.disabled}
                    options={props.items}
                    value={props.items.find(i => i.id === props.value) || null}
                    noOptionsText={props.noOptionsText}
                    onChange={(event, newValue) => props.onChange((newValue as ItnSelectOption).id)}
                    renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                    )}                    
                    renderInput={(params) => <TextField variant={props.variant} {...params} ></TextField>}
                />
            case 'checkbox':
                return <Box width="100%">
                    <Checkbox
                        disabled={props.disabled}
                        value={!!props.value}
                        onChange={e => props.onChange(!props.value)}                        
                    />
                </Box>;
            case 'date':
                /*return <DatePicker
                    value={controlValue}
                    onChange={val => onChange(name, val)}
                    mode={controlOptions.mode}
                />*/;
            case 'password':
                return <Box display="flex" width="100%">
                    <FormControl
                        fullWidth
                        error={props.error}
                    >
                        <TextField
                            variant={props.variant}
                            fullWidth
                            value={props.value}
                            InputProps={{
                                type: showPassword ? 'text' : 'password',
                                endAdornment: <InputAdornment position="end" >
                                    <IconButton
                                        aria-label="Видимость пароля"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                            onChange={event => props.onChange(event.currentTarget.value)}
                        />
                        <FormHelperText>{props.error}</FormHelperText>
                    </FormControl>
                    <IconButton onClick={handlePasswordGenerate}>
                        <Tooltip title="Сгенерировать пароль">
                            <Loop />
                        </Tooltip>
                    </IconButton>
                </Box>;
            //TODO проверить чип инпут
            /*
            case 'chip-input':
                return <ChipInput
                    fullWidth
                    defaultValue={controlValue}
                    placeholder={placeholder}
                    error={error}
                    onChange={(chips) => {onChange(name, chips.join(","))}}
                />;*/
            //TODO Сделать комит на завтра.
            case 'string':
                return <TextField
                    variant={props.variant}
                    disabled={props.disabled}
                    fullWidth
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={event => props.onChange(event.currentTarget.value)}
                    error={props.error}
                    helperText={props.errorText}
                />;
            case 'number':
                return <TextField
                    fullWidth
                    variant={props.variant}
                    type="number"
                    placeholder={props.placeholder}
                    error={props.error}
                    helperText={props.errorText}
                    value={props.value}
                    disabled={props.disabled}
                    onChange={event => props.onChange(+event.currentTarget.value)}
                />;
            default: throw new Error();
        }
    }, [props]);

    if (typeof props.display == "boolean" && !props.display) {
        return null;
    }

    if (typeof props.display == "function" && !props.display()) {
        return null;
    }

    return (
        <Box display="flex" alignItems="center" mt="10px" minHeight="32px">
            {control}
        </Box>
    );
}

ItnControl.defaultProps = {
    disabled: false,
    placeholder: null,
    label: null,
    onClick: null,
    variant: "outlined",
    onChange: null,
    tooltip: null,
    custom: null,
    items: [],
    min: null,
    max: null,
    minDate: null,
    maxDate: null,
    passwordLength: 8,
    error: false,
    errorText: null,
    allowNullInSelect: true,
    selectNullLabel: null,
    noOptionsText: 'Ничего не найдено',
    display: true
}

export default ItnControl;