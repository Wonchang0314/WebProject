import React, { useEffect, useState } from "react";
import "./Tags.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function TagPage() {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTags() {
      const response = await axios.get("http://localhost:8000/posts/tags");

      const tagData = await Promise.all(
        response.data.map(async (tagData) => {
          const response = await axios.get(`http://localhost:8000/posts/tag/${tagData._id}`);
          return { ...response.data, count: tagData.count };
        })
      );
      setTags(tagData);
    }
    fetchTags();
  }, []);
  return (
    <div>
      <div className="tag-body">
        <div className="tag-header">
          <h2>{tags.length} Tags</h2>
          <h3>All Tags</h3>
          <button onClick={() => navigate("/newQuestion")} className="ask-btn">
            Ask Question
          </button>
        </div>
        <div className="tags">
          {tags.map((tag) => (
            <div className="tag" key={tag._id}>
              <a href={`/tag/${tag.name}`}>{tag.name}</a>
              <p>
                {tag.count} {tag.count === 1 ? "question" : "questions"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagPage;
