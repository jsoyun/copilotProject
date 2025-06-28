import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function Profile({ token }) {
  const [profile, setProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [form, setForm] = useState({ name: "", bio: "", skills: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const fileInput = useRef();

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          skills: res.data.skills || "",
        });
        setImageUrl(`${API}/profile/image/${res.data.id}`);
      })
      .catch(() => setMessage("프로필 정보를 불러올 수 없습니다."));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/profile/me`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        await axios.post(`${API}/profile/image`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMessage("프로필이 저장되었습니다.");
    } catch (err) {
      setMessage("저장 실패: " + (err.response?.data?.message || "오류"));
    }
  };

  if (!token) return <div>로그인 후 이용 가능합니다.</div>;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>내 프로필</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center" }}>
          <img
            src={imageUrl}
            alt="프로필"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #aaa",
            }}
            onError={(e) => {
              e.target.src =
                profile?.role === "mentor"
                  ? "https://placehold.co/500x500.jpg?text=MENTOR"
                  : "https://placehold.co/500x500.jpg?text=MENTEE";
            }}
          />
          <br />
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            ref={fileInput}
            onChange={handleFile}
            style={{ marginTop: 8 }}
          />
        </div>
        <div>
          <label>이름</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>소개글</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>
        {profile?.role === "mentor" && (
          <div>
            <label>기술 스택</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>
        )}
        <button type="submit" style={{ marginTop: 16, width: "100%" }}>
          저장
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 12,
            color: message.includes("성공") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Profile;
