const mongoose = require("mongoose");

class DatabaseSingleton {
    constructor() {
        this.connection = null;
    }

    async connectDatabase() {
        try {
            if (!this.connection) {
                mongoose.set("strictQuery", false);
                this.connection = await mongoose.connect(process.env.MONGO_URI);
                console.log(`MongoDB connected: ${this.connection.connection.host}`); //eslint-disable-line no-console
            }
            return this.connection;
        } catch (error) {
            console.error(error); //eslint-disable-line no-console
            process.exit(1);
        }
    }
}

// Create a single instance of the DatabaseSingleton class
const databaseSingleton = new DatabaseSingleton();

// Export a function that calls connectDatabase on the singleton instance
module.exports = () => databaseSingleton.connectDatabase();
