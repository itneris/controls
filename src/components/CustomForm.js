import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
    TextField,
    Box,
    Paper,
    Select,
    MenuItem,
    Checkbox,
    FormControl,
    FormHelperText,
    InputAdornment,
    IconButton,
    Tooltip,
    Typography
} from "@material-ui/core";
import {
    Loop,
    HelpOutline,
    Visibility,
    VisibilityOff
} from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { withStyles } from '@material-ui/core/styles';

const CustomForm = props => {
    const { controls, setField, formStyles, entity, generatePassword } = props;

    return (
        <Paper
            style={{
                padding: "6px 16px 16px 16px",
                marginTop: 20,
                marginBottom: 20
            }}
        >
            <Box alignItems="center" display="flex">
                <Typography variant="h6">{props.header}</Typography>
            </Box>
            {
                controls.map((controls, i) => {
                    if (controls.isShown) {
                        return <CustomControl
                            key={"fc-" + i}
                            formStyles={formStyles}
                            {...controls}
                            entity={entity}
                            value={controls}
                            setField={setField}
                            generatePassword={generatePassword}
                        ></CustomControl>
                    } else {
                        return null;
                    }
                })
            }
        </Paper>
    );
}

export default CustomForm;

CustomForm.propTypes = {
    controls: PropTypes.array,
    classes: PropTypes.array,
    entity: PropTypes.array,
    header: PropTypes.string,
    formStyles: PropTypes.array,
}


export class CustomControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: null,
            check: ""
        };
    }

    render() {
        const { type, entity, label, req, disabled, setField, options, placeholder, tooltip, generatePassword, labelWidth } = this.props;

        let name = options.name;
        let controlValue;
        if (options.value !== undefined) {
            controlValue = options.value
        } else {
            controlValue = "";
        };

        return <Box display="flex" alignItems="cetner" mt="10px">
            <FormLabel req={req} bold labelWidth={labelWidth} tooltip={tooltip}>{label} </FormLabel>
            {
                type === "select" ?
                    <FormControl
                        fullWidth
                        error={
                            this.state.check && (
                                (!this.props.isNullable && controlValue === "") ||
                                controlValue.find(v => v.value === controlValue && v.blocked)
                            )
                        }
                    >
                        <Select
                            fullWidth
                            disabled={disabled}
                            value={controlValue || ""}
                            onChange={event => { setField(name, event.target.value); }}
                            displayEmpty
                        >
                            <MenuItem disabled value="">
                                <Typography variant='body2'>{label}</Typography>
                            </MenuItem>
                            {
                                options.items.map(i =>
                                    <MenuItem value={i.label}>
                                        <Typography variant='body2'>{i.value}</Typography>
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{options.items.find(i => i.value === controlValue && i.blocked)}</FormHelperText>
                    </FormControl> :
                    type === "bool" ?
                        <Box width="100%">
                            <Checkbox
                                disabled={disabled}
                                checked={controlValue}
                                onChange={e => setField(name, !controlValue)}
                            />
                        </Box> :
                        type === "date" ?
                            <KeyboardDatePicker
                                disabled={disabled}
                                disableToolbar
                                fullWidth
                                autoOk
                                maxDate={new Date('2077-01-01')}
                                maxDateMessage={`Значение даты не должно превышать 01.01.2077`}
                                minDateMessage='Слишком маленькое значение даты'
                                invalidDateMessage='Некорректная дата'
                                format='DD.MM.YYYY'
                                okLabel="ОК"
                                cancelLabel="Отмена"
                                placeholder={new Date().toLocaleDateString("ru-RU")}
                                error={this.state.check && req && controlValue === ""}
                                value={controlValue || null}
                                onChange={value => value && value.toISOString() ?
                                    setField(name, value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString(true).slice(0, 19))
                                    : null}
                            /> :
                            type === "password" ?
                                <div style={{ display: "flex", width: "100%" }}>
                                    <FormControl
                                        fullWidth
                                        error={this.props.error}>
                                        <TextField
                                            fullWidth
                                            error={(this.state.check && entity.password === "") || this.state.pwdError}
                                            value={controlValue || null}
                                            helperText={this.state.pwdError}
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
                                            onChange={event => setField("password", event.currentTarget.value)}
                                        />
                                        <FormHelperText>{this.props.error}</FormHelperText>
                                    </FormControl>
                                    <IconButton onClick={() => generatePassword(false)}>
                                        <Loop />
                                    </IconButton>
                                </div> :
                                <TextField
                                    disabled={disabled}
                                    fullWidth
                                    placeholder={placeholder}
                                    error={
                                        this.state.check &&
                                        (
                                            (options.req && controlValue === "") ||
                                            (type === "int" && +controlValue <= 0) ||
                                            (options.range && +controlValue < options.range.min) ||
                                            (options.range && +controlValue > options.range.max) ||
                                            (options.mask && !controlValue.match(new RegExp(options.mask.regex)))
                                        )
                                    }
                                    value={controlValue || ""}
                                    onChange={event => setField(name, event.currentTarget.value)}
                                />
            }
        </Box>;
    }
}

CustomControl.protoTypes = {
    type: PropTypes.string,
    entity: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.array,
    req: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.array
}


class FormLabelWoStyles extends Component {
    render() {
        let { classes, req, bold, tooltip, noPadding, labelWidth } = this.props;
        return <Typography
            style={{
                fontWeight: bold ? "bold" : "normal",
                paddingLeft: noPadding ? 0 : undefined,
            }}
            className={classes.fieldName}
            variant="body2"
            component="span"
        >
            {
                labelWidth ?
                    <Box width="103px" >{this.props.children}</Box>
                    : this.props.children
            }
            {
                req &&
                <Typography component="span" variant="body2" color="secondary" className={classes.asterisk}>*</Typography>
            }
            {
                tooltip &&
                <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title={tooltip}
                >
                    <HelpOutline className={classes.question} />
                </Tooltip>
            }
        </Typography>
    }
}

const styles = theme => ({
    asterisk: {
        marginLeft: 5
    },
    question: {
        marginLeft: 5,
        cursor: 'pointer',
        color: "grey",
        '&:hover': {
            color: theme.palette.secondary.main
        }
    },
    tooltip: {
        width: 620,
        whiteSpace: "pre-line",
        fontSize: 12,
        padding: 24,
        lineHeight: "20px",
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
        backgroundColor: "white"
    },
    fieldName: {
        width: 300,
        paddingLeft: 16,
        paddingRight: 16,
        display: "flex"
    }
});

export const FormLabel = withStyles(styles)(FormLabelWoStyles);