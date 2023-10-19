import { Suspense } from "react";
import Loading from "../../loading";

async function getPost(uri) {
  const query = `
  query GetPostByUri($uri: ID!) {
    post(id: $uri, idType: URI) {
      title
      content
      id
      uri
    }
  }
      `;

  const variables = {
    uri,
  };

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const responseBody = await res.json();

  if (responseBody && responseBody.data && responseBody.data.post) {
    return responseBody.data.post;
  } else {
    throw new Error("Failed to fetch the post");
  }
}

export default async function PostDetails({ params }) {
  const post = await getPost(params.uri);

  return (
    <main>
      <nav>
        <h1>{post.title}</h1>
      </nav>
      <Suspense fallback={<Loading />}>
        <div className="card" key={post.uri}>
          <p dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </Suspense>
    </main>
  );
}
