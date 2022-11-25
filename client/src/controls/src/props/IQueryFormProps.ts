import { QueryClient } from "@tanstack/react-query";
import { LooseObject } from "../base/LooseObject";
import ICommonFormProps from "./ICommonFormProps";

export default interface IQueryFormProps extends ICommonFormProps {
    /**
     * Url with get|post|put|delete methods form form data
     * */
    apiUrl?: string | null;
    onAfterSave?: ((id: string) => void) | null;
    onAfterDelete?: ((id: string) => void) | null;
    onAfterLoad?: ((entity: any) => void) | null;
    onError?: ((response: any) => void) | null;
    type?: "view" | "create" | "edit" | "auto" | null;
    id?: string | null;
    disableSave?: boolean | null;
    disableDelete?: boolean | null;
    urlParams?: LooseObject | null;
    queryClient?: QueryClient | null;
    sendAsMultipartFormData?: boolean | null;
}