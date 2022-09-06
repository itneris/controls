import React from "react";

export default interface IDrawerProps {
    /**
     * Content in drawer
     * */
    children?: React.ReactNode;
    /**
     * Drawer title
     * Default: null
     * */
    title?: string | null;
    /**
     * Callback on drawer action
     * Default: null  
     * Function params: 
     *      result: 
     *          "delete" - "Delete" button clicked
     *          "save" - "Save" button clicked
     *          "cancel" - "Cancel" button clicked
     *          "hide" - Drawer hidden by outside click
     * */
    onResult?: ((result: "delete" | "save" | "cancel" | "hide") => void) | null;
    /**
     * Additional FAB buttons for drawer
     * Default: []  
     * */
    buttons?: Array<DrawerBtnProp>;
    /**
     * Tabs that should be rendered instead of content
     * Default: []  
     * */
    tabs?: Array<DrawerTabProp>;
    /**
     * "Save" button tooltip text
     * Default: "Сохранить"
     * */
    saveBtnText?: string | null;
    /**
     * "Cancel" button tooltip text
     * Default: "Отмена"
     * */
    cancelBtnText?: string | null;
    /**
     * "Delete" button tooltip text
     * Default: "Удалить"
     * */
    deleteBtnText?: string | null;
}

export class DrawerBtnProp {
    /**
     * Button color based on MaterialUI theme colors
     * Default: "default"
     * */
    color?: "inherit" | "default" | "primary" | "secondary" | "error" | "success" | "info" | "warning" = "default";
    /**
     * Button tooltip text, if not set no tooltip will be rendered
     * Default: null
     * */
    tooltip?: string | null = null;
    /**
     * FAB button icon
     * */
    icon: React.ReactNode;
    /**
     * Callbacl when button clicked
     * */
    onClick: () => void = () => { };
}

export class DrawerTabProp {
    /**
     * Title for tab
     * */
    title: string = "";
    /**
     * Subtitle for tabl
     * */
    subtitle?: string | null = null;
    /**
     * Tab inner content
     * */
    component: React.ReactNode;
}