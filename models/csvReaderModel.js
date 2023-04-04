const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(
    "mongodb+srv://sharmas771:rCelcH9bcc2Q7bpI@cluster0.qryqz76.mongodb.net/CSVUpload",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error while connecting to the database", err);
  });

const csvReaderSchema = new Schema(
  {
    fileName: String,
    data: Array,
  },
  { strict: false }
);

module.exports = mongoose.model("csvReader", csvReaderSchema);
