import { connect } from "mongoose";

const connectToDb = async () => {
  try {
    await connect("mongodb://localhost:27017", {
      dbName: "react-native-db",
    }).then(() => {
      console.log("connect to database");
    });
  } catch (err) {
    console.log("Error connecting to database", err);
  }
};
export default connectToDb;
