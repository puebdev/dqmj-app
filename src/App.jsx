import React, { useState } from "react";

const monsters = [
  { name: "Gluant", family: "Gluant", rank: "F" },
  { name: "Gluante", family: "Gluant", rank: "E" },
  { name: "Gigluant", family: "Gluant", rank: "D" },
  { name: "Gigluante", family: "Gluant", rank: "D" },
  { name: "Roi Gluant", family: "Gluant", rank: "C" },
  { name: "Gluant de métal", family: "Gluant", rank: "D" },
  { name: "Gluant de mercure", family: "Gluant", rank: "C" },
  { name: "Vampivol", family: "Démon", rank: "F" },
  { name: "Scorpion", family: "Naturel", rank: "F" },
  { name: "Komodor", family: "Dragon", rank: "F" }
];

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState("");
  const [polarity, setPolarity] = useState("+");
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");

  const addMonster = () => {
    if (!selected) return;

    setInventory([
      ...inventory,
      {
        name: selected,
        polarity
      }
    ]);
  };

  const removeMonster = (index) => {
    const copy = [...inventory];
    copy.splice(index, 1);
    setInventory(copy);
  };

  const canFuse = (m1, m2) => {
    if (!m1 || !m2) return false;
    return m1 !== m2; // simplifié pour l’instant
  };

  const getSuggestions = () => {
    const names = inventory.map((m) => m.name);
    const suggestions = [];

    if (names.filter((n) => n === "Gigluant").length >= 2) {
      suggestions.push("Roi Gluant");
    }

    if (names.filter((n) => n === "Gluant").length >= 4) {
      suggestions.push("Roi Gluant (méthode 4)");
    }

    if (names.filter((n) => n === "Gluant de mercure").length >= 4) {
      suggestions.push("Roi Gluant de métal");
    }

    if (
      names.includes("Gluant") &&
      names.includes("Gigluant")
    ) {
      suggestions.push("Gigluante");
    }

    return suggestions;
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>Fusion DQMJ</h1>

      {/* Recherche */}
      <input
        placeholder="Rechercher un monstre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* Filtre famille */}
      <select
        value={familyFilter}
        onChange={(e) => setFamilyFilter(e.target.value)}
      >
        <option value="all">Toutes familles</option>
        <option value="Gluant">Gluant</option>
        <option value="Dragon">Dragon</option>
        <option value="Démon">Démon</option>
        <option value="Naturel">Naturel</option>
      </select>

      <br /><br />

      {/* Sélection monstre */}
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">Choisir un monstre</option>
        {monsters
          .filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase())
          )
          .filter(
            (m) => familyFilter === "all" || m.family === familyFilter
          )
          .map((m) => (
            <option key={m.name} value={m.name}>
              {m.name} ({m.rank})
            </option>
          ))}
      </select>

      {/* Polarité */}
      <select
        value={polarity}
        onChange={(e) => setPolarity(e.target.value)}
      >
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="0">Neutre</option>
      </select>

      <button onClick={addMonster}>Ajouter</button>

      <h2>Inventaire</h2>

      {inventory.map((m, i) => (
        <div key={i}>
          {m.name} ({m.polarity})
          <button onClick={() => removeMonster(i)}>X</button>
        </div>
      ))}

      <h2>Suggestions</h2>

      {getSuggestions().length === 0 && <p>Aucune</p>}

      {getSuggestions().map((s, i) => (
        <div key={i}>➡ {s}</div>
      ))}
    </div>
  );
}
