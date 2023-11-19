import React, { useState, useEffect } from "react";
import "./Answer.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../../utils";

function Answer() {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestion() {
      const response = await axios.get(`http://localhost:8000/posts/question/${id}`);
      setQuestion(response.data);

      const answerList = await Promise.all(
        response.data.answers.map(async (answerId) => {
          const response = await axios.get(`http://localhost:8000/posts/answer/${answerId}`);
          return response.data;
        })
      );
      setAnswers(answerList);
    }

    fetchQuestion();
  }, []);

  return (
    <div className="answer-container">
      <div className="answer-header">
        <div>{question.answers?.length} answers</div>
        <div className="answer-title">{question.title}</div>
        <button onClick={() => navigate("/newQuestion")} className="answer-ask-button">
          Ask Question
        </button>
      </div>
      <div className="answer-body">
        <div className="question-container">
          <div className="question-views">{question.views} views</div>
          <div className="question-text">{question.text}</div>
          <div className="question-metadata">
            <p className="question-user">{question.asked_by}</p>
            &nbsp;asked {formatDate(question.ask_date_time)}
          </div>
        </div>
        <div className="answer-list">
          {answers?.length > 0 ? (
            answers
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((answer) => (
                <div key={answer._id} className="answer-content">
                  <div className="answer-text">{answer.text}</div>
                  <div className="answer-metadata">
                    <p className="answer-user">{answer.ans_by}</p>
                    answered {formatDate(answer.ans_date_time)}
                  </div>
                </div>
              ))
          ) : (
            <div>No answers yet.</div>
          )}
        </div>

        <button
          onClick={() => navigate(`/question/${id}/answers`)}
          className="answer-submit-button"
        >
          Answer Question
        </button>
      </div>
    </div>
  );
}

export default Answer;
