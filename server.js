﻿const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const formidable = require('express-formidable');

const app = express();
const port = process.env.PORT || 5000;

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(formidable());

const rolesValues = [
    {
        id: "1",
        label: "Оператор ЭВМ",
    },
    {
        id: "2",
        label: "Оператор установки",
    },
    {
        id: "3",
        label: "Администратор справочников",
    },
    {
        id: "4",
        label: "Администратор пользователей",
    },
    {
        id: "5",
        label: "Системный администратор",
    },
    {
        id: "6",
        label: "Администратор",
    },
    {
        id: "7",
        label: "Дата-менеджер",
    },
    {
        id: "8",
        label: "Дата-аналитик",
    },
    {
        id: "9",
        label: "Дата-инженер",
    }
]

const bigRolesValues = [
    {
        "id": "f868a556-28e2-471f-a8d8-f4191784ea9a",
        "label": "Администраторы конфигураций",
        "inputValue": null,
        "otherAttributes": {
            "custom": "somestring"
        }
    },
    {
        "id": "38edb632-6379-4c00-8c0b-022013b1046f",
        "label": "Администраторы сервиса \"test ad sync service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "b08f89b0-a425-4029-9f03-d394f0eefc8d",
        "label": "Администраторы мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "8deedef3-b02e-42fe-b1cb-2a546942e84c",
        "label": "Участники мероприятия \"Новое мероприятие\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "2eb85a75-6f5d-4fef-ae99-284c8f041031",
        "label": "Участники мероприятия \"Тест на слёт админа\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "a22c6b37-1af8-4e78-85ff-2be8bea50aef",
        "label": "Администраторы мероприятия \"Новое мероприятие\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "d0f6b5f2-ad0a-415e-8e76-57e11b0cb2cc",
        "label": "Участники мероприятия \"уцкцук\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "75d31798-9ded-493c-a3db-30c415e6661a",
        "label": "Администраторы мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "172e85b5-91f0-47c4-a3c0-45ba249321f7",
        "label": "Пользователи сервиса \"новый тестовый сервис\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "65c1ef37-6b7a-49df-b8bf-286273c53169",
        "label": "Участники мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "aa06b1f1-033c-4639-b323-a4fe0451090c",
        "label": "Участники мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "074f4d92-f1e5-4f12-8379-5c1564366fdf",
        "label": "Модераторы контента",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ca0f2632-440b-435c-9f70-fe92d7d6d524",
        "label": "Внутренние менеджеры мероприятий",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "3e83c95d-82cc-4413-929e-c9ba912d5298",
        "label": "Пользователи сервиса \"New service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "795da4bb-36bd-4939-be6d-73a7f9d37107",
        "label": "Пользователи сервиса \"test ad sync service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "13e88db8-27bc-4b6f-9b18-7ac05a72743e",
        "label": "Администраторы сервиса \"Very new service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "4b93bf62-e849-4d25-9596-22b9ea7500d1",
        "label": "Администраторы сервиса \"VNS2\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "aaf55cbe-9af8-4fab-a310-89736ea92774",
        "label": "Пользователи сервиса \"test for sync\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "41482802-3188-4a0a-a035-3d1b1468d55e",
        "label": "Пользователи сервиса \"VNS2\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "3700b9d4-93fa-4869-9efe-10e3a06cf625",
        "label": "Администраторы мероприятия \"тест на слёт админа\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "89b0ef03-324f-423b-95d7-ff0befc942dc",
        "label": "Администраторы сервиса \"vns3\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "0b1bffa8-0c4f-4711-aa2d-61a213514e5d",
        "label": "Администраторы сервиса \"test ad sync service 2\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "431f1942-4f0d-4ed0-8616-1903c7ba21b1",
        "label": "Пользователи сервиса \"test ad sync service 2\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ae37094d-25f5-4fbc-8e20-ddef0b509ba5",
        "label": "Администраторы сервиса \"новый тестовый сервис\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "4bd7f05a-4232-4d3a-a793-b3d045438a86",
        "label": "Администраторы мероприятия \"Тест на слёт админа\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "b41ef50e-2ba5-494e-93ae-ffec158b8863",
        "label": "Администраторы мероприятия \"уцкцук\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "e51bdd2f-b930-4c75-9ee4-94875095d006",
        "label": "Пользователи сервиса \"vns3\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "eb448fe9-1581-42a5-b19b-0a9076dfbc2a",
        "label": "Администраторы сервиса \"Тестовый\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "a0abf6f1-dad4-40e9-b87b-3ee37cb63761",
        "label": "Администраторы сервиса \"Тестовый сервис\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "67b33693-d6ab-4ffa-bacb-c12a52f1a267",
        "label": "Администраторы сервиса \"less sad service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "a74bcc70-d4f4-40e3-8f8b-124a5db90ceb",
        "label": "Пользователи сервиса \"less sad service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "03afec39-8a34-47cd-9e31-40e234e05365",
        "label": "Участники мероприятия \"Тест\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "f96bd091-07a4-416d-b904-771c501b52fa",
        "label": "Администраторы сервиса \"test no ad role\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ca1c65c3-b075-4b34-afcf-736cd2572349",
        "label": "Администраторы сервиса \"sad service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "c2525fe9-aa08-4882-8952-71e8848a4032",
        "label": "Администраторы сервиса \"Тестовый\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ec8f9650-c51c-490f-b8fd-a7794649e192",
        "label": "Пользователи сервиса \"sad service\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "a5099389-601a-4725-9baf-2befde970619",
        "label": "Пользователи сервиса \"Тестовый\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "714c5a9f-0a90-4feb-9ab6-29b7f2648380",
        "label": "Участники мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "df8fcc54-62f0-4f58-adb5-f4956e26ffde",
        "label": "Участники мероприятия \"Новое мероприятие\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "5d944236-91bc-4a35-bd15-0a8737618dea",
        "label": "Администраторы мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ade80412-fe7f-42a2-905e-bda520410e66",
        "label": "Администраторы мероприятия \"мывпывпварцкрп\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "cc17f91b-566c-44f1-87ad-b62a6ff19bbe",
        "label": "Администраторы мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "2fdd88bb-ad59-46d1-b54d-fc4f101fe600",
        "label": "Участники мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "175c3357-833b-409f-bb25-28fc538ea7a7",
        "label": "Администраторы мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "f70c088b-3a69-4c17-bcdb-099b44e5b2df",
        "label": "Участники мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "47af312f-c521-4520-96b2-12ae055c27ea",
        "label": "Администраторы мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "2d543a00-3fee-42cb-ae15-56b2a40c2bdf",
        "label": "Участники мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "ce7cff9e-2ec2-4edd-998a-120bc3527bf2",
        "label": "Администраторы мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "50f190c5-e8a9-4566-9764-eff4ff6f331c",
        "label": "Участники мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "77ba7a4a-fbb8-4573-8240-332aa0b70302",
        "label": "Администраторы мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "dbaeed1b-b982-445f-afa1-23cf7ec83d22",
        "label": "Участники мероприятия \"фывыфвыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "8f832c5c-3f9d-4210-879b-104da16b89e4",
        "label": "Участники мероприятия \"мывпывпварцкрп\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "3fdee2bf-4d71-4924-b4a8-a9c2a571f004",
        "label": "Администраторы мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "8c4f9f66-d380-4b36-b14b-c16e2e8e75fc",
        "label": "Администраторы мероприятия \"Новое мероприятие\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "cda5448c-4f5d-4826-99c0-0076d2ef1a8e",
        "label": "Участники мероприятия \"Тест на группу участников\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "c3830547-4a6c-4372-a642-97eb85c2dd81",
        "label": "Администраторы мероприятия \"ылфталдыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "7ace465f-9bf0-4ba5-87f6-5afc9a47c5d3",
        "label": "Участники мероприятия \"ылфталдыф\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "5b97304d-bf2e-464f-9e5d-2aa746fcaab5",
        "label": "Администраторы мероприятия \"Тест с Атемом\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "3318ef99-0f30-499f-845d-d965fcc63e1c",
        "label": "Администраторы мероприятия \"тестич\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "0c9c716d-e3f5-4c00-874e-c2871efc8318",
        "label": "Операторы пользователей и заявок",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "434f127c-c7e9-4ac9-b5fb-1f027a835da6",
        "label": "Участники мероприятия \"тестич\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "bcd8c803-a2fd-4429-8ecf-9385f7e92a8a",
        "label": "Администраторы мероприятия \"Семинар тест групп AD\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "3b9aa545-e921-49f6-afb6-c8948d7868cc",
        "label": "Участники мероприятия \"Семинар тест групп AD\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "c7fcadac-9151-4cee-9810-bfe223dc372b",
        "label": "Внешние обычные пользователи",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "5614174a-6c9e-4422-96d6-b7d0f7baedc7",
        "label": "Пользователи сервиса \"Тестовый сервис для ролевой модели\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "7581036a-7f6b-4186-ae91-076ac55488d6",
        "label": "Администраторы сервиса \"Тестовый сервис для ролевой модели\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "6f37cd0b-cdd4-4fb5-a96b-28cefc1b052c",
        "label": "Администраторы мероприятия \"Конференция с датой в секциях\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "e76ceb8c-94d7-4b0f-8224-e24cc60b0698",
        "label": "Участники мероприятия \"Конференция с датой в секциях\"",
        "inputValue": null,
        "otherAttributes": {}
    },
    {
        "id": "17c17252-a67b-43b0-8134-15b9dcedd4ae",
        "label": "Пользователи TrueConf",
        "inputValue": null,
        "otherAttributes": {}
    }
]

