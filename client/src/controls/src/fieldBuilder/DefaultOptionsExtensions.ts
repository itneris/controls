import { LooseObject } from "../base/LooseObject";
import { ItnSelectOption } from "../props/IControlProps";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";
import IFileControlProps from "../props/IFileControlProps";

declare module "./FieldOptionsBuilder" {
	interface FieldOptionsBuilder<T extends LooseObject> {
		WithLabel(label: string): FieldOptionsBuilder<T>;
		Select(options: ItnSelectOption[]): FieldOptionsBuilder<T>;
		Disable(): FieldOptionsBuilder<T>;
		Password(): FieldOptionsBuilder<T>;
		Bool(): FieldOptionsBuilder<T>;
		Required(): FieldOptionsBuilder<T>;
		WithValidation(validate: (value: any) => string | null): FieldOptionsBuilder<T>;
		WithCustomControl(control: (value: any, onChange: (value: any) => void) => React.ReactNode): FieldOptionsBuilder<T>;
		File(fileOptions: IFileControlProps): FieldOptionsBuilder<T>;
	}
}

/**
 * Defines a label for control
 * @param {string} label
 * */
FieldOptionsBuilder.prototype.WithLabel = function<T extends LooseObject>(label: string) {
	return this
		.SetFieldProp("label", label) as FieldOptionsBuilder<T>;
}

/**
 * Changes control type to 'select' and defines options
 * @param {ItnSelectOption[]} options
 * */
FieldOptionsBuilder.prototype.Select = function<T extends LooseObject>(options: ItnSelectOption[]) {
	return this
		.SetFieldProp("type", "select")
		.SetFieldProp("items", options) as FieldOptionsBuilder<T>;
}

/**
 * Disables control
 * */
FieldOptionsBuilder.prototype.Disable = function<T extends LooseObject>() {
	return this
		.SetFieldProp("disabled", true) as FieldOptionsBuilder<T>;;
}

/**
 * Changes control type to password
 * */
FieldOptionsBuilder.prototype.Password = function<T extends LooseObject>() {
	return this
		.SetFieldProp("type", "password") as FieldOptionsBuilder<T>;;
}

/**
 * Changes control type to boolean
 * */
FieldOptionsBuilder.prototype.Bool = function <T extends LooseObject>() {
	return this
		.SetFieldProp("type", "checkbox") as FieldOptionsBuilder<T>;;
}

/**
 * Renders custom control
 * */
FieldOptionsBuilder.prototype.WithCustomControl = function <T extends LooseObject>(control: (value: any, onChange: (value: any) => void) => React.ReactNode) {
	return this
		.SetFieldProp("custom", control) as FieldOptionsBuilder<T>;;
}

/**
 * Add validation to field by value
 * */
FieldOptionsBuilder.prototype.WithValidation = function <T extends LooseObject>(validate: (value: any) => string | null) {
	return this
		.SetFieldProp("validation", validate) as FieldOptionsBuilder<T>;;
}

/**
 * Add required to field by value
 * */
FieldOptionsBuilder.prototype.Required = function <T extends LooseObject>() {
	return this
		.SetFieldProp("required", true) as FieldOptionsBuilder<T>;
}


/** <summary>
* Change input type to file and set options
* */
FieldOptionsBuilder.prototype.File = function <T extends LooseObject>({
	accept = "*",
	maxSizeKb = 4096,
	withImagePreview = false,
	isAvatar = false,
	cropImageToSize = null
}: IFileControlProps) 
{
	let fieldBuilder = this
		.SetFieldProp("type", "file")
		.SetFieldProp("accept", withImagePreview && accept == "*" ? "image/*" : accept)
		.SetFieldProp("maxFileSize", maxSizeKb * 1000)
		.SetFieldProp("withImagePreview", isAvatar ? true : withImagePreview)
		.SetFieldProp("isAvatar", isAvatar) as FieldOptionsBuilder<T>;

	if (cropImageToSize != null) {
		fieldBuilder = fieldBuilder.SetFieldProp("cropImageToSize", cropImageToSize) as FieldOptionsBuilder<T>;
	}

	return fieldBuilder as FieldOptionsBuilder<T>;;
}

/*
 * 
	/// <summary>
	/// Change field control to autocomplete
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> Autocomplete<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder, Func<string, Task<IEnumerable<T>>> searchFunction)
	{
		return fieldBuilder
			.SetFieldProp("IsAutocomplete", true)
			.SetFieldProp("AutocompleteFunction", searchFunction);
	}

	/// <summary>
	/// Change field type to textarea with n lines
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> Multiline<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder, int lines)
	{
		return fieldBuilder
			.SetFieldProp("Lines", lines);
	}

	/// <summary>
	/// Sets the tooltip for control in quesion mark adornment
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> WithHelpTooltip<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder, string tooltip, Placement placement = Placement.Bottom)
	{
		return fieldBuilder
			.SetFieldProp("HelpTooltip", tooltip)
			.SetFieldProp("TooltipPlacement", placement);
    }
 */