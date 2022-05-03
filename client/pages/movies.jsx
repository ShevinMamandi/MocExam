import { Route, Routes } from "react-router-dom";
import { ListMovies } from "./listMovies";
import { AddMovie } from "./addMovie";
import React from "react";
import { fetchJSONData } from "../http";

export function Movies() {
  async function listMovies() {
    return await fetchJSONData("/api/movies");
  }
  return (
    <Routes>
      <Route path={"/list"} element={<ListMovies listMovies={listMovies} />} />
      <Route path={"/new"} element={<AddMovie />} />
    </Routes>
  );
}
