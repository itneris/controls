import { LooseBoolObject } from "../base/LooseBoolObject";
import ICommonFormProps from "./ICommonFormProps";

export default interface IBaseFormProps<T> extends ICommonFormProps<T> {
    /**
     * Callback when "Save" button click 
     * Default: null
     * Function params:
     *      entity: LooseObject, Currently edit entity
     * */
    onSave?: ((entity: T) => void) | null;
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
     * Callback when form autocomplete input changes
     * Default: () => {}
     * */
    onAutocompleteInputChange?: (property: keyof T, value: string, event: "reset" | "input" | "clear") => void;
    /**
     * Sets controls state to loading (autocomplete only)
     * Default: {}
     * */
    controlsLoading?: LooseBoolObject;
}