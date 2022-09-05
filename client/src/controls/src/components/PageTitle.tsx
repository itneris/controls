import React from 'react';
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from '@mui/material';
import { IPageTitleProps } from '../props/IPageTitleProps';

const PageTitle = (props: IPageTitleProps) => {
    return <Box
        justifyContent='space-between'
        alignItems='center'
        display='flex'
        mb={2}
    >
        <Typography variant='h5'>{props.children}</Typography>
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
                    Создать
                </Button>
            }
        </Box>
    </Box>
}

PageTitle.defaultProps = {
    onAdd: null,
    headerComponent: null,
    btnVariant: 'contained'
}

export default PageTitle;