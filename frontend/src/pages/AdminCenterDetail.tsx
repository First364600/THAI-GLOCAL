import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, CheckCircle2, XCircle, Ban } from "lucide-react";
import useAdminStore, { CenterStatus } from "../store/adminStore";
import useMyCenterStore, { UserWorkshop } from "../store/myCenterStore";
import { useTranslation } from "../i18n/useTranslation";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-stone-200">
        <h3 className="text-lg font-bold text-stone-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function inputCls() {
  return "w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-800 text-sm";
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function AdminCenterDetail({
  centerId,
  onBack,
}: {
  centerId: string;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const center = useAdminStore((s) => s.adminCenters.find((c) => c.id === centerId));
  const [activeTab, setActiveTab] = useState<"info" | "workshops" | "bookings" | "status">("info");

  if (!center) {
    return (
      <div className="p-8 text-center text-stone-500">Center not found.</div>
    );
  }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "info",      label: t.centerDetail.tabs.info },
    { key: "workshops", label: t.centerDetail.tabs.workshops },
    { key: "bookings",  label: t.centerDetail.tabs.bookings },
    { key: "status",    label: t.centerDetail.tabs.status },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-stone-500 hover:text-stone-800 text-sm font-medium flex items-center gap-1 mb-2"
          >
            {t.centerDetail.backToList}
          </button>
          <h2 className="text-2xl font-bold text-stone-900">{center.name}</h2>
          <p className="text-stone-500 text-sm">{center.location}, {center.province}</p>
        </div>
        <CenterStatusPill centerId={centerId} />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-stone-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-t-xl font-medium whitespace-nowrap transition-colors text-sm ${
              activeTab === key
                ? "bg-amber-500 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "info"      && <CenterInfoTab centerId={centerId} />}
      {activeTab === "workshops" && <CenterWorkshopsTab centerId={centerId} />}
      {activeTab === "bookings"  && <CenterBookingsTab centerId={centerId} />}
      {activeTab === "status"    && <CenterStatusTab centerId={centerId} centerName={center.name} />}
    </div>
  );
}

// ─── Status pill ───────────────────────────────────────────────────────────────

