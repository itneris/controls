import { FieldDescription } from "../base/FieldDescription";

export interface IFieldBuilderInitial<T> extends IFieldBuilder<T> {

}

export interface IFieldBuilder<T> {
    SetFieldProp(name: keyof FieldDescription<T>, value: any): IFieldBuilder<T>;
}