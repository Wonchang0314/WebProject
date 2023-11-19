import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    location === "/tag" ? setIsActive(true) : setIsActive(false);
  }, [location]);
  return (
    <div>
      <div className="banner">
        <h1 onClick={() => navigate("/")}>Fake Stack Overflow</h1>
        <form>
          <input type="text" placeholder="Search" />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="main-body">
        <div className="menu">
          <ul>
            <li className={isActive ? "" : "active"}>
              <a href="/">Questions</a>
            </li>
            <li className={isActive ? "active" : ""}>
              <a href="/tag">Tags</a>
            </li>
          </ul>
        </div>
        <div className="questions">{children}</div>
      </div>
    </div>
  );
}
