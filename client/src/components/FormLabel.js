import React from "react";
import {
    Box,
    Tooltip,
    Typography
} from "@mui/material";
import {
    HelpOutline,
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const StyledHelpIcon = styled(HelpOutline)(
    ({theme}) => `
    marginLeft: 5px,
    cursor: pointer,
    color: grey,
    :hover {
        color: ${theme.palette.secondary.main}
    }
`)

const StyledHelpTooltip = styled(Tooltip)(
    ({ theme }) => ({
    width: 620,
    whiteSpace: "pre-line",
    fontSize: 12,
    padding: 24,
    lineHeight: 20,
    color: theme.palette.text.primary,
    borderRadius: 2,
    boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    backgroundColor: "white"
}))

const StyledTypography = styled(Typography)(
    ({ theme }) => ({
    width: 300,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: "flex"
}))

function FormLabel(props) {
    const {
        req,
        bold,
        tooltip,
        noPadding,
        labelWidth,
        children,
        pl
    } = props;
    return (
        <StyledTypography
            sx={{
                fontWeight: bold ? "bold" : "normal",
                paddingLeft: pl ? pl : noPadding ? 0 : undefined,
            }}
            variant="body2"
            component="div"
        >
            <Box width={labelWidth}>{children}</Box>
            {
                req &&
                <Box ml="5px">
                    <Typography component="span" variant="body2" color="secondary">*</Typography>
                </Box>
            }
            {
                tooltip &&
                <StyledHelpTooltip title={tooltip}>
                    <StyledHelpIcon />
                </StyledHelpTooltip>
            }
        </StyledTypography>
    )
}

export default FormLabel;