import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from "@material-ui/core";
import CustomControl from "./CustomControl";
import common from "./common/styles";

class CustomForm extends Component {
    render() {

        const { controls, classes, setField, formStyles, entity, generatePassword } = this.props;

        return <Paper className={classes.layer}>
            <Box alignItems="center" display="flex">
                <Typography variant="h6">{this.props.header}</Typography>
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
    }
}

const styles = theme => ({
    ...common(theme),
    flex: {
        display: "flex",
        alignItems: "center"
    },
    layer: {
        padding: "6px 16px 16px 16px",
        marginTop: 20,
        marginBottom: 20
    },
});

export default withStyles(styles)(CustomForm);

CustomForm.propTypes = {
    controls: PropTypes.array,
    classes: PropTypes.array,
    entity: PropTypes.array,
    header: PropTypes.string,
    formStyles: PropTypes.array,
}