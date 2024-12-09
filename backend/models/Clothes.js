const mongoose = require('mongoose');

const ClothesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: String,
    color: String,
    texture: String,
    tags: [String],
    price: { type: Number, default: null },
    time_of_purchase: { type: Date, default: null },
    needs_dry_washing: { type: Boolean, default: false },
    image_url: { type: String, required: true },
});

module.exports = mongoose.model('Clothes', ClothesSchema);