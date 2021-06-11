import React, { Component } from "react";
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
    Button
} from "@material-ui/core";
import {
    Loop,
    Visibility,
    VisibilityOff,
    Send
} from "@material-ui/icons";
import ChipInput from 'material-ui-chip-input';
import { KeyboardDatePicker } from "@material-ui/pickers";
import FormLabel from "../components/FormLabel";

export class CustomControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: null,
        };

        this._generatePassword = this._generatePassword.bind(this);
    }

    _generatePassword = (newPass, setField) => {
        var small = "abcdefghijklmnopqrstuvwxyz";
        var nonAlpha = "!@#$%^&*()-+<>";
        var big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var nums = "1234567890"
        var chars = small + nonAlpha + big + nums;

        var pass = "";
        for (var x = 0; x < 9; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }

        if (/\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[!@#$%^&*()-+<>]/.test(pass)) {
            if (newPass) {
                this.setState({ newPassword: pass });
            } else {
                setField("password", pass);
            }
        } else {
            this._generatePassword(newPass);
        }
    }

    _renderControl(args) {
        console.log(args);

        const { type, value, name, disabled, setField, options, placeholder, highlightErrors, label, req, entity, onClick, onChange, inputProps, } = args;

        let controlValue = value || "";

        console.log(type);

        switch (type) { 
            case 'select':
                return <FormControl
                    fullWidth
                    error={
                        highlightErrors && (
                            (!this.props.isNullable && controlValue === "") ||
                            controlValue.find(v => v.value === controlValue && v.blocked)
                        )
                    }
                >
                    <Select
                        fullWidth
                        disabled={disabled}
                        value={controlValue || ""}
                        onChange={onChange}
                        displayEmpty
                    >
                        <MenuItem disabled value="">
                            <Typography variant='body2'>{label}</Typography>
                        </MenuItem>
                        {
                            options.items.map((item, index) => {
                                return <MenuItem value={item.label}>
                                    <Typography key={"select-item" + index} variant='body2'>{item.value}</Typography>
                                </MenuItem>
                            })
                        }
                    </Select>
                    <FormHelperText>{options.items.find(i => i.value === value && i.blocked)}</FormHelperText>
                </FormControl>;
            case 'bool':
                return <Box width="100%">
                    <Checkbox
                        disabled={disabled}
                        checked={controlValue}
                        onChange={e => setField(name, !controlValue)}
                    />
                </Box>;
            case 'date':
                return <KeyboardDatePicker
                    disabled={disabled}
                    disableToolbar
                    fullWidth
                    autoOk
                    minDate={options.minDate}
                    maxDate={options.maxDate}
                    maxDateMessage={`Значение даты не должно превышать 01.01.2077`}
                    minDateMessage='Слишком маленькое значение даты'
                    invalidDateMessage='Некорректная дата'
                    format='DD.MM.YYYY'
                    okLabel="ОК"
                    cancelLabel="Отмена"
                    placeholder={placeholder}
                    error={highlightErrors && req && controlValue === ""}
                    value={controlValue || null}
                    onChange={dateValue => dateValue && dateValue.toISOString() ?
                        setField(name, dateValue.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(true).slice(0, 19))
                        : null}
                />;
            case 'password':
                return <div style={{ display: "flex", width: "100%" }}>
                    <FormControl
                        fullWidth
                        error={this.props.error}>
                        <TextField
                            fullWidth
                            error={highlightErrors && entity.password === ""}
                            value={controlValue || null}
                            helperText={highlightErrors}
                            InputProps={{
                                type: this.state.showPassword ? 'text' : 'password',
                                endAdornment: <InputAdornment position="end" >
                                    <IconButton
                                        aria-label="Видимость пароля"
                                        onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                                    >
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                            onChange={event => setField(name, event.currentTarget.value)}
                        />
                        <FormHelperText>{this.props.error}</FormHelperText>
                    </FormControl>
                    <IconButton onClick={() => this._generatePassword(false, setField())}>
                        <Loop />
                    </IconButton>
                </div>;
            case 'chip-input':
                return <ChipInput
                    fullWidth
                    defaultValue={controlValue}
                    placeholder={placeholder}
                    onChange={(chips) => {setField(name, chips.join(","))}}
                />;
            case 'text':
                return <TextField
                    disabled={disabled}
                    fullWidth
                    placeholder={placeholder}
                    error={
                        highlightErrors &&
                        (
                            (req && controlValue === "") ||
                            (type === "int" && +controlValue <= 0) ||
                            (controlValue.range && +controlValue < controlValue.range.min) ||
                            (controlValue.range && +controlValue > controlValue.range.max) ||
                            (controlValue.mask && !controlValue.match(new RegExp(controlValue.mask.regex)))
                        )
                    }
                    value={controlValue || ""}
                    onChange={event => setField(name, event.currentTarget.value)}
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
                return <TextField fullWidth
                    type="number"
                    placeholder={placeholder}
                    error={highlightErrors}
                    value={controlValue || ""}
                    disabled={disabled}
                    inputProps={inputProps}
                    onChange={event => {setField("availabilityPeriod", +event.currentTarget.value)}}
                />;
            default:
                return new Error();
        }
    };

    render() {
        const { label, req, tooltip, labelWidth, noPadding } = this.props;

        // let controlValue;

        // if (value === null) {
        //     controlValue = "";
        // } else {
        //     controlValue = value;
        // }
        //let controlValue = value ||  entity[name];

        return <Box display="flex" alignItems="center" mt="10px">
            <FormLabel req={req} bold labelWidth={labelWidth} tooltip={tooltip} noPadding={noPadding}>{label} </FormLabel>
            {this._renderControl(this.props)}
        </Box>;
    }
}

export default CustomControl;

class OptionsClass {
    items;
    min;
    max;
    onClick;
}

OptionsClass.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    min: PropTypes.number,
    max: PropTypes.number,
    onClick: PropTypes.func
}

CustomControl.propTypes = {
    type: PropTypes.oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number']),
    entity: PropTypes.object,
    name: PropTypes.string,
    value: PropTypes.any,
    req: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.instanceOf(OptionsClass),
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool
}

