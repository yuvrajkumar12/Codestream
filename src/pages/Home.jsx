import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    // console.log(id);
    toast.success("New room created 💚");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id or Username not provided");
    } else navigate(`/editor/${roomId}`, { state: { username } });
  };

  const handleInputEnter = (e) => {
    // console.log("event", e.code);
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper" action="">
        <img
          className="m-3"
          src="/logo.png"
          style={{ width: 90 + "%" }}
          alt="logo"
        />
        <h4 className="mainLabel">Enter your joining info...</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter your room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onKeyUp={handleInputEnter}
          />
          {/* <button className="btn joinBtn">Join</button> */}
          <button
            type="button"
            style={{ width: 100 + "px", marginLeft: "auto" }}
            className="btn btn-info mb-4"
            onClick={joinRoom}
          >
            Join
          </button>
          <span className="createInfo text-center">
            Create new room : &nbsp;{" "}
            <a
              href=""
              onClick={createNewRoom}
              className="createNewBtn text-warning text-decoration-none"
            >
              New Room
            </a>
          </span>
        </div>
        <div class="alert alert-info mt-3" role="alert">
          ✨✨ Code, share and see your creations come to life in real-time with
          our powerful code editor 💙"
        </div>
      </div>
      <footer>
        <h4>
          &#169; created by{" "}
          <a
            href="https://www.linkedin.com/in/

"
          >
            Krishna
          </a>{" "}
          💚
        </h4>
      </footer>
    </div>
  );
};

export default Home;
