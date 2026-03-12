import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, MapPin, Star, Users, ChevronRight, Sparkles, Award, Globe } from "lucide-react";
import useDataStore from "../store/dataStore";
import { WorkshopCard } from "../components/WorkshopCard";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { activities, centers, fetchData, isLoading } = useDataStore();

  useEffect(() => { fetchData(); }, []);

  const featured = activities.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/workshops?search=${encodeURIComponent(searchQuery)}`);
  };

  const stats = [
    { icon: Globe, value: "4", label: "Regions" },
    { icon: Award, value: "8+", label: "Activities" },
    { icon: Users, value: "500+", label: "Happy Guests" },
    { icon: Sparkles, value: "100%", label: "Authentic" },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #78350f 0%, #92400e 35%, #b45309 65%, #d97706 100%)",
        }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-yellow-300/10 blur-xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-32 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            <span className="text-amber-200" style={{ fontSize: "0.8rem" }}>
              Discover Local Wisdom · ค้นพบภูมิปัญญาท้องถิ่น
            </span>
          </div>

          <h1 className="text-white mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, lineHeight: 1.15 }}>
            Book Authentic Thai
            <br />
            <span className="text-amber-300">Cultural Experiences</span>
          </h1>
          <p className="text-amber-100/90 max-w-2xl mx-auto mb-10" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7 }}>
            Connect with local masters across Thailand. Learn traditional crafts, cooking,
            music, and wellness practices directly from community learning centers.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search activities, crafts, cooking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-stone-800 placeholder:text-stone-400"
                  style={{ fontSize: "0.95rem" }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium shadow-sm whitespace-nowrap"
                style={{ fontSize: "0.9rem" }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {["Pottery", "Silk Weaving", "Thai Cooking", "Herbal Medicine", "Khon Dance"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/workshops?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 rounded-full transition-colors"
                style={{ fontSize: "0.75rem" }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-md border border-stone-100 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-stone-900 font-bold" style={{ fontSize: "1.5rem" }}>{value}</p>
              <p className="text-stone-500" style={{ fontSize: "0.8rem" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Activities */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-amber-600 font-medium mb-1" style={{ fontSize: "0.85rem" }}>FEATURED ACTIVITIES</p>
            <h2 className="text-stone-900" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
              Popular Experiences
            </h2>
          </div>
          <Link
            to="/workshops"
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((activity) => (
            <WorkshopCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      {/* Centers Section */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-medium mb-1" style={{ fontSize: "0.85rem" }}>LOCAL LEARNING CENTERS</p>
            <h2 className="text-stone-900 mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
              Our Partner Centers
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto" style={{ fontSize: "0.95rem" }}>
              Authentic community learning centers across Thailand, where local masters share their heritage with the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centers.map((center) => (
              <Link key={center.id} to={`/centers/${center.id}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 flex">
                  <div className="w-32 flex-shrink-0 overflow-hidden group/mini-carousel">
                    <img
                      src={center.images?.[0] || ""}
                      alt={center.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-stone-900 group-hover:text-amber-700 transition-colors" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {center.name}
                      </h3>
                      <p className="text-stone-400" style={{ fontSize: "0.7rem" }}>{center.nameTh}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2" style={{ fontSize: "0.75rem" }}>
                      <span className="flex items-center gap-1 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {center.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {center.tags?.map((tag: any) => (
                        <span key={tag} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full" style={{ fontSize: "0.65rem" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/centers"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded-xl transition-colors font-medium"
              style={{ fontSize: "0.875rem" }}
            >
              Explore All Centers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-medium mb-1" style={{ fontSize: "0.85rem" }}>HOW IT WORKS</p>
          <h2 className="text-stone-900" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700 }}>
            Simple to Book
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Browse Activities",
              desc: "Explore authentic Thai cultural experiences from local learning centers across Thailand.",
              icon: "🔍",
            },
            {
              step: "02",
              title: "Choose a Session",
              desc: "Pick a date and time that works for you. See real-time availability for each session.",
              icon: "📅",
            },
            {
              step: "03",
              title: "Book & Enjoy",
              desc: "Fill in your details, confirm your booking, and get ready for an unforgettable experience!",
              icon: "✨",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4 text-2xl">
                {item.icon}
              </div>
              <div className="text-amber-500 font-bold mb-1" style={{ fontSize: "0.75rem" }}>
                STEP {item.step}
              </div>
              <h3 className="text-stone-900 mb-2" style={{ fontWeight: 600 }}>{item.title}</h3>
              <p className="text-stone-500" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="mx-4 mb-16 rounded-3xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #78350f, #d97706)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-8 py-16 text-center">
          <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700 }}>
            Ready to Discover Thai Culture?
          </h2>
          <p className="text-amber-100 mb-8" style={{ fontSize: "1rem" }}>
            Join hundreds of travelers connecting with authentic Thai traditions through our local learning centers.
          </p>
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-amber-700 rounded-2xl font-semibold hover:bg-amber-50 transition-colors shadow-lg"
          >
            Explore All Activities <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontSize: "0.75rem" }}>TG</span>
              </div>
              <span className="text-white font-semibold">Thai Glocal</span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
              Bridging local Thai wisdom with global travelers. Every booking supports local communities and preserves cultural heritage.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3" style={{ fontSize: "0.875rem" }}>Quick Links</h4>
            <ul className="space-y-2" style={{ fontSize: "0.8rem" }}>
              {["Home", "Activities", "Centers", "My Bookings"].map((l) => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase().replace(" ", "-")}`} className="hover:text-amber-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3" style={{ fontSize: "0.875rem" }}>Contact</h4>
            <ul className="space-y-2" style={{ fontSize: "0.8rem" }}>
              <li>📧 hello@thaiglocal.com</li>
              <li>📞 +66 2 123 4567</li>
              <li>🕐 Mon–Sun, 8AM–8PM</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-stone-800 text-center" style={{ fontSize: "0.75rem" }}>
          © 2026 Thai Glocal. All rights reserved. | ลิขสิทธิ์ 2569 ไทยโกลคอล สงวนลิขสิทธิ์
        </div>
      </footer>
    </div>
  );
}
