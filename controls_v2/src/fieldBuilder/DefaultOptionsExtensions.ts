import { LooseObject } from "../base/LooseObject";
import { ItnSelectOption } from "../props/IControlProps";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";

declare module "./FieldOptionsBuilder" {
	interface FieldOptionsBuilder<T extends LooseObject> {
		WithLabel(label: string): FieldOptionsBuilder<T>;
		WithOptions(options: ItnSelectOption[]): FieldOptionsBuilder<T>;
		Disable(): FieldOptionsBuilder<T>;
		Password(): FieldOptionsBuilder<T>;
		Bool(): FieldOptionsBuilder<T>;
		WithCustomControl(control: (value:any, onChange: (value: any) => void) => React.ReactNode): FieldOptionsBuilder<T>;
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
FieldOptionsBuilder.prototype.WithOptions = function<T extends LooseObject>(options: ItnSelectOption[]) {
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
	/// Change file input options for file input
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> WithFileOptions<T, TProperty>(
		this IFieldBuilder<T, TProperty> fieldBuilder, 
		string accept = "*", 
		int maxSizeKb = 4096,
		bool withImagePreview = false,
		bool isAvatar = false,
		Tuple<int, int>? cropImageToSize = null
	)
	{
		withImagePreview = isAvatar || withImagePreview;
		fieldBuilder
			.SetFieldProp("Accept", withImagePreview && accept == "*" ? "image/*" : accept)
			.SetFieldProp("MaxFileSize", maxSizeKb * 1000)
			.SetFieldProp("WithImagePreview", isAvatar ? true : withImagePreview)
			.SetFieldProp("IsAvatar", isAvatar);
		if (cropImageToSize != null)
		{
            fieldBuilder.SetFieldProp("CropImageToSize", cropImageToSize);
		}

		return fieldBuilder;

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