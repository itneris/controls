# ItNeris Controls
Custom ItNeris company web-form and controls based on MaterialUI

## Content
1. **Props**
2. **Additional classes**

## Props
1. **type: oneOf(['select', 'bool', 'password', 'text', 'date', 'chip-input', 'button', 'number'])** - тип генерируемого контрола
2. **name: string** - имя поля в БД, с которым связан контрол
3. **value: any** - содержание поля в БД, с которым связан контрол
4. **req: bool** - атрибут обязательности ввода, по умолчанию false
5. **disabled: bool** - отключает возможность ввода у контрола
6. **placeholder: oneOfType(PropTypes.string, PropTypes.number)** - задаёт значение плейсхолдера
7. **options: instanceOf([OptionsClass](https://github.com/itneris/controls/edit/main/README.md/Options))** - опциональные функции контрола
8. **highlightErrors: bool** - отображение ошибки, по умолчанию false
9. **noPadding: bool** -  отсутствие/наличие паддинга
10. **labelWidth: bool** - оборачивает FormLabel в <Box width="103px">, по умолчанию false
11. **tooltip: string** - передаёт текст в всплывающую подсказку
12. **label: string** - передаёт наименование контрола
13. **setField: function()** - функция, устанавливающая значение контрола при вводе

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
