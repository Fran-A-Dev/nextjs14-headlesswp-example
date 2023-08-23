import Link from "next/link";
async function getPosts() {
  const query = `
  {
    posts(first: 5) {
      nodes {
        title
        content
        databaseId
      }
    }
  }
    `;

  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await res.json();

  return data.posts.nodes;
}

export default async function PostList() {
  const posts = await getPosts();

  return (
    <>
      {posts.map((post) => (
        <div key={post.databaseId} className="card">
          <Link href={`/post/${post.databaseId}`}>
            <h3>{post.title}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: post.content.slice(0, 200) + "...",
              }}
            />
          </Link>
        </div>
      ))}
    </>
  );
}
