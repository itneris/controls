import { IFormRef } from "./IFormRef";
import { LooseObject } from "./LooseObject";
/**
 * Intreface for calling ItnQueryForm methods
 * */
export interface IQueryFormRef extends IFormRef {
    /**
     * Starts form validation and saving flow
     * */
    saveEntity: (urlParams: LooseObject) => void
    /**
     * Starts form delete flow
     * */
    deleteEntity: (urlParams: LooseObject) => void
    /**
     * Execute get request to server
     * */
    refetch: () => void
}