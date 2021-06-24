import React, { Component } from "react";
import {
    Box,
    Tooltip,
    Typography
} from "@material-ui/core";
import {
    HelpOutline,
} from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';

class FormLabelWoStyles extends Component {
    render() {
        let { classes, req, bold, tooltip, noPadding, labelWidth } = this.props;

        console.log(labelWidth);

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
    asterisk: {
        marginLeft: 5
    },
    question: {
        marginLeft: 5,
        cursor: 'pointer',
        color: "grey",
        '&:hover': {
            color: theme.palette.secondary.main
        }
    },
    tooltip: {
        width: 620,
        whiteSpace: "pre-line",
        fontSize: 12,
        padding: 24,
        lineHeight: "20px",
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
        backgroundColor: "white"
    },
    fieldName: {
        width: 300,
        paddingLeft: 16,
        paddingRight: 16,
        display: "flex"
    }
});

export default FormLabelWoStyles = withStyles(styles)(FormLabelWoStyles);