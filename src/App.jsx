import React, { useState } from "react";

// ----------------------
// BASE MONSTRES (extrait)
// ----------------------
const monsters = [
  "Gluant",
  "Gigluant",
  "Roi Gluant",
  "Gluant de métal",
  "Gluant de mercure",
  "Komodor",
  "Faune",
  "Lézard Argon",
  "Grand Lézard Argon",
  "Frou-Frou",
  "Fri-Fri",
  "Vampivol"
];

// ----------------------
// FUSIONS RÉELLES
// ----------------------
const fusions = [
  // Roi Gluant
  {
    result: "Roi Gluant",
    recipe: ["Gigluant", "Gigluant"]
  },
  {
    result: "Roi Gluant",
    recipe: ["Gluant", "Gluant", "Gluant", "Gluant"]
  },

  // Lézard Argon
  {
    result: "Lézard Argon",
    recipe: ["Komodor", "Faune"]
  },

  // Grand Lézard Argon
  {
    result: "Grand Lézard Argon",
    recipe: [
      "Lézard Argon",
      "Lézard Argon",
      "Lézard Argon",
      "Lézard Argon"
    ]
  },

  // Frou-Frou
  {
    result: "Frou-Frou",
    recipe: [
      "Lézard Argon",
      "Lézard Argon",
      "Lézard Argon",
      "Grand Lézard Argon"
    ]
  },

  // Fri-Fri
  {
    result: "Fri-Fri",
    recipe: ["Komodor", "Vampivol"]
  }
];

// ----------------------
// CHECK FUSION
// ----------------------
function canMakeFusion(inventory, recipe) {
  const temp = [...inventory];

  for (let r of recipe) {
    const index = temp.indexOf(r);
    if (index === -1) return false;
    temp.splice(index, 1);
  }

  return true;
}

// ----------------------
// APP
// ----------------------
export default function App() {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState("");

  const addMonster = () => {
    if (!selected) return;
    setInventory([...inventory, selected]);
  };

  const removeMonster = (index) => {
    const copy = [...inventory];
    copy.splice(index, 1);
    setInventory(copy);
  };

  const getFusions = () => {
    return fusions
      .filter((f) => canMakeFusion(inventory, f.recipe))
      .map((f) => ({
        result: f.result,
        recipe: f.recipe
      }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Fusion DQMJ 2.1</h1>

      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">Choisir</option>
        {monsters.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <button onClick={addMonster}>Ajouter</button>

      <h2>Inventaire</h2>
      {inventory.map((m, i) => (
        <div key={i}>
          {m} <button onClick={() => removeMonster(i)}>X</button>
        </div>
      ))}

      <h2>Fusions possibles</h2>

      {getFusions().length === 0 && <p>Aucune</p>}

      {getFusions().map((f, i) => (
        <div key={i}>
          🔥 {f.result} ← {f.recipe.join(" + ")}
        </div>
      ))}
    </div>
  );
      }
