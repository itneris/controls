import { ItnSelectOption } from "..";
import { FieldDescription } from "../base/FieldDescription";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";

export default abstract class AbstractFieldBuilder<T> {
	private _fields: Array<FieldDescription<T>> = [];

	public FieldFor(model: string | ((type: T) => any)): FieldOptionsBuilder<T> {
		const key =
			typeof model === "string" ?
				model :
				model.toString().split(".")[1]
					.replace("}", "")
					.replace("\n", "")
					.replace("\r", "")
					.replace(";", "")
					.replace(/\s/g, "");
		const field = new FieldDescription(this._fields.length, key as keyof T);
		this._fields.push(field);
		return new FieldOptionsBuilder<T>(field);
	}  

	public GetFields(): Array<FieldDescription<T>> 
	{
		return this._fields;
	}

	public SetSelectOptions(property: keyof T, options: ItnSelectOption[]): AbstractFieldBuilder<T> {
		const newFields = this._fields.map(f => {
			if (f.property === property) {
				return {
					...f,
					items: options,
				} as FieldDescription<T>;
			}

			return f as FieldDescription<T>;
		});
		this._fields = newFields;
		return this;
	}
}