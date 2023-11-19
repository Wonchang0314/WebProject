import React, { useState } from "react";
import "./NewQuestion.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewQuestion() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [username, setUsername] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(formErrors).length === 0) {
      const data = {
        title,
        text,
        tags: tags.split(" "),
        asked_by: username,
      };

      axios.post("http://localhost:8000/posts/questions", data).then((res) => {
        try {
          console.log("Question posted successfully:", res.data);
          setTitle("");
          setText("");
          setTags("");
          setUsername("");
          setFormErrors({});
          alert("Question posted successfully");
          navigate("/");
        } catch (err) {
          alert("posting Question failed", err);
        }
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const errors = {};

    if (name === "title") {
      if (value.trim() === "") {
        errors.title = "Title is required";
      } else if (value.length > 100) {
        errors.title = "Title cannot be more than 100 characters";
      }
    } else if (name === "text") {
      if (value.trim() === "") {
        errors.text = "Question text is required";
      } else {
        const regex = /\[(.*?)\]\((.*?)\)/g;
        let match;
        while ((match = regex.exec(value)) !== null) {
          const linkName = match[1];
          const linkUrl = match[2];
          if (
            linkUrl.trim() === "" ||
            (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://"))
          ) {
            errors.text = "Invalid hyperlink in question text";
            break;
          }
        }
      }
    } else if (name === "tags") {
      if (value.trim() !== "") {
        const tagList = value.split(" ");
        if (tagList.length > 5) {
          errors.tags = "Cannot have more than 5 tags";
        } else {
          for (const tag of tagList) {
            if (tag.length > 10) {
              errors.tags = "Tags cannot be more than 10 characters";
              break;
            }
          }
        }
      }
    } else if (name === "username") {
      if (value.trim() === "") {
        errors.username = "Username is required";
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (name === "title") {
        setTitle(value);
      } else if (name === "text") {
        setText(value);
      } else if (name === "tags") {
        setTags(value);
      } else if (name === "username") {
        setUsername(value);
      }
    }
  };
  return (
    <div className="container">
      <h2>Ask a new question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Question Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            maxLength="100"
            required
            onChange={handleInputChange}
            placeholder="Enter your question title (max 100 characters)"
          />
          {formErrors.title && <div className="text-danger">{formErrors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="text">Question Text*</label>
          <textarea
            id="text"
            name="text"
            className="form-control"
            required
            onChange={handleInputChange}
            placeholder="Enter your question here"
          />
          {formErrors.text && <div className="text-danger">{formErrors.text}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags*</label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="form-control"
            maxLength="50"
            required
            onChange={handleInputChange}
            placeholder="Enter tags separated by spaces (max 5 tags)"
          />
          {formErrors.tags && <div className="text-danger">{formErrors.tags}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            maxLength="50"
            required
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
          {formErrors.username && <div className="text-danger">{formErrors.username}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Post Question
        </button>
      </form>
    </div>
  );
}
