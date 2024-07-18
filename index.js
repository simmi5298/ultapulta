import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();


const db = new pg.Client({
  // user: "postgres",
  // host: "localhost",
  // database: "todolist",
  // password: "Simmikedia5@",
  // port: 5432,
  connectionString: process.env.POSTGRES_URL,

});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {

      listTitle: new Date().toLocaleDateString(),
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});




app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("INSERT INTO items(title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET TITLE=($1) WHERE id= $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id=$1", [id]);
    res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }
});

//week post

// Add routes for week and month pages
const day = new Date();
const MILLISECONDS_IN_WEEK = 604800000;
const firstDayOfWeek = 1; // monday as the first day (0 = sunday)
const startOfYear = new Date(day.getFullYear(), 0, 1);
startOfYear.setDate(
  startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7))
);
const dayWeek = Math.round((day - startOfYear) / MILLISECONDS_IN_WEEK) + 1;

app.get("/week", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM weeks ORDER BY id ASC");
    const weekItems = result.rows;

    res.render("week.ejs", {
      listTitle: dayWeek,
      listItems: weekItems,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addWeek", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("INSERT INTO weeks(title) VALUES ($1)", [item]);
    res.redirect("/week");
  } catch (err) {
    console.log(err);
  }

});

app.post("/editWeek", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE weeks SET TITLE=($1) WHERE id= $2", [item, id]);
    res.redirect("/week");
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteWeek", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM weeks WHERE id=$1", [id]);
    res.redirect("/week");
  }
  catch (err) {
    console.log(err);
  }
});

//month post
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const d = new Date();
let name = month[d.getMonth()];
app.get("/month", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM months ORDER BY id ASC");
    const monthItems = result.rows;

    res.render("month.ejs", {
      listTitle: name,
      listItems: monthItems,
    });
  } catch (err) {
    console.log(err);
  }
});



app.post("/addMonth", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("INSERT INTO months(title) VALUES ($1)", [item]);
    res.redirect("/month");
  } catch (err) {
    console.log(err);
  }

});

app.post("/editMonth", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE months SET TITLE=($1) WHERE id= $2", [item, id]);
    res.redirect("/month");
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteMonth", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM months WHERE id=$1", [id]);
    res.redirect("/month");
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
