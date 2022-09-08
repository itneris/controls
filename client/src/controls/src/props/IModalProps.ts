import { Breakpoint } from "@mui/material";
import React from "react";

export default interface IModalProps {
    /**
     * Modal dialog title
     * Default: null
     * */
    title?: string | null;
    /**
     * Modal content text, <DilogContextText> will not render if not set
     * Default: null
     * */
    contentText?: string | null;
    /**
     * Modal innter content
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
    onResult?: ((result: boolean | null) => boolean) | null;
    /**
     * Disable ok button
     * Default: false
     * */
    okButtonDisabled?: boolean;
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
}