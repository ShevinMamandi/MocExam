import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { fetchJSON, fetchJSONData } from "./http";
import { useLoader } from "./useLoader";
import { ManageMovies } from "./pages/manageMovies";
import { LoginCallback } from "./loginCallback";
import { FrontPage } from "./pages/frontPage";
import { Movies } from "./pages/movies";

function Login() {
  const { discovery_endpoint, client_id, response_type, scope } =
    useContext(LoginContext);
  useEffect(async () => {
    const { authorization_endpoint } = await fetchJSONData(discovery_endpoint);

    const parameters = {
      response_type,
      client_id,
      scope,
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
