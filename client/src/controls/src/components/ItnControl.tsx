import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    Autocomplete,
    Tooltip,
    FormControlLabel,
    InputLabel,
    Button,
    Avatar,
    CircularProgress,
    createFilterOptions,
    AutocompleteInputChangeReason
} from "@mui/material";
import {
    AttachFile,
    CloudUpload,
    Delete,
    HelpOutline,
    Loop,
    Refresh,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import IControlProps, { ItnSelectOption } from "../props/IControlProps";
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from "date-fns/locale";

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

const filter = createFilterOptions<ItnSelectOption>();

function ItnControl(props: IControlProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textInputRef = useRef<HTMLInputElement | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const tmpId = useRef<number>(1);

    const [acInputValue, setAcInputValue] = useState<string>("");

    const handlePasswordGenerate = useCallback(() => {
        props.onChange && props.onChange(generatePassword(props.passwordLength!));
    }, [props.onChange, props.passwordLength]); // eslint-disable-line react-hooks/exhaustive-deps

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (props.type !== "file") {
            return;
        }

        if (!props.value) {
            props.withImagePreview && setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(props.value as File);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [props.value, props.withImagePreview, setPreview, props.type]);

    /*useEffect(() => {
        if (textInputRef.current === null) {
            return;
        }
        textInputRef.current.value = props.value;
    }, [props.value]);*/

    const handleUploadClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        //e.preventDefault();
        fileInputRef.current!.click();
    }, []);

    const handleDeleteFile = useCallback(() => props.onChange && props.onChange(null), [props.onChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const uploadFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) {
            props.onChange && props.onChange(null);
            return;
        }

        props.onChange && props.onChange(e.target.files![0]);
    }, [props.onChange]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const handleAutoCompleteInputChange = useCallback((event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
        props.onAutocompleteInputChange && props.onAutocompleteInputChange(value, reason);
        if (props.onAutocompleteInputChange && reason === "reset") {
            return;
        }
        setAcInputValue(value);
    }, [setAcInputValue, props.onAutocompleteInputChange]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.type === "autocomplete" && !props.multiple) {
            setAcInputValue(props.value?.label ?? "");
        }
    }, [props.value, props.type, props.multiple, setAcInputValue]);

    const control = useMemo(() => {
        switch (props.type) {
            case 'select':
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
                            value={props.value ?? (props.multiple ? [] : "")}
                            onChange={event => props.onChange && props.onChange(event.target.value)}
                            multiple={props.multiple}
                        >
                            <MenuItem disabled={props.allowNullInSelect ? false : true} value="">
                                <Typography variant='body2'>{props.selectNullLabel || `Выберите ${props.label}`}</Typography>
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
                    inputValue={acInputValue}
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
                    onChange={(event, newValue) => {
                        if (!props.multiple && newValue !== null && newValue.inputValue) {
                            props.onAutocompleteOptionAdded && props.onAutocompleteOptionAdded(newValue.inputValue);
                            props.onChange && props.onChange(new ItnSelectOption("new", newValue.inputValue));
                        } else if (props.multiple && newValue.find((val: any) => !!val.inputValue)) {
                            const newVal = newValue.find((val: any) => !!val.inputValue);
                            props.onAutocompleteOptionAdded && props.onAutocompleteOptionAdded(newVal.inputValue);
                            props.onAutocompleteInputChange && props.onAutocompleteInputChange("", "input");
                            props.onChange && props.onChange(
                                [
                                    ...newValue.filter((val: any) => val.id !== "new"),
                                    new ItnSelectOption(`new-${tmpId.current++}`, newVal.inputValue)
                                ]
                            );                                
                        } else {
                            props.onChange && props.onChange(newValue);
                        }

                        if (props.multiple) {
                            setAcInputValue("");
                        } else {
                            setAcInputValue(newValue?.inputValue ?? newValue?.label ?? "");
                        }
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={"opt" + option.id} >{option.label}</li>
                    )}
                    getOptionDisabled={opt => opt.disabled === true}
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
                        const isExisting = options.some((option) => inputValue === option.title);

                        if (inputValue !== '' && !isExisting) {
                            filtered = [{
                                id: "new",
                                label: `Добавить "${inputValue}"`,
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
                    multiple={props.multiple}
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
                return <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <DatePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        disabled={props.disabled}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "дд.мм.гггг"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }
                    />
                </LocalizationProvider>;
            case 'time':
                return <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <TimePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        disabled={props.disabled}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "ЧЧ:ММ"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }
                    />
                </LocalizationProvider>;
            case 'datetime':
                return <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <DateTimePicker
                        label={props.label ?? ""}
                        value={props.value ? new Date(props.value) : null}
                        onChange={val => {
                            if ((val === null || val.toString() !== "Invalid Date") && props.onChange) {
                                props.onChange(val?.toISOString())
                            }
                        }}
                        disabled={props.disabled}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "дд.мм.гггг ЧЧ:ММ"
                                }}
                                size="small"
                                fullWidth
                                error={props.error}
                                helperText={props.error ? props.errorText : (props.helperText ?? "")}
                            />
                        }
                    />
                </LocalizationProvider>;
            case 'password':
                return <Box display="flex" width="100%">
                    <FormControl
                        fullWidth
                        error={props.error}
                    >
                        <TextField
                            ref={textInputRef}
                            variant={props.variant}
                            fullWidth
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
                                    <IconButton
                                        aria-label="Видимость пароля"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }}
                            disabled={props.disabled}
                            onKeyPress={checkEnter}
                        />
                    </FormControl>
                    {
                        !props.disableNewPasswordGenerate &&
                        <IconButton onClick={handlePasswordGenerate}>
                            <Tooltip title="Сгенерировать пароль">
                                <Loop />
                            </Tooltip>
                        </IconButton>
                    }
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
            case 'string':
                return <TextField
                    ref={textInputRef}
                    onKeyPress={checkEnter}
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
                />;
            case 'number':
                return <TextField
                    ref={textInputRef}
                    value={props.value}
                    onChange={event => props.onChange && props.onChange(event.currentTarget.value  === "" ? null : +event.currentTarget.value)}
                    //onBlur={event => props.onChange && props.onChange(event.currentTarget.value)}
                    label={props.label}
                    onKeyPress={handleNumberKeyPress}
                    fullWidth
                    variant={props.variant}
                    type="number"
                    placeholder={props.placeholder ?? ""}
                    error={props.error}
                    helperText={props.error ? props.errorText : (props.helperText ?? "")}
                    disabled={props.disabled}
                    size="small"
                />;
            case 'file':
                return (<FormControl>
                    <input disabled={props.disabled} ref={fileInputRef} type="file" hidden onChange={uploadFile} accept={props.accept} />
                    {
                        props.value === null ?
                            <>
                                {
                                    props.isAvatar &&
                                    <Box
                                        borderRadius="50%"
                                        height={70}
                                        width={70}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        marginRight={3}
                                        sx={theme => ({
                                            cursor: "initial",
                                            backgroundColor: theme.palette.primary.main
                                        })}
                                    >
                                        <Typography color={theme => theme.palette.primary.contrastText} variant="h4">А</Typography>
                                    </Box>
                                }
                                <Button
                                    disabled={props.disabled}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<CloudUpload />}
                                    onClick={handleUploadClick}
                                    style={{ alignSelf: "start" }}
                                >
                                    {props.label}
                                </Button>
                            </> :
                            !props.withImagePreview ?
                                <Box display="flex" alignItems="center" width="100%">
                                    <AttachFile />
                                    <Typography style={{ flex: 1 }}>{(props.value as File).name}</Typography>
                                    <Tooltip placement="right-start" title="Заменить">
                                        <IconButton color="secondary" onClick={handleUploadClick} disabled={props.disabled}>
                                            <Refresh />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip placement="right-start" title="Удалить">
                                        <IconButton color="error" onClick={handleDeleteFile} disabled={props.disabled}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box> :
                                <Box display="flex" alignItems="stretch" width="100%">
                                    {
                                        props.isAvatar ?
                                            <Avatar src={preview!} style={{ height: 80, width: 80 }} /> :
                                            <Box
                                                borderRadius={1}
                                                height={80}
                                                width={140}
                                                sx={{
                                                    background: `url("${preview}")`,
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover"
                                                }}
                                            />
                                    }
                                    <Box display="flex" flexDirection="column" ml={2} justifyContent="space-between">
                                        <Tooltip placement="right-start" title="Заменить">
                                            <IconButton color="secondary" onClick={handleUploadClick} disabled={props.disabled}>
                                                <Refresh />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="right-start" title="Удалить">
                                            <IconButton color="error" onClick={handleDeleteFile} disabled={props.disabled}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box> 
                    }
                    <FormHelperText error={props.error}>{props.error ? props.errorText : (props.helperText ?? "")}</FormHelperText>
                </FormControl>);
            default: throw new Error();
        }
    }, [
        props,
        showPassword,
        handlePasswordGenerate,
        uploadFile,
        handleUploadClick,
        handleDeleteFile,
        handleNumberKeyPress,
        preview,
        checkEnter,
        acInputValue,
        handleAutoCompleteInputChange
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
    multiple: false
}

export default ItnControl;