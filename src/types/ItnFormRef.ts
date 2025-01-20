import { Validation } from "../base/Validation"

/**
 * Interface for calling ItnForm methods
 * */
export type ItnFormRef = {
    /**
     * Start the form validation with highlighting controls and returns the result of validation
     * 
     * @returns {boolean} validation result
     * */
    validate: (onErrors?: (validationErrors: Validation[]) => void) => boolean,
    /**
     * Add error text to specified form field
     * */
    addError: (field: string, message: string) => void
}