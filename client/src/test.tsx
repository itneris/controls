import React, { useCallback, useRef } from "react";
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle, ItnQueryForm, EditDrawer, ItnModal, ItnControl, ItnFormControl } from "controls/src";
import IDrawerRef from "./controls/src/props/IDrawerRef";
import IModalRef from "./controls/src/props/IModalRef";
import { IFormRef } from "./controls/src/base/IFormRef";
import { IQueryFormRef } from "./controls/src/base/IQueryFormRef";
//import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle, ItnQueryForm, EditDrawer } from "@itneris/controls";

interface IUserDTO {
    id: string;
    name: string;
    surname: string;
    visitCount: number;
    visitDate: string;
    visitTime: string;
    visitDateTime: string;
    role: string;
    role_select_multiple: string;
    role_api: string;
    roleValue: {
        id: string,
        label: string
    };
    roleValueArray: {
        id: string,
        label: string
    }[];
    roleValueWithSearch: {
        id: string,
        label: string
    };
    blocked: boolean;
    middlename: string;
    password: string;
    avatar: any;
    note: string;
    calcValue: string;
}

class UsersFieldBuilder extends AbstractFieldBuilder<IUserDTO> {
    constructor() {
        super();
        
        this.FieldFor(_ => _.avatar)
            .WithLabel("Аватар")
            .File({ withImagePreview: true, isAvatar: true })
            //.Required();

        this.FieldFor(_ => _.name)
            .WithLabel("Имя")
            .WithDefaultValue("Ибраген")
            .WithHelperText("Не надо вводить сюда цифры")
            .Required()
            .WithTooltip("Ничего не значащая подсказка");

        this.FieldFor(_ => _.surname)
            .WithLabel("Фамилия")
            .WithDefaultValue("Каромаслов")
            .WithValidation((val, entity) => {
                console.log(val);
                console.log(entity);
                return null;
            });

        this.FieldFor(_ => _.calcValue)
            .WithLabel("Калькулируемое поле")
            .Hide((_) => _.surname === 'dr. Hide');

        this.FieldFor(_ => _.password)
            .WithLabel("Пароль")
            .Password(false, 3, true)
            .WithValidation((val) => {
                const value = val as string;
                if (value.length < 3) {
                    return "Пароль должен быть длиннее трех символов";
                }
                return null;
            })
            .Required();

        this.FieldFor(_ => _.visitCount)
            .WithLabel("Число посещений")
            .Number()
            .Required();

        this.FieldFor(_ => _.visitDate)
            .WithLabel("Дата записи")
            .DatePicker()
            .Disable()
            .Required();

        this.FieldFor(_ => _.visitTime)
            .WithLabel("Время записи")
            .TimePicker();

        this.FieldFor(_ => _.visitDateTime)
            .WithLabel("Дата и время записи")
            .DateTimePicker();

        this.FieldFor(_ => _.blocked)
            .WithLabel("Заблокирован")
            .Bool()
            .Hide((e) => e.role === "1");

        this.FieldFor(_ => _.role)
            .WithLabel("Роль")
            .Select([
                new ItnSelectOption("1", "Админ"),
                new ItnSelectOption("2", "Пользователь"),
                new ItnSelectOption("3", "Дата-менеджер"),
            ]);

        this.FieldFor(_ => _.role_select_multiple)
            .WithLabel("Роль (multiselect)")
            .Select([
                new ItnSelectOption("1", "Админ"),
                new ItnSelectOption("2", "Пользователь"),
                new ItnSelectOption("3", "Дата-менеджер"),
            ], true);

        this.FieldFor(_ => _.roleValueWithSearch)
            .WithLabel("Роль (autocomplete with search)")
            .AutocompleteWithQuery("http://localhost:5000/api/dicts/roles_auto_with_search", true, true);

        this.FieldFor(_ => _.roleValue)
            .WithLabel("Роль (autocomplete)")
            .AutocompleteWithQuery("http://localhost:5000/api/dicts/roles_auto", false, true);

        /*this.FieldFor(_ => _.roleValueArray)
            .WithLabel("Роли (autocomplete multiple)")
            .AutocompleteWithQuery("http://localhost:5000/api/dicts/roles_auto_create", true, true, null, true);*/

        this.FieldFor(_ => _.roleValueArray)
            .WithLabel("Роли (autocomplete multiple without search as type)")
            .AutocompleteWithQuery("http://localhost:5000/api/dicts/roles_auto_create", false, false, null, true);

        this.FieldFor(_ => _.role_api)
            .WithLabel("Роль (api)")
            .SelectWithQuery("http://localhost:5000/api/dicts/roles");

        this.FieldFor(_ => _.note)
            .WithLabel("Примечание")
            .TextArea({ lines: 3 });

        this.FieldFor(_ => _.middlename)
            .WithCustomControl((val, onChange, isError, errorMessage) => {
                return <div>
                    {val ?? "Нет значения"}
                    <br />
                    <div style={{ cursor: "pointer" }} onClick={() => onChange((val ?? "") + "1")}>
                        ++1
                    </div>
                    <div style={{ cursor: "pointer" }} onClick={() => onChange("1")}>
                        = 1
                    </div>
                    {isError ? errorMessage : "Пока ошибки нет"}
                </div>
            })
            .WithValidation(_ => _.length > 10 ? "Too much" : null);
    }
}

const fieldBuilder = new UsersFieldBuilder();

