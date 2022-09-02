import React, { useCallback, useState } from "react";
import {
    Typography,
    Box,
    Button,
    Paper
} from "@mui/material";
import { Save } from "@mui/icons-material";
import CustomForm from "../components/CustomForm";
import PageTitle from '../components/PageTitle';
import Modal from '../components/Modal';
import { ToRuDate } from "../utils/utils";
import HtmlTooltip from "../components/HtmlTooltip";
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import DatePicker from '../components/DatePicker';
import EditDrawer from '../components/EditDrawer';

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
    availabilityPeriod: null,
    createdDate: new Date().toISOString()
}

const initialCustomFormData = {
    role: 'группа 1',
    user: initialUser,
    sendMail: '',
    middleName: '',
}

const TestComnonent = () => {

    const roles = [{ name: 'группа 1', ruName: 'группа 1' }, { name: 'группа 2', ruName: 'группа 2' }, { name: 'группа 3', ruName: 'группа 3' }];

    const [openModal, setOpenModal] = useState(false);
    const [dateExample, setDateExample] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [customFormData, setCustomFormData] = useState(initialCustomFormData);
    const [highlightErrors, setHighlightErrors] = useState(null);

    const handleChange = useCallback((field, value) => {
        if(['dateOfNotification', 'dateOfNotification', "password", "middleName", "surname", "availabilityPeriod"].includes(field)){
            setCustomFormData({
                ...customFormData,
                user: {
                    ...customFormData.user,
                    [field]: value
                }
            });
        }
        else{
            setCustomFormData({
                ...customFormData,
                [field]: value
            });
        }  
    }, [customFormData, setCustomFormData]);

    return <div>
        <PageTitle title="PageTitle: Create new entity" />
        <CustomForm
            header="New entity"
            highlightErrors={highlightErrors}
            formStyles={{ paddingLeft: '16px' }}
            labelWidth={false}
            values={customFormData}
            onChange={handleChange}
            controls={[
                {
                    label: 'Select control',
                    req: true,
                    type: 'select',
                    value: customFormData.role,
                    name: "role",
                    options: {
                        items: roles.map(r => ({
                            label: r.name,
                            value: r.ruName
                        })),
                        onChange: event => () => {
                            setCustomFormData({
                                ...customFormData,
                                role: event.target.value,
                                highlightErrors: false
                            });
                        }
                    },
                    isShown: true
                },
                {
                    label: 'Text control',
                    req: true,
                    type: 'text',
                    value: customFormData.user.surname,
                    name: "surname",
                    isShown: true
                },
                {
                    label: 'Chip-input control',
                    type: 'chip-input',
                    value: customFormData.user.middleName ? customFormData.user.middleName.split(",") : [],
                    name: "middleName",
                    isShown: true
                },
                {
                    label: 'Password control',
                    req: true,
                    type: 'password',
                    value: customFormData.user.password,
                    name: "password",
                    options: {
                        buttonTooltip: 'Сгенерировать новый пароль',
                        passwordLength: 10
                    },
                    isShown: true
                },
                {
                    label: 'Text control (disabled)',
                    type: 'text',
                    value: ToRuDate(customFormData.user.createdDate, true),
                    disabled: true,
                    isShown: true
                },
                {
                    label: 'Date control',
                    type: 'date',
                    value: customFormData.user.dateOfNotification,
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
                    value: customFormData.sendMail,
                    name: "sendMail",
                    isShown: true
                },
                {
                    label: 'Number control',
                    type: 'number',
                    value: customFormData.user.availabilityPeriod,
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
                    if (customFormData.role === "" ||
                        customFormData.user.surname === "" ||
                        customFormData.user.password === "") {
                            highlightErrors(true);
                            return;
                    }
                }}
            >Сохранить</Button>
        </Box>
        <Paper sx={{ marginTop: 2 }}>
            <Box display="flex" flexDirection='column' p={2} gap={2}>
                <Box display="flex" flexDirection='row' gap={2}>
                    <Typography variant="h6">Modal: </Typography>
                    <Button variant="contained"
                        onClick={() => {
                            setOpenModal(true);
                        }}>
                        Open modal
                    </Button>
                </Box>
                <Box display="flex" flexDirection='row' gap={2}>
                    <Typography variant="h6">Drawer: </Typography>
                    <Button variant="contained"
                        onClick={() => {
                            setOpenDrawer(true);
                        }}>
                        Open drawer
                    </Button>
                </Box>
                <Box display="flex" flexDirection='row' gap={2}>
                    <Typography variant="h6">HtmlTooltip: </Typography>
                    <HtmlTooltip title="HtmlTooltip">
                        <AddModeratorIcon />
                    </HtmlTooltip>
                </Box>
                <Box display="flex" flexDirection='row' gap={2}>
                    <Typography variant="h6">DatePicker: </Typography>
                    <DatePicker value={dateExample}
                        onChange={(value) => {
                            setDateExample(value);
                        }} />
                </Box>
            </Box>
        </Paper>
        <Modal title="Модальное окно"
            open={openModal}
            contentText="this is content text"
            onClose={() => {
                setOpenModal(false);
            }}
            onCancel={() => {
                alert("onCancel modal click");
            }}
            onOk={() => {
                alert("OnOk modal click");
            }}
            okBtnText="Okey btn text" />
        <EditDrawer title="Drawer title"
            open={openDrawer}
            onClose={() => {
                setOpenDrawer(false);
            }}
            buttons={[{ tooltip: "Drawer button", icon: <AddModeratorIcon />, color: "primary", onClick: () => alert("Button clicked") }]}>
            <Box px={2}>
                <PageTitle title="Children" />
                <DatePicker value={dateExample}
                    onChange={(value) => {
                        setDateExample(value);
                    }} />
            </Box>
        </EditDrawer>
    </div>;
}

export default TestComnonent;