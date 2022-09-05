import { LooseObject } from "../base/LooseObject";

export interface IFieldBuilderInitial<T extends LooseObject> extends IFieldBuilder<T> {

}

export interface IFieldBuilder<T extends LooseObject> {
    SetFieldProp(name: string, value: any): IFieldBuilder<T>;
}