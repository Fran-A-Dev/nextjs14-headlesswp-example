import { Suspense } from "react";
import Loading from "../../loading";

async function getPost(id) {
  const query = `
        query GetPostById($id: ID!) {
            post(id: $id, idType: DATABASE_ID) {
              title
              content
              id
            }
          }
      `;

  const variables = {
    id,
  };

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    method: "POST", // If you need POST, you can change it
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }), // Include the variables here
    next: {
      revalidate: 60, //Using ISR to refetch and rebuild every 60 seconds
    },
  });

  const { data } = await res.json();

  return data.post; // Correct the way you return the post object
}

export default async function PostDetails({ params }) {
  const post = await getPost(params.id);

  return (
    <main>
      <nav>
        <h1>{post.title}</h1>
      </nav>
      <Suspense fallback={<Loading />}>
        <div className="card" key={post.id}>
          <p dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </Suspense>
    </main>
  );
}
