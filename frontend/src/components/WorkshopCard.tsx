import { Link } from "react-router";
import { Clock, Users, Star, MapPin } from "lucide-react";
import { Activity, centers } from "../data/mockData";
import { ImageCarousel } from "./ImageCarousel";

interface WorkshopCardProps {
  activity: Activity;
  compact?: boolean;
}

export function WorkshopCard({ activity, compact = false }: WorkshopCardProps) {
  const center = centers.find((c) => c.id === activity.centerId);
  const nextSession = activity.sessions.find((s) => s.availableSpots > 0);
  const isAvailable = !!nextSession;

  const categoryColors: Record<string, string> = {
    Crafts: "bg-amber-100 text-amber-700",
    Cooking: "bg-orange-100 text-orange-700",
    "Music & Arts": "bg-purple-100 text-purple-700",
    Wellness: "bg-green-100 text-green-700",
    "Culinary Arts": "bg-rose-100 text-rose-700",
  };

  return (
    <Link to={`/workshops/${activity.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden group-hover:[&>div>img]:scale-105" style={{ height: compact ? "180px" : "220px" }}>
          <ImageCarousel
            images={activity.images || []}
            alt={activity.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category] || "bg-stone-100 text-stone-600"}`}>
              {activity.category}
            </span>
          </div>
          {/* Price */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1 shadow-sm">
            <span className="text-amber-700 font-semibold" style={{ fontSize: "0.875rem" }}>
              ฿{activity.price.toLocaleString()}
            </span>
          </div>
          {/* Availability */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white/90 text-stone-800 px-4 py-1.5 rounded-full text-sm font-medium">
                Fully Booked
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div>
            <h3 className="text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1" style={{ fontSize: "1rem", fontWeight: 600 }}>
              {activity.title}
            </h3>
            <p className="text-stone-500" style={{ fontSize: "0.75rem" }}>{activity.titleTh}</p>
          </div>

          {!compact && (
            <p className="text-stone-600 line-clamp-2 flex-1" style={{ fontSize: "0.8rem" }}>
              {activity.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-stone-500 mt-auto" style={{ fontSize: "0.75rem" }}>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activity.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Max {activity.maxParticipants}
            </span>
          </div>

          {/* Center */}
          {center && (
            <div className="flex items-center gap-1 text-stone-500 border-t border-stone-50 pt-2 mt-1" style={{ fontSize: "0.75rem" }}>
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{center.name} · {center.location}</span>
            </div>
          )}

          {/* Next Session */}
          {isAvailable && nextSession && (
            <div className="flex items-center justify-between bg-amber-50 rounded-xl px-3 py-2">
              <div>
                <p className="text-amber-700 font-medium" style={{ fontSize: "0.75rem" }}>
                  Next:{" "}
                  {new Date(nextSession.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {nextSession.time}
                </p>
              </div>
              <span className="text-amber-600" style={{ fontSize: "0.7rem" }}>
                {nextSession.availableSpots} spots left
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
