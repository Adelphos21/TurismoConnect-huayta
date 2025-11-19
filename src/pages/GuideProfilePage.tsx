import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { getGuideById, type GuideDetail } from "servicios/guides";

export default function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<GuideDetail | null>(null);

  useEffect(() => {
    if (id) getGuideById(id).then(setGuide).catch(console.error);
  }, [id]);

  if (!guide)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando guía...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Image */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden">
        <img
          src="/images/arequipa-white-city-with-misti-volcano.jpg"
          alt="Paisaje de Perú"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative -mt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Guide Info */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center gap-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    `${guide.nombres} ${guide.apellidos}`
                  )}&background=cccccc&color=000`}
                  alt={guide.nombres}
                  className="w-28 h-28 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {guide.nombres} {guide.apellidos}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-1">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    {guide.city}, {guide.country}
                  </div>
                  {guide.ratingAvg != null && (
                    <div className="flex items-center text-gray-800 mt-2">
                      <FaStar className="text-black mr-1" />
                      <span className="font-medium">{guide.ratingAvg.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {guide.languages.map((lang, idx) => (
                      <div key={idx} className="flex items-center gap-2 border border-black rounded-md px-3 py-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {lang.name} ({lang.code.toUpperCase()})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sobre mí</h2>
              <p className="text-gray-700 leading-relaxed">{guide.bio}</p>
            </div>
          </div>

          {/* Pricing and Reservation */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <p className="text-sm text-gray-600">Desde</p>
              <h3 className="text-2xl font-bold text-gray-900">
                S/ 55 <span className="text-base font-normal text-gray-600">/hora</span>
              </h3>
              {guide.createdAt && (
                <p className="text-gray-600 text-sm mt-4">
                  Miembro desde{" "}
                  {new Date(guide.createdAt).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              )}
              <Link
                to={`/reservations/new/${guide.id}`}
                className="mt-6 w-full inline-block text-center bg-black text-white py-2.5 rounded-md"
              >
                Reservar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
