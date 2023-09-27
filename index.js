const express = require('express');
require('dotenv').config()
const PORT = 8080

const app = express();

const masterRouter = require('./src/routes/index')
app.use(masterRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
