const express = require("express");
const { authentication } = require("../helpers/authentication");
const { createCustomer, removeCustomer, updateCustomer, getCustomer, getAllCustomer } = require("../controllers/customer");

const router = express.Router();

router.post("/customer/create", authentication(["sale", "admin", "manager"]), createCustomer);

router.post("/customer/remove", authentication(["sale", "admin", "manager"]), removeCustomer);

router.patch("/customer/update", authentication(["sale", "admin", "manager"]), updateCustomer);

router.get("/customer/get", authentication(["sale", "admin", "manager"]), getCustomer);

router.get("/customer/getall", authentication(["admin", "manager"]), getAllCustomer);

module.exports = router;
