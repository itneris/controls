import { Breakpoint } from "@mui/material";
import React from "react";

export default interface IModalProps {
    title?: string | null;
    contentText?: string | null;
    children: React.ReactNode;
    onResult?: ((result: boolean | null) => void) | null;
    okButtonDisabled?: boolean;
    size?: Breakpoint,
    yesBtnText?: string | null,
    noBtnText?: string | null,
    cancelBtnText?: string | null,
    titleComponent?: React.ReactNode | null;
}