import { useState, useEffect } from "react";

const ENV = "production";
const API_URL =
  ENV === "development"
    ? "http://localhost:8080/api/solicitudes"
    : "https://proteccion-prueba.onrender.com/api/solicitudes";

function App() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [formData, setFormData] = useState({
    tipo: "CONSULTA",
    prioridadManual: 1,
    usuario: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Uses Colombian/Spanish format: DD/MM/YYYY, HH:MM a.m./p.m.
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Fetch Data
  const fetchSolicitudes = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setSolicitudes(data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      fetchSolicitudes();
      setFormData({ ...formData, usuario: "" });
    });
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">
        Motor de Reglas de Priorización
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8 flex gap-4"
      >
        <select
          className="border p-2 rounded"
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
        >
          <option value="INCIDENTE">Incidente</option>
          <option value="REQUERIMIENTO">Requerimiento</option>
          <option value="CONSULTA">Consulta</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          className="border p-2 rounded w-20"
          value={formData.prioridadManual}
          onChange={(e) =>
            setFormData({
              ...formData,
              prioridadManual: parseInt(e.target.value),
            })
          }
        />

        <input
          type="text"
          placeholder="Usuario"
          className="border p-2 rounded grow"
          value={formData.usuario}
          required
          onChange={(e) =>
            setFormData({ ...formData, usuario: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>

      <div className="bg-white shadow rounded overflow-hidden">
        {solicitudes.map((sol) => (
          <div
            key={sol.id}
            className="border-b last:border-0 p-4 flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <div className="flex items-center mb-1">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold mr-3 ${
                    sol.tipo === "INCIDENTE"
                      ? "bg-red-100 text-red-800"
                      : sol.tipo === "REQUERIMIENTO"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {sol.tipo}
                </span>
                <span className="font-medium text-gray-700">{sol.usuario}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Prioridad Manual:{" "}
                <span className="font-bold">{sol.prioridadManual}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatDate(sol.fechaCreacion)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
