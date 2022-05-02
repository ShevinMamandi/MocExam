import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { fetchJSON } from "./http";
import { useLoader } from "./useLoader";

function FrontPage() {
  return (
    <div>
      <h1>Login</h1>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </div>
  );
}

function ManageMovies() {
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

function MovieCard({ movie: { title, plot, year } }) {
  return (
    <>
      <h3>{title}</h3>
      <h4>{year}</h4>
      <div>{plot}</div>
    </>
  );
}

function ListMovies() {
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
      <h1>List movies</h1>
      {data.map((movie) => (
        <MovieCard key={movie.title} movie={movie} />
      ))}
    </div>
  );
}

function AddMovie() {
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

function Movies() {
  return (
    <Routes>
      <Route path={"/list"} element={<ListMovies />} />
      <Route path={"/new"} element={<AddMovie />} />
    </Routes>
  );
}

async function fetchJSONData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

function Login() {
  const { discovery_endpoint, client_id, response_type } =
    useContext(LoginContext);
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSONData(discovery_endpoint);

    const parameters = {
      response_type,
      client_id,
      scope: "email profile",
      redirect_uri: window.location.origin + "/login/callback",
    };

    window.location.href =
      authorization_endpoint + "?" + new URLSearchParams(parameters);
  }, []);

  return (
    <div>
      <h1>Please wait....</h1>
    </div>
  );
}

function LoginCallback() {
  const [error, setError] = useState();
  const navigate = useNavigate();
  useEffect(async () => {
    const { access_token } = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1))
    );
    console.log(access_token);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ access_token }),
    });
    if (res.ok) {
      navigate("/manageMovies");
    } else {
      setError(`Failed POST /api/login: ${res.status} ${res.statusText}`);
    }
  });

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error}</div>
      </div>
    );
  }
  return <h1>Please wait...</h1>;
}

const LoginContext = React.createContext();
function Application() {
  const { loading, error, data } = useLoader(() => fetchJSON("/api/config"));
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <LoginContext.Provider value={data}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<FrontPage />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/login/callback"} element={<LoginCallback />} />
          <Route path={"/manageMovies"} element={<ManageMovies />} />
          <Route path={"/movies/*"} element={<Movies />} />
        </Routes>
      </BrowserRouter>
    </LoginContext.Provider>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
