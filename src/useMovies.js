import { useState, useEffect } from "react";

const KEY = "33580385";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController(); // Clean up data fetching, step 1: register an AbortController

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal } // Clean up data fetching, step 2: connect an AbortController with fetch
          );

          if (!res.ok)
            throw new Error("Something went run with fetching moives");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          // Clean up data fetching, step 4: handle the Aborterror
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort(); // Clean up data fetching, step 3: use the AbortController on the Cleanup function
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
