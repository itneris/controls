import { LooseObject } from "../base/LooseObject";
import { ItnSelectOption } from "../props/IControlProps";
import { FieldOptionsBuilder } from "./FieldOptionsBuilder";
import IFileControlProps from "../props/IFileControlProps";
import ITextAreaControlProps from "../props/ITextAreaControlProps";

declare module "./FieldOptionsBuilder" {
	interface FieldOptionsBuilder<T extends LooseObject> {
		/**
		 * Defines a label for control
		 * @param {string} label Label to render
		 * */
		WithLabel(label: string): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'select' and defines options
		 * @param {ItnSelectOption[]} options Array of opitons to render in select
		 * */
		Select(options: ItnSelectOption[]): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'autocomplete' and defines options
		 * @param {ItnSelectOption[]} options Array of opitons to render in autocomplete
		 * */
		Autocomplete(options: ItnSelectOption[]): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'date'
		 * @param {ItnSelectOption[]} options Array of opitons to render in select
		 * */
		DatePicker(): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'time'
		 * @param {ItnSelectOption[]} options Array of opitons to render in select
		 * */
		TimePicker(): FieldOptionsBuilder<T>;
		/**
		 * !!!USE ONLY WITH QUERY FORM
		 * Changes control type to 'select' and defines api url for get options
		 * @param {string} apiUrl API address that return array of ItnSelectOption
		 * */
		SelectWithQuery(apiUrl: string): FieldOptionsBuilder<T>;
		/**
		 * !!!USE ONLY WITH QUERY FORM
		 * Changes control type to 'autocomplete' and defines api url for get options
		 * @param {string} apiUrl API address that return array of ItnSelectOption
		 * @param {boolean} searchAsType Calls the api with "search=" query param when user types text, default false
		 * */
		AutocompleteWithQuery(apiUrl: string, searchAsType?: boolean): FieldOptionsBuilder<T>;
		/**
		 * Disables control
		 * @param {boolean | (entity: LooseObject) => boolean} disabled sets control state or function for calculate control state dependent on current form values
		 * */
		Disable(disabled?: boolean | ((entity: LooseObject) => boolean)): FieldOptionsBuilder<T>;
		/**
		 * Hides control
		 * @param {boolean | (entity: LooseObject) => boolean} visible sets control state or function for calculate control state dependent on current form values
		 * */
		Hide(hidden?: boolean | ((entity: LooseObject) => boolean)): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to password
		 * @param {boolean} disableNewPasswordGenerate hide button for generate new password
		 * */
		Password(disableNewPasswordGenerate?: boolean): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to boolean
		 * */
		Bool(): FieldOptionsBuilder<T>;
		/**
		 * Make the field required, in validation value will be checked on null, empty string and undefined
		 * */
		Required(): FieldOptionsBuilder<T>;
		/**
		 * Add validation to field by value
		 * @param {(value: any) => string | null} validate Function that get current value as param and return errorMessage or null if value is valid
		 * */
		WithValidation(validate: (value: any, entity: LooseObject) => string | null): FieldOptionsBuilder<T>;
		 /**
		 * Renders custom control
		 * @param {(value: any, onChange: (value: any) => void) => React.ReactNode} control Function that receives as paramteres entity current value, onChange function. Also current state as isSaving and viewOnly
		 * */
		WithCustomControl(control: (value: any, onChange: (value: any) => void, isError: boolean, errorMessage: string | undefined, isSaving: boolean, viewOnly: boolean) => React.ReactNode): FieldOptionsBuilder<T>;
		/** 
		* Change input type to file and set options
		* @param {{ accept = "*", maxSizeKb = 4096,withImagePreview = false,isAvatar = false,cropImageToSize = null}} fileOptions File input configuring options 
		* */
		File(fileOptions: IFileControlProps): FieldOptionsBuilder<T>;
		/**
		* Change input type to multiline texfield with options
		* @param {{ lines: number, maxLines: number} | undefined} textAreaOptions Initial and maximum lines count for textArea. All nullables
		* */
		TextArea(textAreaOptions?: ITextAreaControlProps): FieldOptionsBuilder<T>;
		/**
		* Sets the default value for control
		 * @param {any} value value that will be in intial entity for create form
		* */
		WithDefaultValue(value: any): FieldOptionsBuilder<T>;
	}
}

