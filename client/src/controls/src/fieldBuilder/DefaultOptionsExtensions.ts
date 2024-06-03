import { FieldOptionsBuilder } from "./FieldOptionsBuilder";
import IFileControlProps from "../props/IFileControlProps";
import ITextAreaControlProps from "../props/ITextAreaControlProps";
import ISelectControlProps from "../props/ISelectControlProps";
import { ItnSelectOption } from "@itneris/controls";

declare module "./FieldOptionsBuilder" {
	interface FieldOptionsBuilder<T> {
		/**
		 * Defines a label for control
		 * @param {string} label Label to render
		 * */
		WithLabel(label: string | ((entity: T) => string)): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'select' and defines options
		 * @param {ItnSelectOption[]} options Array of opitons to render in select
		 * */
		Select(options: ItnSelectOption[], multiple?: boolean, props?: ISelectControlProps): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'autocomplete' and defines options
		 * @param {ItnSelectOption[]} options Array of opitons to render in autocomplete
		 * @param {boolean} creatable can user add new options, default false
		 * @param {(value: string) => void | null} onOptionAdded callback when option added
		 * */
		Autocomplete(options: ItnSelectOption[], creatable?: boolean, onOptionAdded?: ((value: string) => void) | null, multiple?: boolean): FieldOptionsBuilder<T>;
		/**
		 * !!!USE ONLY WITH QUERY FORM
		 * Changes control type to 'autocomplete' and defines api url for get options
		 * @param {string} apiUrl API address that return array of ItnSelectOption
		 * @param {boolean} searchAsType Calls the api with "search=" query param when user types text, default false
		 * @param {boolean} creatable can user add new options, default false
		 * @param {(value: string) => void | null} onOptionAdded callback when option added
		 * */
		AutocompleteWithQuery(apiUrl: string, searchAsType?: boolean, creatable?: boolean, onOptionAdded?: ((value: string) => void) | null, multiple?: boolean): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'number'
		 * @param {boolean} allowDecimal allows user to enter decimal numbers
		 * @param {boolean} allowNegative allows user to enter negative numbers
		 * @param {number} min sets the min value for number
		 * @param {number} max sets the max value for number
		 * */
		Number(allowDecimals?: boolean, allowNegative?: boolean, min?: number | null, max?: number | null): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'date'
		 * */
		DatePicker(props?: { minDate?:  Date, maxDate?: Date }): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'time'
		 * */
		TimePicker(): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to 'datetime'
		 * */
		DateTimePicker(): FieldOptionsBuilder<T>;
		/**
		 * !!!USE ONLY WITH QUERY FORM
		 * Changes control type to 'select' and defines api url for get options
		 * @param {string} apiUrl API address that return array of ItnSelectOption
		 * */
		SelectWithQuery(apiUrl: string, multiple?: boolean, props?: ISelectControlProps): FieldOptionsBuilder<T>;
		/**
		 * Disables control
		 * @param {boolean | (entity: LooseObject) => boolean} disabled sets control state or function for calculate control state dependent on current form values
		 * */
		Disable(disabled?: boolean | ((entity: T) => boolean)): FieldOptionsBuilder<T>;
		/**
		 * Hides control
		 * @param {boolean | (entity: LooseObject) => boolean} visible sets control state or function for calculate control state dependent on current form values
		 * */
		Hide(hidden?: boolean | ((entity: T) => boolean)): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to password
		 * @param {boolean} disableNewPasswordGenerate hide button for generate new password
		 * @param {number} length length for generated password, default = 6
		 * @param {boolean} enableCheck enable form password check for digits, cases and non-alpha chars
		 * */
		Password(disableNewPasswordGenerate?: boolean, length?: number, enableCheck?: boolean): FieldOptionsBuilder<T>;
		/**
		 * Changes control type to boolean
		 * */
		Bool(): FieldOptionsBuilder<T>;
		/**
		 * Make the field required, in validation value will be checked on null, empty string and undefined
		 * @param {boolean | (entity: LooseObject) => boolean} required sets control state or function for calculate control state dependent on current form values
		 * */
		Required(required?: boolean | ((entity: T) => boolean)): FieldOptionsBuilder<T>;
		/**
		 * Add validation to field by value
		 * @param {(value: any) => string | null} validate Function that get current value as param and return errorMessage or null if value is valid
		 * */
		WithValidation(validate: (value: any, entity: T) => string | null): FieldOptionsBuilder<T>;
		 /**
		 * Renders custom control
		 * @param {(value: any, onChange: (value: any) => void) => React.ReactNode, isError, errorMessage, isSaving, viewOnly, entity} control Function that receives as paramteres entity current value, onChange function. Also current state as isSaving and viewOnly
		 * */
		WithCustomControl(control: (value: any, onChange: (value: any) => void, isError: boolean, errorMessage: string | undefined, isSaving: boolean, viewOnly: boolean, entity: T) => React.ReactNode): FieldOptionsBuilder<T>;
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
		/**
		* Sets helper text for the control
		 * @param {string} text text to render below control
		* */
		WithHelperText(text: string): FieldOptionsBuilder<T>;
		/**
		* Sets tooltip for the control
		 * @param {string} text text to render in tooltip
		* */
		WithTooltip(tooltip: string): FieldOptionsBuilder<T>;
		/**
		* Executes function on enter press
		 * @param {string} text text to render in tooltip
		* */
		OnEnter(onEnterKeyPress: () => void): FieldOptionsBuilder<T>;
	}
}
FieldOptionsBuilder.prototype.OnEnter = function <T>(onEnterKeyPress: () => void) {
	return this
		.SetFieldProp("onEnterKeyPress", onEnterKeyPress) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithLabel = function <T>(label: string | ((entity: T) => string)) {
	return this
		.SetFieldProp("label", label) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Select = function <T>(options: ItnSelectOption[], multiple: boolean = false, props: ISelectControlProps = {}) {
	return this
		.SetFieldProp("type", "select")
		.SetFieldProp("multiple", multiple)
		.SetFieldProp("selectNullLabel", props.nullLabel ?? null)
		.SetFieldProp("allowNullInSelect", props.allowNull ?? false)
		.SetFieldProp("items", options) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.SelectWithQuery = function <T>(apiUrl: string, multiple: boolean = false, props: ISelectControlProps = {}) {
	return this
		.SetFieldProp("type", "select")
		.SetFieldProp("multiple", multiple)
		.SetFieldProp("selectNullLabel", props.nullLabel ?? null)
		.SetFieldProp("allowNullInSelect", props.allowNull ?? false)
		.SetFieldProp("selectApiUrl", apiUrl) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.DatePicker = function <T>(props?: { minDate?: Date, maxDate?: Date }) {
	let controlProps = this;
    if (props?.minDate) {
        controlProps = controlProps.SetFieldProp("minDate", props.minDate);
    }

    if (props?.maxDate) {
        controlProps = controlProps.SetFieldProp("maxDate", props.maxDate);
    }

    return controlProps.SetFieldProp("type", "date") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.TimePicker = function <T>() {
	return this
		.SetFieldProp("type", "time") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.DateTimePicker = function <T>() {
	return this
		.SetFieldProp("type", "datetime") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Disable = function <T>(disabled: boolean | ((entity: T) => boolean) = true) {
	return this
		.SetFieldProp("disabled", disabled) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Hide = function <T>(hidden: boolean | ((entity: T) => boolean) = true) {
	return this
		.SetFieldProp("hidden", hidden) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Password = function <T>(
	disableNewPasswordGenerate: boolean = false,
	length: number = 6,
	enableCheck: boolean = false
) {
	return this
		.SetFieldProp("type", "password")
		.SetFieldProp("passwordLength", length) 
		.SetFieldProp("enablePasswordCheck", enableCheck) 
		.SetFieldProp("disableNewPasswordGenerate", disableNewPasswordGenerate) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Bool = function <T>() {
	return this
		.SetFieldProp("type", "checkbox") as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithCustomControl = function <T>(control: (value: any, onChange: (value: any) => void, isError: boolean, errorMessage: string | undefined, isSaving: boolean, viewOnly: boolean, entity: T) => React.ReactNode) {
	return this
		.SetFieldProp("custom", control) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithValidation = function <T>(validate: (value: any, entity: T) => string | null) {
	return this
		.SetFieldProp("validation", validate) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Required = function <T>(required: boolean | ((entity: T) => boolean) = true) {
	return this
		.SetFieldProp("required", required) as FieldOptionsBuilder<T>;

}

FieldOptionsBuilder.prototype.Number = function <T>(
	allowDecimals: boolean = false,
	allowNegative: boolean = false,
	min: number | null = null,
	max: number | null = null
) {
	return this
		.SetFieldProp("type", "number")
		.SetFieldProp("allowDecimals", allowDecimals)
		.SetFieldProp("allowNegative", allowNegative)
		.SetFieldProp("max", max)
		.SetFieldProp("min", min) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.File = function <T>({
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

FieldOptionsBuilder.prototype.TextArea = function <T>(textAreaOptions?: ITextAreaControlProps) {
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

FieldOptionsBuilder.prototype.WithDefaultValue = function <T>(value: any) {
	return this
		.SetFieldProp("defaultValue", value) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithHelperText = function <T>(text: string) {
	return this
		.SetFieldProp("helperText", text) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.WithTooltip = function <T>(text: string) {
	return this
		.SetFieldProp("tooltip", text) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.Autocomplete = function <T>(
	options: ItnSelectOption[],
	creatable: boolean = false,
	onOptionAdded: ((value: string) => void) | null = null,
	multiple: boolean = false
) {
	return this
		.SetFieldProp("type", "autocomplete")
		.SetFieldProp("autocompleteCreatable", creatable)
		.SetFieldProp("onAutocompleteOptionAdded", onOptionAdded)
		.SetFieldProp("multiple", multiple)
		.SetFieldProp("items", options) as FieldOptionsBuilder<T>;
}

FieldOptionsBuilder.prototype.AutocompleteWithQuery = function <T>(
	apiUrl: string,
	searchAsType: boolean = false,
	creatable: boolean = false,
	onOptionAdded: ((value: string) => void) | null = null,
	multiple: boolean = false
) {
	return this
		.SetFieldProp("type", "autocomplete")
		.SetFieldProp("searchAsType", searchAsType)
		.SetFieldProp("autocompleteCreatable", creatable)
		.SetFieldProp("onAutocompleteOptionAdded", onOptionAdded)
		.SetFieldProp("multiple", multiple)
		.SetFieldProp("selectApiUrl", apiUrl) as FieldOptionsBuilder<T>;
}