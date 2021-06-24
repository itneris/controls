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
    Button,
    Tooltip,
    Snackbar
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
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
            buttonIsClicked: false,
            open: false
        };

        this._generatePassword = this._generatePassword.bind(this);
    }

    _generatePassword = (newPass, setField, length) => {
        var small = "abcdefghijklmnopqrstuvwxyz";
        var nonAlpha = "!@#$%^&*()-+<>";
        var big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var nums = "1234567890"
        var chars = small + nonAlpha + big + nums;

        var pass = "";
        for (var x = 0; x < length; x++) {
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
            /*this._generatePassword(newPass);*/
        }
    }

    closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            buttonIsClicked: false
        });
    }

    _renderControl(args) {

        const { type, value, name, disabled, setField, options, placeholder, highlightErrors, label, req, onClick, onChange} = args;

        const controlValue = value || "";
        const error = highlightErrors && (req && controlValue === "");

        switch (type) { 
            case 'select':
                return <FormControl
                    fullWidth
                    error={error}
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
                    maxDateMessage={`Значение даты не должно превышать ${options.maxDate}`}
                    minDateMessage={`Значение даты не должно быть менее ${options.minDate}`}
                    invalidDateMessage='Некорректная дата'
                    format='DD.MM.YYYY'
                    okLabel="ОК"
                    cancelLabel="Отмена"
                    placeholder={placeholder}
                    error={error}
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
                            error={error}
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
                    <IconButton onClick={() => { this._generatePassword(false, setField, options.passwordLength); this.setState({ buttonIsClicked: true }) }}>
                        <Tooltip
                            title={options.buttonTooltip}
                        >
                            <Loop />
                        </Tooltip>
                    </IconButton>
                    <Snackbar
                        open={this.state.buttonIsClicked}
                        autoHideDuration={1000}
                        onClose={this.closeSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Alert severity="info">
                            Button has been pressed
                        </Alert>
                    </Snackbar>
                </div>;
            case 'chip-input':
                return <ChipInput
                    fullWidth
                    defaultValue={controlValue}
                    placeholder={placeholder}
                    error={error}
                    onChange={(chips) => {setField(name, chips.join(","))}}
                />;
            case 'text':
                return <TextField
                    disabled={disabled}
                    fullWidth
                    placeholder={placeholder}
                    error={error}
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
                    error={
                        error ||
                        (controlValue < options.inputProps.min) ||
                        (controlValue > options.inputProps.max)
                    }
                    helperText={
                        error ||
                            (controlValue < options.inputProps.min) ||
                            (controlValue > options.inputProps.max) ?
                            `Введите число от ${options.inputProps.min} до ${options.inputProps.max}` :
                            null
                    }
                    value={controlValue || ""}
                    disabled={disabled}
                    inputProps={options.inputProps}
                    onChange={event => {setField("availabilityPeriod", +event.currentTarget.value)}}
                />;
            default:
                return new Error();
        }
    };

    render() {
        const { label, req, tooltip, labelWidth, noPadding } = this.props;

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
    onChange;
    minDate;
    maxDate;
    inputProps;
}

OptionsClass.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    minDate: PropTypes.date,
    maxDate: PropTypes.date,
    inputProps: PropTypes.objectOf(PropTypes.number)
}

CustomControl.propTypes = {
    type: PropTypes.oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number']),
    name: PropTypes.string,
    value: PropTypes.any,
    req: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
    options: PropTypes.instanceOf(OptionsClass),
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool,
    labelWidth: PropTypes.bool,
    tooltip: PropTypes.string,
    label: PropTypes.string,
    setField: PropTypes.func,
    onClick: PropTypes.func

}