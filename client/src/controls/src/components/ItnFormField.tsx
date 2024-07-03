import React, { useContext } from "react";
import ItnControl from "./ItnControl";
import { Skeleton } from "@mui/material";
import { CustomControlFunction, FieldDescription } from "../base/FieldDescription";
import { Validation } from "../base/Validation";
import { ItnFormGlobalContext } from "../localization/ItnFromProvider";

function ItnFormField<T>(props: {
    isLoading: boolean;
    customControl: CustomControlFunction<T>;
    property: keyof T;
    onChange: (property: keyof T, value: T[keyof T]) => void;
    validation: Validation<T>[];
    isSaving: boolean;
    viewOnly: boolean;
    entity: T;
    field: FieldDescription<T>;
    onAcInput?: (property: keyof T, value: string, event: "reset" | "input" | "clear") => void;
    acLoading: boolean;
    variant: "outlined" | "standard" | "filled";
}) {
    const { 
        isLoading, 
        customControl, 
        property, 
        onChange, 
        validation, 
        entity, 
        isSaving, 
        viewOnly,
        field,
        onAcInput,
        acLoading,
        variant
    } = props;

    const prop = property.toString();

    const { locale } = useContext(ItnFormGlobalContext);

    if (isLoading) {
        return <Skeleton key={"fc-" + prop} height="32px" />
    } else if (customControl) {
        return <React.Fragment key={"fc-" + prop}>
            {
                customControl(
                    entity[property],
                    (value) => onChange(property, value),
                    validation.find(_ => _.property === property) !== undefined,
                    validation.find(_ => _.property === property)?.message,
                    isSaving,
                    viewOnly,
                    entity
                )
            }
        </React.Fragment>;
    } else {
        const controlHidden = typeof field.hidden === "function" ? field.hidden(entity) : field.hidden;
        if (controlHidden) {
            return null;
        }

        const controlDefaultValue =
            (["file", "date", "time"]).includes(field.type) ? null :
                field.type !== "select" && field.type !== "autocomplete" ? "" :
                    field.multiple ? [] :
                        null;

        const controlValue = entity[field.property] ?? controlDefaultValue;
        const controlDisabled = typeof field.disabled === "function" ? field.disabled(entity) : field.disabled;

        return (
            <ItnControl
                key={"fc-" + prop}
                type={field.type}
                disableNewPasswordGenerate={field.disableNewPasswordGenerate}
                variant={variant}
                onChange={(value) => onChange(field.property, value)}
                value={controlValue}
                allowNullInSelect={field.allowNullInSelect}
                selectNullLabel={field.selectNullLabel}
                noOptionsText={field.noOptionsText ?? locale.autocompleteControl.noOptionsText}
                passwordLength={field.passwordLength}
                placeholder={field.placeholder}
                disabled={controlDisabled || isSaving || viewOnly}
                display={field.display}
                error={validation.find(_ => _.property === field.property) !== undefined}
                errorText={validation.find(_ => _.property === field.property)?.message}
                items={field.items}
                label={typeof (field.label) === "function" ? field.label(entity) : field.label}
                max={field.max}
                min={field.min}
                allowDecimals={field.allowDecimals}
                allowNegative={field.allowNegative}
                maxDate={field.maxDate}
                minDate={field.minDate}
                tooltip={field.tooltip}
                accept={field.accept}
                maxFileSize={field.maxFileSize}
                imageProperties={field.imageProps ?? undefined}
                multiline={field.multiline}
                lines={field.lines}
                maxLines={field.maxLines}
                onAutocompleteInputChange={field.searchAsType ? (value, event) => onAcInput!(field.property, value, event) : undefined}
                autocompleteLoading={acLoading}
                autocompleteCreatable={field.autocompleteCreatable}
                onAutocompleteOptionAdded={field.onAutocompleteOptionAdded}
                helperText={field.helperText}
                multiple={field.multiple}
                onEnter={field.onEnterKeyPress}
                name={field.property.toString()}
            />
        );
    }
};

export default ItnFormField;