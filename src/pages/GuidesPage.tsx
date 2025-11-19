import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGuides, type GuideSearchItem } from "servicios/guides";
import { FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";

export default function GuidesPage() {
  const [guides, setGuides] = useState<GuideSearchItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const cities = [
    "Lima", "Cusco", "Arequipa", "Iquitos", "Trujillo", "Puno", "Tarapoto"
  ];

  useEffect(() => {
    getGuides()
      .then((data) => {
        setGuides(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error al cargar guías:", err));
  }, []);

  const filteredGuides = guides.filter((g) => {
    const name = g.fullName?.toLowerCase() || "";
    const city = g.city?.toLowerCase() || "";
    const s = search.toLowerCase();
    const matchSearch = name.includes(s) || city.includes(s);
    const matchCity = selectedCity ? city === selectedCity.toLowerCase() : true;
    return matchSearch && matchCity;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 pt-24">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Encuentra tu guía peruano perfecto</h1>
        <p className="text-gray-600 mt-2">Explora perfiles de guías locales certificados en todo Perú</p>
      </div>

      {/* Buscador */}
      <div className="max-w-6xl mx-auto bg-white p-5 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex items-center w-full md:w-2/3 border rounded-md px-4 py-2">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar guías o ciudades..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="w-full md:w-1/3 border rounded-md px-4 py-2 text-gray-700 bg-gray-50"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Tarjetas de guías */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">No se encontraron guías.</p>
        ) : (
          filteredGuides.map((g) => (
            <div key={g.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(g.fullName || "")}&background=cccccc&color=000`}
                  alt={g.fullName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{g.fullName}</h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaMapMarkerAlt className="text-red-500 mr-1" />
                    {g.city || "Perú"}
                  </div>
                  {g.ratingAvg != null && (
                    <div className="flex items-center text-yellow-500 mt-1 text-sm">
                      <FaStar className="mr-1" />
                      <span className="text-gray-800">{g.ratingAvg.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {g.languages?.map((code) => (
                  <span key={code} className="border border-black rounded-md px-3 py-1 text-sm">
                    {code.toUpperCase()}
                  </span>
                ))}
              </div>

              <hr className="my-3 border-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Desde</span>
                  <p className="font-bold text-gray-900">
                    {g.hourlyRate
                      ? `${g.hourlyRate.currency === "PEN" ? "S/" : ""} ${g.hourlyRate.hourlyRate} /hora`
                      : "S/ 55 /hora"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/guides/${g.id}`} className="border border-black px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
                    Ver perfil
                  </Link>
                  <Link
                    to={`/reservations/new/${g.id}`}
                    className="bg-black text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-900"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
