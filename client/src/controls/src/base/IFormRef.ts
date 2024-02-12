import { Validation } from "./Validation";
/**
 * Intreface for calling ItnForm methods
 * */
export interface IFormRef<T> {
    /**
     * Get current edited values in form
     * 
     * @returns {T} object with values
     * */
    getCurrentValues: () => T,
    /**
     * Start the form validation with hightlighting controls and returs the result of validation
     * 
     * @returns {boolean} validation result
     * */
    validate: (onErrors?: (validationErrors: Validation<T>[]) => void) => boolean,
    /**
     * Add error text to specified form field
     * */
    addError: (field: keyof T, message: string) => void
    /**
     * Sets new entity
     * */
    setEntity: (entity: T) => void
    /**
     * Update form forcefully
     * */
    forceUpdate: () => void
}