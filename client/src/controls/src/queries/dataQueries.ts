import { LooseObject } from "@itneris/controls/dist/base/LooseObject";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios, {  AxiosResponse } from "axios";
import { ItnSelectOption } from "../props/IControlProps";

export interface IFormMutateParams {
    entity: LooseObject,
    useFormData: boolean
}

export const getEntity = <T>(apiName: string, id: string) => async (): Promise<AxiosResponse<T>> => {
    return await axios.get(`${apiName}/${id}`);
}

export const getDict = async (context: QueryFunctionContext): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.get(context.queryKey[0] as string);
}

export const createEntity = (apiName: string) => async (params: IFormMutateParams): Promise<AxiosResponse<string>> => {
    const entity = params.entity;
    if (params.useFormData) {
        const bodyFormData = new FormData();
        for (let key in entity) {
            if (entity[key] === "" || entity[key] === null || entity[key] === undefined) {
                continue;
            }
            bodyFormData.append(key, entity[key]);
        }
        return await axios({
            method: "post",
            url: apiName,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
    return await axios.post(`${apiName}`, entity);
}

export const updateEntity = (apiName: string) => async (params: IFormMutateParams): Promise<AxiosResponse<string>> => {
    const entity = params.entity;
    if (params.useFormData) {
        const bodyFormData = new FormData();
        for (let key in entity) {
            if (entity[key] === "" || entity[key] === null || entity[key] === undefined) {
                continue;
            }
            bodyFormData.append(key, entity[key]);
        }
        return await axios({
            method: "put",
            url: `${apiName}/${entity.id}`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    return await axios.put(`${apiName}/${entity.id}`, entity);
}

export const deleteEntity = (apiName: string) => async (id: string): Promise<AxiosResponse<string>> => {
    return await axios.delete(`${apiName}/${id}`);
}

export const getDictionary = (apiName: string) => async (): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.put(`${apiName}`);
}