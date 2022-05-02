import express from "express";
import * as path from "path";
import { MoviesApi } from "./moviesApi.js";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}
const discovery_endpoint =
  "https://accounts.google.com/.well-known/openid-configuration";
app.get("/api/config", (req, res) => {
  res.json({
    response_type: "token",
    client_id:
      "937896651150-boiuk03ppguqobl7v37rjulofn6tejve.apps.googleusercontent.com",
    discovery_endpoint,
  });
});

app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;

  const { userinfo_endpoint } = await fetchJSON(discovery_endpoint);
  const userinfo = await fetch(userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (userinfo.ok) {
    res.json(await userinfo.json());
  } else {
    console.log(`Failed to fetch ${userinfo.status} ${userinfo.statusText}`);
    res.sendStatus(500);
  }
});

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});

const mongodburl = process.env.MONGODB_URL;
if (mongodburl) {
  const client = new MongoClient(mongodburl);
  client
    .connect()
    .then((conn) =>
      app.use(
        "/api/movies",
        MoviesApi(conn.db(process.env.MONGODB_DATABASE || "movie-reference"))
      )
    );
}

app.use(express.static("../client/dist/"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on http://localhost:${server.address().port}`);
});
