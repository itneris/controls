import { FieldDescription } from "../base/FieldDescription";
import { LooseObject } from "../base/LooseObject";
import { ItnSelectOption } from "../props/IControlProps";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";

export default abstract class AbstractFieldBuilder<T extends LooseObject> {
	private _fields: Array<FieldDescription> = [];

	public FieldFor(model: string | ((type: T) => any)): FieldOptionsBuilder<T> {
		const key =
			typeof model === "string" ? model :
			model.toString().split(".")[1]
				.replace("}", "")
				.replace("\n", "")
				.replace("\r", "")
				.replace(";", "")
				.replace(/\s/g, "");
		const field = new FieldDescription(this._fields.length, key);
		this._fields.push(field);
		return new FieldOptionsBuilder<T>(field);
	}  

	public Build(): Array<FieldDescription> 
	{
		return this._fields;
	}

	public SetSelectOptions(property: string, options: ItnSelectOption[]): AbstractFieldBuilder<T> {
		const newFields = this._fields.map(f => {
			if (f.property === property) {
				return {
					...f,
					items: options,
				} as FieldDescription;
			}

			return f;
		});
		this._fields = newFields;
		return this;
	}
}