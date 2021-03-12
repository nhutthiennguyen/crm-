const Service = require("../models/service");
const createService = async (req, res) => {
    let { name, price, description, timeout, bonus } = req.body;
    try {
        const foundedService = await Service.find({ name });
        if (foundedService.length > 0)
            return res.status(400).send({ message: "service had already existed" });
        const newService = new Service({
            name,
            price,
            description,
            createDay: new Date,
            timeout,
            bonus: (typeof bonus === "number") ? bonus : price * parseInt(bonus) / 100,
            status: "active"
        })
        const result = await newService.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" })
    }
};
const updateService = async (req, res) => {
    const { id } = req.query;
    const { name, price, description, timeout, bonus } = req.body;
    try {
        const foundedService = await Service.findById(id);
        if (!foundedService) return res.status(400).send({ message: "invalid services" });
        foundedService.name = name;
        foundedService.price = price;
        foundedService.description = description;
        foundedService.timeout = timeout;
        foundedService.bonus = bonus;
        const result = await foundedService.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};
const getService = async (req, res) => {
    const { id } = req.query;
    try {
        const foundedService = await Service.find({ status: "active" })
        if (!foundedService)
            return res.status(400).send({ message: "service" });
        res.send(foundedService);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};
const deleteService = async (req, res) => {
    const { id } = req.query;
    try {
        const foundedService = await Service.findById(id);
        if (!foundedService || foundedService.status === "inactive")
            return res.status(400).send({ message: "invalid service" });
        foundedService.status = "inactive";
        const result = await foundedService.save();
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong" });
    }
};

module.exports = {
    createService,
    updateService,
    deleteService,
    getService
};