import { FieldDescription } from "../base/FieldDescription";
import { LooseObject } from "../base/LooseObject";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";

export abstract class AbstractFieldBuilder<T extends LooseObject> {
	private _fields: Array<FieldDescription> = [];

	public FieldFor(model: (type: T) => any): FieldOptionsBuilder<T> {
		const key = model.toString().split(".")[1];
		const field = new FieldDescription(this._fields.length, key);
		this._fields.push(field);
		return new FieldOptionsBuilder<T>(field);
	}  

	public Build(): Array<FieldDescription> 
	{
		return this._fields;
	}
}