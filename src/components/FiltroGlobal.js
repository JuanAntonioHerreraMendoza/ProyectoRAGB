import React from "react";

function FiltroGlobal({ filter, setFilter }) {
  return (
    <div className="input-group input-group-sm" style={{ width: "30%" }}>
      <span className="input-group-text" id="inputGroup-sizing-sm">
        <ion-icon name="search"></ion-icon>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar..."
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-sm"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}

export default FiltroGlobal;
