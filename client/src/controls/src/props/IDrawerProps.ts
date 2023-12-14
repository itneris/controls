import { SxProps, Theme } from "@mui/material";

export default interface IDrawerProps {
    /**
     * Is drawer open
     * */
    open: boolean;
    /**
     * Current drawer tab
     * Default: 0
     * */
    defaultTab?: number;
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
    buttons?: Array<IDrawerBtnProp>;
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
    /**
     * Props for defining paper style
     * Default: {
            width: '40%',
            '& .MuiDrawer-paper': {
                width: '40%',
                overflow: 'visible',
                boxSizing: 'border-box',
                backgroundColor: "#eee"
            }
        }
     * */
    sx?: SxProps<Theme>;
}

export interface IDrawerBtnProp {
    /**
     * Button color based on MaterialUI theme colors
     * Default: "default"
     * */
    color?: "inherit" | "default" | "primary" | "secondary" | "error" | "success" | "info" | "warning";
    /**
     * Button tooltip text, if not set no tooltip will be rendered
     * Default: null
     * */
    tooltip?: string | null;
    /**
     * FAB button icon
     * */
    icon: React.ReactNode;
    /**
     * Callbacl when button clicked
     * */
    onClick: () => void;
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