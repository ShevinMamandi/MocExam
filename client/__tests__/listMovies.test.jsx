import { ListMovies } from "../pages/listMovies";
import ReactDOM from "react-dom";
import React from "react";
import { act } from "react-dom/test-utils";

describe("ListMovies component", () => {
  it("show loading screen", () => {
    const domElemenet = document.createElement("div");
    ReactDOM.render(<ListMovies />, domElemenet);
    expect(domElemenet).toMatchSnapshot();
  });

  it("show movies", async () => {
    const movies = [{ title: "movie 1" }, { title: "movie 2" }];
    const domElemenet = document.createElement("div");
    await act(async () => {
      ReactDOM.render(<ListMovies listMovies={() => movies} />, domElemenet);
    });
    expect(
      Array.from(domElemenet.querySelectorAll("h3")).map((e) => e.innerHTML)
    ).toEqual(["movie 1", "movie 2"]);
    expect(domElemenet).toMatchSnapshot();
  });

  it("show error message", async () => {
    const movies = [{ title: "movie 1" }, { title: "movie 2" }];
    const domElemenet = document.createElement("div");
    await act(async () => {
      ReactDOM.render(
        <ListMovies
          listMovies={() => {
            throw new Error("Something went wrong");
          }}
        />,
        domElemenet
      );
    });
    expect(domElemenet.querySelector("#error-text").innerHTML).toEqual(
      "Error: Something went wrong"
    );
    expect(domElemenet).toMatchSnapshot();
  });
});
