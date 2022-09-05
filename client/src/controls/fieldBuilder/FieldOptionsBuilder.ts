import { FieldDescription } from "../base/FieldDescription";
import { LooseObject } from "../base/LooseObject";
import { IFieldBuilder, IFieldBuilderInitial } from "./Syntax";

export class FieldOptionsBuilder<T extends LooseObject> implements IFieldBuilderInitial<T>
{
	private _field: FieldDescription;

	constructor(field: FieldDescription) {
		this._field = field
	}

	SetFieldProp(name: string, value: any): IFieldBuilder<T>
	{
		(this._field as LooseObject)[name] = value;
		return this;
	}
}