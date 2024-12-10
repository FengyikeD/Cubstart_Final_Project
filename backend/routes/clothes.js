const express = require('express');
const router = express.Router();
const Clothes = require('../models/Clothes');
const multer = require('multer');
const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// POST /api/clothes - Add a new clothing item
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image upload failed" });
        }

        const newClothing = new Clothes({
            name: req.body.name,
            brand: req.body.brand,
            color: req.body.color,
            texture: req.body.texture,
            tags: req.body.tags ? req.body.tags.split(",") : [],
            price: req.body.price,
            time_of_purchase: req.body.time_of_purchase,
            needs_dry_washing: req.body.needs_dry_washing === "true",
            image_url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, // Full URL
        });

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

// DELETE /api/clothes/:id - Delete a clothing item by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClothing = await Clothes.findByIdAndDelete(id);

        if (!deletedClothing) {
            return res.status(404).json({ message: "Clothing item not found" });
        }

        res.status(200).json({ message: `Clothing item '${deletedClothing.name}' deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;