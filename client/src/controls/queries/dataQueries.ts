import axios, {  AxiosResponse } from "axios";
import { ItnSelectOption } from "../props/IControlProps";

export const getEntity = <T>(apiName: string, id: string) => async (): Promise<AxiosResponse<T>> => {
    return await axios.get(`/api/${apiName}/${id}`);
}

export const createEntity = <T>(apiName: string, entity: T) => async (): Promise<AxiosResponse<string>> => {
    return await axios.post(`/api/${apiName}`, entity);
}

export const updateEntity = <T>(apiName: string, id: string, entity: T) => async (): Promise<AxiosResponse<string>> => {
    return await axios.put(`/api/${apiName}/${id}`, entity);
}

export const deleteEntity = (apiName: string, id: string) => async (): Promise<AxiosResponse<string>> => {
    return await axios.put(`/api/${apiName}/${id}`);
}

export const getDictionary = (apiName: string) => async (): Promise<AxiosResponse<ItnSelectOption[]>> => {
    return await axios.put(`/api/${apiName}`);
}