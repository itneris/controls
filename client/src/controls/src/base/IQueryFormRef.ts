import { IFormRef } from "./IFormRef";
import { UrlParams } from "./UrlParams";
/**
 * Intreface for calling ItnQueryForm methods
 * */
export interface IQueryFormRef<T> extends IFormRef<T> {
    /**
     * Starts form validation and saving flow
     * */
    saveEntity: (urlParams: UrlParams) => void
    /**
     * Starts form delete flow
     * */
    deleteEntity: (urlParams: UrlParams) => void
    /**
     * Execute get request to server
     * */
    refetch: () => void
}