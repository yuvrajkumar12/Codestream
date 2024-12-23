import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/material.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/xml/xml";
import "codemirror/mode/clike/clike";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const modeOptions = {
    javascript: { name: "javascript", json: true },
    python: { name: "python" },
    cplusplus: { name: "text/x-c++src" },
    java: { name: "text/x-java" },
  };
  const themeOptions = [
    "dracula",
    "3024-day",
    "3024-night",
    "eclipse",
    "material",
    "rubyblue",
  ];

  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: modeOptions.javascript,
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      // editorRef.current.setValue(`console.log("changes");`);
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });

      //problem on not defined
      // socketref got render before, get initialised
      // socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      //   if (code !== null) {
      //     editorRef.current.setValue(code);
      //   }
      // });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      // unsubscribing the useeffect
      // to prevent the memory leakage
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
    // we have to change socketRef.current not socket
  }, [socketRef.current]);

  const handleModeChange = (e) => {
    const mode = e.target.value;
    editorRef.current.setOption("mode", modeOptions[mode]);
  };

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    editorRef.current.setOption("theme", theme);
  };

  return (
    <>
      <h3 className="m-2">#Write your code here...</h3>
      <textarea id="realtimeEditor" placeholder="//code here"></textarea>
      <div className="d-flex m-4">
        <label className="mx-3" htmlFor="mode-select">
          Choose Language :{" "}
        </label>
        <select
          style={{ width: 10 + "%" }}
          className="form-select"
          id="mode-select"
          onChange={handleModeChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cplusplus">C++</option>
          <option value="java">Java</option>
          {/* <option value="xml">XML</option> */}
        </select>
        <label className="mx-3" htmlFor="theme-select">
          Theme:
        </label>
        <select
          id="theme-select"
          className="form-select"
          style={{ width: 10 + "%" }}
          onChange={handleThemeChange}
        >
          {themeOptions.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
      {/* <button onClick={handleRunCode}>Run</button> */}
    </>
  );
};

export default Editor;
