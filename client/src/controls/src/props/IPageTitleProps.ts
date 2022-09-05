import React from "react";

export interface IPageTitleProps {
    children: React.ReactNode;
    onAdd?: (() => void) | null;
    btnVariant?: "contained" | "text" | "outlined";
    headerComponent?: React.ReactNode | null;
}