import ICommonFormProps from "./ICommonFormProps";

export default interface IQueryFormProps extends ICommonFormProps {
    /**
     * Url with get|post|put|delete methods form form data
     * */
    apiUrl?: string | null;
    onAfterSave?: (() => void) | null;
    onAfterDelete?: (() => void) | null;
    type?: "view" | "create" | "edit" | "auto" | null;
    id?: string | null;
    disableSave?: boolean | null;
    disableDelete?: boolean | null;
}