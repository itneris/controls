import { Validation } from "./Validation";
/**
 * Interface for calling ItnForm methods
 * */
export interface IFormRef<T> {
    /**
     * Get current edited values in form
     * 
     * @returns {T} object with values
     * */
    getCurrentValues: () => T,
    /**
     * Start the form validation with highlighting controls and returns the result of validation
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
}