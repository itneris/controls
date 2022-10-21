import React from "react";

export interface IPageTitleProps {
    /**
     * Content of page title <Typography />, string in most cases
     * */
    children: React.ReactNode;
    /**
     * Callback when "Add" button click, "Add" button will not be rendered if not set
     * Default: null
     * */
    onAdd?: (() => void) | null;
    /**
     * "Add" button variant based on MaterialUI
     * Default: "contained"
     * */
    btnVariant?: "contained" | "text" | "outlined";
    /**
     * Component rendered before "Add" button
     * Default: null
     * */
    headerComponent?: React.ReactNode | null;

    /**
     * Tooltip for question mark near title, will not be rendered if not set
     * Default: null
     * */
    tooltip?: React.ReactNode | null;
}