FieldOptionsBuilder.prototype.WithLabel = function<T extends LooseObject>(label: string) {
	return this
		.SetFieldProp("label", label) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Select = function<T extends LooseObject>(options: ItnSelectOption[]) {
	return this
		.SetFieldProp("type", "select")
		.SetFieldProp("items", options) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.SelectWithQuery = function <T extends LooseObject>(apiUrl: string) {
	return this
		.SetFieldProp("type", "select")
		.SetFieldProp("selectApiUrl", apiUrl) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.DatePicker = function <T extends LooseObject>() {
	return this
		.SetFieldProp("type", "date") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.TimePicker = function <T extends LooseObject>() {
	return this
		.SetFieldProp("type", "time") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Disable = function <T extends LooseObject>(disabled: boolean | ((entity: LooseObject) => boolean) = true) {
	return this
		.SetFieldProp("disabled", disabled) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Hide = function <T extends LooseObject>(hidden: boolean | ((entity: LooseObject) => boolean) = true) {
	return this
		.SetFieldProp("hidden", hidden) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Password = function <T extends LooseObject>(disableNewPasswordGenerate: boolean = false) {
	return this
		.SetFieldProp("type", "password") 
		.SetFieldProp("disableNewPasswordGenerate", disableNewPasswordGenerate) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Bool = function <T extends LooseObject>() {
	return this
		.SetFieldProp("type", "checkbox") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithCustomControl = function <T extends LooseObject>(control: (value: any, onChange: (value: any) => void, isError: boolean, errorMessage: string | undefined, isSaving: boolean, viewOnly: boolean) => React.ReactNode) {
	return this
		.SetFieldProp("custom", control) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithValidation = function <T extends LooseObject>(validate: (value: any, entity: LooseObject) => string | null) {
	return this
		.SetFieldProp("validation", validate) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Required = function <T extends LooseObject>() {
	return this
		.SetFieldProp("required", true) as FieldOptionsBuilder<T>;
}

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
		.SetFieldProp("accept", withImagePreview && accept === "*" ? "image/*" : accept)
		.SetFieldProp("maxFileSize", maxSizeKb * 1000)
		.SetFieldProp("withImagePreview", isAvatar ? true : withImagePreview)
		.SetFieldProp("isAvatar", isAvatar) as FieldOptionsBuilder<T>;

	if (cropImageToSize !== null) {
		fieldBuilder = fieldBuilder.SetFieldProp("cropImageToSize", cropImageToSize) as FieldOptionsBuilder<T>;
	}

	return fieldBuilder as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.TextArea = function <T extends LooseObject>(textAreaOptions?: ITextAreaControlProps) {
	let fieldBuilder = this
		.SetFieldProp("multiline", true) as FieldOptionsBuilder<T>;

	if (textAreaOptions) {
		if (textAreaOptions.lines !== null && textAreaOptions.lines !== undefined) {
			fieldBuilder = fieldBuilder.SetFieldProp("lines", textAreaOptions.lines) as FieldOptionsBuilder<T>;
		}
		if (textAreaOptions.maxLines !== null && textAreaOptions.maxLines !== undefined) {
			fieldBuilder = fieldBuilder.SetFieldProp("maxLines", textAreaOptions.maxLines) as FieldOptionsBuilder<T>;
		}
	}

	return fieldBuilder as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithDefaultValue = function <T extends LooseObject>(value: any) {
	return this
		.SetFieldProp("defaultValue", value) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Autocomplete = function <T extends LooseObject>(options: ItnSelectOption[]) {
	return this
		.SetFieldProp("type", "autocomplete")
		.SetFieldProp("items", options) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.AutocompleteWithQuery = function <T extends LooseObject>(apiUrl: string, searchAsType: boolean = false) {
	return this
		.SetFieldProp("type", "autocomplete")
		.SetFieldProp("searchAsType", searchAsType)
		.SetFieldProp("selectApiUrl", apiUrl) as FieldOptionsBuilder<T>;
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