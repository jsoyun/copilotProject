import React, { useState } from "react";

function Register({ onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "mentee",
    bio: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("회원가입 성공! 자동 로그인 중...");
        setSuccess(true);
        // 회원가입 후 바로 로그인
        const loginRes = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          if (onSuccess) onSuccess(loginData.token);
        }
      } else {
        setMessage(data.message || "회원가입 실패");
        setSuccess(false);
      }
    } catch (err) {
      setMessage("서버 오류");
      setSuccess(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2>회원가입</h2>
      <input
        name="email"
        type="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={handleChange}
        required
      />
      <select name="role" value={form.role} onChange={handleChange} required>
        <option value="mentor">멘토</option>
        <option value="mentee">멘티</option>
      </select>
      <textarea
        name="bio"
        placeholder="소개글"
        value={form.bio}
        onChange={handleChange}
      />
      {form.role === "mentor" && (
        <input
          name="skills"
          placeholder="기술 스택 (쉼표로 구분)"
          value={form.skills}
          onChange={handleChange}
        />
      )}
      <button type="submit">회원가입</button>
      {message && (
        <div style={{ color: success ? "green" : "red" }}>{message}</div>
      )}
    </form>
  );
}

export default Register;
