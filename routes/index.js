var express = require("express");
var router = express.Router();
const Book = require("../models").Book; //imports all CRUD ops

//Handles server errors
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
//NoRoute for error handling
router.get(
  "/noroute",
  asyncHandler(async (req, res) => {
    const err = new Error();
    err.message = "Custom 500 error thrown";
    err.status = 500;
    next(err);
  })
);

/* GET home page. */
router.get("/", async (req, res) => {
  res.redirect("/books");
});

/* GET /books - shows the full list of books */
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    res.render("index", { books, title: "book.title" });
  })
);

/* GET /books/new - shows the create book form */
router.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new-book", { book: {}, title: "New Book" });
  })
);

/* POST-Posts a new book to the database /books/new */
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book"
        });
      } else {
        throw error;
      }
    }
  })
);
/* GET /book/:id - Shows book detail form. */
router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update Book" });
    } else {
      const err = new Error();
      err.status = 404;
      next(err);
    }
  })
);

/* POST /books/:id - Updates book info in the database */
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Edit " + book.title,
          id: book.id
        });
      } else {
        throw error;
      }
    }
  })
);

router.get(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("delete", { book, title: "Delete Book" });
  })
);
/* POST deletes book entry. */
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

//ERROR HANDLERS
//404 HANDLER TO CATCH NON EXISTENT ROUTE REQUESTS

router.use((req, res, next) => {
  const err = new Error(); //creating error object
  err.status = 404;
  next(err); //error object is passed to next function
});

//GLOBAL HANDLER
router.use((err, req, res, next) => {
  if (err.status === 404) {
    err.message = "Sorry! We couldn't find the page you were looking for.";
    console.log(err.message);
    res.status(err.status);
    return res.render("page-not-found", { err });
  } else {
    err.message = "Sorry! There was an unexpected error on the server.";
    console.log(err.message);
    return res.status(err.status || 500).render("error", { err });
  }
});

module.exports = router;
