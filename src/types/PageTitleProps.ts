import React from "react";

export type PageTitleProps = {
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
    /**
     * Callback when "Back" button click, "Back" button will not be rendered if not set
     * Default: null
     * */
    onBack?: (() => void) | null;
    /**
     * Header text variant
     * Default: h5
     * */
    textVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "button" | "caption" | "inherit" | "overline" | "subtitle1" | "subtitle2" | "body1" | "body2"
}