app.get('/api/test/1', (req, res) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    res.send({
        description: "<html><h1>Description</h1></html>",
        surname: "Тестовый",
        name: "Тест",
        middleName: "Тестович",
        role: "1",
        wysiwyg: '<div style="font-size: 44px">Qwerty</div>',
        role_api: "2",
        blocked: true,
        password: "Qwerty123!",
        visitDate: date.toISOString(),
        visitTime: date.toISOString(),
        visitDateTime: date.toISOString(),
        role_select_multiple: ["1", "2"],
        role_select_multiple_api: ["1", "2"],
        visitCount: 3,
        avatar: {
            id: "some-guid",
            name: "avatar.jpg",
            data: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT70S8WOIl7kxeV70PRR5LuOq7Nr7-lv_GjYB5nCkgw9-vhrGFC"
        },
        note: "some note about user",
        roleValue: rolesValues[0],
        roleValueArray: [rolesValues[0], rolesValues[1]],
        roleValueWithSearch: rolesValues[0]
    });
});

app.get('/api/test/2', (req, res) => {
    res.send({
        id: "1",
        surname: "Тестовый",
        name: "Тест",
        middleName: "Тестович",
        role: "1",
        role_api: "2",
        blocked: true,
        password: "qwerty",
        avatar: {
            name: "avatar.jpg",
            url: "http://localhost/5000/api/file"
        },
        note: "some note about user"
    });
});

