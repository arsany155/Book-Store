const mongoose = require("mongoose");
const Joi = require('joi');    //we use it for validation


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    cover: { 
        type: String,
        required: true,
        enum: ["soft cover" , "hard cover"]
    }
},
{
    timestamps: true
}
)

//Validate create a new book
function validateCreateBook(obj){
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        author: Joi.string().required(),
        description: Joi.string().trim().required(),
        price: Joi.number().min(1).required(),
        cover: Joi.string().valid("soft cover" , "hardcover").required(),
    });
    return schema.validate(obj) 
}

//Validate Update a  book
function validateUpdateBook(obj){
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(50),
        author: Joi.string(),
        description: Joi.string().trim(),
        price: Joi.number().min(1),
        cover: Joi.string().valid("soft cover" , "hardcover")
    });
    return schema.validate(obj) 
}

const Book = mongoose.model("Book" , BookSchema);

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook   
}