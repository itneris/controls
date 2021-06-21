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

    //isDateInvalid = (value, minDate, maxDate) => {
    //    let splittedDate = value.split("." || "-");
    //    let splittedMinDate = minDate.split("." || "-");
    //    let splittedMaxDate = maxDate.split("." || "-");
    //    console.log(splittedDate);
    //    console.log(splittedMinDate);
    //    console.log(splittedMaxDate);

    //    if (
    //        ((+splittedDate[2] < +splittedMinDate[2]) && (+splittedDate[1] < +splittedMinDate[1]) && (+splittedDate[0] < +splittedMinDate[0])) ||
    //        ((+splittedDate[2] > +splittedMaxDate[2]) && (+splittedDate[1] > +splittedMaxDate[1]) && (+splittedDate[0] > +splittedMaxDate[0]))
    //    ) {
    //        return true;
    //    } else {
    //        return false;
    //    }
    //}


    _renderControl(args) {

        const { type, value, name, disabled, setField, options, placeholder, highlightErrors, label, req, onClick, onChange, inputProps } = args;

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
                    error={
                        highlightErrors && (req && controlValue === "")
                    }
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
                            error={
                                highlightErrors && (req && controlValue === "")
                            }
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
                    error={
                        highlightErrors && (req && controlValue === "")
                    }
                    onChange={(chips) => {setField(name, chips.join(","))}}
                />;
            case 'text':
                return <TextField
                    disabled={disabled}
                    fullWidth
                    placeholder={placeholder}
                    error={
                        highlightErrors && (req && controlValue === "")
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
                    error={
                        error ||
                        (controlValue < inputProps.min) ||
                        (controlValue > inputProps.max)
                    }
                    helperText={
                        error ||
                            (controlValue < inputProps.min) ||
                            (controlValue > inputProps.max) ?
                            `Введите число от ${inputProps.min} до ${inputProps.max}` :
                            null
                    }
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

