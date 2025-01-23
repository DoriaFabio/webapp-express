import express from "express";

// middlewares
import errorsHandler from "./middlewares/errorsHandler.js";
import corsPolicy from "./middlewares/corsPolicy.js";
import notFound from "./middlewares/notFound.js";
import moviesRouter from "./routers/movies.js";

const app = express();
const PORT = process.env.PORT || 3000;


//definisco dove sono gli asset statici
app.use(express.static("public")); //http://localhost:5500/

app.use(corsPolicy);

// il body di qualunque richiesta va parsato come application/json
app.use(express.json());

//rotte API
app.use("/movies", moviesRouter);

app.use(errorsHandler);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}}`);
});