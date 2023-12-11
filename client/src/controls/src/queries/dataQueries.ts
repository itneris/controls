import { QueryFunctionContext } from "@tanstack/react-query";
import axios, {  AxiosResponse } from "axios";
import { ItnSelectOption } from "..";
import { UrlParams } from "../base/UrlParams";
import ItnFormFile from "../props/ItnFormFile";

export interface IFormDeleteParams<T> {
    id?: string | null,
    urlParams?: UrlParams | null
}

export interface IFormMutateParams<T> extends IFormDeleteParams<T> {
    id?: string | null,
    entity: T,
    useFormData: boolean
}

export const getEntity = <T>(apiName: string, id: string) => async () => {
    const response = await axios.get(`${apiName}/${id}`);
    return response.data as T;
}

export const getDict = async (context: QueryFunctionContext) => {
    const response = await axios.get(context.queryKey[1] as string);
    return response.data as ItnSelectOption[];
}

export const getAutocompleteDict = async (context: QueryFunctionContext) => {
    let url = context.queryKey[1] as string;
    if (context.queryKey[2] !== null) {
        if (url.includes("?")) {
            url += `&search=${encodeURIComponent(context.queryKey[2] as string)}`
        } else {
            url += `?search=${encodeURIComponent(context.queryKey[2] as string)}`
        }
    }

    const response = await axios.get(url);
    return response.data as ItnSelectOption[];
}

export const createEntity = <T,>(apiName: string, sendAsForm: boolean) => async (params: IFormMutateParams<T>): Promise<AxiosResponse<string>> => {
    const entity = params.entity;
    let url = apiName;
    if (params.urlParams !== null) {
        url += "?";
        let paramsArr: string[] = [];
        for (let key in params.urlParams) {
            paramsArr.push(`${key}=${encodeURIComponent(params.urlParams[key])}`);
        }
        url += paramsArr.join("&");
    }

    if (params.useFormData || sendAsForm) {
        const bodyFormData = objectToFormData(entity);
        return await axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
    return await axios.post(url, entity);
}

export const updateEntity = <T,>(apiName: string, sendAsForm: boolean) => async (params: IFormMutateParams<T>): Promise<AxiosResponse<string>> => {
    const entity = params.entity;
    let url = `${apiName}`;
    if (params.id) {
        url += `/${params.id}`;
    }
    if (params.urlParams !== null) {
        url += "?";
        let paramsArr: string[] = [];
        for (let key in params.urlParams) {
            paramsArr.push(`${key}=${encodeURIComponent(params.urlParams[key])}`);
        }
        url += paramsArr.join("&");
    }

    if (params.useFormData || sendAsForm) {
        const bodyFormData = objectToFormData(entity);
        return await axios({
            method: "put",
            url: url,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    return await axios.put(url, entity);
}

export const deleteEntity = <T,>(apiName: string) => async (params: IFormDeleteParams<T>): Promise<AxiosResponse<string>> => {
    let url = `${apiName}/${params.id}`;
    if (params.urlParams !== null) {
        url += "?";
        let paramsArr: string[] = [];
        for (let key in params.urlParams) {
            paramsArr.push(`${key}=${encodeURIComponent(params.urlParams[key])}`);
        }
        url += paramsArr.join("&");
    }

    return await axios.delete(url);
}

export const getDictionary = (apiName: string) => async (): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.put(`${apiName}`);
}

export function objectToFormData<T>(entity: T, formData: FormData = new FormData(), namespace: string = '') {
    const fd = formData || new FormData();
    let formKey;

    for (const property in entity) {
        if ((entity as Object).hasOwnProperty(property)) {
            if (namespace) {
              if (Array.isArray(entity)) {
                formKey = `${namespace}[${property}]`;
              }
              else {
                formKey = `${namespace}.${property}`;
              }
            } else {
                formKey = property;
            }
            // if the property is an object, but not a File,
            // use recursivity.   
            if (typeof entity[property] === 'object' && !(entity[property] instanceof ItnFormFile)) {
                objectToFormData(entity[property], fd, formKey);
            } else if (entity[property] instanceof ItnFormFile) {
                if ((entity[property] as ItnFormFile)!.file) {
                    fd.append(`${formKey}.file`, (entity[property] as ItnFormFile)!.file!);
                    fd.append(`${formKey}.changed`, ((entity[property] as ItnFormFile)!.fileWasChanged ?? false).toString())
                };
            } else {
                fd.append(formKey, entity[property] as string);
            }

        }
    }

    return fd;
};