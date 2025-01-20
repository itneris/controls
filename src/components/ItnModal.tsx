import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {  useCallback } from 'react';
import { ModalProps } from '../types/ModalProps';

const ItnModal = (props: ModalProps) => {
    const { onResult, onClose, open } = props;

    const handleResult = useCallback((result: boolean | null) => {
        if (onResult) {
            const shouldClose = onResult(result);
            if (shouldClose !== false) {
                onClose();
            }
            return;
        }

        onClose();
    }, [onResult, onClose]);

    return (
        <Dialog
            open={open}
            onClose={() => handleResult(null)}
            maxWidth={props.size}
            fullWidth
            fullScreen={props.fullScreen}
            transitionDuration={props.transitionDuration}     
        >
            {
                (props.title !== null || props.titleComponent !== null) &&
                <DialogTitle>
                    {
                        props.titleComponent !== null ?
                            props.titleComponent :
                            props.title
                    }
                </DialogTitle>
            }
            <DialogContent sx={props.contentStyle}>
                {
                    props.contentText != null &&
                    <DialogContentText mb={props.children !== null ? 2 : 0}>
                        {props.contentText}
                    </DialogContentText>
                }
                {props.children}
            </DialogContent>
            <DialogActions>
                <Box width="100%" display="flex" justifyContent={"space-between"}>
                    <Box>
                        {
                            props.cancelBtnText !== null &&
                            <Button
                                variant="text"
                                onClick={() => handleResult(null)}
                            >
                                {props.cancelBtnText}
                            </Button>
                        }
                    </Box>
                    <Box display="flex" gap={2}>
                        {
                            props.noBtnText !== null &&
                            <Button
                                variant="text"
                                onClick={() => handleResult(false)}
                                color="secondary"
                            >
                                {props.noBtnText}
                            </Button>
                        }
                        {
                            props.yesBtnText !== null &&
                            <Button
                                variant="text"
                                onClick={() => handleResult(true)}
                                color="secondary"
                                disabled={props.yesButtonDisabled}
                            >
                                {props.yesBtnText}
                            </Button>
                        }
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

ItnModal.defaultProps = {
    title: null,
    contentText: null,
    onResult: null,
    yesButtonDisabled: false,
    size: "md",
    yesBtnText: null,
    noBtnText: null,
    cancelBtnText: null,
    titleComponent: null,
    children: null
}

export default ItnModal;