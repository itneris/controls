import AbstractFieldBuilder from "../fieldBuilder/AbstractFieldBuilder";

export default interface ICommonFormProps<T> {
    /**
     * Class with fields rules and descriptions
     * */
    fieldBuilder: AbstractFieldBuilder<T>;
    /**
     * Callback when form values changed
     * Default: null
     * Function params:
     *      prop: keyof T, property name of edited field
     *      value: any, value of edited field
     * */
    onChange?: ((prop: keyof T, value: any) => void) | null;
    /**
     * Disabled paddings for current form
     * Default: false
     * */
    noPadding?: boolean;
    /**
     * Callback when "Cancel" button pressed, if not set button will not be rendered
     * Default: null
     * */
    onCancel?: (() => void) | null;
    /**
     * Initial entity for editing, form will not call GET api if set
     * Default: null
     * */
    entity?: T | null;
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
     * Children to render, supposed to be used with ItnFormControl
     */
    children?: React.ReactNode
}