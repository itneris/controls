import { FieldDescription } from "../base/FieldDescription";
import { IFieldBuilder, IFieldBuilderInitial } from "./Syntax";

export class FieldOptionsBuilder<T> implements IFieldBuilderInitial<T>
{
	private _field: FieldDescription<T>;

	constructor(field: FieldDescription<T>) {
		this._field = field
	}

	SetFieldProp(name: keyof FieldDescription<T>, value: any): IFieldBuilder<T>
	{
		(this._field as any)[name] = value;
		return this;
	}
}