const TestComnonent = () => {
    const drawerRef = useRef<IDrawerRef | null>(null);
    const modalRef = useRef<IModalRef | null>(null);
    const formRef = useRef<IFormRef | null>(null);
    const createFormRef = useRef<IQueryFormRef>(null);
    const editFormRef = useRef<IQueryFormRef>(null);

    const handleCreateChange = useCallback((prop: string, value: any) => {
        if (prop === "name" || prop === "surname") {
            const values = createFormRef.current!.getCurrentValues();
            const loginNamePart = prop === "name" ?
                (!value ? "" : value[0]) :
                (!values.name ? "" : values.name[0]);

            const loginSurnamePart = prop === "surname" ?
                (!value ? "" : value) :
                (!values.surname ? "" : values.surname);

            values[prop] = value;
            values.calcValue = `${loginNamePart}.${loginSurnamePart}`;


            createFormRef.current?.setEntity(values);
        }
    }, []);

    const handleError = useCallback((data: any) => {
        createFormRef.current!.addError("calcValue", data.detail)
    }, []);

    const handleResetAc = useCallback((prop: string, val: string) => {
        /*if (prop === "roleValueWithSearch" || prop === "roleValueArray") {
            let entity = { ...editFormRef.current!.getCurrentValues() };
            entity.roleValueWithSearch = { id: 0, label: "" };
            entity.roleValueArray = null;
            editFormRef.current!.setEntity(entity);
        }*/
    }, []);

    return (
        <>
            <Button variant="contained" onClick={() => drawerRef.current!.open()}>Открыть Drawer</Button>
            <Button variant="contained" onClick={() => modalRef.current!.open()}>Открыть Modal</Button>
            <ItnControl
                type="string"
                value="qwe"
                onEnter={() => console.log("enter Pressed")}
            />

            {
                /*<ItnQueryForm
                ref={createFormRef}
                header="Форма создания"
                headerContent={<b>Пример контента после заголовка</b>}
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
                footerContent={<b>Пример контента после контролов</b>}
                onChange={handleCreateChange}
                onError={handleError}
            />*/
            }
            
            <PageTitle tooltip="Представленные в таблице ниже пользователи включают в себя как доменных, так и недоменных пользователей внутреннего и внешнего контуров систем. Для запуска принудительной синхронизации с доменом нажмите на кнопку «Обновить из домена»">Тестовая форма редактирования</PageTitle>
            <ItnQueryForm
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
                id="1"
                onAfterLoad={(e) => console.log(e)}
                urlParams={{ forGodsSake: "true", qweqwe: "qweqheuh" }}
                onError={e => console.log(e)}
                onChange={handleResetAc}
                ref={editFormRef}
            />
            {
                /*
            <PageTitle>Тестовая форма без апи</PageTitle>
            <ItnForm                
                ref={formRef}
                entity={{
                    id: "2",
                    name: "Name",
                    surname: "Surname",
                    role: "1",
                    blocked: true,
                    middlename: "middlename",
                    password: "password",
                    roleValue:
                    {
                        id: "1",
                        label: "Оператор ЭВМ",
                    },
                    roleValueArray: [
                        {
                            id: "1",
                            label: "Оператор ЭВМ",
                        },
                        {
                            id: "2",
                            label: "Оператор установки",
                        }],
                    roleValueWithSearch:
                    {
                        id: "1",
                        label: "Оператор ЭВМ",
                    }
                } as IUserDTO}
                onSave={(en) => console.log("qwe")}
                fieldBuilder={fieldBuilder}
                
            />

            <PageTitle>Форма с кастомным расположением</PageTitle>
            <ItnForm
                ref={formRef}
                entity={{
                    id: "2",
                    name: "Name",
                    surname: "Surname",
                    role: "1",
                    blocked: true,
                    middlename: "middlename",
                    password: "password",
                } as IUserDTO}
                onSave={(en) => console.log("qwe")}
                fieldBuilder={fieldBuilder}
                hidePaper
            >
                <Stack gap={4}>
                    <Paper>
                        <PageTitle>Первый блок</PageTitle>
                        <ItnFormControl field="name" />
                        <ItnFormControl field="surname" />
                        <ItnFormControl field="calcValue" />
                    </Paper>
                    <Paper>
                        <PageTitle>Второй блок</PageTitle>
                        <ItnFormControl field="password" />
                        <ItnFormControl field="role" />
                    </Paper>
                </Stack>
            </ItnForm>*/
            }

            <EditDrawer
                title="Тестовый дровер"
                cancelBtnText="Отмена"
                ref={drawerRef}                
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: "white"
                    }
                }}
            >
                <TableContainer component={Paper}>
                <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Заголовок 1</TableCell>
                                <TableCell>Заголовок 2</TableCell>                            
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Значение 1 Значение 1Значение 1Значение 1Значение 1Значение 1Значение 1Значение 1Значение 1</TableCell>
                                <TableCell>Значение 2Значение 2Значение 2Значение 2Значение 2Значение 2Значение 2Значение 2Значение 2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Значение 1</TableCell>
                                <TableCell>Значение 2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Значение 1</TableCell>
                                <TableCell>Значение 2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Значение 1</TableCell>
                                <TableCell>Значение 2</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Значение 1</TableCell>
                                <TableCell>Значение 2</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </EditDrawer>
            <ItnModal
                ref={modalRef}
                yesBtnText="Да"
                noBtnText="Нет"
                onResult={(res: boolean | null) => {
                    if (res === true) {
                        console.log("Smbdy clicked yes");
                        return true;
                    }
                    if (res === false) {
                        console.log("Smbdy clicked no");
                        return false;
                    }
                    if (res === null) {
                        console.log("Smbdy has closed this modal");
                    }
                }}
            >
                Контент
            </ItnModal>
        </>
    );
}

export default TestComnonent;