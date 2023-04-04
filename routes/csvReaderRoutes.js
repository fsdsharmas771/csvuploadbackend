const express = require("express");
const router = express.Router();
const csvReaderController = require("../controllers/csvReaderController.js");
const multer = require("multer");
const forms = multer({ dest: "upload/" });

/*
 * GET
 */
router.get("/list/files", csvReaderController.listFiles);

/*
 * GET
 */
router.get("/list/rows/:tableId", csvReaderController.getTableRows);

/*
 * POST
 */
router.post("/upload", forms.single("file0"), csvReaderController.create);

/*
 * DELETE
 */
router.delete("/:id", csvReaderController.remove);

module.exports = router;
