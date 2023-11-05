const {Book} = require("./models/Book")
const {Author} = require("./models/Author")

const {books, authors} =require("./data")

const connectToDB = require ("./config/db")
require("dotenv").config()

connectToDB()

//Imports Books in Database
const importBooks = async () =>{
    try {
        await Book.insertMany(books);
        console.log("books imported")
    } catch (error) {
        console.log(error)
        process.exit(1)   //to cut the connection between the database
    }
}

//Imports Authors in Database
const importAuthors = async () =>{
    try {
        await Author.insertMany(authors);
        console.log("Authors imported")
    } catch (error) {
        console.log(error)
        process.exit(1)   //to cut the connection between the database
    }
}


//Remove Books in Database
const removeBooks = async () =>{
    try {
        await Book.deleteMany();
        console.log("books removed")
    } catch (error) {
        console.log(error)
        process.exit(1)   //to cut the connection between the database
    }
}   


if (process.argv[2] === "-import"){
    importBooks()
}else if (process.argv[2] === "-remove") {
    removeBooks()
}else if (process.argv[2] === "-import-authors") {
    importAuthors()
}
