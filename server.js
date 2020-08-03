const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect((err) => {
  if (err) console.log(`mysql err message:${err}`);
});

/////////////////////////
///1~9호선은 이걸로처리///
////////////////////////
app.get('/Subway/:lineNum', (req, res) => {
  console.log('api요청 들어옴');
  const num = req.params.lineNum;
  connection.query(`select * from line${num}`, (err, rows, field) =>
    res.send(rows)
  );
});

app.get('/Subway/airLine', (req, res) => {
  connection.query('select * from airline', (err, rows, field) =>
    res.send(rows)
  );
});

app.post('/SignUp', (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const nick = req.body.nick;
  const gender = req.body.gender;
  const birth = req.body.birth;
  const curDate = new Date();
  connection.query(
    `insert into users values(?,?,?,?,?,?)`,
    [id, pw, nick, birth, curDate, gender],
    (err, rows, field) => {
      res.send(rows);
    }
  );
});
app.listen(port, () => console.log(`server on port ${port}`));
