import { LooseObject } from "@itneris/controls/dist/base/LooseObject";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios, {  AxiosResponse } from "axios";
import { ItnSelectOption } from "../props/IControlProps";

export interface IFormDeleteParams {
    id?: string | null,
    urlParams?: LooseObject | null
}

export interface IFormMutateParams extends IFormDeleteParams {
    id?: string | null,
    entity: LooseObject,
    useFormData: boolean
}

export const getEntity = <T>(apiName: string, id: string) => async (): Promise<AxiosResponse<T>> => {
    return await axios.get(`${apiName}/${id}`);
}

export const getDict = async (context: QueryFunctionContext): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.get(context.queryKey[0] as string);
}

export const getAutocompleteDict = async (context: QueryFunctionContext): Promise<AxiosResponse<ItnSelectOption[]>> => {
    let url = context.queryKey[0] as string;
    if (context.queryKey[1] !== null) {
        if (url.includes("?")) {
            url += `&search=${encodeURIComponent(context.queryKey[1] as string)}`
        } else {
            url += `?search=${encodeURIComponent(context.queryKey[1] as string)}`
        }
    }

    return await axios.get(url);
}

export const createEntity = (apiName: string) => async (params: IFormMutateParams): Promise<AxiosResponse<string>> => {
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

    if (params.useFormData) {
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

export const updateEntity = (apiName: string) => async (params: IFormMutateParams): Promise<AxiosResponse<string>> => {
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

    if (params.useFormData) {
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

export const deleteEntity = (apiName: string) => async (params: IFormDeleteParams): Promise<AxiosResponse<string>> => {
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

function objectToFormData(entity: LooseObject, formData: FormData = new FormData(), namespace: string = '') {
    const fd = formData || new FormData();
    let formKey;

    for (const property in entity) {
        if (entity.hasOwnProperty(property)) {
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
            if (typeof entity[property] === 'object' && !(entity[property] instanceof File)) {
                objectToFormData(entity[property], fd, formKey);
            } else {
                // if it's a string or a File object     
                fd.append(formKey, entity[property]);
            }
        }
    }

    return fd;
};