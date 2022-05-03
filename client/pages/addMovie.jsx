import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../http";
import { logout } from "../logout";

export function AddMovie() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await fetchJSON("/api/movies", {
      method: "post",
      json: { title, year, plot },
    });
    setTitle("");
    setYear("");
    setPlot("");
    navigate("/movies/list");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <h1>Add Movie</h1>
      <div>
        Title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        Year:
        <input value={year} onChange={(e) => setYear(e.target.value)} />
      </div>
      <div>Plot:</div>
      <div>
        <textarea value={plot} onChange={(e) => setPlot(e.target.value)} />
      </div>
      <button>Submit</button>
    </form>
  );
}
