import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, {  useCallback } from 'react';
import IModalProps from '../props/IModalProps';

const ItnModal = (props: IModalProps) => {
    const { onResult, onClose, open, testId = "itn-modal" } = props;

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
            data-testid={testId}
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
                                data-testid={`${testId}-cancel-button`}
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
                                data-testid={`${testId}-no-button`}
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
                                data-testid={`${testId}-yes-button`}
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