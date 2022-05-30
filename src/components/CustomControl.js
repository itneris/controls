import React, { useCallback, useMemo, useState } from "react";
import PropTypes from 'prop-types';
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
    Autocomplete
} from "@mui/material";
import {
    Loop,
    Visibility,
    VisibilityOff,
    Send
} from "@mui/icons-material";
//import ChipInput from 'material-ui-chip-input';
import FormLabel from "./FormLabel";

import HtmlTooltip from "./HtmlTooltip";
import DatePicker from "./DatePicker";

function CustomControl(props) {
    const {
        type,
        value,
        name,
        disabled,
        options,
        placeholder,
        highlightErrors,
        label,
        req,
        onClick,
        variant,
        onChange,
        tooltip,
        labelWidth,
        noPadding,
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = useCallback((newPass, length) => {
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
           onChange("password", pass);
        } else {
           generatePassword(newPass);
        }
    }, [onChange])

    const control = useMemo(() => {
        const controlValue = value || "";
        const error = highlightErrors && req && controlValue === "";

        const controlOptions = options || {};
        const controlVariant = variant || "standard";

        switch (type) {
            case 'select':
                return <FormControl
                    fullWidth
                    error={error}
                >
                    <Select
                        variant={controlVariant}
                        fullWidth
                        disabled={disabled}
                        value={controlValue}
                        onChange={event => onChange(name, event.target.value)}
                        displayEmpty
                    >
                        <MenuItem disabled={controlOptions.allowNull ? false : true} value="">
                            <Typography variant='body2'>{controlOptions.nullLabel || label}</Typography>
                        </MenuItem>
                        {
                            controlOptions.items.map((item, index) => {
                                return <MenuItem key={name + "-o-" + index} value={item.value}>
                                    <Typography key={"select-item" + index} variant='body2'>{item.label}</Typography>
                                </MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{controlOptions.items.find(i => i.value === value && i.blocked)}</FormHelperText>
                </FormControl>;
            case 'autocomplete':
                return <Autocomplete
                    getOptionLabel={option => option.label || ""}
                    isOptionEqualToValue={(option, value) => {
                        return option.value === value;
                    }}
                    fullWidth
                    disabled={disabled}
                    options={controlOptions.items}
                    value={controlOptions.items.find(i => i.value.toString() === controlValue.toString()) || null}
                    noOptionsText={'Ничего не найдено'}
                    onChange={(event, newValue) => {
                        onChange(name, newValue.value);
                    }}
                    renderOption={(props, option) => (
                        <Box {...props}>
                            {option.label}
                        </Box>
                    )}
                    renderInput={(params) => <TextField variant="standard" {...params} ></TextField>}
                />
            case 'bool':
                return <Box width="100%">
                    <Checkbox
                        disabled={disabled}
                        value={!!controlValue}
                        onChange={e => onChange(name, !controlValue)}
                    />
                </Box>;
            case 'date':
                return <DatePicker
                    value={controlValue}
                    onChange={val => onChange(name, val)}
                    mode={controlOptions.mode}
                />
                /*return <DayPicker
                    disabled={disabled}
                    disableToolbar
                    fullWidth
                    autoOk
                    minDate={controlOptions.minDate}
                    maxDate={controlOptions.maxDate}
                    maxDateMessage={`Значение даты не должно превышать ${controlOptions.maxDate}`}
                    minDateMessage={`Значение даты не должно быть менее ${controlOptions.minDate}`}
                    invalidDateMessage='Некорректная дата'
                    format='DD.MM.YYYY'
                    okLabel="ОК"
                    cancelLabel="Отмена"
                    placeholder={placeholder}
                    error={error}
                    value={controlValue || null}
                    locale={ru}
                    onChange={dateValue => dateValue && dateValue.toISOString() ?
                        onChange(name, dateValue.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(true).slice(0, 19))
                        : null}
                />*/;
            case 'password':
                return <div style={{ display: "flex", width: "100%" }}>
                    <FormControl
                        fullWidth
                        error={error}
                    >
                        <TextField
                            variant={controlVariant}
                            fullWidth
                            error={error}
                            value={controlValue}
                            helperText={highlightErrors}
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
                            onChange={event => onChange(name, event.currentTarget.value)}
                        />
                        <FormHelperText>{error}</FormHelperText>
                    </FormControl>
                    <IconButton onClick={() => generatePassword(false, controlOptions.passwordLength)}>
                        <HtmlTooltip title="Сгенерировать пароль">
                            <Loop />
                        </HtmlTooltip>
                    </IconButton>
                </div>;
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
            case 'text':
                return <TextField
                    variant={controlVariant}
                    disabled={disabled}
                    fullWidth
                    placeholder={placeholder}
                    value={controlValue}
                    onChange={event => onChange(name, event.currentTarget.value)}
                    error={
                        error || (controlOptions?.mask && controlValue && !new RegExp(controlOptions?.mask).test(controlValue)) ?
                            true :
                            false
                    }
                    helperText={
                        error || (controlOptions?.mask && controlValue && !new RegExp(controlOptions?.mask).test(controlValue)) ?
                            controlOptions?.maskError :
                            null
                    }
                />;
            case 'button':
                return <Box width="100%">
                    <Button
                        variant="text"
                        startIcon={<Send />}
                        color="secondary"
                        onClick={onClick}
                    >
                        {controlValue}
                    </Button>
                </Box>;
            case 'number':
                return <TextField
                    fullWidth
                    variant={controlVariant}
                    type="number"
                    placeholder={placeholder}
                    error={
                        error ||
                            (controlOptions.inputProps?.min && controlValue < controlOptions.inputProps.min) ||
                            (controlOptions.inputProps?.max && controlValue > controlOptions.inputProps.max) ?
                            true :
                            false
                    }
                    helperText={
                        error ||
                            (controlOptions.inputProps?.min && controlValue < controlOptions.inputProps.min) ||
                            (controlOptions.inputProps?.max && controlValue > controlOptions.inputProps.max) ?
                            `Введите число от ${controlOptions.inputProps.min} до ${controlOptions.inputProps.max}` :
                            null
                    }
                    value={controlValue || ""}
                    disabled={disabled}
                    inputProps={controlOptions.inputProps}
                    onChange={event => { onChange(name, +event.currentTarget.value) }}
                />;
            default:
                return <TextField
                    variant={controlVariant}
                    disabled={disabled}
                    fullWidth
                    placeholder={placeholder}
                    value={controlValue}
                    onChange={event => onChange(name, event.currentTarget.value)}
                    error={
                        error || (controlOptions?.mask && controlValue && !new RegExp(controlOptions?.mask).test(controlValue)) ?
                            true :
                            false
                    }
                    helperText={
                        error || (controlOptions?.mask && controlValue && !new RegExp(controlOptions?.mask).test(controlValue)) ?
                            controlOptions?.maskError :
                            null
                    }
                />;
        }
    }, [value, onChange, options, disabled, placeholder, variant, highlightErrors]);

    return <Box display="flex" alignItems="center" mt="10px" minHeight="32px">
        <FormLabel
            req={req}
            bold
            labelWidth={labelWidth}
            tooltip={tooltip}
            noPadding={noPadding}
            pl={options?.pl}
        >
            {label}
        </FormLabel>
        {control}
    </Box>;
}

export default CustomControl;

CustomControl.propTypes = {
    type: PropTypes.oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number', 'autocomplete', null]),
    name: PropTypes.string,
    value: PropTypes.any,
    req: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.object),
        min: PropTypes.number,
        max: PropTypes.number,
        pl: PropTypes.number,
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        minDate: PropTypes.instanceOf(Date),
        maxDate: PropTypes.instanceOf(Date),
        mask: PropTypes.string,
        maskError: PropTypes.string,
        inputProps: PropTypes.object
    }),
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool,
    labelWidth: PropTypes.bool,
    tooltip: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
}