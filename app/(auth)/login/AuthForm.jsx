"use client";

import { useState, useEffect } from "react";

const AuthForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [userData, setUserData] = useState(null); // Add user data state

  useEffect(() => {
    // Check if a JWT token is stored in the browser's localStorage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setJwt(storedToken);
      setLoading(false); // Set loading to false once token is found
    } else {
      setLoading(false); // Set loading to false even if token is not found
    }
  }, []); // Only run this effect once, on component mount

  useEffect(() => {
    // Check if JWT token is set
    if (jwt) {
      // Fetch posts data when JWT token is available
      fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          query: `
            query GetAllPosts {
              posts(where: { status: DRAFT }) {
                nodes {
                  title
                  content
                  author {
                    node {
                      username
                    }
                  }
                }
              }
            }
          `,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPosts(data?.data?.posts?.nodes || []);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });

      // Fetch user data
      fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          query: `
            query GetUserData {
              viewer {
                id
                username
              }
            }
          `,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data?.data?.viewer || null);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [jwt]);

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
                }
              }
            `,
        }),
      });

      const { data } = await response.json();

      if (data?.login?.authToken) {
        // Store JWT token in localStorage
        localStorage.setItem("authToken", data.login.authToken);
        setJwt(data.login.authToken);
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
            title: title,
            content: content,
          },
        }),
      });

      const responseData = await response.json();
      console.log("Created post:", responseData);

      alert("Draft post created successfully!");
      setTitle(""); // Clear the title
      setContent(""); // Clear the content
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const logout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("authToken");
    setJwt("");
  };

  return (
    <>
      {loading ? (
        // Display a loading indicator here
        <p>Loading...</p>
      ) : jwt ? (
        <div>
          <button
            onClick={logout}
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
          >
            Logout
          </button>
          {userData && (
            <span className="ml-4 text-blue-900">
              Welcome, {userData.username}
            </span>
          )}
        </div>
      ) : (
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
      )}
      {loginError && <p className="text-red-500">{loginError}</p>}
      {jwt && (
        <section className="mb-8">
          <h3 className="font-semibold mb-2 text-primary">Draft Posts</h3>
          <ul>
            {posts.map((post) => (
              <li key={post.title} className="card">
                <h4 className="text-lg font-medium">{post.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: post.content }} />
                <span>Author: {post.author.node.username}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {jwt && (
        <section>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-primary">
              Create A Draft Post
            </h3>
            <label htmlFor="titleInput">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="titleInput"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>
          <label htmlFor="contentInput">Content</label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="contentInput"
            className="block w-full rounded border border-gray-300 p-2"
            rows="4"
          />
          <br />
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
            onClick={createDraftPost}
          >
            Create A New Draft Post
          </button>
        </section>
      )}
    </>
  );
};

export default AuthForm;
