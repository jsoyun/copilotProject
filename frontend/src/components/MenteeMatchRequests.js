import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function MenteeMatchRequests() {
  const [token] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchProfileAndRequests = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.get(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
      if (res.data.role === "mentee") {
        const reqRes = await axios.get(`${API}/match/mentee`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(reqRes.data);
      }
    } catch {
      setMsg("권한이 없거나 로그인 필요");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRequests();
    // eslint-disable-next-line
  }, []);

  const handleCancel = async (id) => {
    setLoading(true);
    setMsg("");
    try {
      await axios.delete(`${API}/match/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfileAndRequests();
    } catch (err) {
      setMsg(err.response?.data?.message || "취소 실패");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "mentee") return <div>멘티만 접근 가능합니다.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20 }}>
      <h2>내 매칭 요청</h2>
      {msg && <div style={{ color: "red" }}>{msg}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {requests.map((r) => (
          <li
            key={r.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <b>{r.mentor?.name}</b>{" "}
              <span style={{ color: "#888" }}>{r.mentor?.email}</span>
              <div style={{ color: "#555" }}>{r.message}</div>
              <div
                style={{
                  color:
                    r.status === "pending"
                      ? "#888"
                      : r.status === "accepted"
                      ? "green"
                      : r.status === "rejected"
                      ? "red"
                      : "#aaa",
                }}
              >
                {r.status === "pending"
                  ? "대기중"
                  : r.status === "accepted"
                  ? "수락됨"
                  : r.status === "rejected"
                  ? "거절됨"
                  : "취소됨"}
              </div>
            </div>
            {r.status === "pending" && (
              <button disabled={loading} onClick={() => handleCancel(r.id)}>
                요청 취소
              </button>
            )}
          </li>
        ))}
      </ul>
      {requests.length === 0 && <div>보낸 요청이 없습니다.</div>}
    </div>
  );
}

export default MenteeMatchRequests;
