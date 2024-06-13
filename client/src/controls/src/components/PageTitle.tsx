import React, { useContext } from 'react';
import { Add,  ArrowBack,  HelpOutline } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { IPageTitleProps } from '../props/IPageTitleProps';
import { ItnFormGlobalContext } from '../localization/ItnFromProvider';

const PageTitle = (props: IPageTitleProps) => {
    const { locale } = useContext(ItnFormGlobalContext);
    
    return (
        <Box
            justifyContent='space-between'
            alignItems='center'
            display='flex'
            mb={2}
        >
            <Box display='flex' gap={2} alignItems='center'>
                {
                    props.onBack !== null &&
                    <IconButton
                        onClick={props.onBack}
                        size="small"
                        title={locale.pageTitle.backButtonText}
                    >
                        <ArrowBack />
                    </IconButton>
                }
                <Typography variant={props.textVariant!}>{props.children}</Typography>
                {
                    props.tooltip !== null &&
                    <Tooltip
                        title={props.tooltip}
                    >
                        <HelpOutline
                            sx={theme => ({
                                cursor: "pointer",
                                ":hover": {
                                    color: theme.palette.secondary.main
                                }
                            })}
                        />
                    </Tooltip>
                }
            </Box>
            <Box display='flex' gap={2} alignItems='center'>
                {props.headerComponent}
                {
                    props.onAdd &&
                    <Button
                        color='secondary'
                        variant={props.btnVariant}
                        startIcon={<Add />}
                        onClick={props.onAdd}
                    >
                        {locale.pageTitle.createButtonText}
                    </Button>
                }
            </Box>
        </Box>
    );
}

PageTitle.defaultProps = {
    onAdd: null,
    onBack: null,
    headerComponent: null,
    tooltip: null,
    btnVariant: 'contained',
    textVariant: "h5"
}

export default PageTitle;