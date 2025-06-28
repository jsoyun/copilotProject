import React, { useState } from "react";
import Register from "./components/Register";
import Profile from "./components/Profile";
import MentorList from "./components/MentorList";
import MentorMatchRequests from "./components/MentorMatchRequests";
import MenteeMatchRequests from "./components/MenteeMatchRequests";
import UserStatus from "./components/UserStatus";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState(token ? "profile" : "login");

  const handleRegisterSuccess = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    setView("profile");
  };

  const handleLoginSuccess = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
    setView("profile");
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setView("login");
  };

  return (
    <div className="App">
      <UserStatus token={token} onLogout={handleLogout} />
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          margin: 16,
        }}
      >
        <button onClick={() => setView("login")}>로그인</button>
        <button onClick={() => setView("register")}>회원가입</button>
        <button onClick={() => setView("profile")}>내 프로필</button>
        <button onClick={() => setView("mentors")}>멘토 목록</button>
        <button onClick={() => setView("mentee-requests")}>내 매칭요청</button>
        <button onClick={() => setView("mentor-requests")}>
          멘토 매칭요청 관리
        </button>
      </div>
      {view === "login" && <Login onSuccess={handleLoginSuccess} />}
      {view === "register" && <Register onSuccess={handleRegisterSuccess} />}
      {view === "profile" && <Profile token={token} />}
      {view === "mentors" && <MentorList />}
      {view === "mentee-requests" && <MenteeMatchRequests />}
      {view === "mentor-requests" && <MentorMatchRequests />}
    </div>
  );
}

export default App;