app.get('/api/file', (req, res) => {
    res.send(`data:image/jpeg;base64,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`);
}); 

app.get('/api/dicts/roles', async (req, res) => {
    await snooze(1000);
    res.send(rolesValues);
});

app.get('/api/dicts/roles_auto_with_search', async (req, res) => {
    //await snooze(1000);
    res.send([...rolesValues].filter(r => r.label.toLowerCase().includes(req.query["search"].toLowerCase())).splice(0, 2));
});

app.get('/api/dicts/roles_auto', async (req, res) => {
    await snooze(1000);
    res.send([...rolesValues]);
});

app.get('/api/dicts/roles_auto_create', async (req, res) => {
    //await snooze(3000);
    res.send([...bigRolesValues]);
});

app.post('/api/test', async (req, res) => {
    res.status(422);
    res.send({
        detail: "Next error(s) occured:* Нарушение уникального ключа IX_IterServices_Code\r\n",
        status: 422,
        title: "Something went wrong."
    });
    return;
    await snooze(1000);
    res.send({ result: "ok" });
});

app.put('/api/test/:id', async (req, res) => {
    /*res.status(422);
    res.send({
        detail: "Next error(s) occured:* Нарушение уникального ключа IX_IterServices_Code\r\n",
        status: 422,
        title: "Something went wrong."
    });
    return;
    await snooze(1000);*/
    res.send({ result: "ok", data: req.fields.visitDateTime, field: "qwe" });
});

app.delete('/api/test', (req, res) => {
    res.send({ result: "ok" });
});


app.listen(port, () => console.log(`Listening on port ${port}`));