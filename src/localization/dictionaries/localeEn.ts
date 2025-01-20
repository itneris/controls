import { FormLocalizationType } from "../FormLocalizationType";

export const localeEn = {
    form: {
        fieldRequired: "Field is required",
        maxValueError: "Maximum value of field {0}",
        minValueError: "Minimum value of field {0}",
        passwordError: "Password must contain at least {0} characters, include a digit, lower and upper case Latin alphabet and a non-prose symbol (!@#$%^&*()-+<>)`",
        incorrectNumber: "Incorrect numeric value",
        onlyPositiveNumber: "Value must be a positive number",
        onlyIntegerNumber: "Value must be an integer number",
        loadError: "Data load error: {0}"
    },
    pageTitle: {
        backButtonText: "Back",
        createButtonText: "Create"
    },
    passwordControl: {
        generateButtonText: "Generate password",
        visibilityToggleText: "Show password"
    },
    dateControl: {
        datePlaceHolder: "DD.MM.YYYY",
        dateTimePlaceHolder: "DD.MM.YYYY HH:MM",
        timePlaceHolder: "HH:MM",
        dayPlaceholder: "DD",
        hourPlaceholder: "HH",
        minutePlaceholder: "MM",
        monthPlaceholder: "MM",
        yearPlaceholder: "YYYY",
        secondPlaceholder: "SS"
    },
    fileControl: {
        fileSizeError: "File size should not exceed {0}",
        compressError: "Error compressing file, try another file or contact the administrator",
        replaceButtonText: "Replace",
        cropImageModalTitle: "Crop image",
        cropButtonText: "Crop"
    },
    common: {
        cancelButtonText: "Cancel",
        removeButtonText: "Remove",
        closeButtonText: "Close",
        saveButtonText: "Save",
        loadingText: "Loading...",
        chooseText: "Choose {0}",
        defaultValueText: "value"
    },
    formatters: {
        number: (value: number) => value.toLocaleString("en-US"),
        date: (value: Date) => value.toLocaleDateString("en-US")
    } 
} satisfies FormLocalizationType;