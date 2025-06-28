import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (q) params.q = q;
      if (sort) params.sort = sort;
      const res = await axios.get(`${API}/mentors`, { params });
      setMentors(res.data);
    } catch (err) {
      setError("멘토 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 내 프로필(역할) 및 내 매칭 요청 목록
  const fetchProfileAndRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
      if (res.data.role === "mentee") {
        const reqRes = await axios.get(`${API}/match/mentee`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRequests(reqRes.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMentors();
    fetchProfileAndRequests();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  // 매칭 요청
  const handleRequest = async (mentorId) => {
    setReqLoading(true);
    try {
      await axios.post(
        `${API}/match/request`,
        { mentorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProfileAndRequests();
    } catch (err) {
      alert(err.response?.data?.message || "요청 실패");
    } finally {
      setReqLoading(false);
    }
  };
  // 매칭 요청 취소
  const handleCancel = async (reqId) => {
    setReqLoading(true);
    try {
      await axios.delete(`${API}/match/request/${reqId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProfileAndRequests();
    } catch (err) {
      alert(err.response?.data?.message || "취소 실패");
    } finally {
      setReqLoading(false);
    }
  };

  // 멘토별 내 요청 상태
  const getRequestStatus = (mentorId) => {
    const req = myRequests.find((r) => r.mentorId === mentorId);
    return req ? req.status : null;
  };
  const getRequestId = (mentorId) => {
    const req = myRequests.find((r) => r.mentorId === mentorId);
    return req ? req.id : null;
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20 }}>
      <h2>멘토 목록</h2>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="이름 또는 기술스택 검색"
          style={{ flex: 1 }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">정렬 없음</option>
          <option value="name">이름순</option>
          <option value="skills">기술스택순</option>
        </select>
        <button type="submit">검색</button>
      </form>
      {loading && <div>로딩 중...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {mentors.map((m) => {
          const status = getRequestStatus(m.id);
          const reqId = getRequestId(m.id);
          return (
            <li
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                borderBottom: "1px solid #eee",
                padding: 12,
              }}
            >
              <img
                src={`${API}/profile/image/${m.id}`}
                alt="프로필"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #aaa",
                }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/500x500.jpg?text=MENTOR";
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{m.name}</div>
                <div style={{ color: "#555" }}>{m.bio}</div>
                <div style={{ color: "#888", fontSize: 13 }}>{m.skills}</div>
              </div>
              {role === "mentee" && (
                <div>
                  {status === "pending" ? (
                    <button
                      disabled={reqLoading}
                      onClick={() => handleCancel(reqId)}
                    >
                      요청 취소
                    </button>
                  ) : status === "accepted" ? (
                    <span style={{ color: "green" }}>매칭 완료</span>
                  ) : status === "rejected" ? (
                    <span style={{ color: "red" }}>거절됨</span>
                  ) : (
                    <button
                      disabled={reqLoading}
                      onClick={() => handleRequest(m.id)}
                    >
                      매칭 요청
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {mentors.length === 0 && !loading && <div>멘토가 없습니다.</div>}
    </div>
  );
}

export default MentorList;
