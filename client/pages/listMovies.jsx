import { useLoader } from "../useLoader";
import { fetchJSONData } from "../http";
import { logout } from "../logout";
import React from "react";

export function ListMovies() {
  const { loading, error, data } = useLoader(async () => {
    return fetchJSONData("/api/movies");
  });

  if (loading) {
    return <div>Loading.... </div>;
  }
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error.toString()}</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <h1>List movies</h1>
      {data.map((movie) => (
        <MovieCard key={movie.title} movie={movie} />
      ))}
    </div>
  );
}
function MovieCard({ movie: { title, plot, year } }) {
  return (
    <>
      <h3>{title}</h3>
      <h4>{year}</h4>
      <div>{plot}</div>
    </>
  );
}
