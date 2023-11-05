const express = require("express")
const router = express.Router()
const {getAllBooks}= require("../controllers/bookController")
const { verifyTokenandAdmin } =require("../middleware/verifyToken.js")
const asynchandler = require("express-async-handler")
const {Book , validateCreateBook , validateUpdateBook} = require ("../models/Book.js")

/** 
* @desc     Get all books 
* @route    /api/books
* @method   Get
* @access   public
*/ 
router.get("/" , getAllBooks);



/** 
* @desc     Get all book by id  
* @route    /api/books/:id
* @method   Get 
* @access   public
*/
router.get("/:id" , asynchandler(async(req,res) => {
        const book = await Book.findById(req.params.id).populate("author");  // ay 7aga ba5odha men el url ya string mesh number ....fa fe method bet7wl from string to number esmaha parseInt 
    
        if(book){
            res.status(200).json(book);
        }else {
            res.status(404).json({message:"book not found"})
        }
    }
));




/** 
* @desc     Create a new book 
* @route    /api/books
* @method   Post
* @access   private (only admin)
*/
router.post("/" , verifyTokenandAdmin, asynchandler(async (req , res) => { 
        const { error } = validateCreateBook(req.body)
    
        if(error){
            return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
        }
    
        const book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.cover,
            }
        )
        const result = await book.save()
        res.status(201).json(result) //201 means created successfully
    }
))



/** 
* @desc     update
* @route    /api/books/:id
* @method   Put
* @access   private (only admin)
*/
router.put("/:id" , verifyTokenandAdmin, asynchandler(async(req , res) => {
        const { error } = validateUpdateBook(req.body);
    
        if(error){
            return res.status(400).json({message:error.details[0].message})   
        }
    
        const book = await Book.findByIdAndUpdate(req.params.id , {
            $set:{
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                price: req.body.price,
                cover: req.body.price
            }
        } , {new: true});
        res.status(200).json(book) 
    
    }
))




/** 
* @desc     Delete
* @route    /api/books/:id
* @method   Delete
* @access   private (only admin)
*/
router.delete("/:id" , verifyTokenandAdmin , asynchandler(async (req , res) => {
        const book = Book.findById(req.params.id); 
        if(book){
            await Book.findByIdAndDelete(req.params.id)
            return res.status(200).json({message: "book has been deleted"})
        }else {
            return res.status(404).json({message: "book not found"})
        }
    }
))




module.exports = router