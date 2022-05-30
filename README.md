# ItNeris Controls
Custom ItNeris company web-form and controls based on MaterialUI

-----

1. [Control props](https://github.com/itneris/controls/blob/main/README.md#control-props)
2. [Form props](https://github.com/itneris/controls/blob/main/README.md#form-props)
3. [Additional classes](https://github.com/itneris/controls/blob/main/README.md#form-props)

## Control props
 - **type: oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number'])** - тип генерируемого контрола
 - **name: string** - имя поля в БД, с которым связан контролnn
 - **value: any** - содержание поля в БД, с которым связан контрол
 - **req: bool** - атрибут обязательности ввода, по умолчанию false
 - **disabled: bool** - отключает возможность ввода у контрола
 - **placeholder: oneOfType(PropTypes.string, PropTypes.number)** - задаёт значение плейсхолдера
 - **options: instanceOf([OptionsClass](https://github.com/itneris/controls/blob/main/README.md#options))** - опциональные функции контрола
 - **highlightErrors: bool** - отображение ошибки, по умолчанию false
 - **noPadding: bool** -  отсутствие/наличие паддинга
 - **labelWidth: bool** - оборачивает FormLabel в <Box width="103px">, по умолчанию false
 - **tooltip: string** - передаёт текст в всплывающую подсказку
 - **label: string** - передаёт наименование контрола
 - **setField: function()** - функция, устанавливающая значение контрола при вводе
 
## Form props
 - **controls: arrayOf(PropTypes.object)** - массив объектов, где каждый объект представляет данные определённого контрола
 - **header: string** - имя заголовка формы
 - **formStyles: object** - передаёт стили для формы

 ## Additional classes
  ### Options
  - **items: arrayOf(PropTypes.object)** - элементы контрола типа 'select'
  - **inputProps: objectOf(PropTypes.number)** - объект, включающий в себя свойства min и max
  - **min: number** - минимальное значение контрола типа 'number'
  - **max: number** - максимальное значение контрола типа 'number'
  - **onClick: function()** - функция, передаваемая для контрола типа 'button'
  - **onChange: function()** - функция, передаваемая для контрола типа 'select'
  - **minDate: date** - передаёт минимальное значение для контрола типа 'date'
  - **maxDate: date** - передаёт максимальное значение для контрола типа 'date'
 
  ### Form style
  - **mt: number** - marginTop
  - **mb: number** - marginBottom