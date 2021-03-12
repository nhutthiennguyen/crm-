const express = require("express");
const { createService, updateService, deleteService, getService } = require("../controllers/service");
const { authentication } = require("../helpers/authentication");

const router = express.Router();

router.post("/service/create", authentication(["admin"]), createService);

router.patch("/service/update", authentication(["admin"]), updateService);

router.post("/service/delete", authentication(["admin"]), deleteService);

router.get("/service/get", authentication(), getService)



module.exports = router;