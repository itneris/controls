export default interface IControlProps {
    /**
     * Type of rendered control
     * */
    type: "select" | "autocomplete" | "number" | "string" | "date" | "checkbox" | "chip" | "password" | "file";
    /**
     * Controlled value of control
     * */
    value: any;
    /**
     * Is control should be rendered disalbed
     * Default: false
     * */
    disabled?: boolean;
    /**
     * Control placeholder for all types except chip, file and checkbox
     * Default: null
     * */
    placeholder?: string | null;
    /**
     * Shoud be string controol textarea
     * Default: false
     * */
    multiline?: boolean;
    /**
     * Initial height of textarea
     * Default: null
     * */
    lines?: number | null;
    /**
     * Maximum height of textarea
     * Default: null
     * */
    maxLines?: number | null;
    /**
     * Should be control heighlight with red border
     * Default: false
     * */
    error?: boolean,
    /**
     * Message for red helperText
     * Default: null
     * */
    errorText?: string | null;
    /**
     * Control label, button label for file type
     * Default: null
     * */
    label?: string | null;
    /**
     * Control varinat based on MaterilaUI for all types except file and checkbox
     * Default: "outlined"
     * */
    variant?: "outlined" | "standard" | "filled";
    /**
     * Callback when control value changed
     * Function params: 
     *      value: any, current control value
     * Default: null
     * */
    onChange?: ((value: any) => void) | null;
    /**
     * Tooltip with question mark icon trigger for control
     * */
    tooltip?: string | null;
    /**
     * Items for control types autocomplete and select
     * Default: []
     * */
    items?: Array<ItnSelectOption>;
    /**
     * Mimimal value for control type number
     * Default: null
     * */
    min?: number | null;
    /**
     * Maximum value for control type number
     * Default: null
     * */
    max?: number | null;
    /**
     * Mimimal date for control type date
     * Default: null
     * */
    minDate?: Date | null;
    /**
     * Maximum date for control type date
     * Default: null
     * */
    maxDate?: Date | null;
    /**
     * Generated password length control type password
     * */
    passwordLength?: number;
    /**
     * Disables blocked options for null value for control type select
     * Default: false
     * */
    allowNullInSelect?: boolean;
    /**
     * Null value option label for control type select
     * Default: null
     * */
    selectNullLabel?: string | null;
    /**
     * No options text for control type autocomplete
     * Default: "Нет значений для отображения"
     * */
    noOptionsText?: string;
    /**
     * Should control be displayed, boolean or function return boolean
     * Default: true
     * */
    display?: boolean | (() => boolean);
    /**
     * Accept property for control type file
     * Default: "*"
     * */
    accept?: string;
    /**
     * Maximum file size for control type file
     * Default: 4096 (4Мб)
     * */
    maxFileSize?: number;
    /**
     * Shold control show image preview control type file
     * Default: false
     * */
    withImagePreview?: boolean;
    /**
     * Should control image rendered as <Avatar /> for control type file
     * Sets withImagePreview to true
     * Default: false
     * */
    isAvatar?: boolean;
    /**
     * Tuple for cropping image size for control type file
     * Default: null
     * */
    cropImageToSize?: [number, number] | null;
}

export class ItnSelectOption {
    id: string;
    label: string;
    blocked: boolean;

    constructor(id: string, label: string, blocked: boolean = false) {
        this.id = id;
        this.label = label;
        this.blocked = blocked;
    }
}