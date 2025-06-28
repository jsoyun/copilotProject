import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function MentorMatchRequests() {
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
      if (res.data.role === "mentor") {
        const reqRes = await axios.get(`${API}/match/mentor`, {
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

  // 이미 수락된 요청이 있는지 체크
  const hasAccepted = requests.some((r) => r.status === "accepted");

  const handleStatus = async (id, status) => {
    setLoading(true);
    setMsg("");
    try {
      await axios.patch(
        `${API}/match/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProfileAndRequests();
    } catch (err) {
      setMsg(err.response?.data?.message || "상태 변경 실패");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "mentor") return <div>멘토만 접근 가능합니다.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20 }}>
      <h2>받은 매칭 요청</h2>
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
              <b>{r.mentee?.name}</b>{" "}
              <span style={{ color: "#888" }}>{r.mentee?.email}</span>
              <div style={{ color: "#555" }}>{r.message}</div>
              <div
                style={{
                  color:
                    r.status === "pending"
                      ? "#888"
                      : r.status === "accepted"
                      ? "green"
                      : "red",
                }}
              >
                {r.status === "pending"
                  ? "대기중"
                  : r.status === "accepted"
                  ? "수락됨"
                  : "거절됨"}
              </div>
            </div>
            {r.status === "pending" && !hasAccepted && (
              <>
                <button
                  disabled={loading}
                  onClick={() => handleStatus(r.id, "accepted")}
                >
                  수락
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleStatus(r.id, "rejected")}
                >
                  거절
                </button>
              </>
            )}
            {r.status === "pending" && hasAccepted && (
              <span style={{ color: "#aaa" }}>다른 요청 수락 중</span>
            )}
          </li>
        ))}
      </ul>
      {requests.length === 0 && <div>받은 요청이 없습니다.</div>}
    </div>
  );
}

export default MentorMatchRequests;