function CenterStatusPill({ centerId }: { centerId: string }) {
  const { t } = useTranslation();
  const status = useAdminStore((s) => s.centerStatuses[centerId] ?? "active");
  const map: Record<CenterStatus, { color: string; label: string }> = {
    active:    { color: "bg-green-100 text-green-700",   label: t.centerDetail.status.active },
    suspended: { color: "bg-amber-100 text-amber-700",   label: t.centerDetail.status.suspended },
    disabled:  { color: "bg-red-100 text-red-700",       label: t.centerDetail.status.disabled },
  };
  const { color, label } = map[status];
  return (
    <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${color}`}>{label}</span>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function CenterInfoTab({ centerId }: { centerId: string }) {
  const { t } = useTranslation();
  const di = t.centerDetail.info;
  const center = useAdminStore((s) => s.adminCenters.find((c) => c.id === centerId));
  const updateAdminCenter = useAdminStore((s) => s.updateAdminCenter);

  // Try to get richer UserCenter from myCenterStore
  const userCenter = useMyCenterStore((s) => s.centers.find((c) => c.id === centerId));
  const updateCenter = useMyCenterStore((s) => s.updateCenter);

  const [name, setName] = useState(center?.name ?? "");
  const [nameTh, setNameTh] = useState(center?.nameTh ?? "");
  const [location, setLocation] = useState(center?.location ?? userCenter?.subDistrict ?? "");
  const [province, setProvince] = useState(center?.province ?? userCenter?.province ?? "");
  const [description, setDescription] = useState(center?.description ?? userCenter?.description ?? "");
  const [email, setEmail] = useState(userCenter?.email ?? "");
  const [website, setWebsite] = useState(userCenter?.website ?? "");
  const [lineId, setLineId] = useState(userCenter?.lineId ?? "");
  const [facebook, setFacebook] = useState(userCenter?.facebook ?? "");
  const [phones, setPhones] = useState<string[]>(userCenter?.telephones ?? [""]);
  const [leaderFirst, setLeaderFirst] = useState(userCenter?.communityLeaderFirstName ?? "");
  const [leaderLast, setLeaderLast] = useState(userCenter?.communityLeaderLastName ?? "");
  const [leaderPhone, setLeaderPhone] = useState(userCenter?.communityLeaderTelephone ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const filteredPhones = phones.filter((p) => p.trim());
    updateAdminCenter(centerId, { name, nameTh, location, province, description });
    if (userCenter) {
      updateCenter(centerId, {
        name, nameTh, subDistrict: location, province, description,
        email, website, lineId, facebook,
        telephones: filteredPhones,
        communityLeaderFirstName: leaderFirst,
        communityLeaderLastName: leaderLast,
        communityLeaderTelephone: leaderPhone,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SectionCard title={di.section}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={di.name}>
          <input className={inputCls()} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={di.nameTh}>
          <input className={inputCls()} value={nameTh} onChange={(e) => setNameTh(e.target.value)} />
        </Field>
        <Field label={di.location}>
          <input className={inputCls()} value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>
        <Field label={di.province}>
          <input className={inputCls()} value={province} onChange={(e) => setProvince(e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label={di.description}>
            <textarea
              className={`${inputCls()} resize-none`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>
        <Field label={di.email}>
          <input className={inputCls()} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label={di.website}>
          <input className={inputCls()} value={website} onChange={(e) => setWebsite(e.target.value)} />
        </Field>
        <Field label={di.lineId}>
          <input className={inputCls()} value={lineId} onChange={(e) => setLineId(e.target.value)} />
        </Field>
        <Field label={di.facebook}>
          <input className={inputCls()} value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </Field>

        <div className="md:col-span-2">
          <Field label={di.phones}>
            <div className="space-y-2">
              {phones.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls()}
                    value={p}
                    onChange={(e) => {
                      const updated = [...phones];
                      updated[i] = e.target.value;
                      setPhones(updated);
                    }}
                  />
                  {phones.length > 1 && (
                    <button
                      onClick={() => setPhones(phones.filter((_, j) => j !== i))}
                      className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition"
                    >
                      {di.removePhone}
                    </button>
                  )}
                </div>
              ))}
              {phones.length < 3 && (
                <button
                  onClick={() => setPhones([...phones, ""])}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium transition"
                >
                  + {di.addPhone}
                </button>
              )}
            </div>
          </Field>
        </div>

        <Field label={di.leaderFirstName}>
          <input className={inputCls()} value={leaderFirst} onChange={(e) => setLeaderFirst(e.target.value)} />
        </Field>
        <Field label={di.leaderLastName}>
          <input className={inputCls()} value={leaderLast} onChange={(e) => setLeaderLast(e.target.value)} />
        </Field>
        <Field label={di.leaderPhone}>
          <input className={inputCls()} value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} />
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors text-sm"
        >
          {di.saveChanges}
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> {di.saved}
          </span>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Workshops Tab ─────────────────────────────────────────────────────────────

const EMPTY_WORKSHOP = {
  title: "", titleTh: "", category: "Crafts", description: "",
  duration: "3 hours", maxParticipants: 10, price: 0, difficulty: "Beginner",
};

function CenterWorkshopsTab({ centerId }: { centerId: string }) {
  const { t } = useTranslation();
  const dw = t.centerDetail.workshops;
  const allWorkshops = useMyCenterStore((s) => s.workshops);
  const workshops = useMemo(() => allWorkshops.filter((w) => w.centerId === centerId), [allWorkshops, centerId]);
  const createWorkshop = useMyCenterStore((s) => s.createWorkshop);
  const updateWorkshop = useMyCenterStore((s) => s.updateWorkshop);
  const deleteWorkshop = useMyCenterStore((s) => s.deleteWorkshop);

  const [editing, setEditing] = useState<UserWorkshop | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_WORKSHOP });

  const openCreate = () => { setForm({ ...EMPTY_WORKSHOP }); setCreating(true); setEditing(null); };
  const openEdit = (w: UserWorkshop) => {
    setEditing(w);
    setCreating(false);
    setForm({
      title: w.title, titleTh: w.titleTh, category: w.category,
      description: w.description, duration: w.duration,
      maxParticipants: w.maxParticipants, price: w.price, difficulty: w.difficulty ?? "Beginner",
    });
  };
  const handleCancel = () => { setCreating(false); setEditing(null); };

  const handleSave = () => {
    if (editing) {
      updateWorkshop(editing.id, form);
    } else {
      createWorkshop(centerId, { ...form, centerId, ownerId: "admin", images: [] } as any);
    }
    handleCancel();
  };

  const handleDelete = (w: UserWorkshop) => {
    if (window.confirm(dw.deleteConfirm(w.title))) deleteWorkshop(w.id);
  };

  return (
    <div className="space-y-4">
      {/* Workshop list */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-800">{dw.section}</h3>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> {dw.createNew}
          </button>
        </div>

        {workshops.length === 0 ? (
          <div className="p-8 text-center text-stone-500">{dw.noWorkshops}</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {workshops.map((w) => (
              <div key={w.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition">
                <div>
                  <p className="font-semibold text-stone-900">{w.title}</p>
                  <p className="text-xs text-stone-500">{w.titleTh} · {w.category} · ฿{w.price} · {w.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(w)}
                    className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    title={dw.editWorkshop}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(w)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title={dw.deleteWorkshop}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form (create / edit) */}
      {(creating || editing) && (
        <SectionCard title={editing ? dw.editWorkshop : dw.createNew}>
          <WorkshopForm
            form={form}
            onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </SectionCard>
      )}
    </div>
  );
}

function WorkshopForm({
  form,
  onChange,
  onSave,
  onCancel,
}: {
  form: typeof EMPTY_WORKSHOP;
  onChange: (k: string, v: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const f = t.centerDetail.workshops.form;
  const cats = t.centerDetail.workshops.categories as readonly string[];
  const diffs = t.centerDetail.workshops.difficulties as readonly string[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label={f.titleEn}>
        <input className={inputCls()} value={form.title} onChange={(e) => onChange("title", e.target.value)} />
      </Field>
      <Field label={f.titleTh}>
        <input className={inputCls()} value={form.titleTh} onChange={(e) => onChange("titleTh", e.target.value)} />
      </Field>
      <Field label={f.category}>
        <select className={inputCls()} value={form.category} onChange={(e) => onChange("category", e.target.value)}>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label={f.difficulty}>
        <select className={inputCls()} value={form.difficulty} onChange={(e) => onChange("difficulty", e.target.value)}>
          {diffs.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label={f.duration}>
        <input className={inputCls()} value={form.duration} onChange={(e) => onChange("duration", e.target.value)} />
      </Field>
      <Field label={f.maxParticipants}>
        <input type="number" className={inputCls()} value={form.maxParticipants} min={1}
          onChange={(e) => onChange("maxParticipants", +e.target.value)} />
      </Field>
      <Field label={f.price}>
        <input type="number" className={inputCls()} value={form.price} min={0}
          onChange={(e) => onChange("price", +e.target.value)} />
      </Field>
      <div className="md:col-span-2">
        <Field label={f.description}>
          <textarea className={`${inputCls()} resize-none`} rows={3} value={form.description}
            onChange={(e) => onChange("description", e.target.value)} />
        </Field>
      </div>
      <div className="md:col-span-2 flex gap-3 pt-2">
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition"
        >
          {f.save}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-sm transition"
        >
          {f.cancel}
        </button>
      </div>
    </div>
  );
}

// ─── Bookings Tab ──────────────────────────────────────────────────────────────

function CenterBookingsTab({ centerId }: { centerId: string }) {
  const { t } = useTranslation();
  const db = t.centerDetail.bookings;
  const allWorkshops = useMyCenterStore((s) => s.workshops);
  const workshops = useMemo(() => allWorkshops.filter((w) => w.centerId === centerId), [allWorkshops, centerId]);
  const sessions = useMyCenterStore((s) => s.sessions);
  const bookings = useMyCenterStore((s: any) => s.myBookings || s.bookings);
  const updateBookingStatus = useMyCenterStore((s) => s.updateBookingStatus);

  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const workshopSessions = sessions.filter((ss) => ss.workshopId === selectedWorkshop);
  const bookingStatusLabel = (status: string) =>
    (db.bookingStatuses as Record<string, string>)[status] ?? status;

  const handleAction = (id: string, action: "approved" | "rejected" | "cancelled") => {
    if (action === "cancelled" && !window.confirm(db.cancelConfirm)) return;
    updateBookingStatus(id, action);
  };

  return (
    <div className="space-y-4">
      {/* Workshop selector */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
        <h3 className="text-lg font-bold text-stone-800 mb-3">{db.section}</h3>
        <select
          className={inputCls()}
          value={selectedWorkshop}
          onChange={(e) => { setSelectedWorkshop(e.target.value); setExpandedSession(null); }}
        >
          <option value="">{db.selectWorkshop}</option>
          {workshops.map((w) => (
            <option key={w.id} value={w.id}>{w.title}</option>
          ))}
        </select>
      </div>

      {/* Sessions + bookings */}
      {selectedWorkshop && (
        workshopSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
            {db.noSessions}
          </div>
        ) : (
          workshopSessions.map((session) => {
            const sessionBookings = bookings?.filter((b: any) => b.sessionId === session.id) || [];
            const isOpen = expandedSession === session.id;
            return (
              <div key={session.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSession(isOpen ? null : session.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition text-left"
                >
                  <div>
                    <p className="font-semibold text-stone-900">{session.name}</p>
                    <p className="text-xs text-stone-500">{session.date} · {session.startTime}–{session.endTime} · {sessionBookings.length} bookings</p>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
                </button>

                {isOpen && (
                  <div className="border-t border-stone-100 overflow-x-auto">
                    {sessionBookings.length === 0 ? (
                      <p className="p-4 text-center text-stone-500 text-sm">{db.noBookings}</p>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 border-b border-stone-200">
                          <tr>
                            <th className="p-3 font-semibold text-stone-600">{db.columns.participant}</th>
                            <th className="p-3 font-semibold text-stone-600">{db.columns.phone}</th>
                            <th className="p-3 font-semibold text-stone-600">{db.columns.participants}</th>
                            <th className="p-3 font-semibold text-stone-600">{db.columns.payment}</th>
                            <th className="p-3 font-semibold text-stone-600">{db.columns.status}</th>
                            <th className="p-3 font-semibold text-stone-600 text-right">{db.columns.action}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionBookings.map((b: any) => (
                            <tr key={b.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                              <td className="p-3 font-medium text-stone-900">{b.firstName} {b.lastName}</td>
                              <td className="p-3 text-stone-600">{b.telephone}</td>
                              <td className="p-3 text-stone-600">{b.participants}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                  {(db.paymentStatuses as Record<string, string>)[b.paymentStatus]}
                                </span>
                              </td>
                              <td className="p-3">
                                <BookingStatusBadge status={b.status} label={bookingStatusLabel(b.status)} />
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {(b.status === "pending" || b.status === "cancellation_requested") && (
                                    <>
                                      <button
                                        onClick={() => handleAction(b.id, "approved")}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                                        title={db.approve}
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleAction(b.id, "rejected")}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title={db.reject}
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  {b.status !== "cancelled" && (
                                    <button
                                      onClick={() => handleAction(b.id, "cancelled")}
                                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      title={db.cancel}
                                    >
                                      <Ban className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )
      )}
    </div>
  );
}

function BookingStatusBadge({ status, label }: { status: string; label: string }) {
  const colorMap: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-stone-100 text-stone-700",
    cancellation_requested: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colorMap[status] ?? "bg-stone-100 text-stone-700"}`}>
      {label}
    </span>
  );
}

