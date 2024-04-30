import mongoose from "mongoose";
const connection = {};
const uri="mongodb+srv://justarandomdude:%23Cannizzaronew4@cluster0.vriqt0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

            async function connectDb() {
            if (connection.isConnected) {
                console.log("ready database");
                return;
            }

            if (mongoose.connection.lentgh > 0) {
                connection.isConnected = mongoose.connections[0].readyState;
                if (connection.isConnected === 1) {
                    console.log("use previous connection to the database");
                    return;
                }
                await mongoose.disconnect();
            }

            const db = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })

            console.log("new connection to the database")
            connection.isConnected = db.connections[0].readyState;

        }

            async function disconnectDb() {
            if (connection.isConnected) {
                if (process.env.NODE_END === "production") {
                    await mongoose.disconnect();
                    connection.isConnected = false;
                } else {
                    console.log("not disconnected from the database")
                }
            }
        }

            const db = { connectDb, disconnectDb };
        export default db;