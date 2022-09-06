import { LooseObject } from "./LooseObject";
/**
 * Intreface for calling ItnForm methods
 * */
export interface IFormRef {
    /**
     * Get current edited values in form
     * 
     * @returns {LooseObject} object with values
     * */
    getCurrentValues: () => LooseObject,
    /**
     * Start the form validation with hightlighting controls and returs the result of validation
     * 
     * @returns {boolean} validation result
     * */
    validate: () => boolean
}