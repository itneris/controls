import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import IModalProps from '../props/IModalProps';
import IModalRef from '../props/IModalRef';

const ItnModal = forwardRef<IModalRef, IModalProps>((props: IModalProps, ref: ForwardedRef<IModalRef>) => {
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));

    const [open, setOpen] = useState<boolean>(false);

    const handleResult = useCallback((result: boolean | null) => {
        if (props.onResult) {
            const shouldClose = props.onResult(result);
            if (shouldClose !== false) {
                setOpen(false);
            }
            return;
        }

        setOpen(false);
    }, [props.onResult, setOpen]);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Dialog
            open={open}
            onClose={() => handleResult(null)}
            maxWidth={props.size}
            fullWidth
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
            <DialogContent>
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
                            >
                                {props.yesBtnText}
                            </Button>
                        }
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
});

ItnModal.defaultProps = {
    title: null,
    contentText: null,
    onResult: null,
    okButtonDisabled: false,
    size: "md",
    yesBtnText: null,
    noBtnText: null,
    cancelBtnText: null,
    titleComponent: null,
    children: null
}

export default ItnModal;