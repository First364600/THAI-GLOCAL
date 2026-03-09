import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { MapPin, Star, ChevronLeft } from "lucide-react";
import useDataStore from "../store/dataStore";
import { WorkshopCard } from "../components/WorkshopCard";
import { ImageCarousel } from "../components/ImageCarousel";

export function CentersPage() {
  const { centers, activities, fetchData } = useDataStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  const centerList = centers;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-stone-900 mb-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700 }}>
            Cultural Centers
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto" style={{ fontSize: "0.95rem" }}>
            Discover our network of authentic Thai cultural centers across the country
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {centerList.map((center) => {
            const centerActivities = activities.filter((a) => a.centerId === center.id);
            return (
              <Link
                key={center.id}
                to={`/centers/${center.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative overflow-hidden group-hover:[&>div>img]:scale-105" style={{ height: "200px" }}>
                  <ImageCarousel
                    images={center.images || []}
                    alt={center.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex flex-wrap gap-1.5">
                      {center.tags?.slice(0, 3).map((tag: any) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="text-stone-900 mb-0.5 group-hover:text-amber-700 transition-colors"
                    style={{ fontWeight: 600, fontSize: "1.05rem" }}
                  >
                    {center.name}
                  </h3>
                  <p className="text-stone-400 mb-3" style={{ fontSize: "0.78rem" }}>
                    {center.nameTh}
                  </p>
                  <div className="flex items-center gap-1.5 text-stone-500 mb-3" style={{ fontSize: "0.8rem" }}>
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {center.location}, {center.province}
                  </div>
                  <p className="text-stone-500 mb-4" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                    {center.description.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-stone-500" style={{ fontSize: "0.8rem" }}>
                      {centerActivities.length} activit{centerActivities.length === 1 ? "y" : "ies"}
                    </span>
                    <span className="text-amber-600 font-medium" style={{ fontSize: "0.8rem" }}>
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CenterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { centers, activities, fetchData } = useDataStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  const center = centers.find((c) => c.id === id);

  if (!center) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏯</div>
          <h2 className="text-stone-900 mb-2">Center not found</h2>
          <Link to="/centers" className="text-amber-600 hover:underline">
            Browse all centers
          </Link>
        </div>
      </div>
    );
  }

  const centerActivities = activities.filter((a) => a.centerId === center.id);

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-16">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 pt-6 mb-4">
        <Link
          to="/centers"
          className="inline-flex items-center gap-1 text-stone-500 hover:text-amber-600 transition-colors"
          style={{ fontSize: "0.875rem" }}
        >
          <ChevronLeft className="w-4 h-4" /> All Centers
        </Link>
      </div>

      {/* Hero */}
      <div className="relative mb-8" style={{ height: "280px" }}>
        <ImageCarousel images={center.images || []} alt={center.name} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 pb-6">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {center.tags?.map((tag: any) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white"
                style={{ fontSize: "0.75rem" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-white mb-1" style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700 }}>
            {center.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80" style={{ fontSize: "0.875rem" }}>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {center.location}, {center.province}
            </span>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8">
        {/* Description */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100">
          <h2 className="text-stone-900 mb-3" style={{ fontWeight: 600 }}>About the Center</h2>
          <p className="text-stone-600 mb-4" style={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
            {center.description}
          </p>

        </div>

        {/* Activities */}
        {centerActivities.length > 0 && (
          <div>
            <h2 className="text-stone-900 mb-4" style={{ fontWeight: 600, fontSize: "1.2rem" }}>
              Workshops at This Center
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {centerActivities.map((activity) => (
                <WorkshopCard key={activity.id} activity={activity} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
