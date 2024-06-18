import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
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
    Autocomplete,
    Tooltip,
    FormControlLabel,
    InputLabel,
    CircularProgress,
    createFilterOptions,
    AutocompleteInputChangeReason
} from "@mui/material";
import {
    HelpOutline,
    Loop,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import IControlProps from "../props/IControlProps";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { ItnSelectOption } from "..";
import ItnFileControl from "./controls/ItnFileControl";
import { ItnFormGlobalContext } from "../localization/ItnFromProvider";

const generatePassword = (length: number): string => {
    const small = "abcdefghijklmnopqrstuvwxyz";
    const nonAlpha = "!@#$%^&*()-+<>";
    const big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "1234567890"
    const chars = small + nonAlpha + big + numbers;

    let pass = "";
    for (let i = 0; i < (length || 8); i++) {
        const charPos = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(charPos);
    }

    if (/\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[!@#$%^&*()\-+<>]/.test(pass)) {
        return pass;
    } else {
        return generatePassword(length);
    }
}

const getOptionDisabled = (option: ItnSelectOption) => {
    return option.blocked === true;
}

const filter = createFilterOptions<ItnSelectOption>();

function ItnControl(props: IControlProps) {
    const { multiple, onAutocompleteInputChange } = props;

    const { locale } = useContext(ItnFormGlobalContext);
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const tmpId = useRef<number>(1);

    const handlePasswordGenerate = useCallback(() => {
        props.onChange && props.onChange(generatePassword(props.passwordLength!));
    }, [props.onChange, props.passwordLength]); // eslint-disable-line react-hooks/exhaustive-deps

    const checkEnter = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            props.onEnter && props.onEnter();
        }
    }, [props.onEnter]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNumberKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            props.onEnter && props.onEnter();
            return;
        }

        const isNumber = /[0-9]/.test(e.key);
        if (isNumber) {
            return;
        }

        if (props.allowDecimals && (e.key === "." || e.key === ",")) {
            return;
        }

        if (props.allowNegative && e.key === "-" && (e.target as HTMLInputElement).value === "") {
            return;
        }

        e.preventDefault();
    }, [props.onEnter, props.allowDecimals, props.allowNegative]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAutoCompleteInputChange = useCallback((_event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
        if (!onAutocompleteInputChange) {
            return;
        }

        onAutocompleteInputChange(value, reason);
    }, [onAutocompleteInputChange]);

    const control = useMemo(() => {
        switch (props.type) {
            case 'select':
                const currentValue = props.autocompleteLoading ?
                    (multiple ? ["null"] : "null") :
                    (props.value ?? (multiple ? [] : ""));

                return (
                    <FormControl size="small" fullWidth>
                        <InputLabel error={props.error} id="sel">{props.label}</InputLabel>
                        <Select
                            labelId="sel"
                            variant={props.variant}
                            fullWidth
                            label={props.label}
                            size="small"
                            error={props.error}
                            disabled={props.disabled}
                            value={currentValue}
                            onChange={event => props.onChange && props.onChange(event.target.value)}
                            multiple={multiple}                            
                        >
                            <MenuItem disabled={props.allowNullInSelect ? false : true} value={props.autocompleteLoading ? "null" : ""}>
                                {
                                    props.autocompleteLoading ? locale.autocompleteControl.loadingText :
                                        (
                                            props.selectNullLabel || 
                                            locale.autocompleteControl.chooseText.replace("{0}", (props.label ?? locale.autocompleteControl.defaultLabelText))
                                        )
                                }
                            </MenuItem>
                            {
                                props.items!.map((item) => {
                                    return <MenuItem key={"opt-" + item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                })
                            }
                        </Select>
                        <FormHelperText error={props.error}>{props.error ? props.errorText : (props.helperText ?? "")}</FormHelperText>
                    </FormControl>
                );
            case 'autocomplete':
                return <Autocomplete
                    //inputValue={acInputValue ?? props.value?.label ?? ""}
                    onInputChange={handleAutoCompleteInputChange}
                    getOptionLabel={option => option.label}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    size="small"
                    fullWidth
                    disabled={props.disabled}
                    options={props.items!}
                    value={props.value}
                    noOptionsText={props.noOptionsText}
                    loadingText={props.autocompleteLoadingText}
                    loading={props.autocompleteLoading}
                    onChange={(_e, newValue) => {
                        const newInputValue = (newValue as any).inputValue as string;
                        if (!multiple && newValue !== null && newInputValue) {
                            props.onAutocompleteOptionAdded && props.onAutocompleteOptionAdded(newInputValue);
                            props.onChange && props.onChange(new ItnSelectOption("new", newInputValue));
                        } else if (multiple && (newValue as any[]).find((val: any) => !!val.inputValue)) {
                            const newVal = (newValue as any[]).find((val: any) => !!val.inputValue);
                            props.onAutocompleteOptionAdded && props.onAutocompleteOptionAdded(newVal.inputValue);
                            props.onAutocompleteInputChange && props.onAutocompleteInputChange("", "input");
                            props.onChange && props.onChange(
                                [
                                    ...(newValue as ItnSelectOption[]).filter((val: any) => val.id !== "new"),
                                    new ItnSelectOption(`new-${tmpId.current++}`, newVal.inputValue)
                                ]
                            );                                
                        } else {
                            props.onChange && props.onChange(newValue);
                        }
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={"opt" + option.id} >{option.label}</li>
                    )}
                    getOptionDisabled={getOptionDisabled}
                    filterOptions={(options, params) => {
                        let filtered: ItnSelectOption[];
                        if (props.onAutocompleteInputChange !== null) {
                            filtered = filter(options, params);
                        } else {
                            filtered = filter(options, params);
                        }

                        if (!props.autocompleteCreatable) {
                            return filtered;
                        }

                        const { inputValue } = params;
                        const isExisting = options.some((option: ItnSelectOption) => inputValue === option.label);

                        if (inputValue !== '' && !isExisting) {
                            filtered = [{
                                id: "new",
                                label: locale.autocompleteControl.addText.replace("{0}", inputValue),
                                inputValue,
                                blocked: false
                            }, ...filtered];
                        }

                        return filtered;
                    }}
                    renderInput={(params) => (
                        <TextField
                            label={props.label}
                            variant={props.variant}
                            {...params}
                            error={props.error}
                            helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {props.autocompleteLoading === true ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                )
                            }}
                        />
                    )}
                    multiple={multiple}
                />
            case 'checkbox':
                return <FormControlLabel
                    label={props.label}
                    control={<Checkbox
                        disabled={props.disabled}
                        checked={!!props.value}
                        color="secondary"
                        onChange={() => props.onChange && props.onChange(!props.value)}
                    />}
                />;
            case 'date':
                return <DatePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        minDate={props.minDate ?? undefined}
                        maxDate={props.maxDate ?? undefined}
                        disabled={props.disabled}
                        slotProps={{
                            textField: {
                                placeholder: locale.dateControl.datePlaceHolder,
                                size: "small",
                                fullWidth: true,
                                error: props.error,
                                helperText: props.error ? props.errorText : (props.helperText ?? "")
                            }
                        }}
                        localeText={{
                            fieldDayPlaceholder: () => locale.dateControl.dayPlaceholder,
                            fieldHoursPlaceholder: () => locale.dateControl.hourPlaceholder,
                            fieldMinutesPlaceholder: () => locale.dateControl.minutePlaceholder,
                            fieldMonthPlaceholder: () => locale.dateControl.monthPlaceholder,
                            fieldSecondsPlaceholder: () => locale.dateControl.secondPlaceholder,
                            fieldYearPlaceholder: () => locale.dateControl.yearPlaceholder
                        }}
                        /*renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "ДД.ММ.ГГГГ"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }*/
                    />;
            case 'time':
                return <TimePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        disabled={props.disabled}
                        slotProps={{
                            textField: {
                                placeholder: locale.dateControl.timePlaceHolder,
                                size: "small",
                                fullWidth: true,
                                error: props.error,
                                helperText: props.error ? props.errorText : (props.helperText ?? "")
                            }
                        }}
                        localeText={{
                            fieldDayPlaceholder: () => locale.dateControl.dayPlaceholder,
                            fieldHoursPlaceholder: () => locale.dateControl.hourPlaceholder,
                            fieldMinutesPlaceholder: () => locale.dateControl.minutePlaceholder,
                            fieldMonthPlaceholder: () => locale.dateControl.monthPlaceholder,
                            fieldSecondsPlaceholder: () => locale.dateControl.secondPlaceholder,
                            fieldYearPlaceholder: () => locale.dateControl.yearPlaceholder
                        }}
                        /*renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    placeholder: "ЧЧ:ММ"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }*/
                    />;
            case 'datetime':
                return <DateTimePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        minDate={props.minDate ?? undefined}
                        maxDate={props.maxDate ?? undefined}
                        disabled={props.disabled}
                        slotProps={{
                            textField: {
                                placeholder: locale.dateControl.dateTimePlaceHolder,
                                size: "small",
                                fullWidth: true,
                                error: props.error,
                                helperText: props.error ? props.errorText : (props.helperText ?? "")
                            }
                        }}
                        localeText={{
                            fieldDayPlaceholder: () => locale.dateControl.dayPlaceholder,
                            fieldHoursPlaceholder: () => locale.dateControl.hourPlaceholder,
                            fieldMinutesPlaceholder: () => locale.dateControl.minutePlaceholder,
                            fieldMonthPlaceholder: () => locale.dateControl.monthPlaceholder,
                            fieldSecondsPlaceholder: () => locale.dateControl.secondPlaceholder,
                            fieldYearPlaceholder: () => locale.dateControl.yearPlaceholder
                        }}
                        /*renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    placeholder: "ДД.ММ.ГГГГ ЧЧ:ММ"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }*/
                    />;
            case 'password':
                return <Box display="flex" width="100%">
                    <FormControl
                        fullWidth
                        error={props.error}
                    >
                        <TextField
                            variant={props.variant}
                            fullWidth
                            autoComplete="off"
                            //onBlur={event => props.onChange && props.onChange(event.currentTarget.value)}
                            value={props.value}
                            onChange={event => props.onChange && props.onChange(event.currentTarget.value)}
                            placeholder={props.placeholder ?? ""}
                            label={props.label}
                            size="small"
                            error={props.error}
                            helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            InputProps={{
                                type: showPassword ? 'text' : 'password',
                                endAdornment: <InputAdornment position="end" >
                                    <Tooltip title={locale.passwordControl.visibilityToggleText}>
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
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
                </Box>;
            case 'string':
                return <TextField
                    autoComplete="off"
                    onKeyUp={checkEnter}
                    variant={props.variant}
                    disabled={props.disabled}
                    fullWidth
                    placeholder={props.placeholder ?? ""}
                    //onBlur={event => props.onChange && props.onChange(event.currentTarget.value)}
                    value={props.value}
                    onChange={event => props.onChange && props.onChange(event.currentTarget.value)}
                    label={props.label}
                    error={props.error}
                    size="small"
                    helperText={props.error ? props.errorText : (props.helperText ?? "")}
                    multiline={props.multiline}
                    rows={props.lines || undefined}
                    maxRows={props.maxLines || undefined}
                    name={props.name}
                />;
            case 'number':
                return <TextField
                    autoComplete="off"
                    value={props.value}
                    onChange={event => props.onChange && props.onChange(event.currentTarget.value  === "" ? null : +event.currentTarget.value)}
                    //onBlur={event => props.onChange && props.onChange(event.currentTarget.value)}
                    label={props.label}
                    onKeyUp={handleNumberKeyPress}
                    fullWidth
                    variant={props.variant}
                    type="number"
                    placeholder={props.placeholder ?? ""}
                    error={props.error}
                    helperText={props.error ? props.errorText : (props.helperText ?? "")}
                    disabled={props.disabled}
                    size="small"
                    name={props.name}
                />;
            case 'file':
                return (
                    <ItnFileControl
                        value={props.value}
                        onChange={(val) => props.onChange && props.onChange(val)}
                        accept={props.accept}
                        disabled={props.disabled}
                        error={props.error}
                        errorText={props.errorText ?? undefined}
                        helperText={props.helperText ?? undefined}
                        label={props.label ?? undefined}
                        maxFileSize={props.maxFileSize}
                        imageProperties={props.imageProperties}
                    />
                );
            default: throw new Error();
        }
    }, [
        props,
        showPassword,
        handlePasswordGenerate,
        handleNumberKeyPress,
        checkEnter,
        //acInputValue,
        handleAutoCompleteInputChange,
        locale
    ]); 

    if (typeof props.display == "boolean" && !props.display) {
        return null;
    }

    if (typeof props.display == "function" && !props.display()) {
        return null;
    }

    return (
        <Box display="flex" alignItems="flex-start" minHeight="32px" gap={2}>
            {control}
            {
                props.tooltip !== null &&
                    <Tooltip
                        title={props.tooltip}
                    >
                        <HelpOutline
                            sx={theme => ({
                                cursor: "pointer",
                                mt: 1,
                                ":hover": {
                                    color: theme.palette.secondary.main
                                }
                            })}
                        />
                    </Tooltip>
            }
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
    allowNullInSelect: false,
    selectNullLabel: null,
    noOptionsText: 'Ничего не найдено',
    display: true,
    accept: "*",
    cropImageToSize: null,
    maxFileSize: 4096,
    withImagePreview: false,
    isAvatar: false,
    lines: null,
    multiline: false,
    maxLines: null,
    disableNewPasswordGenerate: false,
    autocompleteLoadingText: "Загрузка...",
    onAutocompleteInputChange: null,
    onEnter: null,
    autocompleteCreatable: false,
    helperText: null,
    allowNegative: false,
    allowDecimals: false,
    multiple: false,
    wysiwygEditorProps: null,
    onWysiwygImageSave: null
}

export default ItnControl;