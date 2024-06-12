import { ItnSelectOption } from "../base/ItnSelectOption";
import { FileImageProperties } from "./IFileControlProps";

export default interface IControlProps {
    /**
     * Type of rendered control
     * */
    type: "select" | "autocomplete" | "number" | "string" | "date" | "checkbox" | "chip" | "password" | "file" | "time" | "datetime" | "wysiwyg";
    /**
     * Controlled value of control
     * */
    value: any;
    /**
     * Is control should be rendered disabled
     * Default: false
     * */
    disabled?: boolean;
    /**
     * Control placeholder for all types except chip, file and checkbox
     * Default: null
     * */
    placeholder?: string | null;
    /**
     * Should be string control textarea
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
     * Should be control highlight with red border
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
     * Text to render below control
     * Default: null
     * */
    helperText?: string | null;
    /**
     * Control variant based on MaterialUI for all types except file and checkbox
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
     * Autocomplete input value
     * Default: null
     * */
    autocompleteInputValue?: string;
    /**
     * Callback when autocomplete input changed
     * Function params: 
     *      value: string, current input value
     *      reason: "input" | "reset" | "clear", reason causing autocomplete change
     * Default: null
     * */
    onAutocompleteInputChange?: ((value: string, reason: "input" | "reset" | "clear") => void) | null;
    /**
     * Sets autocomplete loading state when async search enabled
     * Default: undefined
     * */
    autocompleteLoading?: boolean;
    /**
     * Sets autocomplete loading text
     * Default: "Загрузка..."
     * */
    autocompleteLoadingText?: string;
    /**
     * Enables create new options in autocomplete
     * Default: false
     * */
    autocompleteCreatable?: boolean;
    /**
     * Callback when autocomplete option add
     * Default: null
     * */
    onAutocompleteOptionAdded?: ((value: string) => void) | null;
    /**
     * Enables multi selection for select and autocomplete types
     * Default: false
     * */
    multiple?: boolean;
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
     * Minimal value for control type number
     * Default: null
     * */
    min?: number | null;
    /**
     * Maximum value for control type number
     * Default: null
     * */
    max?: number | null;
    /**
     * Allow decimal input in number
     * Default: false
     * */
    allowDecimals?: boolean;
    /**
     * Allow negative input in number
     * Default: false
     * */
    allowNegative?: boolean;
    /**
     * Minimal date for control type date
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
     * Default: 6
     * */
    passwordLength?: number;
    /**
     * Disable generate password button
     * */
    disableNewPasswordGenerate?: boolean;
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
     * If file control should be image, set image properties
     * Default: null
     * */
    imageProperties?: FileImageProperties;
    /**
     * Fires event when enter key pressed
     * Default: null
     * */
    onEnter?: () => void;
    /**
     * Name of the field
     * Default: null
     * */
    name?: string;
}