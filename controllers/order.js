const Service = require("../models/service");
const Order = require("../models/order");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const createOrder = async (req, res) => {
    let { name, service, timeOut, description, bonus } = req.body;
    timeOut = timeOut + " 00:00:00";
    try {
        const newOrder = new Order({
            name,
            service,
            timeOut,
            description,
            status: "active",
            pending: "sent",
            saleman: req.user._id,
            bonus
        });
        const result = await newOrder.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.query;
    const { name, service, timeOut, description } = req.body;
    try {
        const foundedOrder = await Order.findById(id);
        if (!foundedOrder)
            return res.status(400).send({ message: "invalid order" });
        foundedOrder.name = name;
        foundedOrder.service = service;
        foundedOrder.timeOut = timeOut;
        foundedOrder.description = description;
        const result = await foundedOrder.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.query;
    try {
        const foundedOrder = await Order.findById(id);
        if (!foundedOrder || foundedOrder.status === "inactive")
            return res.status(400).send({ message: "invalid order" });
        foundedOrder.status = "inactive";
        const result = await foundedOrder.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};

const getOrder = async (req, res) => {
    try {
        const foundedOrder = await Order.find({ "saleman": req.user._id, "status": "active" });
        res.send(foundedOrder);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};
const getAllOrder = async (req, res) => {
    const user = req.user._id;
    try {
        const foundedOrder = await Order.find({ "status": "active" });
        res.send(foundedOrder);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};

const forDev = async (req, res) => {
    const { id } = req.query;
    const { pending } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const foundedOrder = await Order.findById(id).populate("saleman").session(session);
        const foundedUser = await User.findById(foundedOrder.saleman).session(session);
        if (!foundedOrder)
            return res.status(400).send({ message: "invalid Order" });
        if (pending === "complete") {
            foundedUser.salary += foundedOrder.bonus;
            await foundedUser.save();
        };
        foundedOrder.pending = pending;
        const result = await foundedOrder.save();
        await session.commitTransaction();
        session.endSession();
        res.send(result);
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({ message: "somthing went wrong" });
    }
};

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    getAllOrder,
    forDev
}

