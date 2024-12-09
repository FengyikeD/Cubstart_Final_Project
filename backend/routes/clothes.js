const express = require('express');
const router = express.Router();
const Clothes = require('../models/Clothes');

// POST /api/clothes - Add a new clothing item
router.post('/', async (req, res) => {
    try {
        const newClothing = new Clothes(req.body);
        const savedClothing = await newClothing.save();
        res.status(201).json(savedClothing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/clothes - Get all clothes
router.get('/', async (req, res) => {
    try {
        const { tags, sort, order } = req.query;
        let filter = {};
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        const sortOptions = {};
        if (sort) {
            sortOptions[sort] = order === 'desc' ? -1 : 1;
        }

        const clothes = await Clothes.find(filter).sort(sortOptions);
        res.status(200).json(clothes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;