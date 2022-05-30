# ITneris Controls
Custom ITneris company web-form and controls based on MaterialUI

-----

1. [Control props](https://github.com/itneris/controls/blob/main/README.md#control-props)
2. [Form props](https://github.com/itneris/controls/blob/main/README.md#form-props)
3. [DatePicker props](https://github.com/itneris/controls/blob/main/README.md#datepicker-props)
4. [EditDrawer props](https://github.com/itneris/controls/blob/main/README.md#editdrawer-props)
5. [Modal props](https://github.com/itneris/controls/blob/main/README.md#modal-props)
6. [PageTitle props](https://github.com/itneris/controls/blob/main/README.md#pagetitle-props)
7. [HtmlTooltip props](https://github.com/itneris/controls/blob/main/README.md#htmltooltip-props)
8. [Additional classes](https://github.com/itneris/controls/blob/main/README.md#form-props)

 ## Control props
 - **type: oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number'])** - тип генерируемого контрола
 - **name: string** - имя поля в БД, с которым связан контрол
 - **value: any** - содержание поля в БД, с которым связан контрол
 - **req: bool** - атрибут обязательности ввода, по умолчанию false
 - **disabled: bool** - отключает возможность ввода у контрола
 - **placeholder: oneOfType(PropTypes.string, PropTypes.number)** - задаёт значение плейсхолдера
 - **options: instanceOf([OptionsClass](https://github.com/itneris/controls/blob/main/README.md#options))** - опциональные функции контрола
 - **highlightErrors: bool** - отображение ошибки, по умолчанию false
 - **noPadding: bool** -  отсутствие/наличие паддинга
 - **labelWidth: bool** - оборачивает *CustomControl* в FormLabel<Box width="103px">, по умолчанию false
 - **tooltip: string** - передаёт текст в всплывающую подсказку
 - **label: string** - передаёт наименование контрола
 - **setField: function()** - функция, устанавливающая значение контрола при вводе
 
 ## Form props
 - **controls: arrayOf(PropTypes.object)** - массив объектов, где каждый объект представляет данные определённого контрола
 - **header: string** - имя заголовка формы
 - **formStyles: object** - передаёт стили для формы

 ## DatePicker props
 - **mode: string** - режим выбора даты
 - **value: any** - Значение компонента, необходимое для управления компонента.
 - **onChange: function()** - вызовается функция onChange при изменении значения.
 - **variant: string** - стилистический вариант для использования.
 - **fullWidth: bool** - если значение true, то входные данные будут занимать всю ширину своего контейнера.
 
 ## EditDrawer props
 - **open: bool** -  если значение true, отображается компонент.
 - **children: any** - дочерние элементы модального окна.
 - **onClose: function()** - вызовается функция onClose при закрытии дровера. 
 - **title: string** - текст заголовка дровера.
 - **onDelete: function()** - вызовается функция onDelete при нажатии на кнопку удаления.
 - **onSave: function()** - вызовается функция onSave при нажатии на кнопку сохранения.
 - **buttons: arrayOf([Buttons Options](https://github.com/itneris/controls/blob/main/README.md#buttons-options))** - массив кнопок, которые отображаются в боковом меню.
 - **tabs: arrayOf(PropTypes.object)** - массив вкладок, которые отображаются в боковом меню.
 
 ## Modal props
 - **styleTitle: object** - обьект со стилями для заголовка.
 - **styleContent: object** - обьект со стилями для контент.
 - **styleBottom: object** - стили контейнера с кнопками отмена и ок.
 - **titleJustifyContent: string** - распределяет пространство между элементами контента.
 - **title: string** - текст заголовка модального окна.
 - **open: bool** - если значение true, отображается компонент.
 - **contentText: string** - основной текст.
 - **children: any** - дочерние элементы модального окна.
 - **onClose: function()** - вызовается функция onClose при закрытии модального окна.
 - **okButtonDisabled: bool** - если значение true, кнопка окей заблокирована.
 - **onCancel: function()** - вызовается функция onCancel при нажатии на кнопку отмены.
 - **onOk: function()** - вызовается функция onOk при нажатии на кнопку окей.
 - **size: string** - размер модального окна. Окно растет вместе с размером экрана. false выключает это. Возможные варианты: 'xs', 'sm', 'md', 'lg', 'xl', false.
 - **okBtnText: string** - текст для кнопки Ok.
 - **titleComponent: React.element** - компонент, который отображается в заголовке модального окна.

 ## PageTitle props
 - **title: string** - текст заголовка.
 - **onAdd: function()** - вызовается функция onAdd при нажатии на кнопку окей.  Кнопка не отображается если свойство не указано.
 - **btnStyle: object** - обьект со стилями для кнопки.

 ## HtmlTooltip props
 - **title: string** - текст подсказки.

 ## Additional classes
  ### Options
  - **items: arrayOf(PropTypes.object)** - элементы контрола типа 'select'.
  - **inputProps: objectOf(PropTypes.number)** - объект, включающий в себя свойства min и max:
   - **min: number** - минимальное значение контрола типа 'number'.
   - **max: number** - максимальное значение контрола типа 'number'.
  - **onClick: function()** - функция, передаваемая для контрола типа 'button'.
  - **onChange: function()** - функция, передаваемая для контрола типа 'select'.
  - **minDate: date** - передаёт минимальное значение для контрола типа 'date'.
  - **maxDate: date** - передаёт максимальное значение для контрола типа 'date'.

  ### Buttons Options
  - **tooltip: component** - текст тултипа.
  - **color: string** - цвет кнопки.
  - **onClick: function()** - вызывается функция onClick при нажатии на кнопку.
  - **icon: component** - иконка для кнопки.
