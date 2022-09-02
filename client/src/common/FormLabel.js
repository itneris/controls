import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    Typography,
    Tooltip,
    Box
} from "@material-ui/core";

import {
    HelpOutline
} from "@material-ui/icons";
import common from "./styles";

class FormLabel extends Component {
    render() {
        let { classes, req, bold, tooltip, noPadding, labelWidth } = this.props;
        return <Typography
            style={{
                fontWeight: bold ? "bold" : "normal",
                paddingLeft: noPadding ? 0 : undefined,
            }}
            className={classes.fieldName}
            variant="body2"
            component="span"
        >
            {
                labelWidth ?
                    <Box width="103px" >{this.props.children}</Box>
                    : this.props.children
            }
            {
                req &&
                <Typography component="span" variant="body2" color="secondary" className={classes.asterisk}>*</Typography>
            }
            {
                tooltip &&
                <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title={tooltip}
                >
                    <HelpOutline className={classes.question} />
                </Tooltip>
            }
        </Typography>
    }
}

const styles = theme => ({
    ...common(theme),
    asterisk: {
        marginLeft: 5
    },
    fieldName: {
        width: 300,
        paddingLeft: 16,
        paddingRight:16,
        display: "flex"
    }
});

export default withStyles(styles)(FormLabel);