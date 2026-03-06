import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { activities, categories, provinces, centers } from "../data/mockData";
import { WorkshopCard } from "../components/WorkshopCard";

export function WorkshopsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const selectedProvince = searchParams.get("province") || "All Provinces";
  const sortBy = searchParams.get("sort") || "default";

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "All" || value === "All Provinces" || value === "default" || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.titleTh.includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (selectedProvince !== "All Provinces") {
      result = result.filter((a) => {
        const center = centers.find((c) => c.id === a.centerId);
        return center?.province === selectedProvince;
      });
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [searchQuery, selectedCategory, selectedProvince, sortBy]);

  const activeFilters = [
    searchQuery && { label: `"${searchQuery}"`, key: "search" },
    selectedCategory !== "All" && { label: selectedCategory, key: "category" },
    selectedProvince !== "All Provinces" && { label: selectedProvince, key: "province" },
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Header */}
      <div
        className="py-12 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}
      >
        <h1 className="text-white mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700 }}>
          Browse Workshops
        </h1>
        <p className="text-amber-200" style={{ fontSize: "0.95rem" }}>
          กิจกรรมทางวัฒนธรรมไทย · Authentic Thai Cultural Workshops
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 focus-within:border-amber-400 transition-colors">
            <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => updateParam("search", e.target.value)}
              className="flex-1 bg-transparent outline-none text-stone-800 placeholder:text-stone-400"
              style={{ fontSize: "0.875rem" }}
            />
            {searchQuery && (
              <button onClick={() => updateParam("search", "")} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-600"
            style={{ fontSize: "0.875rem" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Category filter */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 outline-none text-stone-700 cursor-pointer focus:border-amber-400 transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedProvince}
              onChange={(e) => updateParam("province", e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 outline-none text-stone-700 cursor-pointer focus:border-amber-400 transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2.5 outline-none text-stone-700 cursor-pointer focus:border-amber-400 transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="sm:hidden flex flex-col gap-2 mb-4 bg-white rounded-xl p-4 border border-stone-200">
            <select
              value={selectedCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none text-stone-700"
              style={{ fontSize: "0.875rem" }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={selectedProvince}
              onChange={(e) => updateParam("province", e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none text-stone-700"
              style={{ fontSize: "0.875rem" }}
            >
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none text-stone-700"
              style={{ fontSize: "0.875rem" }}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        )}

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-stone-500" style={{ fontSize: "0.8rem" }}>Active filters:</span>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => updateParam(filter.key, "")}
                className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
                style={{ fontSize: "0.75rem" }}
              >
                {filter.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => setSearchParams({})}
              className="text-stone-500 hover:text-stone-700 underline"
              style={{ fontSize: "0.75rem" }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", cat)}
              className={`px-4 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-600"
              }`}
              style={{ fontSize: "0.8rem" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500" style={{ fontSize: "0.875rem" }}>
            <span className="text-stone-900 font-medium">{filteredActivities.length}</span> activities found
          </p>
        </div>

        {/* Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredActivities.map((activity) => (
              <WorkshopCard key={activity.id} activity={activity} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-stone-900 mb-2" style={{ fontWeight: 600 }}>No activities found</h3>
            <p className="text-stone-500 mb-4" style={{ fontSize: "0.875rem" }}>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
