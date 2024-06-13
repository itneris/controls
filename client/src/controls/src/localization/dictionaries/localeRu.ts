import { FormLocalizationType } from "../FormLocalizationType";

export const localeRu = {
    form: {
        fieldRequired: "Поле обязательно для заполнения",
        maxValueError: "Максимальное значение поля {0}",
        minValueError: "Минимальное значение поля {0}",
        passwordError: "Пароль должен содержать не менее {0} символов, включать цифру, нижний и верхний регистры латинского алфавита и непрописной символ (!@#$%^&*()-+<>)`",
        incorrectNumber: "Некорректное числовое значение",
        onlyPositiveNumber: "Значение должно быть положительным числом",
        onlyIntegerNumber: "Значение должно быть целым числом",
        loadError: "Ошибка загрузки данных: {0}"
    },
    pageTitle: {
        backButtonText: "Назад",
        createButtonText: "Создать"
    },
    passwordControl: {
        generateButtonText: "Сгенерировать пароль",
        visibilityToggleText: "Показать пароль"
    },
    dateControl: {
        datePlaceHolder: "ДД.ММ.ГГГГ",
        dateTimePlaceHolder: "ДД.ММ.ГГГГ ЧЧ:ММ",
        timePlaceHolder: "ЧЧ:ММ",
        dayPlaceholder: "ДД",
        hourPlaceholder: "ЧЧ",
        minutePlaceholder: "ММ",
        monthPlaceholder: "ММ",
        yearPlaceholder: "ГГГГ",
        secondPlaceholder: "СС"
    },
    autocompleteControl: {
        helperText: "Введите текст для поиска",
        noOptionsText: "Нет результатов",
        loadingText: "Загрузка...",
        chooseText: "Выберите {0}",
        addText: "Добавить {0}",
        defaultLabelText: "значение"
    },
    fileControl: {
        fileSizeError: "Размер файла не должен превышать {0}",
        compressError: "Ошибка при сжатии файла, попробуйте другой файл или обратитесь к администратору",
        replaceButtonText: "Заменить",
        cropImageModalTitle: "Обрезать изображение",
        cropButtonText: "Обрезать",
    },
    common: {
        cancelButtonText: "Отмена",
        closeButtonText: "Закрыть",
        saveButtonText: "Сохранить",
        removeButtonText: "Удалить"
    },
    formatters: {
        number: (value: number) => value.toLocaleString("ru-RU"),
        date: (value: Date) => value.toLocaleDateString("ru-RU")
    }
} satisfies FormLocalizationType;