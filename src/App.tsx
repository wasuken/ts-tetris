import React from "react";
import "./App.css";

import Tetris from "./components/Tetris";

function App() {
  return (
    <div className="App" style={{ display: "flex", justifyContent: "center" }}>
      <Tetris edge={20} blockWidth={10} blockHeight={20} />
    </div>
  );
}

export default App;
