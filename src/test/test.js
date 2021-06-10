import React, { Component } from "react";
import {
    Typography,
    Box,
} from "@material-ui/core";
import common from "../common/styles";
import colors from "../common/colors";
import CustomForm from "../components/CustomForm";
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@material-ui/core/styles";

const initialUser = {
    name: "",
    surname: "",
    middleName: "",
    email: "",
    personHash: "",
    password: "",
    blocked: false,
    phoneNumber: "",
    userName: "",
    createdDate: new Date().toISOString()
}

class TestComnonent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entity: null,
            user: initialUser,
            role: "group 1",
            roles: [{ name: 'group 1', ruName: 'группа 1' }, { name: 'group 2', ruName: 'группа 2' }, { name: 'group 3', ruName: 'группа 3'}],
            blockOpen: false,
            smbAvailabilityPeriod: null
        };
    }

    _generatePassword = (newPass) => {
        var small = "abcdefghijklmnopqrstuvwxyz";
        var nonAlpha = "!@#$%^&*()-+<>";
        var big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var nums = "1234567890"
        var chars = small + nonAlpha + big + nums;

        var pass = "";
        for (var x = 0; x < 9; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }

        if (/\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[!@#$%^&*()-+<>]/.test(pass)) {
            if (newPass) {
                this.setState({ newPassword: pass });
            } else {
                this._setField("password", pass);
            }
        } else {
            this._generatePassword.bind(this)(newPass);
        }
    }

    _setField = (name, value, callback) => {
        let userName = name === "userName" ? value : this.state.user.userName;

        let role = name === "role" ? value : this.state.role;
        this.setState({
            role,
            highlightErrors: false,
            blocking: true
        });

        if (["name", "surname", "middleName"].includes(name)) {
            value = value.replace(/\d/g, '');
        }

        if (["name", "surname", "middleName"].includes(name)) {
            userName = "int-";

            let surname = name === "surname" ? value : this.state.user.surname;
            if (surname.length > 0) {
                surname = surname[0].toLowerCase();
            } else {
                surname = ""
            }
            userName += surname

            let fname = name === "name" ? value : this.state.user.name;
            if (fname.length > 0) {
                fname = fname[0].toLowerCase();
            } else {
                fname = ""
            }
            userName += fname;

            let middleName = name === "middleName" ? value : this.state.user.middleName;
            if (middleName.length > 0) {
                middleName = middleName[0].toLowerCase();
            } else {
                middleName = ""
            }
            userName += middleName;
        }

        let user = {
            ...this.state.user,
            [name]: value,
            userName: userName
        };

        this.setState({
            user,
            highlightErrors: false,
            blocking: true
        }, () => callback && callback())

        if (!this.state.user.name) {

            let sendMail = name === "sendMail" ? value : this.state.sendMail;
            this.setState({
                sendMail
            });
        }
    }

    render() {
        let { classes } = this.props;
        return <div>
            <Box display="flex" alignItems="center">
                <Typography variant="h6">
                    Create new entity
                </Typography>
            </Box>
            <CustomForm
                setField={this._setField}
                generatePassword={this._generatePassword}
                entity={this.state.entity}
                classes={classes}
                header="New entity"
                highlightErrors={false}
                formStyles={{ paddingLeft: '16px' }}
                controls={[
                    {
                        label: 'Группа',
                        req: true,
                        type: 'select',
                        value: this.state.role,
                        name: 'role',
                        options: {
                            items: this.state.roles.map(r => ({
                                label: r.name,
                                value: r.ruName
                            }))
                        },
                        isShown: true,
                        onChange: event => this.setState({ role: event.target.value, check: false, blocking: true })
                    },
                    {
                        label: 'Фамилия',
                        req: true,
                        type: 'text',
                        value: this.state.user.surname,
                        name: "surname",
                        isShown: true
                    },
                    {
                        label: 'Имя',
                        req: true,
                        type: 'text',
                        value: this.state.user.name,
                        name: "name",
                        isShown: true
                    },
                    {
                        label: 'Отчество',
                        type: 'chip-input',
                        value: this.state.user.middleName,
                        name: "middleName",
                        isShown: true
                    },
                    {
                        label: 'Логин',
                        req: true,
                        type: 'text',
                        value: this.state.user.userName,
                        name: "userName",
                        disabled: true,
                        tooltip: 'Первоначально формируется системой автоматически на основании заполненного ФИО, однако может быть изменен по усмотрению администратора с учетом следующих требований: уникальность в системе, не менее 3 символов, использование латиницы',
                        isShown: true
                    },
                    {
                        label: 'Пароль',
                        req: true,
                        type: 'password',
                        value: this.state.user.password,
                        name: "password",
                        tooltip: 'Может быть сформирован системой автоматически (по нажатию на кнопку генерации пароля правее) либо задан по усмотрению администратора с учетом следующих требований: не менее 9 символов, наличие не менее 1 цифры, наличие не менее 1 символа высокого регистра, наличие не менее 1 символа низкого регистра, наличие не менее 1 специального символа',
                        isShown: true
                    },
                    {
                        label: 'Контактный телефон',
                        type: 'text',
                        value: this.state.user.phoneNumber,
                        name: "phoneNumber",
                        placeholder: '+7 (123) 456 78 90',
                        isShown: true
                    },
                    {
                        label: 'E-mail',
                        req: true,
                        type: 'text',
                        value: this.state.user.email,
                        name: "email",
                        isShown: true
                    },
                    {
                        label: 'ИД физлица для ЭП',
                        type: 'text',
                        value: this.state.user.personHash,
                        name: "personHash",
                        tooltip: 'Идентификатор физического лица, полученный от лиц, отвечающих за ASPMailer. Используется внутрисистемной логикой в рамках предоставления отчетности, требующей ЭП ответственного сотрудника, а именно: указание в составе *.INFO.XML заданного у пользователя "ИД физлица для ЭП"',
                        isShown: true
                    },
                    {
                        label: 'Статус',
                        type: 'text',
                        value: this.state.user.blocked ? "Блокирован" : "Активен",
                        disabled: true,
                        tooltip: 'При блокировке пользователя (перевод из статуса "Активен" в статус "Блокирован") дальнейший вход в систему для данного пользователя будет недоступен',
                        isShown: true
                    },
                    {
                        label: 'Дата создания',
                        type: 'text',
                        value: ToRuDate(this.state.user.createdDate, true),
                        disabled: true,
                        isShown: true
                    },
                    {
                        label: 'Дата изменения',
                        type: 'text',
                        value: ToRuDate(this.state.user.modified, true),
                        disabled: true,
                        isShown: true
                    },
                    {
                        label: 'Дата уведомления',
                        type: 'date',
                        value: this.state.user.dateOfNotification,
                        placeholder: new Date().toLocaleDateString("ru-RU"),
                        isShown: true,
                        name: 'dateOfNotification'
                    },
                    {
                        label: 'Уведомить по E-mail?',
                        type: 'bool',
                        value: this.state.sendMail,
                        name: "sendMail",
                        isShown: true
                    },
                    {
                        label: 'Период автоматической проверки (мин.)',
                        type: 'number',
                        value: this.state.user.availabilityPeriod,
                        name: "availabilityPeriod",
                        placeholder: 10,
                        inputProps: {min: 0, max: 99},
                        isShown: true
                    },
                    {
                        label: 'Ручная проверка',
                        type: 'button',
                        value: 'Отправить тест',
                        name: 'sendButton',
                        isShown: true
                    }
                ]}
            />
        </div>;
    }
}

const styles = theme => ({
    ...common(theme),
    ...colors(theme),
    flex: {
        display: "flex",
        alignItems: "center",
        marginTop: 10
    },
    option: {
        fontSize: 15
    }
});

export default withStyles(styles)(TestComnonent);