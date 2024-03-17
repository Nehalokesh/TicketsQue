const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        title: 'Tickets Que Assessment API Documentation',
        description: 'Description'
    },
    host: process.env.SWAGGER_HOST,
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: "JWT token obtained from login"
        }
    }
};

const outputFile = './swagger-output.json'
const routes = ['./router'];

swaggerAutogen(outputFile, routes, doc).then(() => {
    require('./app').default; //compliant
}).catch((err) => {
    throw new Error(err)
})
