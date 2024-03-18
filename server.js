const app = require('./app');
const connectDatabase = require('./utils/database');

const PORT = process.env.PORT || 80;


connectDatabase()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);// eslint-disable-line
});