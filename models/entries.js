const { request, response } = require("express");
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connecting to mongoDB");
  })
  .catch((error) => {
    console.log("error connecting to mongoDB", error.message);
  });

const phoneEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
});
phoneEntrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Entry", phoneEntrySchema);
