import ICommonFormProps from "./ICommonFormProps";
import { UrlParams } from "../base/UrlParams";

export default interface IQueryFormProps<T> extends ICommonFormProps<T> {
    /**
     * Url with get|post|put|delete methods form form data
     * */
    apiUrl?: string | null;
    onAfterSave?: ((id: string) => void) | null;
    onAfterDelete?: ((id: string) => void) | null;
    onAfterLoad?: ((entity: T) => void) | null;
    onError?: ((response: any) => void) | null;
    type?: "view" | "create" | "edit" | "auto" | null;
    id?: string | null;
    disableSave?: boolean | null;
    disableDelete?: boolean | null;
    urlParams?: UrlParams | null;
    sendAsMultipartFormData?: boolean | null;
    onSavingStateChange?: (isStart: boolean) => void;
}