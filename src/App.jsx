import React, { useState } from "react";
import { monsters } from "./data/monsters.js";

export default function App() {
  const [selected, setSelected] = useState("");
  const [inventory, setInventory] = useState([]);

  const addMonster = () => {
    if (!selected) return;

    setInventory([...inventory, selected]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>DQMJ Test</h1>

      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">Choisir</option>
        {monsters.map((m, i) => (
          <option key={i}>{m.name}</option>
        ))}
      </select>

      <button onClick={addMonster}>Ajouter</button>

      <h2>Inventaire</h2>
      {inventory.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
}
