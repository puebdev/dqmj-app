import React, { useState } from "react";

// ----------------------
// BASE MONSTRES (extrait)
// ----------------------
import monsters from "./data/monsters.js";

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
    const index = temp.findIndex(m => m === r);
    if (index === -1) return false;
    temp.splice(index, 1);
  }

  return true;
}
function findFusionForMonster(name) {
  return fusions.find(f => f.result === name);
}

function buildChain(monster, depth = 0) {
  if (depth > 3) return []; // limite anti boucle

  const fusion = fusions.find(f => f.result === monster);
  if (!fusion) return [];

  let result = [`${monster} ← ${fusion.recipe.join(" + ")}`];

  fusion.recipe.forEach(m => {
    const sub = buildChain(m, depth + 1);
    result = result.concat(sub);
  });

  return result;
}

function getFusionChain(missing) {
  let chains = [];

  missing.forEach(monster => {
    const chain = buildChain(monster);
    if (chain.length > 0) {
      chains.push(...chain);
    }
  });

  return chains;
}
function getSuggestion(reasons, fusion) {
  if (fusion.missing && fusion.missing.length > 0) {
    const count = {};
    fusion.missing.forEach(m => {
      count[m] = (count[m] || 0) + 1;
    });

    const list = Object.entries(count)
      .map(([name, qty]) => qty > 1 ? `${qty}x ${name}` : name)
      .join(", ");

    const chains = getFusionChain(fusion.missing);

    return (
      `Il te manque : ${list}` +
      (chains.length > 0
        ? `\n➡️ Tu peux créer : ${chains.join(" | ")}`
        : "")
    );
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
  let missing = [];

  const temp = [...inventory];

  for (let r of fusion.recipe) {
    const index = temp.findIndex(m => m === r);
    if (index === -1) {
      missing.push(r);
    } else {
      temp.splice(index, 1);
    }
  }

  if (missing.length > 0) {
    reasons.push("Manque des monstres");
  }

  const used = fusion.recipe.map(r =>
    inventory.find(m => m.name === r)
  );

  if (used.some(m => m && !m.fusion)) {
    reasons.push("Monstre non fusionnable");
  }

  return {
    valid: reasons.length === 0,
    reasons,
    missing
  };
}

function getFusionResults(inventory, fusions) {
  return fusions.map(f => {
    const result = analyzeFusion(inventory, f);
    return {
      ...f,
      valid: result.valid,
      reasons: result.reasons,
      missing: result.missing
    };
  });
}
export default function App() {
  const [inventory, setInventory] = useState([]);
  const [team, setTeam] = useState([]);
const [bench, setBench] = useState([]);
  const [selected, setSelected] = useState("");
  const [polarity, setPolarity] = useState("neutral");
  const [filter, setFilter] = useState("all");
  
const addMonster = () => {
  if (!selected) return;

  const newMonster = {
    name: selected,
    fusion: true,
    polarity: polarity
  };

  if (team.length < 3) {
    setTeam([...team, newMonster]);
  } else if (bench.length < 3) {
    setBench([...bench, newMonster]);
  } else {
    setInventory([...inventory, newMonster]);
  }
};


  const removeMonster = (index) => {
    const copy = [...inventory];
    copy.splice(index, 1);
    setInventory(copy);
  };

  const allMonsters = [...team, ...bench, ...inventory];
const fusionResults = getFusionResults(allMonsters, fusions);
const filteredResults = fusionResults.filter(f => {
  if (filter === "valid") return f.valid;
  if (filter === "invalid") return !f.valid;
  return true;
});
  
  return (
  <div style={{ padding: 20 }}>
    <h1>Fusion DQMJ 2.1</h1>

    <select onChange={(e) => setSelected(e.target.value)}>
      <option value="">Choisir</option>
      {monsters.map((m, i) => (
  <option key={i}>{m}</option>
))}
    </select>

    <select onChange={(e) => setPolarity(e.target.value)}>
      <option value="positive">+</option>
      <option value="negative">-</option>
      <option value="neutral">Neutre</option>
    </select>

    <button onClick={addMonster}>Ajouter</button>

    <h2>Équipe</h2>
    {team.map((m, i) => (
      <div key={i}>{m} ({m.polarity})</div>
    ))}

    <h2>Remplaçants</h2>
    {bench.map((m, i) => (
      <div key={i}>{m} ({m.polarity})</div>
    ))}

    <h2>Réserve</h2>
    {inventory.map((m, i) => (
      <div key={i}>{m} ({m.polarity})</div>
    ))}

    <h2>Fusions possibles</h2>

    <select onChange={(e) => setFilter(e.target.value)}>
      <option value="all">Toutes</option>
      <option value="valid">Possibles</option>
      <option value="invalid">Impossible</option>
    </select>

    {filteredResults.length === 0 && <p>Aucune</p>}

    {filteredResults.map((f, i) => {
      const suggestion = getSuggestion(f.reasons, f);

      return (
        <div key={i} style={{ marginBottom: 10 }}>
          {f.valid ? "✅" : "❌"} {f.result} ← {f.recipe.join(" + ")}

          {!f.valid && (
            <div style={{ color: "red", fontSize: 12 }}>
              {f.reasons.join(" / ")}

              <div style={{ marginTop: 5 }}>
                💡
                {suggestion.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
);
}
