export type FormLocalizationType = {
    form: {
        fieldRequired: string,
        maxValueError: string,
        minValueError: string,
        passwordError: string,
        incorrectNumber: string,
        onlyPositiveNumber: string,
        onlyIntegerNumber: string,
        loadError: string
    },
    pageTitle: {
        backButtonText: string,
        createButtonText: string
    },
    dateControl: {
        datePlaceHolder: string,
        dateTimePlaceHolder: string,
        timePlaceHolder: string,
        dayPlaceholder: string,
        hourPlaceholder: string,
        minutePlaceholder: string,
        monthPlaceholder: string,
        yearPlaceholder: string,
        secondPlaceholder: string
    },
    passwordControl: {
        generateButtonText: string,
        visibilityToggleText: string
    },
    fileControl: {
        fileSizeError: string,
        compressError: string,        
        replaceButtonText: string,
        cropImageModalTitle: string,
        cropButtonText: string
    },
    autocompleteControl: {
        helperText: string,
        noOptionsText: string,
        loadingText: string,
        chooseText: string,
        addText: string,
        defaultLabelText: string
    },
    common: {
        cancelButtonText: string,
        closeButtonText: string,
        saveButtonText: string,
        removeButtonText: string,
    },
    formatters: {
        number: (value: number) => string,
        date: (value: Date) => string
    }
}