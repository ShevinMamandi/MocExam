import { useLoader } from "../useLoader";
import { fetchJSONData } from "../http";
import { logout } from "../logout";
import { Link } from "react-router-dom";
import React from "react";

export function ManageMovies() {
  const { loading, data, error } = useLoader(async () => {
    return await fetchJSONData("/api/login");
  });
  if (loading) {
    return <div>Please wait...</div>;
  }
  if (error) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <div>Profile for: {data.name}</div>
      <br />
      <h1>Movie Database</h1>
      <ul>
        <li>
          <Link to={"/movies/list"}>List movies</Link>
        </li>
        <li>
          <Link to={"/movies/new"}>Add new movie</Link>
        </li>
      </ul>
    </div>
  );
}
