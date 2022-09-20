import React, { useRef } from "react";
import { Button } from "@mui/material";

import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle, ItnQueryForm, EditDrawer, ItnModal } from "controls/src";
import IDrawerRef from "./controls/src/props/IDrawerRef";
import IModalRef from "./controls/src/props/IModalRef";
import { IFormRef } from "./controls/src/base/IFormRef";
//import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle, ItnQueryForm, EditDrawer } from "@itneris/controls";

interface IUserDTO {
    id: string;
    name: string;
    surname: string;
    visitDate: string;
    role: string;
    role_api: string;
    blocked: boolean;
    middlename: string;
    password: string;
    avatar: string;
    note: string;
}

class UsersFieldBuilder extends AbstractFieldBuilder<IUserDTO> {
    constructor() {
        super();
        this.FieldFor(_ => _.avatar)
            .WithLabel("Аватар")
            .File({ withImagePreview: true });

        this.FieldFor(_ => _.name)
            .WithLabel("Имя")
            .WithDefaultValue("Ибраген")
            .Required();

        this.FieldFor(_ => _.surname)
            .WithLabel("Фамилия")
            .WithDefaultValue("Каромаслов")
            .WithValidation((val, entity) => {
                console.log(val);
                console.log(entity);
                return null;
            })
            .Disable();

        this.FieldFor(_ => _.password)
            .WithLabel("Пароль")
            .Password(true)
            .WithValidation((val) => {
                const value = val as string;
                if (value.length < 3) {
                    return "Пароль должен быть длиннее трех символов";
                }
                return null;
            });

        this.FieldFor(_ => _.visitDate)
            .WithLabel("Дата записи")
            .DatePicker();

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

        this.FieldFor(_ => _.role_api)
            .WithLabel("Роль (api)")
            .SelectWithQuery("http://localhost:5000/api/dicts/roles");

        this.FieldFor(_ => _.note)
            .WithLabel("Примечание")
            .TextArea({ lines: 3 });

        this.FieldFor(_ => _.middlename)
            .WithCustomControl((val, onChange) => {
                return <div style={{ cursor: "pointer" }} onClick={() => onChange((val ?? "") + "1")}>
                    {val ?? "Нет значения"}
                </div>
            });
    }
}

const fieldBuilder = new UsersFieldBuilder();

const TestComnonent = () => {
    const drawerRef = useRef<IDrawerRef | null>(null);
    const modalRef = useRef<IModalRef | null>(null);
    const formRef = useRef<IFormRef | null>(null);
    return (
        <>
            <Button variant="contained" onClick={() => drawerRef.current!.open()}>Открыть Drawer</Button>
            <Button variant="contained" onClick={() => modalRef.current!.open()}>Открыть Modal</Button>

            <ItnQueryForm
                header="Форма создания"
                headerContent={<b>Пример контента после заголовка</b>}
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
                footerContent={<b>Пример контента после контролов</b>}
            />
            <PageTitle>Тестовая форма редактирования</PageTitle>
            <ItnQueryForm
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
                id="1"
                onAfterLoad={(e) => console.log(e)}
                urlParams={{ forGodsSake: "true" }}
            />
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
                } as IUserDTO}
                onSave={(en) => console.log("qwe")}
                fieldBuilder={fieldBuilder}
                
            />
            <EditDrawer
                title="Тестовый дровер"
                cancelBtnText="Отмена"
                ref={drawerRef}
            >
                Контент
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