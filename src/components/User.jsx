import React from "react";
import Avatar from "react-avatar";
const User = ({ username }) => {
  return (
    <div className="user">
      <Avatar name={username} size={50} round="14px" />
      <span className="username my-1">{username}</span>
    </div>
  );
};

export default User;
