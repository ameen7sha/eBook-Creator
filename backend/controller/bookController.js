const Book = require('../models/Book');

const createBook = async (req, res)=>{
    try{
        const { title, author, subtitle, chapters } = req.body;
        if(!title || !author){
            return res.status(400).json({ message: "Please provide a title and the author name!"});
        }

        const book = await Book.create({
            userID: req.user._id,
            title,
            author,
            subtitle,
            chapters,
        });

        res.status(201).json(book);
    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

const getBooks = async (req, res)=>{
    try{
        const books = await Book.find({ userID: req.user._id }).sort({ createdAt: -1});
        res.status(200).json(books);
    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

const getBookById = async (req, res)=>{
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({ message: "Book not found!" });
        }

        if(book.userID.toString() !== req.user._id.toString()){
            return res.status(400).json({ message: "No authorisation to view this Book!"});
        }
        
        return res.status(200).json(book);
    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

const updateBook = async (req, res)=>{
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({ message: "Book not found!"});
        }

        if(book.userID.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized!"});
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedBook);
    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

const deleteBook = async (req, res)=>{
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({ message: "Book not found!" });
        }
        if(book.userID.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized!"});
        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully"});

    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

const updateBookCover = async (req, res)=>{
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({ message: "Book not found!" });
        }
        if(book.userID.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized!"});
        }

        if(req.file){
            book.coverImage = `${req.file.path}`;
        }else{
            return res.status(400).json({ message: "No Image provided"});
        }

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    }
    catch(err){
        res.status(500).json({ message: "Server error!"});
        console.error(err);
    }
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover
}