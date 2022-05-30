import React, { useCallback, forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";
import CustomControl from "./CustomControl";
import { Backspace, Save } from "@mui/icons-material";
import DataLoad from "./DataLoad";

const CustomForm = forwardRef((props, ref) => {
    const {
        controls,
        onChange,
        formStyles,
        noPadding,
        labelWidth,
        onSave,
        onCancel,
        values,
        saving,
        variant,
        loading
    } = props;

    const [highlightErrors, setHighlightErrors] = useState(false);

    const handleChange = useCallback((field, value) => {
        setHighlightErrors(false);
        onChange(field, value);
    }, [setHighlightErrors, onChange]);

    const validateControls = useCallback(() => {
        let valid = true;
        //Все обязательные
        controls
            .filter(c => c.req && c.type !== "bool")
            .forEach(c => {
                const val = values[c.name];
                if (["", null, undefined].includes(val)) {
                    valid = false;
                    return;
                }
            });
        //Маски и ограничения
        controls
            .forEach(c => {
                const val = values[c.name];
                if (["", null, undefined].includes(val)) {
                    return;
                }

                if ((c.options?.inputProps?.min && +val < c.options.inputProps.min) ||
                    (c.options?.inputProps?.max && +val > c.options.inputProps.max)) {
                    valid = false;
                    return;
                }

                if (c.options?.mask && !new RegExp(c.options?.mask).test(val)) {
                    valid = false;
                    return;
                }
            });

        setHighlightErrors(!valid);
        return valid;
    }, [controls, values, setHighlightErrors]);

    const handleSaveClick = useCallback(() => {
        if (!validateControls()) {
            return;
        }
        onSave && onSave();
    }, [values, validateControls, onSave]);

    useImperativeHandle(ref, () => ({
        validate() {
            return validateControls();
        }
    }));

    if (loading) {
        return <DataLoad rowsCount={controls.length} />
    }

    return (
        <>
            <Paper
                sx={{
                    padding: formStyles?.p === 0 ? 0 : formStyles?.p || 2,
                    paddingLeft: formStyles?.pl === 0 ? 0 : formStyles?.pl || 2,
                    paddingTop: formStyles?.pt === 0 ? 0 : formStyles?.pt || 2,
                    marginTop: formStyles?.mt === 0 ? 0 : formStyles?.mt || 2,
                    marginBottom: formStyles?.mb === 0 ? 0 : formStyles?.mb || 2,
                }}
                elevation={props.hidePaper ? 0 : undefined}
            >
                {
                    props.header &&
                    <Box alignItems="center" display="flex">
                        <Typography variant="h6">{props.header}</Typography>
                    </Box>
                }
                {
                    controls.map((control, i) => {
                        if (!control.hide) {
                            return <CustomControl
                                key={"fc-" + i}
                                variant={variant}
                                formStyles={formStyles}
                                onChange={handleChange}
                                noPadding={noPadding}
                                labelWidth={labelWidth}
                                highlightErrors={highlightErrors}
                                value={values[control.name]}
                                {...control}
                            />
                        } else {
                            return null;
                        }
                    })
                }
            </Paper>
            {
                (onSave || onCancel) &&
                <Box display="flex" mt={2} justifyContent={onSave && onCancel ? "space-between" : "flex-end"}>
                    {
                        onCancel &&
                        <Button
                            startIcon={<Backspace />}
                            color="default"
                            variant="contained"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Отмена
                        </Button>
                    }
                    {
                        onSave &&
                        <Button
                            startIcon={<Save />}
                            disabled={saving}
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveClick}
                        >
                            Сохранить
                        </Button>
                    }
                </Box>
            }
        </>
    );
});

export default CustomForm;

CustomForm.propTypes = {
    controls: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.string,
    formStyles: PropTypes.shape({
        p: PropTypes.number,
        mt: PropTypes.number,
        mb: PropTypes.number,
        pt: PropTypes.number,
        pl: PropTypes.number,
    }),
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool,
    labelWidth: PropTypes.bool
}