import { Breakpoint, SxProps } from "@mui/material";
import React from "react";

export type ModalProps = {
    /**
     * Is modal open
     * */
    open: boolean;
    /**
     * Fires when modal closes
     * */
    onClose: () => void;
    /**
     * Modal dialog title
     * Default: null
     * */
    title?: string | null;
    /**
     * Modal content text, <DialogContextText> will not render if not set
     * Default: null
     * */
    contentText?: string | null;
    /**
     * Modal inner content
     * Default: null
     * */
    children?: React.ReactNode | null;
    /**
     * Callback on result of modal action
     * Default: null
     * Function params:
     *      result: boolean | null
     *          true: "Yes" button clicked
     *          false: "No" button clicked
     *          null: "Cancel" button clicked or dialog hidden another way
     * Return boolean, should modal be closed after button click
     * */
    onResult?: ((result: boolean | null) => boolean | void) | null;
    /**
     * Disable ok button
     * Default: false
     * */
    yesButtonDisabled?: boolean;
    /**
     * Show modal on fullscreen
     * Default: false
     * */
    fullScreen?: boolean;
    /**
     * Size of modal based on MaterialUI breakpoints
     * Default: "md"
     * */
    size?: Breakpoint,
    /**
     * "Yes" button text, button will not be rendered if not set
     * Default: null
     * */
    yesBtnText?: string | null,
    /**
     * "No" button text, button will not be rendered if not set
     * Default: null
     * */
    noBtnText?: string | null,
    /**
     * "Cancel" button text, button will not be rendered if not set
     * Default: null
     * */
    cancelBtnText?: string | null,
    /**
     * Replaces title and renders react node in title
     * Default: null
     * */
    titleComponent?: React.ReactNode | null;
    /**
     * Replaces title and renders react node in title
     * Default: null
     * */
    contentStyle?: SxProps;
    /**
     * Transition duration in ms
     * Default: null
     * */
    transitionDuration?: number;
}