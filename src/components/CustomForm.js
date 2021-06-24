import React from "react";
import PropTypes from 'prop-types';
import {
    Box,
    Paper,
    Typography
} from "@material-ui/core";
import CustomControl from "../components/CustomControl";

const CustomForm = props => {
    const { controls, setField, formStyles, entity, generatePassword, noPadding, highlightErrors, labelWidth, mt, mb } = props;

    return (
        <Paper
            style={{
                padding: "6px 16px 16px 16px",
                marginTop: mt || 20,
                marginBottom: mb || 20
            }}
        >
            <Box alignItems="center" display="flex">
                <Typography variant="h6">{props.header}</Typography>
            </Box>
            {
                controls.map((control, i) => {
                    if (control.isShown) {
                        return <CustomControl
                            key={"fc-" + i}
                            formStyles={formStyles}
                            {...control}
                            entity={entity}
                            setField={setField}
                            generatePassword={generatePassword}
                            noPadding={noPadding}
                            labelWidth={labelWidth}
                            highlightErrors={highlightErrors}
                        />
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
    entity: PropTypes.object,
    header: PropTypes.string,
    formStyles: PropTypes.object,
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool,
    labelWidth: PropTypes.bool

}