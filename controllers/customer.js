const Customer = require("../models/customer");
const { User } = require('../models/user');

const createCustomer = async (req, res) => {
    const {
        name,
        business,
        personalPhone,
        businessPhone,
        address,
        email } = req.body;
    try {
        const foundedUser = req.user;
        const newCustomer = new Customer({
            name,
            business,
            personalPhone,
            businessPhone,
            address,
            email,
            saleman: foundedUser._id
        })
        foundedUser.customerId.push(newCustomer._id);
        await foundedUser.save();
        const result = await newCustomer.save();
        res.send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" })
    }
};
const removeCustomer = async (req, res) => {
    const { customerId } = req.body;
    try {
        const foundedCustomer = await Customer.findById(customerId);
        if (!foundedCustomer) return res.status(400).send({ message: "invalid customer" });
        foundedCustomer.status = "inactive";
        const result = await foundedCustomer.save();
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" })
    }
};
const updateCustomer = async (req, res) => {
    const {
        customerId,
        name,
        business,
        personalPhone,
        businessPhone,
        address,
        email } = req.body;
    try {
        const foundedCustomer = await Customer.findById(customerId);
        if (!foundedCustomer || foundedCustomer.status === "inactive")
            return res.status(400).send({ message: "invalid customer" });
        foundedCustomer.name = name;
        foundedCustomer.business = business;
        foundedCustomer.personalPhone = personalPhone;
        foundedCustomer.businessPhone = businessPhone;
        foundedCustomer.address = address;
        foundedCustomer.email = email;
        const result = await foundedCustomer.save();
        res.send(result);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" })
    }
};
const getCustomer = async (req, res) => {
    try {
        const customer = await User.find(req.user._id).populate('customerId');
        res.send(customer);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" });
    }
};
const getAllCustomer = async (req, res) => {
    try {
        const customer = await User.find().populate('customerId');
        res.send(customer);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "something went wrong" });
    }
}

module.exports = {
    createCustomer,
    removeCustomer,
    updateCustomer,
    getCustomer,
    getAllCustomer
};

