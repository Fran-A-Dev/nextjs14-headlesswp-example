"use client";

import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null); // Reset the success message on a new submission

    const CREATE_POST = `
      mutation CreatePost($title: String!, $content: String!) {
        createPost(input: { title: $title, content: $content }) {
          post {
            id
            title
            content
          }
        }
      }
    `;

    const variables = {
      title,
      content,
    };

    console.log("Query:", CREATE_POST); // Log 1
    console.log("Variables:", variables); // Log 1

    try {
      const res = await fetch("https://smartcahce.wpengine.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: CREATE_POST, variables }),
      });

      const jsonResponse = await res.json();
      const { data, errors } = jsonResponse;

      console.log("Response data:", data); // Log 2
      console.log("Response errors:", errors); // Log 2

      if (data && data.createPost && data.createPost.post) {
        setSuccessMessage("Post created successfully");
        setTitle(""); // Clear the input fields
        setContent("");
      } else {
        // Handle error
        console.error("Error creating post");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSuccessMessage(null);
    }

    setIsLoading(false);
  };

  // ...

  return (
    <form onSubmit={handleSubmit} className="w-1/2">
      {successMessage && <div>{successMessage}</div>}{" "}
      {/* Display success message */}
      <label>
        <span>Title:</span>
        <input
          required
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>
      <label>
        <span>Content:</span>
        <textarea
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </label>
      <button className="btn-primary" disabled={isLoading}>
        {isLoading ? <span>Adding...</span> : <span>Create Post</span>}
      </button>
    </form>
  );
}