// ─── Status Tab ────────────────────────────────────────────────────────────────

function CenterStatusTab({ centerId, centerName }: { centerId: string; centerName: string }) {
  const { t } = useTranslation();
  const ds = t.centerDetail.status;
  const status = useAdminStore((s) => s.centerStatuses[centerId] ?? "active");
  const updateCenterStatus = useAdminStore((s) => s.updateCenterStatus);

  const bannerInfo: Record<CenterStatus, { bg: string; text: string; msg: string }> = {
    active:    { bg: "bg-green-50 border-green-200", text: "text-green-800", msg: ds.warningActive },
    suspended: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", msg: ds.warningSuspended },
    disabled:  { bg: "bg-red-50 border-red-200",     text: "text-red-800",   msg: ds.warningDisabled },
  };
  const { bg, text, msg } = bannerInfo[status];

  const act = (next: CenterStatus, confirm: string) => {
    if (window.confirm(confirm)) updateCenterStatus(centerId, next);
  };

  return (
    <SectionCard title={ds.section}>
      {/* Status banner */}
      <div className={`p-4 rounded-xl border mb-6 ${bg}`}>
        <p className={`font-medium text-sm ${text}`}>{msg}</p>
      </div>

      {/* Current status */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-stone-600">{ds.currentStatus}:</span>
        <CenterStatusPill centerId={centerId} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {status !== "active" && (
          <button
            onClick={() => act("active", ds.activateConfirm(centerName))}
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {ds.activateBtn}
          </button>
        )}
        {status !== "suspended" && (
          <button
            onClick={() => act("suspended", ds.suspendConfirm(centerName))}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" /> {ds.suspendBtn}
          </button>
        )}
        {status !== "disabled" && (
          <button
            onClick={() => act("disabled", ds.disableConfirm(centerName))}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition flex items-center gap-2"
          >
            <Ban className="w-4 h-4" /> {ds.disableBtn}
          </button>
        )}
      </div>
    </SectionCard>
  );
}
