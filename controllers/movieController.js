import connection from "../connection.js"
// import { posts } from "../data/post.js";
import CustomError from "../class/customError.js";

// const { post } = require("../routers/posts.js");

function index(req, res) {
  const sql = "SELECT * FROM `movies`"
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    let data = results;
    const response = {
      totalCount: results.length,
      data,
    };
    res.json(response);
  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
  // const sql = "SELECT * FROM `movies` WHERE `id` = ?";
  const sql = `SELECT movies.*, AVG(reviews.vote) AS vote_average FROM movies
  JOIN reviews ON reviews.movie_id = movies.id
  WHERE movies.id = ?
  GROUP BY reviews.movie_id`;
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    const item = results[0];
    if (!item) {
      return res.status(404).json({ error: "L'elemento non esiste" }
      );
    }
    const sqlReviews = "SELECT * FROM `reviews` WHERE `movie_id` = ?"
    connection.query(sqlReviews, [id], (err, reviews) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      item.reviews = reviews;
      // let film = results;
      // const response = {
      //   Count: reviews.length,
      //   film,
      // };
      res.json(item);
    })
  });
}

function store(req, res) {
  // res.send("Creazione nuovo post");
  let newid = 0;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id > newid) {
      newid = posts[i].id
    }
  }
  newid += 1;

  const newPost = {
    id: newid,
    ...req.body,
    // titolo: req.body.titolo,
    // contenuto: req.body.contenuto,
    // immagine: req.body.immagine,
    // tags: req.body.tags
  };

  posts.push(newPost);
  res.status(201).json(newPost);
}

function storeReviews(req, res) {
  const { id } = req.params;
  //! Verificare che l'id sia valido
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      error: "errore id"
    })
  }
  const { text, name, vote } = req.body
  //! Validazione del body
  if (!text || !name || vote === undefined || isNaN(parseFloat(vote))) {
    return res.status(400).json({
      error: "Richiesta non valida"
    })
  }
  //?query
  const sql = "INSERT INTO reviews (text, name, vote, movie_id) VALUES (?, ?, ?, ?)";

  connection.query(sql, [text, name, vote, id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(201).json({
      message: "review added",
      id: results.insertId,
    });
  });
}

function update(req, res) {
  const id = parseInt(req.params.id);
  const item = posts.find((item) => item.id === id);
  if (item) {
    res.send(`Modifica integrale del post ${id}`);
    for (key in item) {
      if (key !== "id") {
        item[key] = req.body[key];
      }
    }
    res.json(item);
  } else {
    res.status(404);
    res.json({
      success: false,
      message: `Il post ${id} non esiste`,
    });
  }
}

function modify(req, res) {
  const id = parseInt(req.params.id);
  const item = posts.find((item) => item.id === id);
  if (item) {
    res.send(`Modifica parziale del post ${id}`);
  } else {
    res.status(404);
    res.json({
      success: false,
      message: `Il post ${id} non esiste`,
    });
  }
}

function destroy(req, res) {
  const { id } = req.params;
  const sql = "DELETE FROM `movies` WHERE `id` = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.sendStatus(204);
  });
}

export { index, show, store, storeReviews, update, modify, destroy };