const express = require('express');
const router = express.Router();
const { User, Address } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().max(100).required(),
        country : yup.string().trim().max(100).required(),
        fullAddress : yup.string().trim().max(500).required(),
        postalCode : yup.string().trim().max(20).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Address.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { country: { [Op.like]: `%${search}%` } },
            { fullAddress: { [Op.like]: `%${search}%` } },
            { postalCode: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await Address.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let address = await Address.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!address) {
        res.sendStatus(404);
        return;
    }
    res.json(address);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let address = await Address.findByPk(id);
    if (!address) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (address.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().max(100,"Title must be at most 100 characters").required("Title is required"),
        country : yup.string().trim().max(100,"Country must be at most 100 characters").required("Country is required"),
        fullAddress : yup.string().trim().max(500,"Full Address must be at most 500 characters").required("Full Address is required"),
        postalCode : yup.string().trim().max(20,"Postal Code must be at most 100 characters").required("Postal Code is required")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Address.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Address was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update address with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let address = await Address.findByPk(id);
    if (!address) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (address.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Address.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Address was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Address with id ${id}.`
        });
    }
});

module.exports = router;