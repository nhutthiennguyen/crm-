const express = require("express");
const { createOrder, updateOrder, deleteOrder, getOrder, getAllOrder, forDev } = require("../controllers/order");
const { authentication } = require("../helpers/authentication");

const router = express.Router();

router.post("/order/create", authentication(["sale", "admin", "manager"]), createOrder);

router.patch("/order/update", authentication(["sale", "admin", "manager"]), updateOrder);

router.delete("/order/delete", authentication(["sale", "admin", "manager"]), deleteOrder);

router.get("/order/get", authentication(["sale", "admin"]), getOrder);

router.get("/order/getall", authentication(["dev", "admin", "manager"]), getAllOrder);

router.post("/order/fordev", authentication(["dev", "admin"]), forDev);
module.exports = router;

