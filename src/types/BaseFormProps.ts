import { ItnFormRef } from "./ItnFormRef";


export type ItnFormProps<T> = {
    /**
     * Callback when "Save" button click 
     * Default: undefined
     * Function params:
     *      entity: LooseObject, Currently edit entity
     * */
    onSave?: (entity: T) => void;
    /**
     * Callback when enter pressed on form 
     * Default: undefined
     * Function params:
     *      entity: LooseObject, Currently edit entity
     * */
    onEnter?: (entity: T) => void;
    /**
     * Callback when "Delete" button click
     * Default: null
     * Function params:
     *      id: string, Id of currently edit entity.
     * */
    onDelete?: ((id: string) => void) | null;
    /**
     * Blocks form inputs and control buttons
     * Default: false
     * */
    isSaving?: boolean;
    /**
     * Show skeletons instead of real controls when data loading from server or other sources
     * Default: false
     * */
    isLoading?: boolean;
    /**
     * Show error instead of controls
     * Default: null
     * */
    errorLoading?: string | null;
    /**
     * Sets form in values views with labels
     * Default: false
     * */
    viewOnly?: boolean;
    
    /**
     * Callback when form values changed, fires before entity change
     * Default: undefined
     * Function params:
     *      prop: keyof T, property name of edited field
     *      value: any, value of edited field
     * */
    onPropertyChange?: <K extends keyof T>(prop: K, value: T[K]) => T;
    /**
     * Disabled paddings for current form
     * Default: false
     * */
    noPadding?: boolean;
    /**
     * Callback when "Cancel" button pressed, if not set button will not be rendered
     * Default: undefined
     * */
    onCancel?: () => void;
    /**
     * Initial entity for editing, form will not call GET api if set
     * Default: null
     * */
    entity?: T | null;
    /**
     * Callback when entity changed
     * Default: null
     * Function params:
     *      entity: T, currently edited entity
     * */
    onEntityChange?: (entity: T) => void;
    /**
     * Hides paper for form and sets noPadding to true
     * Default: false
     * */
    hidePaper?: boolean;
    /**
     * Title for form, if not set block will not be rendered
     * Default: null
     * */
    header?: string | null;
    /**
     * Form controls variant based on MaterialUI
     * Default: "outlined"
     * */
    variant?: "standard" | "filled" | "outlined";
    /**
     * Text for "Delete" button
     * Default: "Удалить"
     * */
    deleteBtnText?: string;
    /**
     * Text for "Save" button
     * Default: "Сохранить"
     * */
    saveBtnText?: string;
    /**
     * Text for "Cancel" button
     * Default: "Отмена"
     * */
    cancelBtnText?: string;
    /**
     * Render element after form header
     * Default: null
     * */
    headerContent?: React.ReactNode | null;
    /**
     * Render element before form footer
     * Default: null
     * */
    footerContent?: React.ReactNode | null;
    /*
     * Children to render, supposed to be used with form controls
     */
    children: React.ReactNode
    /*
     * Ref to call form methods
     */
    ref?: React.ForwardedRef<ItnFormRef>
}