import React, { useState, useMemo } from "react"; import { monsters } from "./data/monsters.js";

// Exemple simple de fusions (à compléter) const fusions = [ { result: "Roi Gluant", parents: ["Gluant", "Gluant"], rank: "B" }, { result: "Gigluant", parents: ["Gluant", "Gluant"], rank: "D" }, { result: "Fri-Fri", parents: ["Komodor", "Vampivol"], rank: "C" } ];

const rankOrder = ["S","A","B","C","D","E","F"];

export default function App() { const [search, setSearch] = useState(""); const [inventory, setInventory] = useState([]); const [polarity, setPolarity] = useState("neutral");

const filteredMonsters = useMemo(() => { return monsters.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) ); }, [search]);

const addMonster = (name) => { setInventory([...inventory, { name, polarity }]); };

const fusionResults = useMemo(() => { return fusions .map(f => { const owned = f.parents.filter(p => inventory.some(m => m.name === p) );

return {
      ...f,
      ownedCount: owned.length
    };
  })
  .sort((a, b) =>
    rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)
  );

}, [inventory]);

return ( <div style={{ padding: 20 }}> <h1>DQMJ Fusion Lite</h1>

{/* Recherche */}
  <input
    placeholder="Rechercher monstre..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* Polarité */}
  <div>
    <label><input type="radio" onChange={() => setPolarity("positive")} /> +</label>
    <label><input type="radio" onChange={() => setPolarity("negative")} /> -</label>
    <label><input type="radio" onChange={() => setPolarity("neutral")} /> neutre</label>
  </div>

  {/* Résultats recherche */}
  <div>
    {filteredMonsters.slice(0,20).map((m, i
