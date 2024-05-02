import { FieldDescription } from "../base/FieldDescription";
import { LooseBoolObject } from "../base/LooseBoolObject";


export const EMPTY_FUNC = () => { };
export const EMPTY_BOOL_OBJ = {} as LooseBoolObject;


export function getDefaultValues<T>(fields: FieldDescription<T>[]) {
    let initEntity: T = {} as T;
    fields.forEach(f => {
        initEntity[f.property] = f.defaultValue ?? null;
    });
    return initEntity;
};
