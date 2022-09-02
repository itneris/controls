const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => {
    res.send({
        surname: "Тестовый",
        name: "Тест",
        middlename: "Тестович",
        role: "1"
    });
});

app.get('/api/test/getRoles', (req, res) => {
    res.send([
        {
            id: "1",
            label: "Оператор",
        },
        {
            id: "2",
            label: "Администратор",
        }
    ]);
});

app.post('/api/test', (req, res) => {
    res.send({ result: "ok" });
});

app.put('/api/test', (req, res) => {
    res.send({ result: "ok" });
});

app.delete('/api/test', (req, res) => {
    res.send({ result: "ok" });
});


app.listen(port, () => console.log(`Listening on port ${port}`));