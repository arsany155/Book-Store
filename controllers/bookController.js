const asynchandler = require("express-async-handler")
const {Book , validateCreateBook , validateUpdateBook} = require ("../models/Book.js")


const getAllBooks = asynchandler(async (req,res) => {
    const {minPrice , maxPrice} =req.query
    
    let booklist;

    if (minPrice && maxPrice)
    {
        booklist = await Book.find({ price:{$gte: minPrice , $lte: maxPrice} }).populate("author" , ["_id" , "firstname" , "lastname"])
    }
    else 
    {
        booklist = await Book.find().populate("author" , ["_id" , "firstname" , "lastname"])
    }
        res.status(200).json(booklist);  
}
)


module.exports ={
    getAllBooks,

}