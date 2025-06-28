import React from "react";

function UserStatus({ token, onLogout }) {
  if (!token) {
    return <div style={{ float: "right", margin: 8 }}>로그인 필요</div>;
  }
  // 토큰에서 사용자 정보 파싱(간단히 base64 decode)
  let userInfo = null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userInfo = payload;
  } catch {}
  return (
    <div style={{ float: "right", margin: 8 }}>
      {userInfo ? (
        <>
          <b>{userInfo.name}</b> ({userInfo.role}) |{" "}
          <button onClick={onLogout}>로그아웃</button>
        </>
      ) : (
        "로그인됨"
      )}
    </div>
  );
}

export default UserStatus;
