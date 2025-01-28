import express from "express"
const router = express.Router();

import {
    index,
    show,
    store,
    storeReviews,
    update,
    modify,
    destroy,
} from "../controllers/movieController.js";

// index
router.get("/", index);

// leggere un solo post - Read one - Show
router.get("/:id", show);

//Create - Store
router.post("/", store);

//Create - StoreReview
router.post("/:id/reviews", storeReviews);

//Update totale - Update
router.put("/:id", update);

//Update parziale - Modify
router.patch("/:id", modify);

//Delete (cancellazione) - Destroy
router.delete("/:id", destroy);

export default router;