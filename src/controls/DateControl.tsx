import { DateTimePicker } from "@mui/x-date-pickers";
import { useCallback, useContext } from "react";
import { ItnFormGlobalContext } from "../providers/ItnFromProvider";
import { DateControlProps } from "../types/ControlProps";

function DateControl(props: DateControlProps) {
    const { locale } = useContext(ItnFormGlobalContext);

    const handleChange = useCallback((val: any) => {
        if ((!val === null || val.toString() !== "Invalid Date") && props.onChange) {
            props.onChange(val?.toISOString())
        }
    }, [props.value, props.onChange]);

    return (
        <DateTimePicker
            label={props.label ?? ""}
            value={props.value ? new Date(props.value as string) : null}
            onChange={handleChange}
            minDate={props.minDate}
            maxDate={props.maxDate}
            disabled={props.disabled}
            slotProps={{
                textField: {
                    placeholder: locale.dateControl.dateTimePlaceHolder,
                    size: "small",
                    fullWidth: true,
                    error: props.isError,
                    helperText: props.isError ? props.errorText : (props.helperText ?? "")
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
        />
    );
}

export default DateControl;