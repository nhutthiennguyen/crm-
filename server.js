require("./db/db");
const express = require("express");
const config = require("config");
const PORT = config.get("PORT");
const bodyParser = require("body-parser");
const path = require("path");
const userRouter = require("./routers/user");
const customerRouter = require("./routers/customer");
const serviceRouter = require("./routers/service");
const orderRouter = require("./routers/order");
const uploadRouter = require("./routers/upload");
const app = express();

app.use(bodyParser.json());



app.use("/img", express.static(path.join(__dirname, "img")));

app.use(userRouter);

app.use(customerRouter);

app.use(serviceRouter);

app.use(uploadRouter);

app.use(orderRouter);

app.listen(PORT, () => {
  console.log("listening");
});
