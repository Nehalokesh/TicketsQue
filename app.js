const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const headers = require('./middlewares/header.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const AppError = require('./utils/appError');

const router = require('./router');

const app = express();
dotenv.config({ path: `${__dirname}/config.env` });

app.use(express.json({ limit: '16mb' }));

app.use(helmet());

app.use(headers);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/meta.json', (req, res) => {
    res.json(swaggerDocument);
});


app.use('/api/v1', router);



app.use('*', (req, res, next) => {
    if (req.originalUrl === '/') {
        res.send('Welcome to the server');
    } else {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    }
});



module.exports = app;
