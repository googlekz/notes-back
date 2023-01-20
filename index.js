const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const urlHelper = require('./routes');

const port = config.port;
const index = express();

index.use(cors());
index.use(bodyParser.json());
index.use(
    bodyParser.urlencoded({
        extends: true,
    })
)

index.listen(port, () => {
    console.log(`app running on port ${port}.`);
})

urlHelper.setRequestUrl(index);
