import React, { useEffect, useState } from "react";
import "./QuestionList.css";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils";

export default function QuestionList({ questions }) {
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();
  const tagName = useLocation().pathname.split("/");

  const sortedQuestions = () => {
    switch (sortOrder) {
      case "newest":
        return [...questions].sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
      case "active":
        return [...questions].sort((a, b) => b.answers.length - a.answers.length);
      case "unanswered":
        return [...questions].filter((q) => q.answers.length === 0);
      case "tags":
        return [...questions].filter((q) => q.tags.some((tag) => tag.name === tagName[2]));
      default:
        return questions;
    }
  };
  useEffect(() => {
    if (tagName[1] === "tag") {
      setSortOrder("tags");
    }
  }, []);

  return (
    <div className="question-list-container">
      <div className="header">
        <h2 onClick={() => setSortOrder("newest")}>All Questions</h2>
        <button onClick={() => navigate("/newQuestion")}>Ask Question</button>
      </div>
      <div className="question-total">
        <p>Total Questions: {questions.length}</p>
        <div className="question-sort">
          <button
            className={sortOrder === "newest" ? "active" : ""}
            onClick={() => setSortOrder("newest")}
          >
            Newest
          </button>
          <button
            className={sortOrder === "active" ? "active" : ""}
            onClick={() => setSortOrder("active")}
          >
            Active
          </button>
          <button
            className={sortOrder === "unanswered" ? "active" : ""}
            onClick={() => setSortOrder("unanswered")}
          >
            Unanswered
          </button>
        </div>
      </div>
      <div className="questions-list">
        {sortedQuestions().map((q) => (
          <div key={q._id} className="question">
            <div className="question-stats">
              <p>{q.answers.length} answers</p>
              <p>{q.views} views</p>
            </div>
            <div
              onClick={() => {
                navigate(`/question/${q._id}`);
              }}
              className="question-title"
            >
              <h3>{q.title}</h3>
              {q.tags.map((tag) => {
                return (
                  <p key={tag._id} className="question-tag">
                    {tag.name}
                  </p>
                );
              })}
            </div>
            <p className="question-metadata">
              <p className="question-asked_by">{q.asked_by}</p>
              &nbsp;asked {formatDate(q.ask_date_time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
