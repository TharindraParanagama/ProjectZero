//importing modules
import express from "express";
import { db } from "../DB Connection/connection";
import {
  sess,
  requestTracker,
  bp,
  auth,
  validator,
} from "../Middleware/middleware";
import cors from "cors";

//creating a router instance
export const path: any = express.Router();

const config = {
  origin: "http://localhost:3000",
  credentials: true,
};

//using the middleware
path.use(requestTracker);
path.use(bp);
path.use(sess);
path.use(cors(config));

//route to the landing page with a get request
path.get("/", function (req: any, res: any) {});

//route to the login portal with the user credentials to be specified in the
//body of the request
path.post("/login", auth);

//multiple roles
path.get("/role", validator, function (req: any, res: any) {
  if (req.session.role === "admin") {
    res.send("Welcome to admin portal");
  } else if (req.session.role === "vendor") {
    res.send("Welcome to vendor portal");
  } else {
    res.send("Welcome to customer portal");
  }
});

//route to search section
path.get("/search", validator, function (req: any, res: any) {
  db.any("SELECT * FROM book_catalog")
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      res.send(
        "Sorry your search result does not match with any of our records!"
      );
    });
});

//route to obtain the details for all the book supplied by a given supplier
//affiliated with my store
path.get("/author/:author", function (req: any, res: any) {
  let data: any = req.params;

  db.any("SELECT * FROM book_catalog WHERE author=${author}", {
    author: data.author,
  })
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      res.send(
        "Sorry your search result does not match with any of our records!"
      );
    });
});

//route to obtain title of books which is higher that a given supplier rating
path.get("/rating/:supplier_rating", validator, function (req: any, res: any) {
  let url: any = req.params;

  db.any(
    "SELECT title FROM book_catalog INNER JOIN supplier ON book_catalog.supplier_id=supplier.supplier_id WHERE supplier_rating > ${supplier_rating}",
    {
      supplier_rating: url.supplier_rating,
    }
  )
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      res.send("No records found");
    });
});

//filter by title
path.get("/title/:title", validator, function (req: any, res: any) {
  let data: any = req.params;

  db.any("SELECT * FROM book_catalog WHERE title = ${title}", {
    title: data.title,
  })
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      res.send("No records found");
    });
});

path.get("/price/:price", validator, function (req: any, res: any) {
  let data: any = req.params;

  db.any("SELECT title FROM book_catalog WHERE price > ${price}", {
    price: data.price,
  })
    .then((result: any) => {
      res.json(result);
    })
    .catch((error: any) => {
      res.send("No records found");
    });
});

path.post("/signup", function (req: any, res: any) {
  db.none("INSERT INTO members VALUES(${username},${password},${role})", {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  })
    .then((result: any) => {
      res.send("Please login to continue");
    })
    .catch((error: any) => {
      res.send("please input valid information!");
    });
});

//route for new joiners
path.post("/contact", function (req: any, res: any) {
  db.none(
    "INSERT INTO customer_queries(FullName,email,message) VALUES(${FullName},${email},${message})",
    {
      FullName: req.body.name,
      email: req.body.email,
      message: req.body.message,
    }
  )
    .then((result: any) => {
      res.send("Thank You");
    })
    .catch((error: any) => {
      res.send("Please re-check on your inputs!");
    });
});

//route for a session termination
path.get("/logout", function (req: any, res: any) {
  req.session.destroy();
  res.send("logged out");
});
