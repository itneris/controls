import { LooseObject } from "@itneris/controls/dist/base/LooseObject";
import axios, {  AxiosResponse } from "axios";
import { ItnSelectOption } from "../props/IControlProps";

export const getEntity = <T>(apiName: string, id: string) => async (): Promise<AxiosResponse<T>> => {
    return await axios.get(`${apiName}/${id}`);
}

export const createEntity = (apiName: string) => async (entity: LooseObject): Promise<AxiosResponse<string>> => {
    return await axios.post(`${apiName}`, entity);
}

export const updateEntity = (apiName: string) => async (entity: LooseObject): Promise<AxiosResponse<string>> => {
    return await axios.put(`${apiName}/${entity.id}`, entity);
}

export const deleteEntity = (apiName: string) => async (id: string): Promise<AxiosResponse<string>> => {
    return await axios.put(`${apiName}/${id}`);
}

export const getDictionary = (apiName: string) => async (): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.put(`${apiName}`);
}