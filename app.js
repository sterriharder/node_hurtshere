const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// 라우트 파일 불러오기
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// 라우트 사용
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});