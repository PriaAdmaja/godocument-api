const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = 8080;

const app = express();
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const masterRouter = require('./src/routes/index')
app.use(masterRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
