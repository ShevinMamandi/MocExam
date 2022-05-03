import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginCallback() {
  const [error, setError] = useState();
  const navigate = useNavigate();
  useEffect(async () => {
    const { access_token, error, error_description } = Object.fromEntries(
      new URLSearchParams(window.location.hash.substring(1))
    );
    if (error || error_description) {
      setError(`Error: ${error} ${error_description}`);
      return;
    }

    if (!access_token) {
      setError("Missing access token");
      return;
    }
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