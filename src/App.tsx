import "./App.css";
import { useUpdater } from "./hooks/useUpdater";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      // F12 to open devtools
      if (e.key === "F12") {
        e.preventDefault();
        try {
          await invoke("toggle_devtools");
        } catch (error) {
          console.error("Failed to open devtools:", error);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const { updateAvailable, updateInfo, installUpdate } = useUpdater();
  console.log(updateInfo);
  return (
    <div>
      {/* Your existing app content */}
      <h1>hello Lingadurai</h1>

      <h2>Update 0.1.2</h2>

      {updateInfo && <h1>{updateInfo.toString()}</h1>}
      {updateAvailable && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <p>Update available: {updateInfo?.version}</p>
          <button onClick={installUpdate}>Install Update</button>
        </div>
      )}
    </div>
  );
}

export default App;
