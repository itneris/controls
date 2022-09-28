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
    CircularProgress
} from "@mui/material";
import {
    AttachFile,
    CloudUpload,
    Delete,
    Loop,
    Refresh,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import { ItnDatePicker, ItnTimePicker } from "@itneris/pickers";
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

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

    const control = useMemo(() => {
        switch (props.type) {
            case 'select':
                return (
                    <FormControl size="small" fullWidth>
                        <InputLabel id="sel">{props.label}</InputLabel>
                        <Select
                            labelId="sel"
                            variant={props.variant}
                            fullWidth
                            label={props.label}
                            size="small"
                            error={props.error}
                            disabled={props.disabled}
                            value={props.value ?? ""}
                            onChange={event => props.onChange && props.onChange(event.target.value)}
                        >
                            <MenuItem disabled={props.allowNullInSelect ? false : true} value="">
                                <Typography variant='body2'>{props.selectNullLabel || `Выберите ${props.label}`}</Typography>
                            </MenuItem>
                            {
                                props.items!.map((item) => {
                                    return <MenuItem key={"opt-" + item.id} value={item.id}>
                                        <Typography variant='body2'>{item.label}</Typography>
                                    </MenuItem>
                                })
                            }
                        </Select>
                        <FormHelperText>{props.error && props.errorText}</FormHelperText>
                    </FormControl>
                );
            case 'autocomplete':
                return <Autocomplete
                    onInputChange={(event, value, reason) => props.onAutocompleteInputChange && props.onAutocompleteInputChange(value, reason)}
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
                    onChange={(event, newValue) => props.onChange && props.onChange(newValue)}
                    renderOption={(props, option) => (
                        <li {...props}>{option.label}</li>
                    )}
                    getOptionDisabled={opt => opt.disabled === true}
                    filterOptions={props.onAutocompleteInputChange !== null ? (_) => _ : undefined}
                    renderInput={(params) => (
                        <TextField
                            label={props.label}
                            variant={props.variant}
                            {...params}
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
                />
            case 'checkbox':
                return <FormControlLabel
                    label={props.label}
                    control={<Checkbox
                        disabled={props.disabled}
                        checked={!!props.value}
                        onChange={() => props.onChange && props.onChange(!props.value)}
                    />}
                />;
            case 'date':
                return <ItnDatePicker
                    label={props.label ?? ""}
                    value={props.value}
                    onChange={val => props.onChange && props.onChange(val)}
                    size="small"
                    disabled={props.disabled}
                    fullWidth
                />;
            case 'time':
                return <ItnTimePicker
                    label={props.label ?? ""}
                    value={props.value}
                    onChange={val => props.onChange && props.onChange(val)}
                    size="small"
                    disabled={props.disabled}
                    fullWidth
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
                            value={props.value}
                            placeholder={props.placeholder ?? ""}
                            label={props.label}
                            size="small"
                            error={props.error}
                            helperText={props.errorText}
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
                            onChange={event => props.onChange && props.onChange(event.currentTarget.value)}
                        />
                        <FormHelperText>{props.error}</FormHelperText>
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
                    variant={props.variant}
                    disabled={props.disabled}
                    fullWidth
                    placeholder={props.placeholder ?? ""}
                    value={props.value}
                    label={props.label}
                    onChange={event => props.onChange && props.onChange(event.currentTarget.value)}
                    error={props.error}
                    size="small"
                    helperText={props.errorText}
                    multiline={props.multiline}
                    rows={props.lines || undefined}
                    maxRows={props.maxLines || undefined}
                />;
            case 'number':
                return <TextField
                    fullWidth
                    variant={props.variant}
                    type="number"
                    placeholder={props.placeholder ?? ""}
                    error={props.error}
                    helperText={props.errorText}
                    value={props.value}
                    disabled={props.disabled}
                    onChange={event => props.onChange && props.onChange(+event.currentTarget.value)}
                    size="small"
                />;
            case 'file':
                return (<>
                    <input ref={fileInputRef} type="file" hidden onChange={uploadFile} accept={props.accept} />
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
                                        <Typography variant="h4">А</Typography>
                                    </Box>
                                }
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<CloudUpload />}
                                    onClick={handleUploadClick}
                                >
                                    {props.label}
                                </Button>
                            </> :
                            !props.withImagePreview ?
                                <Box display="flex" alignItems="center" width="100%">
                                    <AttachFile />
                                    <Typography style={{ flex: 1 }}>{(props.value as File).name}</Typography>
                                    <Tooltip placement="right-start" title="Заменить">
                                        <IconButton color="secondary" onClick={handleUploadClick}>
                                            <Refresh />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip placement="right-start" title="Удалить">
                                        <IconButton color="error" onClick={handleDeleteFile}>
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
                                            <IconButton color="secondary" onClick={handleUploadClick}>
                                                <Refresh />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="right-start" title="Удалить">
                                            <IconButton color="error" onClick={handleDeleteFile}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box> 
                    }
                </>);
            default: throw new Error();
        }
    }, [
        props,
        showPassword,
        handlePasswordGenerate,
        uploadFile,
        handleUploadClick,
        handleDeleteFile,
        preview
    ]); 

    if (typeof props.display == "boolean" && !props.display) {
        return null;
    }

    if (typeof props.display == "function" && !props.display()) {
        return null;
    }

    return (
        <Box display="flex" alignItems="center" minHeight="32px">
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
    onAutocompleteInputChange: null
}

export default ItnControl;