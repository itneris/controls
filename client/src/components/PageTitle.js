import { React } from 'react';
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from '@mui/material';

export default function PageTitle(props) {
    const {
        title,
        onAdd,
        btnStyle
    } = props;
    return <Box
        justifyContent='space-between'
        alignItems='center'
        display='flex'
        mb={2}
    >
        <Typography variant='h5'>{title}</Typography>
        {
            onAdd &&
            <Button
                color='secondary'
                variant={btnStyle || 'contained'}
                startIcon={<Add />}
                onClick={onAdd}
            >
                Создать
            </Button>
        }
    </Box>
}