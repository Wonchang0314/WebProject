import React, { useEffect, useState } from "react";
import "./HomePage.css";
import QuestionList from "./QuestionList";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [questions, setQuestions] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("active");
  const [activeTag, setActiveTag] = useState("non-active");
  const [filteredQuestions, setFilteredQuestions] = useState("");
  const navigate = useNavigate();
  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    async function fetchQuestions() {
      const questionResponse = await axios.get("http://localhost:8000/posts/questions");
      const questions = questionResponse.data;

      const tagIds = new Set();

      
      questions.forEach((question) => {
        question.tags.forEach((tagId) => {
          tagIds.add(tagId);
        });
      });
      
      const tagResponses = await Promise.all(
        Array.from(tagIds).map((tagId) => axios.get(`http://localhost:8000/posts/tag/${tagId}`))
      );

      const tags = tagResponses.map((tagResponse) => tagResponse.data);

      const questionsWithTags = questions.map((question) => {
        const questionTags = question.tags.map((tagId) => tags.find((tag) => tag._id === tagId));
        return { ...question, tags: questionTags };
      });
      
      setQuestions(questionsWithTags);
      setFilteredQuestions(questionsWithTags);
      
    }

    fetchQuestions();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const regex = /\[(.*?)\]/g;
    let tagMatch;
    const tagNames = [];
    while ((tagMatch = regex.exec(searchText)) !== null) {
      tagNames.push(tagMatch[1]);
    }

    const words = searchText
      .replace(/\[(.*?)\]/g, "")
      .trim()
      .split(/\s+/)
      .map((word) => word.toLowerCase());

    const filteredQuestions = questions.filter((question) => {
      const hasTag = tagNames.some((tagName) =>
        question.tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())
      );
      const hasWord =
        words[0] === ""
          ? false
          : words.some(
              (word) =>
                question.title.toLowerCase().includes(word) ||
                question.text.toLowerCase().includes(word)
            );

      return hasTag || hasWord;
    });
    setFilteredQuestions(filteredQuestions);
  };

  return (
    <div>
      <div className="banner">
        <h1
          onClick={() => {
            navigate("/");
            setFilteredQuestions(questions);
          }}
        >
          Fake Stack Overflow
        </h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearchInputChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="main-body">
        <div className="menu">
          <ul>
            <li
              className={activeQuestion}
              onClick={() => {
                setActiveQuestion("active");
                setActiveTag("non-active");
              }}
            >
              <a href="/">Questions</a>
            </li>
            <li
              className={activeTag}
              onClick={() => {
                setActiveQuestion("non-active");
                setActiveTag("active");
              }}
            >
              <a href="/tag">Tags</a>
            </li>
          </ul>
        </div>
        <div className="questions">
          <QuestionList questions={filteredQuestions} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
