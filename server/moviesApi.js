import express from "express";
export function MoviesApi(db) {
    const api = express.Router();

    api.get("/", async (req, res) => {
        const movies = await db
            .collection("movies")
            .find({})
            .map(({ title, plot, year }) => ({ title, plot, year}))
            .toArray();
        res.json(movies);
    });

    api.post("/", (req, res) => {
        const { title, plot, year } = req.body;
        movies.push({ title, plot, year });
        db.collection("movies").insertOne({ title, plot, year });
        res.sendStatus(204);
    });
    return api;
}