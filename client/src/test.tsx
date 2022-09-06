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
    role: string;
    blocked: boolean;
    middlename: string;
    password: string;
    avatar: string
}

class UsersFieldBuilder extends AbstractFieldBuilder<IUserDTO> {
    constructor() {
        super();
        this.FieldFor(_ => _.avatar)
            .WithLabel("Аватар")
            .File({ withImagePreview: true });

        this.FieldFor(_ => _.name)
            .WithLabel("Имя")
            .Required();

        this.FieldFor(_ => _.surname)
            .WithLabel("Фамилия")
            .Disable();

        this.FieldFor(_ => _.password)
            .WithLabel("Пароль")
            .Password()
            .WithValidation((val) => {
                const value = val as string;
                if (value.length < 3) {
                    return "Пароль должен быть длиннее трех символов";
                }
                return null;
            });

        this.FieldFor(_ => _.blocked)
            .WithLabel("Заблокирован")
            .Bool();

        this.FieldFor(_ => _.role)
            .WithLabel("Роль")
            .Select([
                new ItnSelectOption("1", "Админ"),
                new ItnSelectOption("2", "Пользователь"),
                new ItnSelectOption("3", "Дата-менеджер"),
            ]);


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

            <PageTitle>Тестовая форма создания</PageTitle>
            <ItnQueryForm
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
            />
            <PageTitle>Тестовая форма редактирования</PageTitle>
            <ItnQueryForm
                apiUrl="http://localhost:5000/api/test"
                fieldBuilder={fieldBuilder}
                id="1"
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
                ref={drawerRef}
            >
                Контент
            </EditDrawer>
            <ItnModal
                ref={modalRef}
            >
                Контент
            </ItnModal>
        </>
    );
}

export default TestComnonent;