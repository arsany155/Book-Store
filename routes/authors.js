const express = require("express")
const router = express.Router()
const asynchandler = require("express-async-handler")
const { Author , validateCreateauthor , validateUpdateauthor } = require("../models/Author")
const {verifyTokenandAdmin} = require("../middleware/verifyToken")


/** 
* @desc     Get all authors
* @route    /api/authors
* @method   Get
* @access   public
*/ 
// router.get("/" , async (req,res) => {
//     try {
//                                             // .sort({nationality: 1}).select("firstname lastname -_id")   //in the select -_id  means when send the api .... the res will be firstname and the last name only without id
//         const authorList = await Author.find()    
//         res.status(200).json(authorList);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:"something went wrong"})
//     }
// });
router.get("/" , asynchandler(
    async (req,res) => {
        const {pageNumber} = req.query;
        const authorsPerPage = 2;
                                                // .sort({nationality: 1}).select("firstname lastname -_id")   //in the select -_id  means when send the api .... the res will be firstname and the last name only without id
            const authorList = await Author.find().skip((pageNumber -1)*authorsPerPage).limit(authorsPerPage)    
            res.status(200).json(authorList);  
    }        
));



/** 
* @desc     Get all author by id  
* @route    /api/author/:id
* @method   Get 
* @access   public
*/
router.get("/:id" , async (req,res) => {
    try 
    {
        const author = await Author.findById(req.params.id)
                // authors.find(b => b.id === parseInt(req.params.id));  // ay 7aga ba5odha men el url ya string mesh number ....fa fe method bet7wl from string to number esmaha parseInt 

        if(author){
            res.status(200).json(author);
        }else {
            res.status(404).json({message:"author not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"}) 
    }
});




/** 
* @desc     Create a new author 
* @route    /api/authors
* @method   Post
* @access   private (only admin)
*/
router.post("/" , verifyTokenandAdmin , async (req , res) => {

    const { error } = validateCreateauthor(req.body)

    if(error){
        return res.status(400).json({message:error.details[0].message}) // 400 means the problem from client not server
    }

    try {
        const author = new Author({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            nationality: req.body.nationality,
        })
        const result = await author.save()
        res.status(201).json(result) 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"}) //the problem from the server 
    }
})



/** 
* @desc     update
* @route    /api/authors/:id
* @method   Put
* @access   private (only admin)
*/
router.put("/:id" , verifyTokenandAdmin ,  async (req , res) => {
    const { error } = validateUpdateauthor(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message})   
    }

    try 
    {
        const author = await Author.findByIdAndUpdate(req.params.id , {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                nationality: req.body.nationality,
                image: req.body.image
            }
        }, {new: true}) 
        res.status(200).json(author)
    
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})




/** 
* @desc     Delete
* @route    /api/authors/:id
* @method   Delete
* @access   private (only admin)
*/
router.delete("/:id" , verifyTokenandAdmin  , async (req , res) => {

    try 
    {
        const author = await Author.findById(req.params.id); 
        if(author){
            await Author.findByIdAndDelete(req.params.id)
            return res.status(200).json({message: "author has been deleted"})
        }else {
            return res.status(404).json({message: "author not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})




module.exports = router