import React, { useState } from "react";
import "./NewAnswer.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function NewAnswer() {
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Object.keys(formErrors).length === 0) {
      const data = {
        text,
        ans_by: username,
      };

      await axios.post(`http://localhost:8000/posts/question/${id}/answers`, data).then((res) => {
        try {
          console.log("Answer posted successfully:", res.data);
          setText("");
          setUsername("");
          setFormErrors({});
          alert("Answer posted successfully");
          navigate(`/question/${id}`);
        } catch (err) {
          alert("posting Answer failed", err);
        }
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const errors = {};

    if (name === "text") {
      if (value.trim() === "") {
        errors.text = "Answer text is required";
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
            errors.text = "Invalid hyperlink in Answer text";
            break;
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
      if (name === "text") {
        setText(value);
      } else if (name === "username") {
        setUsername(value);
      }
    }
  };
  return (
    <div className="container">
      <h2>New Answer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">Question Text*</label>
          <textarea
            id="text"
            name="text"
            className="form-control"
            required
            onChange={handleInputChange}
            placeholder="Enter your Answer here"
          />
          {formErrors.text && <div className="text-danger">{formErrors.text}</div>}
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
          Post Answer
        </button>
      </form>
    </div>
  );
}
