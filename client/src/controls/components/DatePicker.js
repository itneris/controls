import React, { useState, useEffect, useCallback, useMemo} from 'react';

import { DayPicker } from 'react-day-picker';
import ru from 'date-fns/locale/ru';
import 'react-day-picker/dist/style.css';
import { format } from "date-fns";
import { Box, IconButton, Popover, TextField, useTheme } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

const getIsoDateFromString = (value) => {
    const day = +value.split(".")[0];
    const month = +value.split(".")[1];
    const year = +value.split(".")[2];
    const dateValue = new Date(year, month - 1, day);
    return format(dateValue, "yyyy-MM-dd'T'HH:mm:ss");
}

export default function DatePicker(props) {
    const {
        mode = "single",
        value,
        onChange,
        variant = "standard",
        fullWidth = true
    } = props;

    const [inputValue, setInputValue] = useState(value || "");
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isRange = useMemo(() => mode === "range", [mode]);

    useEffect(() => {
        try {
            if (isRange) {
                const dates = value.split(" - ");
                const from = dates[0] === "..." ? "..." : format(new Date(dates[0]), "dd.MM.yyyy");
                const to = dates[1] === "..." ? "..." : format(new Date(dates[1]), "dd.MM.yyyy");
                setInputValue(from + " - " + to);
            } else {
                setInputValue(value ? format(new Date(value), "dd.MM.yyyy") : "");
            }
        } catch {

        }
    }, [value, isRange]);

    const handleInputChange = useCallback((e) => {
        let val = e.currentTarget.value;
        if (val.length > 23 || (val.length > 10 && !isRange)) {
            return;
        }
        if (val.length === 2 || val.length == 5 || val.length === 15 || val.length === 18) {
            val += "."
        }
        if (val.length === 10 && isRange) {
            val += " - ";
        }
        setInputValue(val);
    }, [setInputValue, isRange]);

    const handleBlur = useCallback(() => {
        try {
            if (isRange) {
                const dates = inputValue.split(" - ");
                onChange(getIsoDateFromString(dates[0]) + " - " + getIsoDateFromString(dates[1]));
            } else {
                const val = getIsoDateFromString(inputValue);
                onChange(val);
            }
        } catch {
            setInputValue("");
        }
    }, [inputValue, onChange, isRange]);

    const handleShowPicker = useCallback((e) => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    }, [setAnchorEl, anchorEl]);

    const handleHidePicker = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const handleSelectDate = useCallback(dateValue => {
        if (isRange) {
            let from = "...";
            let to = "...";
            if (dateValue?.from && !isNaN(dateValue?.from) && dateValue.from.toISOString()) {
                from = format(dateValue.from, "yyyy-MM-dd'T'HH:mm:ss");
            }
            if (dateValue?.to && !isNaN(dateValue?.to) && dateValue.to.toISOString()) {
                to = format(dateValue.to, "yyyy-MM-dd'T'HH:mm:ss");
            }

            onChange(from + " - " + to);
        } else {
            if (dateValue && dateValue.toISOString()) {
                const val = format(dateValue, "yyyy-MM-dd'T'HH:mm:ss");
                onChange(val);
            }
            handleHidePicker();
        }
    }, [onChange, handleHidePicker, isRange]);

    const id = anchorEl !== null ? 'dp-date' : undefined;

    const selectedValue = useMemo(() => {
        if (!value) {
            return null;
        }

        if (isRange) {
            const dates = value.split(" - ");
            return {
                from: new Date(dates[0]),
                to: new Date(dates[1])
            };
        } else {
            return new Date(value);
        }
    }, [value, isRange]);


    return <>
        <TextField
            fullWidth={fullWidth}
            variant={variant}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            aria-describedby={id}
            InputProps={{
                endAdornment: <IconButton
                    color="secondary"
                    onClick={handleShowPicker}
                >
                    <CalendarMonth />
                </IconButton>
            }}
        />
        <Popover
            id={id}
            open={anchorEl !== null}
            anchorEl={anchorEl}
            onClose={handleHidePicker}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box zIndex={9999}>
                <DayPicker
                    styles={{
                        day: {
                            borderColor: 'transparent',
                        },
                        nav_button_previous: {
                            borderColor: 'transparent',
                        },
                        nav_button_next: {
                            borderColor: 'transparent'
                        }
                    }}
                    locale={ru}
                    selected={selectedValue}
                    modifiersStyles={{
                        selected: {
                            backgroundColor: theme.palette.secondary.main,
                        },
                    }}
                    mode={mode}
                    onSelect={handleSelectDate}
                />
            </Box>
        </Popover>
    </>
}