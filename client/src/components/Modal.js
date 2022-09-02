import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useCallback } from 'react';

export default function Modal(props) {
    const {
        styleTitle = { paddingX: "16px", paddingY: "16px" },
        styleContent = { paddingX: "16px", paddingTop: "0px", paddingBottom: "20px" },
        styleBottom = { paddingX: "16px", paddingTop: "8px", paddingBottom: "16px" },
        titleJustifyContent = "start",
        title,
        open,
        contentText,
        children,
        onClose,
        okButtonDisabled,
        onCancel,
        onOk,
        size = "xl",
        okBtnText = "Принять",
        titleComponent,
    } = props;

    const handleOk = useCallback(() => {
        onOk && onOk();
        onClose();
    }, [onOk, onClose]);

    const handleCancel = useCallback(() => {
        onClose();
    }, [onCancel, onClose]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={size}
            fullWidth
        >
            <DialogTitle sx={styleTitle}>
                {
                    titleComponent ? <Box display="flex" flexDirection="row" gap={3} justifyContent={titleJustifyContent}>
                    <Typography variant="h5" gutterBottom component="div">
                        {title}
                    </Typography>
                {titleComponent && titleComponent }
                </Box>
                :
                <Typography variant="h5" gutterBottom component="div">
                    {title}
                </Typography>
            }   
            </DialogTitle>
            <DialogContent sx={styleContent}>
                <DialogContentText mb={children ? 2 : 0}>
                    {contentText}
                </DialogContentText>
                {children}
            </DialogContent>
            <DialogActions sx={styleBottom}>
                <Box width="100%" display="flex" justifyContent={handleCancel && onCancel? "space-between" : "flex-end"}>
                    {
                        onCancel && <Button
                            variant="contained"
                            //color="default"
                            onClick={handleCancel}
                        >
                            Отмена
                        </Button>
                    }
                    <Button
                        variant="contained"
                        //color="secondary"
                        onClick={handleOk}
                        disabled={okButtonDisabled}
                    >
                        {okBtnText}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}