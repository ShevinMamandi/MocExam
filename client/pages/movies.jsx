import { Route, Routes } from "react-router-dom";
import { ListMovies } from "./listMovies";
import { AddMovie } from "./addMovie";
import React from "react";

export function Movies() {
  return (
    <Routes>
      <Route path={"/list"} element={<ListMovies />} />
      <Route path={"/new"} element={<AddMovie />} />
    </Routes>
  );
}
