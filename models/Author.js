const mongoose = require("mongoose");
const Joi = require('joi')

const AuthorSchema = new mongoose.Schema({
    firstname: {
        type: String, // Corrected data type to String
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    lastname: {
        type: String, // Corrected data type to String
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    nationality: {
        type: String, // Corrected data type to String
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    image: {
        type: String,
        default: "default-avatar.png"
    }
}, 
{
    timestamps: true
}
);

//Validate create a new author
function validateCreateauthor(obj){
    const schema = Joi.object({
        firstname: Joi.string().trim().min(3).max(50).required(),
        lastname: Joi.string().trim().min(3).max(50).required(),
        nationality: Joi.string().min(2).max(50).required(),
        image: Joi.string(),
    });
    return schema.validate(obj) 
}

//Validate Update a  author
function validateUpdateauthor(obj){
    const schema = Joi.object({
        firstname: Joi.string().trim().min(3).max(50),
        lastname: Joi.string().trim().min(3).max(50),
        nationality: Joi.string().min(2).max(50),
        image: Joi.string()
    });
    return schema.validate(obj) 
}


const Author = mongoose.model("Author", AuthorSchema);

module.exports = {
    Author,
    validateCreateauthor,
    validateUpdateauthor
};
