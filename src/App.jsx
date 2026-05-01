    import React, { useState, useMemo } from "react";
import { monsters } from "./data/monsters.js";

// Fusions exemple
const fusions = [
  // Roi Gluant (recettes réelles)
  { result: "Roi Gluant", parents: ["Gigluant", "Gigluant"], rank: "B" },
  { result: "Roi Gluant", parents: ["Gluant", "Gluant", "Gluant", "Gluant"], rank: "B" },

  // Lézard Argon
  { result: "Lézard Argon", parents: ["Komodor", "Faune"], rank: "C" },

  // Grand Lézard Argon
  { result: "Grand Lézard Argon", parents: ["Lézard Argon", "Lézard Argon", "Lézard Argon", "Lézard Argon"], rank: "B" },

  // Frou-Frou
  { result: "Frou-Frou", parents: ["Lézard Argon", "Lézard Argon", "Lézard Argon", "Grand Lézard Argon"], rank: "A" },

  // Fri-Fri
  { result: "Fri-Fri", parents: ["Komodor", "Vampivol"], rank: "C" }
];

const rankOrder = ["X","S","A","B","C","D","E","F"];

// 🔎 CHAÎNE DE FUSION (UNE SEULE FOIS)
function buildChain(target, depth = 0) {
  if (depth > 3) return [];

  const fusion = fusions.find(f => f.result === target);
  if (!fusion) return [];

  let result = [`${target} ← ${fusion.parents.join(" + ")}`];

  fusion.parents.forEach(p => {
    result = result.concat(buildChain(p, depth + 1));
  });

  return result;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState([]);
  const [polarity, setPolarity] = useState("neutral");
  const [target, setTarget] = useState("");
  const [showInventory, setShowInventory] = useState(false);

  const filteredMonsters = useMemo(() => {
    return monsters.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const addMonster = (name) => {
    setInventory([...inventory, { name, polarity }]);
  };

  const fusionResults = useMemo(() => {
    return fusions
      .map(f => {
        const owned = f.parents.filter(p =>
          inventory.some(m => m.name === p)
        );

        return {
          ...f,
          ownedCount: owned.length
        };
      })
      .sort((a, b) =>
        rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)
      );
  }, [inventory]);

  const chain = target ? buildChain(target) : [];

  return (
    <div style={{ padding: 20 }}>
      <h1>DQMJ Fusion Lite</h1>

      <input
        placeholder="Rechercher monstre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <label><input type="radio" onChange={() => setPolarity("positive")} /> +</label>
        <label><input type="radio" onChange={() => setPolarity("negative")} /> -</label>
        <label><input type="radio" onChange={() => setPolarity("neutral")} /> neutre</label>
      </div>

      <div>
        {filteredMonsters.slice(0,20).map((m, i) => (
          <div key={i} onClick={() => addMonster(m.name)} style={{ cursor: "pointer" }}>
            {m.name}
          </div>
        ))}
      </div>

      <button onClick={() => setShowInventory(!showInventory)}>
  {showInventory ? "Masquer inventaire" : "Voir inventaire"}
</button>

{showInventory && (
  <>
    <h2>Inventaire</h2>
    {inventory.map((m, i) => (
      <div key={i}>{m.name} ({m.polarity})</div>
    ))}
  </>
)}

      <h2>Fusions</h2>
    {fusionResults.map((f, i) => {
  const owned = f.parents.filter(p =>
    inventory.some(m => m.name === p)
  );

  const missing = f.parents.filter(p =>
    !inventory.some(m => m.name === p)
  );

  const isComplete = owned.length === f.parents.length;
  const isPartial = owned.length > 0 && !isComplete;

  return (
    <div
      key={i}
      onClick={() => {
        if (isPartial) {
          alert("Il manque : " + missing.join(", "));
        }
      }}
      style={{
        opacity: isComplete ? 1 : isPartial ? 0.5 : 0.2,
        cursor: isPartial ? "pointer" : "default",
        marginBottom: 10,
        border: "1px solid #ccc",
        padding: 10
      }}
    >
      <strong>{f.result}</strong> ({f.rank})
    </div>
  );
})}

      <h2>Objectif</h2>
      {target && (
        <div style={{ marginTop: 10 }}>
          {(() => {
            const fusion = fusions.find(f => f.result === target);
            if (!fusion) return <div>Aucune fusion trouvée</div>;

            return fusion.parents.map((p, i) => {
              const owned = inventory.some(m => m.name === p);

              return (
                <div key={i}>
                  {owned ? "✅" : "❌"} {p}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
