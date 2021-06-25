import React from "react";
import PropTypes from 'prop-types';
import {
    Box,
    Paper,
    Typography
} from "@material-ui/core";
import CustomControl from "../components/CustomControl";

const CustomForm = props => {
    const { controls, setField, formStyles, generatePassword, noPadding, highlightErrors, labelWidth, } = props;

    return (
        <Paper
            style={{
                padding: "6px 16px 16px 16px",
                marginTop: formStyles.mt || 20,
                marginBottom: formStyles.mb || 20
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
                            setField={setField}
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

class FormStyleClass {
    mt;
    mb;
}

FormStyleClass.PropTypes = {
    mt: PropTypes.number,
    mb: PropTypes.number
}

CustomForm.propTypes = {
    controls: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.string,
    formStyles: PropTypes.objectOf(PropTypes.instanceOf(FormStyleClass)),
    highlightErrors: PropTypes.bool,
    noPadding: PropTypes.bool,
    labelWidth: PropTypes.bool,
    

}