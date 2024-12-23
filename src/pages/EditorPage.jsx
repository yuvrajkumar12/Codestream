import React, { useEffect, useRef, useState } from "react";
import User from "../components/User.jsx";
import Editor from "../components/Editor.jsx";
import { initSocket } from "../socket.js";
import ACTIONS from "../Actions.js";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
const EditorPage = () => {
  // to store reference of the socket
  // it is a react hook
  // to store the data which is available at multiple render
  // and on change of it, our component will not rerender
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams(); // params contains the object of dynamic routes
  const [users, setUsers] = useState([]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied");
    } catch (error) {
      toast.error("doesn't copied");
      console.log(error);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setUsers(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
          // console.log(users);
        }
      );

      // listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setUsers((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mainWrap text-warning">
      <div className="side">
        <div className="sideInner">
          <div className="logo mb-4">
            <img
              className="logoImage"
              style={{ width: 100 + "%" }}
              src="/logo.png"
              alt="logo"
            />
            <hr
              style={{
                background: "#fcba03",
                color: "#fcba03",
                borderColor: "#fcba03",
                height: "3px",
              }}
            />
          </div>
          <h4>Users Connected</h4>
          <div className="usersList">
            {users.map((user) => (
              <User key={user.socketId} username={user.username} />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-light mb-2"
          onClick={copyRoomId}
        >
          Copy room Id
        </button>
        <button
          type="button"
          className="btn btn-danger mb-2"
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
