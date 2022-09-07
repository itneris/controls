import { IFormRef } from "./IFormRef";
/**
 * Intreface for calling ItnQueryForm methods
 * */
export interface IQueryFormRef extends IFormRef {
    /**
     * Starts form validation and saving flow
     * */
    saveEntity: () => void
    /**
     * Starts form delete flow
     * */
    deleteEntity: () => void
}