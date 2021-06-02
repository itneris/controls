import React from "react";
import PropTypes from 'prop-types';
import {
    Box,
    Paper,
    Typography
} from "@material-ui/core";

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
                controls.map((control, i) => {
                    if (control.isShown) {
                        return <CustomControl
                            key={"fc-" + i}
                            formStyles={formStyles}
                            {...control}
                            entity={entity}
                            value={control}
                            setField={setField}
                            generatePassword={generatePassword}
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
    classes: PropTypes.array,
    entity: PropTypes.array,
    header: PropTypes.string,
    formStyles: PropTypes.array,
}