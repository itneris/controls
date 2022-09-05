import { LooseObject } from "../base/LooseObject";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";

declare module "./FieldOptionsBuilder" {
	interface FieldOptionsBuilder<T extends LooseObject> {
		WithLabel(label: string): FieldOptionsBuilder<T>;
	}
}

/**
 * Defines a label for control
 * @param {string} label
 * @param {bool} bold default false
 * */
FieldOptionsBuilder.prototype.WithLabel = function<T extends LooseObject>(label: string) {
	return this
		.SetFieldProp("label", label) as FieldOptionsBuilder<T>;
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
	/// Set select dictionary for field
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> WithOptions<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder, IEnumerable<SelectOption> options)
	{
		return fieldBuilder
			.SetFieldProp("SelectOptions", options);
	}

	/// <summary>
	/// Disable field for edit
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> Disable<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder)
	{
		return fieldBuilder
			.SetFieldProp("Disabled", true);
	}

	/// <summary>
	/// Change field type to password
	/// </summary>
	/// <typeparam name="T">Type of object being validated</typeparam>
	/// <typeparam name="TProperty">Type of property being validated</typeparam>
	/// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
	/// <returns></returns>
	public static IFieldBuilder<T, TProperty> Password<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder)
	{
		return fieldBuilder
			.SetFieldProp("IsPassword", true);
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

    /// <summary>
    /// Sets the custom renderer for control
    /// </summary>
    /// <typeparam name="T">Type of object being validated</typeparam>
    /// <typeparam name="TProperty">Type of property being validated</typeparam>
    /// <param name="fieldBuilder">The column builder on which the rule should be defined</param>
    /// <returns></returns>
    public static IFieldBuilder<T, TProperty> WithCustomControl<T, TProperty>(this IFieldBuilder<T, TProperty> fieldBuilder, Func<ItnControlOptions, RenderFragment> controlRenderer)
    {
		return fieldBuilder
			.SetFieldProp("CustomControl", controlRenderer);
    }
 */