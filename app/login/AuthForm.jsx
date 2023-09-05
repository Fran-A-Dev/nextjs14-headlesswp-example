"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useState("");
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const loginAndFetch = async (e) => {
    e.preventDefault();
    console.log("Logging in user...");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation LoginUser {
              login( input: {
                clientMutationId: "uniqueId",
                username: "${username}",
                password: "${password}"
              }){
                authToken
                user {
                  id
                  databaseId
                  name
                }
              }
            }
          `,
        }),
      });

      const { data } = await response.json();
      console.log(data);

      if (data?.login?.authToken) {
        console.log("Fetching auth content...");
        setJwt(data.login.authToken);

        const authResponse = await fetch(
          process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.login.authToken}`,
            },
            body: JSON.stringify({
              query: `
              query GetAllPosts {
                posts(where: { status: DRAFT }) {
                  nodes {
                    title
                    content
                  }
                }
              }
            `,
            }),
          }
        );

        const authData = await authResponse.json();
        setPosts(authData?.data?.posts?.nodes);
        console.log(authData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const createDraftPost = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          query: `
              mutation CreateDraftPost($title: String!, $content: String!) {
                createPost(input: { content: $content, title: $title, status: DRAFT, authorId: "1" }) {
                  post {
                    title
                    content
                  }
                }
              }
            `,
          variables: {
            title: "Draft Authentication Post",
            content: content,
          },
        }),
      });

      const responseData = await response.json();
      console.log("Created post:", responseData);

      // Display a success message here
      alert("Draft post created successfully!");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <>
      <form onSubmit={loginAndFetch}>
        <label htmlFor="usernameInput">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="usernameInput"
        />
        <label htmlFor="passwordInput">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="passwordInput"
        />
        <button type="submit">Login</button>
      </form>
      <section className="mb-8">
        <h3 className="font-semibold mb-2 text-primary">Draft Posts</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.title}>
              <h4 className="text-lg font-medium">{post.title}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.content,
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      {jwt && (
        <section>
          <h3 className="font-semibold mb-2 text-primary">Create Post</h3>
          <QuillEditor
            theme="snow"
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
          <br />
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
            onClick={createDraftPost}
          >
            Create New Post
          </button>
        </section>
      )}
    </>
  );
};

export default AuthForm;
