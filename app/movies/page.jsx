async function getMovies() {
  const query = `
  query getMovies {
    movies {
      nodes {
        movieFields {
          
         
          movieQuote
        }
        title
        uri
      }
    }
  }
  `;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}?query=${encodeURIComponent(
      query
    )}`,
    { next: { revalidate: 10 } },
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // ... any other headers you need to include (like authentication tokens)
      },
    }
  );

  const { data } = await res.json();

  return data.movies.nodes;
}

export default async function MovieList() {
  const movies = await getMovies();

  return (
    <div>
      {movies.map((movie) => {
        // Ensure that you are accessing the movieQuote from the movie.movieFields object
        const { movieFields: { movieQuote, title } = {} } = movie;
        return (
          <div key={movie.uri} className="card">
            <h3>{movie.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: movieQuote,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
