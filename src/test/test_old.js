import React, { Component } from "react";
import {
    Typography,
    Box,
    Button,
    Paper
} from "@mui/material";
import { Save } from "@mui/icons-material";
import common from "../common/styles";
import colors from "../common/colors";
import CustomForm from "../components/CustomForm";
import PageTitle from '../components/PageTitle';
import Modal from '../components/Modal';
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@mui/styles";
import HtmlTooltip from "../components/HtmlTooltip";
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import DatePicker from '../components/DatePicker';
import EditDrawer from '../components/EditDrawer';
import { useTheme } from "@emotion/react";

const initialUser = {
    name: "",
    surname: "",
    middleName: "Петрович",
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
            role: 'группа 1',
            roles: [{ name: 'группа 1', ruName: 'группа 1'}, { name: 'группа 2', ruName: 'группа 2'}, { name: 'группа 3', ruName: 'группа 3'}],
            blockOpen: false,
            smbAvailabilityPeriod: null,
            openModal: false,
            dateExample: null,
            openDrawer: false
        };
    }

    _setField = (name, value, callback) => {
        let userName = name === "userName" ? value : this.state.user.userName;

        let role = name === "role" ? value : this.state.role;
        this.setState({
            role,
            highlightErrors: false,
            blocking: true
        });

        if(name === "surname"){
            this.setState({
                surname: value
            });
        }

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
            <PageTitle title="PageTitle: Create new entity"/>
            <CustomForm
                classes={classes}
                header="New entity"
                highlightErrors={this.state.check}
                formStyles={{ paddingLeft: '16px' }}
                labelWidth={false}
                values={this.state}
                onChange={this._setField}
                controls={[
                    {
                        label: 'Select control',
                        req: true,
                        type: 'select',
                        value: this.state.role,
                        name: "role",
                        options: {
                            items: this.state.roles.map(r => ({
                                label: r.name,
                                value: r.ruName
                            })),
                            onChange: event => this.setState({ role: event.target.value, check: false, blocking: true })
                        },
                        isShown: true
                    },
                    {
                        label: 'Text control',
                        req: true,
                        type: 'text',
                        value: this.state.user.surname,
                        name: "surname",
                        isShown: true
                    },
                    {
                        label: 'Chip-input control',
                        type: 'chip-input',
                        value: this.state.user.middleName ? this.state.user.middleName.split(",") : [],
                        name: "middleName",
                        isShown: true
                    },
                    {
                        label: 'Password control',
                        req: true,
                        type: 'password',
                        value: this.state.user.password,
                        name: "password",
                        options: {
                            buttonTooltip: 'Сгенерировать новый пароль',
                            passwordLength: 10
                        },
                        //tooltip: 'Может быть сформирован системой автоматически (по нажатию на кнопку генерации пароля правее) либо задан по усмотрению администратора с учетом следующих требований: не менее 9 символов, наличие не менее 1 цифры, наличие не менее 1 символа высокого регистра, наличие не менее 1 символа низкого регистра, наличие не менее 1 специального символа',
                        isShown: true
                    },
                    {
                        label: 'Text control (disabled)',
                        type: 'text',
                        value: ToRuDate(this.state.user.createdDate, true),
                        disabled: true,
                        isShown: true
                    },
                    {
                        label: 'Date control',
                        type: 'date',
                        value: this.state.user.dateOfNotification,
                        placeholder: new Date().toLocaleDateString("ru-RU"),
                        options: {
                            minDate: new Date('01.01.1970'),
                            maxDate: new Date('01.01.2022')
                        },
                        isShown: true,
                        name: 'dateOfNotification'
                    },
                    {
                        label: 'Bool control',
                        type: 'bool',
                        value: this.state.sendMail,
                        name: "sendMail",
                        isShown: true
                    },
                    {
                        label: 'Number control',
                        type: 'number',
                        value: this.state.user.availabilityPeriod,
                        name: "availabilityPeriod",
                        placeholder: '10',
                        options: {
                            inputProps: { min: 0, max: 99 },
                        },
                        isShown: true
                    },
                    {
                        label: 'Button control',
                        type: 'button',
                        value: 'Отправить тест',
                        name: 'sendButton',
                        isShown: true,
                    }
                ]}
            />
            <Box display="flex" justifyContent="flex-end" mr={5} ml={5}>
                <Button
                    startIcon={<Save />}
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        if  (this.state.role === "" ||
                            this.state.user.surname === "" ||
                            this.state.user.password === "") {
                            this.setState({
                                check: true
                            });
                            return;
                        }
                    }}
                >Сохранить</Button>
            </Box>
                <Paper sx={{marginTop: 2}}>
                    <Box display="flex" flexDirection='column' p={2} gap={2}>
                        <Box display="flex" flexDirection='row' gap={2}>
                            <Typography variant="h6">Modal: </Typography>
                            <Button variant="contained" 
                                onClick={() => this.setState({openModal: true})}>
                                Open modal
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection='row' gap={2}>
                            <Typography variant="h6">Drawer: </Typography>
                            <Button variant="contained"  
                                onClick={() => this.setState({openDrawer: true})}>
                                Open drawer
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection='row' gap={2}>
                            <Typography variant="h6">HtmlTooltip: </Typography>
                            <HtmlTooltip title="HtmlTooltip">
                                <AddModeratorIcon/>
                            </HtmlTooltip>
                        </Box>
                        <Box display="flex" flexDirection='row' gap={2}>
                            <Typography variant="h6">DatePicker: </Typography>
                            <DatePicker value={this.state.dateExample} 
                            onChange={(value) => this.setState({
                                dateExample: value
                            })}/>
                        </Box>
                    </Box>
                </Paper>
            <Modal title="Модальное окно" 
                open={this.state.openModal} 
                contentText="this is content text" 
                onClose={() =>
                    this.setState({openModal: false})
                }
                onCancel={() => {
                    alert("onCancel modal click");
                }} 
                onOk={() => {
                    alert("OnOk modal click");
                    }}
                okBtnText="Okey btn text"/>
            <EditDrawer title="Drawer title"
                open={this.state.openDrawer}
                onClose={() =>
                    this.setState({openDrawer: false})
                }
                buttons={[{tooltip: "Drawer button", icon: <AddModeratorIcon/>,color: "primary", onClick: () => alert("Button clicked")}]}>
                    <Box px={2}>
                        <PageTitle title="Children"/>
                        <DatePicker value={this.state.dateExample} 
                            onChange={(value) => this.setState({
                                dateExample: value
                            })}/>
                    </Box>
            </EditDrawer>
        </div>;
    }
}

export default TestComnonent;