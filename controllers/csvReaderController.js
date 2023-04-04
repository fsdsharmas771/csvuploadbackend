const { ObjectId } = require("bson");
const CsvreaderModel = require("../models/csvReaderModel.js");
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");

/**
 * csvReaderController.js
 *
 * @description :: Server-side logic for managing csvReaders.
 */
module.exports = {
  listFiles: async function (req, res) {
    const result = await CsvreaderModel.find({}, { data: 0 });
    return res.status(200).json({ data: result, count: result.length });
  },

  /**
   * csvReaderController.getTableRows()
   */
  getTableRows: async function (req, res) {
    let _id;
    try {
      _id = req.params.tableId;
    } catch {
      return res.status(400).json({ message: "Id provided is not valid" });
    }

    const desiredRecord = await CsvreaderModel.findById(_id);

    if (!desiredRecord) {
      return res
        .set(404)
        .json({ message: "Record not found with the given id." });
    }

    const { page = 1 } = req.query;
    const result = await CsvreaderModel.find(
      { _id },
      {
        data: {
          $slice: [(page - 1) * 100, 100],
        },
      }
    );

    return res.json({ data: result[0].data });
  },

  /**
   * csvReaderController.create()
   */
  create: async function (req, res) {
    try {
      if (req.file.mimetype?.split("/").pop() !== "csv") {
        res.status(400).json({ message: "Uploaded file is not of type csv!" });
      }

      const fileData = [];
      fs.createReadStream(
        path.resolve(__dirname, "../upload", req.file.filename)
      )
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => console.error(error))
        .on("data", (row) => fileData.push(row))
        .on("end", async () => {
          const newRecord = new CsvreaderModel({
            fileName: req.file.originalname,
            data: fileData,
          });

          const result = await newRecord.save();
          return res.status(201).json({ _id: result._id, success: true });
        });

      // fs.unlink(
      //   path.resolve(__dirname, "../upload", req.file.filename),
      //   function (err) {
      //     if (err) throw err;
      //     console.log("File deleted!");
      //   }
      // );
    } catch (e) {
      return res.status(500).json({
        error: {
          message: e.message || "Something went wrong.",
        },
      });
    }
  },

  /**
   * csvReaderController.remove()
   */
  remove: async function (req, res) {
    const id = req.params.id;
    let a = await CsvreaderModel.findByIdAndDelete(id);
    console.log(a);
    return res.status(200).json({
      message:'Document Deleted',
      // deletedDocument:csv
    });
    // await CsvreaderModel.findOneAndDelete({id:id},function(err,csv){
    //   if(err){console.log('Error in finding csv during deleting:',err); return}
    //   return res.status(200).json({
    //     message:'Document Deleted',
    //     deletedDocument:csv
    //   });
    // });
    // console.log(csv);
    // return res.status(200).json({
    //   message:'checked'
    // });

    // CsvreaderModel.findByIdAndRemove(id, function (err, csvReader) {
    //   if (err) {
    //     return res.status(500).json({
    //       message: "Error when deleting the csvReader.",
    //       error: err,
    //     });
    //   }

    //   return res.status(204).json();
    
  },
};
