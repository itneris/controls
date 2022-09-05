import React from "react";

export default interface IDrawerProps {
    children: React.ReactNode;
    title?: string | null;
    onResult?: ((result: "delete" | "save" | "cancel" | "hide") => void) | null;
    buttons?: Array<DrawerBtnProp>;
    tabs?: Array<DrawerTabProp>;
    saveBtnText?: string | null;
    cancelBtnText?: string | null;
    deleteBtnText?: string | null;
}

export class DrawerBtnProp {
    color?: "inherit" | "default" | "primary" | "secondary" | "error" | "success" | "info" | "warning" = "default";
    tooltip?: string | null = null;
    icon: React.ReactNode;
    onClick: () => void = () => { };
}

export class DrawerTabProp {
    title: string = "";
    subtitle?: string | null = null;
    component: React.ReactNode;
}