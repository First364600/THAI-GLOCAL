import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import {
  Plus, Pencil, Trash2, Building2, Layers, ChevronDown, ChevronUp,
  X, Save, MapPin, Tag, BookOpen, Clock, Users, DollarSign, ArrowLeft
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useMyCenterStore, { UserCenter, UserWorkshop } from "../store/myCenterStore";
import { ImageCarousel } from "../components/ImageCarousel";

// ─── helpers ────────────────────────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add tag and press Enter"
          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm">
          Add
        </button>
      </div>
    </div>
  );
}

function BulletListInput({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v) onChange([...items, v]);
    setInput("");
  };
  return (
    <div>
      <ul className="mb-2 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 bg-stone-50 rounded-lg text-sm text-stone-700">
            <span>{item}</span>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="w-3.5 h-3.5 text-stone-400 hover:text-red-500" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
        />
        <button type="button" onClick={add} className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm">
          Add
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
const labelCls = "block text-sm font-medium text-stone-700 mb-1.5";

// ─── Center form ─────────────────────────────────────────────────────────────

const EMPTY_CENTER = {
  name: "",
  nameTh: "",
  subDistrict: "",
  district: "",
  province: "",
  locationLink: "",
  telephones: [] as string[],
  email: "",
  lineId: "",
  facebook: "",
  website: "",
  description: "",
  communityLeaderFirstName: "",
  communityLeaderLastName: "",
  communityLeaderTelephone: "",
  images: [] as string[],
};

function CenterForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_CENTER>;
  onSave: (data: any) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_CENTER, ...initial });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const set = (k: keyof typeof EMPTY_CENTER, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, imageFiles }); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Center Name *</label>
          <input required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="My Learning Center" />
        </div>
        <div>
          <label className={labelCls}>Center Name (TH)</label>
          <input className={inputCls} value={form.nameTh} onChange={(e) => set("nameTh", e.target.value)} placeholder="ศูนย์เรียนรู้ของฉัน" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Sub-district (ตำบล/แขวง) *</label>
          <input required className={inputCls} value={form.subDistrict} onChange={(e) => set("subDistrict", e.target.value)} placeholder="Mae Rim Tai" />
        </div>
        <div>
          <label className={labelCls}>District (อำเภอ/เขต) *</label>
          <input required className={inputCls} value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Mae Rim" />
        </div>
        <div>
          <label className={labelCls}>Province (จังหวัด) *</label>
          <input required className={inputCls} value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="Chiang Mai" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Location Link (Google Maps URL)</label>
        <input type="url" className={inputCls} value={form.locationLink} onChange={(e) => set("locationLink", e.target.value)} placeholder="https://maps.app.goo.gl/..." />
      </div>
      
      <div className="pt-2 border-t border-stone-100">
        <h3 className="font-medium text-stone-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Telephones (Max 3, at least 1 required) *</label>
            <BulletListInput items={form.telephones} onChange={(v) => { if (v.length <= 3) set("telephones", v); }} placeholder="08xxxxxxxx" />
            {form.telephones.length === 0 && <p className="text-xs text-red-500 mt-1">Please add at least 1 telephone number</p>}
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contact@center.com" />
          </div>
          <div>
            <label className={labelCls}>Line ID</label>
            <input className={inputCls} value={form.lineId} onChange={(e) => set("lineId", e.target.value)} placeholder="@centerline" />
          </div>
          <div>
            <label className={labelCls}>Facebook Page</label>
            <input className={inputCls} value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="facebook.com/centerpage" />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input type="url" className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://center.com" />
          </div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-stone-100">
        <h3 className="font-medium text-stone-800 mb-4">Community Leader Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input className={inputCls} value={form.communityLeaderFirstName} onChange={(e) => set("communityLeaderFirstName", e.target.value)} placeholder="First Name" />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input className={inputCls} value={form.communityLeaderLastName} onChange={(e) => set("communityLeaderLastName", e.target.value)} placeholder="Last Name" />
          </div>
          <div>
            <label className={labelCls}>Leader's Telephone</label>
            <input type="tel" className={inputCls} value={form.communityLeaderTelephone} onChange={(e) => set("communityLeaderTelephone", e.target.value)} placeholder="08xxxxxxxx" />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-100">
        <h3 className="font-medium text-stone-800 mb-4">Additional Details</h3>
        <div className="mb-4">
          <label className={labelCls}>Description *</label>
          <textarea required rows={4} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Tell guests about your center…" />
        </div>
        <div className="mb-4">
          <label className={labelCls}>Center Images (Exactly 3, Image only) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={form.images.length >= 3}
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              
              const accepted = files.slice(0, 3 - form.images.length);
              const newImagesInfo = await Promise.all(
                accepted.map((file) => {
                  return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                })
              );
              
              set("images", [...form.images, ...newImagesInfo]);
              setImageFiles((prev) => [...prev, ...accepted]);
            }}
            className="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors cursor-pointer"
          />
          {form.images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`Center preview ${i+1}`} className="w-24 h-24 object-cover rounded-xl border border-stone-200" />
                  <button 
                    type="button" 
                    onClick={() => { set("images", form.images.filter((_, idx) => idx !== i)); setImageFiles((prev) => prev.filter((_, idx) => idx !== i)); }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-stone-100 text-stone-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {form.images.length !== 3 && <p className="text-xs text-red-500 mt-2">Please upload exactly 3 images before saving.</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-stone-100 mt-2">
        <button type="submit" disabled={form.telephones.length === 0 || form.images.length !== 3} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Save className="w-4 h-4" /> Save Center
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Workshop form ───────────────────────────────────────────────────────────

const EMPTY_ACT = {
  title: "", titleTh: "", category: "Crafts", description: "", images: [] as string[],
  duration: "", maxParticipants: 10, price: 0,
  // Auto-generation properties
  recurringDays: [] as string[], // e.g. ["Mon", "Wed", "Fri"]
  sessionType: "Daily Time Slots",
  sessionRounds: [{ start: "13:00", end: "16:00" }],
  defaultActivityName: "",
  defaultActivityDescription: "",
  defaultRegistrationCapacity: 10,
};

function WorkshopForm({ initial, onSave, onCancel }: {
  initial?: Partial<typeof EMPTY_ACT>;
  onSave: (data: typeof EMPTY_ACT) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_ACT, ...initial });
  const [errorMessage, setErrorMessage] = useState("");
  const set = <K extends keyof typeof EMPTY_ACT>(k: K, v: (typeof EMPTY_ACT)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleDay = (day: string) => {
    const current = form.recurringDays;
    set("recurringDays", current.includes(day) ? current.filter(d => d !== day) : [...current, day]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Duration Validation Logic
    if (form.duration && form.sessionRounds && form.sessionRounds.length > 0) {
      const match = form.duration.match(/(\d+)/);
      if (match) {
        const durationHours = parseInt(match[1]);
        const isValid = form.sessionRounds.every(round => {
          if (!round.start || !round.end) return true; // skip if incomplete
          const [sH, sM] = round.start.split(":").map(Number);
          const [eH, eM] = round.end.split(":").map(Number);
          let diffHours = eH - sH + (eM - sM) / 60;
          if (diffHours < 0) diffHours += 24; // Handle overnight gently
          return Math.abs(diffHours - durationHours) < 0.1; // allow small float err
        });

        if (!isValid) {
          setErrorMessage("Error: The selected time slot does not match the Workshop Duration.");
          return;
        }
      }
    }

    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
          {errorMessage}
        </div>
      )}
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col gap-4">
        <h4 className="font-semibold text-stone-800 flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-500" /> 1. Main Profile</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Workshop Name *</label>
            <input required className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Traditional Thai Cooking" />
          </div>
          <div>
            <label className={labelCls}>ชื่อภาษาไทย</label>
            <input className={inputCls} value={form.titleTh} onChange={(e) => set("titleTh", e.target.value)} placeholder="อาหารไทยดั้งเดิม" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>Workshop Category *</label>
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option>Crafts</option>
              <option>Cooking</option>
              <option>Arts</option>
              <option>Music</option>
              <option>Wellness</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Description *</label>
          <textarea required rows={3} className={inputCls + " resize-none"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Overall overview of this workshop program…" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}><Clock className="w-3.5 h-3.5 inline mr-1" />Duration *</label>
            <input required className={inputCls} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="Define total time per activity, e.g., 3 hours" />
          </div>
          <div>
            <label className={labelCls}><Users className="w-3.5 h-3.5 inline mr-1" />Member Capacity *</label>
            <input type="number" min={1} className={inputCls} value={form.maxParticipants} onChange={(e) => set("maxParticipants", Number(e.target.value))} placeholder="Total seats available" />
          </div>
          <div>
            <label className={labelCls}><DollarSign className="w-3.5 h-3.5 inline mr-1" />Price *</label>
            <input type="number" min={0} className={inputCls} value={form.price} onChange={(e) => set("price", Number(e.target.value))} placeholder="Per activity or total" />
          </div>
        </div>
      </div>

      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex flex-col gap-4">
        <h4 className="font-semibold text-stone-800 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> 2. Create Activity (Activity Scheduler)</h4>
        
        <div>
          <label className={labelCls}>Recurring Schedule (Select days)</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${form.recurringDays.includes(day) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Activity Type</label>
            <input type="text" readOnly className={`${inputCls} bg-stone-50 text-stone-600`} value="Daily Time Slots" />
          </div>
          <div>
             <label className={labelCls}>Registration Capacity (Seats per activity)</label>
            <input type="number" min={1} className={inputCls} value={form.defaultRegistrationCapacity} onChange={(e) => set("defaultRegistrationCapacity", Number(e.target.value))} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-stone-800">Daily Activity Rounds (Add custom rounds for each day)</p>
              <button
                type="button"
                className="text-xs text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
                onClick={() => set("sessionRounds", [...form.sessionRounds, { start: "13:00", end: "16:00" }])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Round
              </button>
            </div>
            <p className="text-xs text-stone-500 mb-2">Please specify your preferred time range for each slot (e.g., 13:00 – 16:00).<br/><span className="text-amber-600 font-medium">Requirement:</span> The selected time range must accurately correspond with the total Duration of the activity.</p>
          </div>

          {form.sessionRounds.map((round, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <span className="text-xs font-semibold text-stone-400 w-16">Round {idx + 1}</span>
              <input type="time" className={inputCls + " py-2"} value={round.start} onChange={(e) => {
                const newRounds = [...form.sessionRounds];
                newRounds[idx].start = e.target.value;
                set("sessionRounds", newRounds);
              }} required />
              <span className="text-stone-400 font-medium">to</span>
              <input type="time" className={inputCls + " py-2"} value={round.end} onChange={(e) => {
                const newRounds = [...form.sessionRounds];
                newRounds[idx].end = e.target.value;
                set("sessionRounds", newRounds);
              }} required />
              {form.sessionRounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => set("sessionRounds", form.sessionRounds.filter((_, i) => i !== idx))}
                  className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 text-xs flex gap-2 items-start mt-2">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-medium">Automation Logic: Sunday Weekly Refresh</strong>
            <p className="mt-0.5 text-blue-700/80">New activity slots are automatically generated every Sunday based on the recurring schedule. Each generated slot can be manually adjusted (e.g., to avoid overlaps or for special events) and generate every activity in one week show.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 hidden">
          <div>
             <label className={labelCls}>Default Activity Name</label>
             <input className={inputCls} value={form.defaultActivityName} onChange={(e) => set("defaultActivityName", e.target.value)} />
          </div>
          <div>
             <label className={labelCls}>Default Activity Description</label>
             <textarea rows={2} className={inputCls} value={form.defaultActivityDescription} onChange={(e) => set("defaultActivityDescription", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col gap-4">
        <h4 className="font-semibold text-stone-800 flex items-center gap-2"><Layers className="w-4 h-4 text-amber-500" /> Additional Details</h4>
        <div className="mb-4">
          <label className={labelCls}>Workshop Images (Exactly 3, Image only) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={form.images.length >= 3}
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              
              const newImagesInfo = await Promise.all(
                files.slice(0, 3 - form.images.length).map((file) => {
                  return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                })
              );
              
              set("images", [...form.images, ...newImagesInfo]);
            }}
            className="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors cursor-pointer"
          />
          {form.images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`Workshop preview ${i+1}`} className="w-24 h-24 object-cover rounded-xl border border-stone-200" />
                  <button 
                    type="button" 
                    onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-stone-100 text-stone-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {form.images.length !== 3 && <p className="text-xs text-red-500 mt-2">Please upload exactly 3 images before saving.</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={form.images.length !== 3} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
          <Save className="w-4 h-4" /> Save Workshop
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Workshop card ───────────────────────────────────────────────────────────

function WorkshopCard({ workshop, onEdit, onDelete, onManage }: {
  workshop: UserWorkshop;
  onEdit: () => void;
  onDelete: () => void;
  onManage: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group/mycard-carousel">
      {workshop.images && workshop.images.length > 0 ? (
        <div className="w-full sm:w-36 h-32 sm:h-auto shrink-0 relative overflow-hidden group-hover/mycard-carousel:[&>div>img]:scale-105">
          <ImageCarousel images={workshop.images} alt={workshop.title} className="w-full h-full" />
        </div>
      ) : (
        <div className="w-full sm:w-36 h-32 sm:h-auto bg-amber-50 flex items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8 text-amber-300" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <button
                onClick={onManage}
                className="text-left w-full group"
              >
                <h3 className="font-semibold text-stone-800 text-sm group-hover:text-amber-600 transition-colors">{workshop.title}</h3>
                {workshop.titleTh && <p className="text-xs text-stone-400">{workshop.titleTh}</p>}
              </button>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{workshop.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workshop.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {workshop.maxParticipants}</span>
            <span className="flex items-center gap-1 font-medium text-amber-700">฿{workshop.price.toLocaleString()}</span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{workshop.category}</span>
          </div>
          <button
            onClick={onManage}
            className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            Manage Activities →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Drawer = "none" | "createCenter" | "editCenter" | "workshop" | "editWorkshop";

export function MyCenterPage() {
  const user = useAuthStore((s) => s.user);
  const store = useMyCenterStore();
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState<Drawer>("none");
  const [activeCenterId, setActiveCenterId] = useState<string | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<UserWorkshop | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [pendingWorkshopUpdate, setPendingWorkshopUpdate] = useState<typeof EMPTY_ACT | null>(null);
  const [tab, setTab] = useState<"workshops" | "info">("workshops");
  const [centerExpanded, setCenterExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user.id || user.userId;
      if (userId) store.fetchMyCenterData(String(userId));
    }
  }, [user]);

  if (!user) return <Navigate to="/login" state={{ from: "/my-center" }} replace />;

  // Map API fields to UI fields
  const centers = (store.myCenters || []).map((c: any) => ({
    ...c,
    id: c.centerId ?? c.id,
    name: c.centerName ?? c.name,
    images: c.centerImages ?? c.images ?? [],
    locationLink: c.googleMapLink ?? c.locationLink,
    lineId: c.line ?? c.lineId,
    website: c.webSite ?? c.website,
    communityLeaderFirstName: c.leaderFirstName ?? c.communityLeaderFirstName,
    communityLeaderLastName: c.leaderLastName ?? c.communityLeaderLastName,
    communityLeaderTelephone: c.leaderTelephone ?? c.communityLeaderTelephone,
  }));
  const activeCenter = activeCenterId ? centers.find((c: any) => String(c.id) === String(activeCenterId)) : null;
  const workshops = activeCenter
    ? (store.myWorkshops || []).filter((w: any) => String(w.centerId) === String(activeCenter.id)).map((w: any) => ({
        ...w,
        id: w.workshopId ?? w.id,
        name: w.workshopName ?? w.name,
        title: w.workshopName ?? w.title ?? w.name,
        images: w.workshopImages ?? w.images ?? [],
        category: w.workshopType ?? w.category,
        maxParticipants: w.memberCapacity ?? w.maxParticipants,
      }))
    : [];

  const saveCenter = async (data: typeof EMPTY_CENTER) => {
    if (drawer === "editCenter" && activeCenter) {
      await store.updateCenter(activeCenter.id, data);
    } else {
      const userId = user?.id || user?.userId;
      if (!userId) {
        alert("Cannot create center: missing user id. Please log in again.");
        return;
      }
      const created: any = await store.createCenter(String(userId), { ...data });
      // If backend returns the new center, set it active
      const newId = created?.centerId ?? created?.id;
      if (newId) setActiveCenterId(String(newId));
      // Refresh list after creation
      await store.fetchMyCenterData(String(userId));
    }
    setDrawer("none");
    setCenterExpanded(false);
  };

  const requestSaveWorkshop = (data: typeof EMPTY_ACT) => {
    if (editingWorkshop) {
      setPendingWorkshopUpdate(data);
    } else {
      executeSaveWorkshop(data);
    }
  };

  const executeSaveWorkshop = (data: typeof EMPTY_ACT) => {
    if (!activeCenter) return;
    if (editingWorkshop) {
      store.updateWorkshop(editingWorkshop.id, data);
      (store as any).generateWeeklySessions(editingWorkshop.id);
      setEditingWorkshop(null);
    } else {
      const newWorkshop = (store as any).createWorkshop({ ...data, centerId: activeCenter.id, ownerId: user.id });
      if ((newWorkshop as any).recurringDays && newWorkshop.recurringDays.length > 0) {
        (store as any).generateWeeklySessions((newWorkshop as any).id);
      }
    }
    setPendingWorkshopUpdate(null);
    setDrawer("none");
  };

  const handleDeleteWorkshop = (id: string) => {
    store.deleteWorkshop(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      {/* Header */}
      <div
        className="py-10 px-4"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 mb-2">
            {activeCenter && (
              <button 
                onClick={() => { setActiveCenterId(null); setDrawer("none"); }}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="Back to All Centers"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            {!activeCenter && (
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeCenter ? activeCenter.name : "My Centers"}
              </h1>
              <p className="text-amber-200 text-sm">
                {activeCenter ? "Manage your cultural learning center" : "Manage your cultural learning centers"}
              </p>
            </div>
          </div>
          {!activeCenter && Object.keys(centers).length > 0 && drawer !== "createCenter" && (
            <button
              onClick={() => setDrawer("createCenter")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 hover:bg-stone-50 rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Center
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ── Centers List Dashboard ─────────────────────────────────── */}
        {!activeCenter && drawer === "none" && centers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {centers.map((c: any) => (
              <div 
                key={c.id} 
                onClick={() => setActiveCenterId(c.id)}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:border-amber-200 transition-all group"
              >
                {c.images && c.images[0] ? (
                  <img src={c.images[0]} alt={c.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-amber-50 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-amber-300" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-stone-800 group-hover:text-amber-600 transition-colors">{c.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />{c.district}, {c.province}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-amber-600">Manage Center →</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── No center yet ─────────────────────────────────── */}
        {!activeCenter && drawer === "none" && centers.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-amber-200 p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">You don't have a center yet</h2>
            <p className="text-stone-500 text-sm max-w-sm mb-6">
              Create your cultural learning center to start adding workshops for guests to book.
            </p>
            <button
              onClick={() => setDrawer("createCenter")}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create My Center
            </button>
          </div>
        )}

        {/* ── Create center form ─────────────────────────────── */}
        {!activeCenter && drawer === "createCenter" && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" /> Create Your Center
            </h2>
            <CenterForm onSave={saveCenter} onCancel={() => setDrawer("none")} />
          </div>
        )}

        {/* ── Center dashboard ───────────────────────────────── */}
        {activeCenter && (
          <div className="flex flex-col gap-6">
            {/* Center info summary card */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  {activeCenter.images && activeCenter.images[0] ? (
                    <img src={activeCenter.images[0]} alt={activeCenter.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-stone-800">{activeCenter.name}</h2>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <MapPin className="w-3 h-3" />{activeCenter.district}, {activeCenter.province}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setDrawer("editCenter"); setCenterExpanded(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setCenterExpanded(!centerExpanded)}
                    className="p-1.5 rounded-xl hover:bg-stone-50 text-stone-400 transition-colors"
                  >
                    {centerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {centerExpanded && drawer !== "editCenter" && (
                <div className="px-6 py-4 text-sm text-stone-600 flex flex-col gap-4">
                  <p>{activeCenter.description}</p>
                  {activeCenter.images && activeCenter.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {activeCenter.images.map((img: any, i: any) => (
                        <img key={i} src={img} alt={`${activeCenter.name} preview`} className="w-24 h-24 object-cover rounded-xl border border-stone-100 shrink-0" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawer === "editCenter" && (
                <div className="px-6 py-5 border-t border-stone-50">
                  <h3 className="text-sm font-semibold text-stone-700 mb-4">Edit Center Info</h3>
                  <CenterForm
                    initial={activeCenter}
                    onSave={saveCenter}
                    onCancel={() => setDrawer("none")}
                  />
                </div>
              )}
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
              {(["workshops", "info"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${t === tab ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"}`}
                >
                  {t === "workshops" ? <><Layers className="w-3.5 h-3.5 inline mr-1" />Workshops ({workshops.length})</> : "Center Info"}
                </button>
              ))}
            </div>

            {/* ── Workshops tab ───── */}
            {tab === "workshops" && (
              <div className="flex flex-col gap-4">
                {drawer === "workshop" || drawer === "editWorkshop" ? (
                  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                    <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      {editingWorkshop ? "Edit Workshop" : "Add New Workshop"}
                    </h3>
                    <WorkshopForm
                      initial={editingWorkshop ? {
                        title: editingWorkshop.title,
                        titleTh: editingWorkshop.titleTh,
                        category: editingWorkshop.category,
                        description: editingWorkshop.description,
                        images: editingWorkshop.images,
                        duration: editingWorkshop.duration,
                        maxParticipants: editingWorkshop.maxParticipants,
                        price: editingWorkshop.price,
                        recurringDays: editingWorkshop.recurringDays,
                        sessionType: editingWorkshop.sessionType,
                        sessionRounds: editingWorkshop.sessionRounds,
                        defaultActivityName: editingWorkshop.defaultActivityName,
                        defaultActivityDescription: editingWorkshop.defaultActivityDescription,
                        defaultRegistrationCapacity: editingWorkshop.defaultRegistrationCapacity,
                      } : undefined}
                      onSave={requestSaveWorkshop}
                      onCancel={() => { setDrawer("none"); setEditingWorkshop(null); }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingWorkshop(null); setDrawer("workshop"); }}
                    className="flex items-center gap-2 self-start px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Workshop
                  </button>
                )}

                {workshops.length === 0 && drawer === "none" && (
                  <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-10 text-center">
                    <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">No workshops yet. Add your first workshop above.</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {workshops.map((ws: any) => (
                    <div key={ws.id}>
                      {confirmDeleteId === ws.id ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-3">
                          <p className="text-sm text-red-700">Delete <strong>{ws.title}</strong>?</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleDeleteWorkshop(ws.id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium">Delete</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <WorkshopCard
                          workshop={ws}
                          onEdit={() => { setEditingWorkshop(ws); setDrawer("editWorkshop"); }}
                          onDelete={() => setConfirmDeleteId(ws.id)}
                          onManage={() => navigate(`/my-center/workshop/${ws.id}`)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Info tab ───── */}
            {tab === "info" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h3 className="text-base font-semibold text-stone-800 mb-5">Center Details</h3>
                <dl className="flex flex-col gap-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Center Name</dt><dd className="text-stone-800">{activeCenter.name}</dd></div>
                    {activeCenter.nameTh && <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">ชื่อภาษาไทย</dt><dd className="text-stone-800">{activeCenter.nameTh}</dd></div>}
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Location</dt>
                    <dd className="text-stone-800">
                      {activeCenter.subDistrict}, {activeCenter.district}, {activeCenter.province}
                      {activeCenter.locationLink && <a href={activeCenter.locationLink} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline ml-2">(Map)</a>}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Contact</dt>
                      <dd className="text-stone-800 flex flex-col gap-1">
                        {activeCenter.telephones?.length > 0 && <span>Tel: {activeCenter.telephones.join(", ")}</span>}
                        {activeCenter.email && <span>Email: {activeCenter.email}</span>}
                        {activeCenter.lineId && <span>Line: {activeCenter.lineId}</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Social & Web</dt>
                      <dd className="text-stone-800 flex flex-col gap-1">
                        {activeCenter.facebook && <span>Facebook: {activeCenter.facebook}</span>}
                        {activeCenter.website && <span>Website: <a href={activeCenter.website} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">{activeCenter.website}</a></span>}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Community Leader</dt>
                    <dd className="text-stone-800">
                      {`${activeCenter.communityLeaderFirstName || ''} ${activeCenter.communityLeaderLastName || ''}`.trim() || 'N/A'}
                      {activeCenter.communityLeaderTelephone && <div className="text-stone-500 mt-0.5">Tel: {activeCenter.communityLeaderTelephone}</div>}
                    </dd>
                  </div>
                  <div><dt className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">Description</dt><dd className="text-stone-600 leading-relaxed">{activeCenter.description}</dd></div>
                </dl>
              </div>
            )}
          </div>
        )}
      </div>

      {pendingWorkshopUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-800">Update Settings?</h3>
            </div>
            <div className="p-5 text-sm text-stone-600 bg-stone-50/50 leading-relaxed">
              <p>These changes will be applied to next week's schedule. The current week's activities will remain unchanged. Do you wish to proceed?</p>
            </div>
            <div className="p-4 bg-white flex gap-3 justify-end items-center border-t border-stone-100">
              <button 
                onClick={() => setPendingWorkshopUpdate(null)} 
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeSaveWorkshop(pendingWorkshopUpdate)} 
                className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
