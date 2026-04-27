const monsterMeta = {
  "Gluant": { polarity: "neutral" },
  "Gigluant": { polarity: "neutral" },
  "Roi Gluant": { polarity: "neutral" },
  "Gluant de métal": { polarity: "neutral" },

  "Komodor": { polarity: "positive" },
  "Lézard Argon": { polarity: "positive" },
  "Grand Lézard Argon": { polarity: "positive" },
  "Frou-Frou": { polarity: "positive" },

  "Vampivol": { polarity: "negative" },
  "Fri-Fri": { polarity: "negative" },

  "Faune": { polarity: "neutral" }
};
const monsterMeta = {
  "Gluant": { polarity: "neutral" },
  "Gigluant": { polarity: "neutral" },
  "Roi Gluant": { polarity: "neutral" },
  "Gluant de métal": { polarity: "neutral" },

  "Komodor": { polarity: "positive" },
  "Lézard Argon": { polarity: "positive" },
  "Grand Lézard Argon": { polarity: "positive" },
  "Frou-Frou": { polarity: "positive" },

  "Vampivol": { polarity: "negative" },
  "Fri-Fri": { polarity: "negative" },

  "Faune": { polarity: "neutral" }
};
import { nonFusionnables } from "./data/fusionExceptions";

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

function getSuggestion(reasons, fusion) {
  if (reasons.includes("Manque des monstres")) {
    return "Ajoute les monstres manquants";
  }

  if (reasons.includes("Polarité incompatible")) {
    return "Ajoute un monstre de polarité différente";
  }

  if (reasons.includes("Monstre non fusionnable")) {
    return "Remplace un monstre non fusionnable";
  }

  return "";
}

// ----------------------
// APP
// ----------------------
function analyzeFusion(inventory, fusion) {
  let reasons = [];

  const temp = [...inventory];

  for (let r of fusion.recipe) {
    const index = temp.findIndex(m => m.name === r);
    if (index === -1) {
      reasons.push("Manque des monstres");
      return { valid: false, reasons };
    }
    temp.splice(index, 1);
  }

  const used = fusion.recipe.map(r =>
    inventory.find(m => m.name === r)
  );

  if (used.some(m => m && !m.fusion)) {
    reasons.push("Monstre non fusionnable");
  }

  return {
    valid: reasons.length === 0,
    reasons
  };
}

function getFusionResults(inventory, fusions) {
  return fusions.map(f => {
    const result = analyzeFusion(inventory, f);
    return {
      ...f,
      valid: result.valid,
      reasons: result.reasons
    };
  });
}
export default function App() {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState("");

  const addMonster = () => {
  if (!selected) return;

  setInventory([
  ...inventory,
  {
    name: selected,
    fusion: !nonFusionnables.includes(selected),
    polarity: monsterMeta[selected]?.polarity || "neutral"
  }
]);
};

  const removeMonster = (index) => {
    const copy = [...inventory];
    copy.splice(index, 1);
    setInventory(copy);
  };

  const fusionResults = getFusionResults(inventory, fusions);

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

      {fusionResults.length === 0 && <p>Aucune</p>}

{fusionResults.map((f, i) => (
  <div key={i}>
    {f.valid ? "✅" : "❌"} {f.result} ← {f.recipe.join(" + ")}

    {!f.valid && (
      <div style={{ color: "red", fontSize: 12 }}>
        {f.reasons.join(" / ")}
      </div>
    )}
  </div>
))}
    </div>
  );
      }
