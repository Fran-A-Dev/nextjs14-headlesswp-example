export default function CreatePost() {
  const handleSubmit = async (data) => {
    'use server';

    // e.preventDefault();

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
      title: data.get('title'),
      content: data.get('content'),
    };

    console.log(variables)

    // console.log("Query:", CREATE_POST); // Log 1
    // console.log("Variables:", variables); // Log 1

    // try {
    //   const res = await fetch('https://smartcahce.wpengine.com/graphql', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer xxxx'
    //     },
    //     body: JSON.stringify({
    //       query: CREATE_POST,
    //       variables
    //     })
    //   });
    // } catch (err) {
    //   console.log('There was an error', err)
    // }

    // try {
    //   const res = await fetch("https://smartcahce.wpengine.com/graphql", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ query: CREATE_POST, variables }),
    //   });

    //   const jsonResponse = await res.json();
    //   const { data, errors } = jsonResponse;

    //   console.log("Response data:", data); // Log 2
    //   console.log("Response errors:", errors); // Log 2

    //   if (data && data.createPost && data.createPost.post) {
    //     setSuccessMessage("Post created successfully");
    //     setTitle(""); // Clear the input fields
    //     setContent("");
    //   } else {
    //     // Handle error
    //     console.error("Error creating post");
    //     setSuccessMessage(null);
    //   }
    // } catch (error) {
    //   console.error("An error occurred:", error);
    //   setSuccessMessage(null);
    // }

    // setIsLoading(false);
  };

  // ...

  return (
    <form action={handleSubmit} className="w-1/2">
      {/* Display success message */}
      <label>
        <span>Title:</span>
        <input
          name="title"
          required
          type="text"
        />
      </label>
      <label>
        <span>Content:</span>
        <textarea
          name="content"
          required
        />
      </label>
      <button className="btn-primary">
         <span>Create Post</span>
      </button>
    </form>
  );
}
