const express = require("express")

const helmet = require("helmet")
const cors =require("cors")

const booksPath = require("./routes/books")
const authorsPath = require("./routes/authors")
const authRegister = require("./routes/auth")
const usersPath = require("./routes/users")
const passwordPath = require("./routes/password")
const uploadPath = require("./routes/upload")

const connectTODB = require("./config/db")

const logger = require("./middleware/logger")
const errors = require("./middleware/errors")

const path = require("path")


require("dotenv").config()


//Connection to database
connectTODB()

//helmet & cors
app.use(helmet())
app.use(cors())


//Init app
const app =express();

//Middlewares
app.use(express.json()) //middle ware to be able to convert json file to javascript .... // because when the user write in post method its be written in json file way so express doesn't understand this language cause it is a javascript framework .... so we use this command to make express able to understand json 
app.use(express.urlencoded({extended:false}))//3ashan how mesh by3rf el url ely gay men el view html
app.use(logger)

app.set('view engine', 'ejs');

//static folder
app.use(express.static(path.join(__dirname , "images"))) //for getting the images


//Routes
app.use("/api/books" , booksPath)       
app.use("/api/authors" , authorsPath)
app.use("/api/auth" , authRegister);
app.use("/api/users" , usersPath);
app.use("/password" , passwordPath);    
app.use("/api/upload" , uploadPath);    


// Error handler Middleware
app.use(errors.NotFound);
app.use(errors.errorhandler);




//Running the server
const Port = process.env.Port || 8000;
app.listen(Port , () => console.log(`server is runing ${Port}`))