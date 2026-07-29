import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  isAdmin, logout, getSettings, saveSettings,
  listItems, addItem, updateItem, deleteItem
} from "@/lib/localdb";
import { LogOut, Plus, Pencil, Trash2, Save, X, ExternalLink, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard · DXM '26" }] }),
  component: AdminPage,
});

type TableKey = "settings" | "events" | "schedule_items" | "team_members" | "participants" | "sponsors" | "gallery_items";
type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "number" | "url" | "image" };

const SCHEMA: Record<TableKey, { label: string; fields: FieldDef[] }> = {
  settings: {
    label: "Home / Contact Settings",
    fields: [
      { key: "hero_title", label: "Home: Hero Title" },
      { key: "hero_subtitle", label: "Home: Hero Subtitle" },
      { key: "hero_description", label: "Home: Hero Description", type: "textarea" },
      { key: "stat_participants", label: "Stats: Participants (e.g. 1200+)" },
      { key: "stat_colleges", label: "Stats: Colleges (e.g. 300+)" },
      { key: "stat_events", label: "Stats: Events (e.g. 25+)" },
      { key: "stat_workshops", label: "Stats: Workshops (e.g. 50+)" },
      { key: "contact_phone", label: "Contact: Phone" },
      { key: "contact_email", label: "Contact: Email" },
      { key: "contact_address", label: "Contact: Address", type: "textarea" },
    ],
  },
  events: {
    label: "Events",
    fields: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category (TECHNICAL / NON TECHNICAL / WORKSHOPS)" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "fee", label: "Fee (e.g. ₹150 per team)" },
      { key: "rules", label: "Rules & Regulations", type: "textarea" },
      { key: "sort_order", label: "Display Order", type: "number" },
    ],
  },
  schedule_items: {
    label: "Schedule",
    fields: [
      { key: "day_label", label: "Day (e.g. 29 AUG)" },
      { key: "time_label", label: "Time (e.g. 10:00 AM)" },
      { key: "title", label: "Session Title" },
      { key: "venue", label: "Venue" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Display Order", type: "number" },
    ],
  },
  team_members: {
    label: "Team",
    fields: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role / Designation" },
      { key: "category", label: "Category (FACULTY / STUDENT COORDINATORS / CORE TEAM)" },
      { key: "photo_url", label: "Photo", type: "image" },
      { key: "contact", label: "Contact / Social" },
      { key: "sort_order", label: "Display Order", type: "number" },
    ],
  },
  participants: {
    label: "Participants",
    fields: [
      { key: "name", label: "Name" },
      { key: "college", label: "College" },
      { key: "event", label: "Event" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
    ],
  },
  sponsors: {
    label: "Sponsors",
    fields: [
      { key: "name", label: "Name" },
      { key: "tier", label: "Tier (TITLE / PLATINUM / SILVER / BRONZE)" },
      { key: "logo_url", label: "Logo", type: "image" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "sort_order", label: "Display Order", type: "number" },
    ],
  },
  gallery_items: {
    label: "Gallery",
    fields: [
      { key: "title", label: "Title" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "caption", label: "Category / Caption (HIGHLIGHTS / EVENTS / WORKSHOPS / CAMPUS)", type: "textarea" },
      { key: "sort_order", label: "Display Order", type: "number" },
    ],
  },
};

const TABLES = Object.keys(SCHEMA) as TableKey[];

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TableKey>("events");

  useEffect(() => {
    if (!isAdmin()) {
      navigate({ to: "/auth" });
    } else {
      setReady(true);
    }
  }, []);

  function signOut() {
    logout();
    navigate({ to: "/auth" });
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-500">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-orange-600">ADMIN DASHBOARD</div>
            <div className="font-display text-xl text-slate-900">DXM '26</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <ExternalLink className="h-4 w-4" /> VIEW SITE
            </Link>
            <Link
              to="/food-admin"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-widest border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              🍽️ FOOD TOKENS ADMIN
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" /> SIGN OUT
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3 flex flex-wrap gap-2">
          {TABLES.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition ${
                tab === t
                  ? "text-white shadow-md"
                  : "text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
              style={tab === t ? { background: "linear-gradient(135deg, #ff6a00, #ee0979)" } : {}}
            >
              {SCHEMA[t].label.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <CrudSection key={tab} table={tab} />
      </main>
    </div>
  );
}

function CrudSection({ table }: { table: TableKey }) {
  const def = SCHEMA[table];
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() { if (table === "settings") { getSettings().then(s => setRows([s])); } else { listItems(table).then(setRows); } }

  useEffect(() => { load(); }, [table]);

  const blank = useMemo(() => {
    const o: any = {};
    def.fields.forEach((f) => (o[f.key] = f.type === "number" ? 0 : ""));
    return o;
  }, [table]);

  // Sort rows by sort_order if field exists
  const sortedRows = useMemo(() => {
    const hasSortOrder = def.fields.some(f => f.key === "sort_order");
    if (!hasSortOrder) return rows;
    return [...rows].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
  }, [rows, def.fields]);

  async function reorderItem(id: string, direction: "up" | "down") {
    const hasSortOrder = def.fields.some(f => f.key === "sort_order");
    if (!hasSortOrder) return;
    const sorted = [...rows].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
    const idx = sorted.findIndex(r => r.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    
    // Swap in the array
    const temp = sorted[idx];
    sorted[idx] = sorted[swapIdx];
    sorted[swapIdx] = temp;
    
    // Update all sort_orders to match new index to guarantee correct ordering
    await Promise.all(sorted.map((item, index) => 
      updateItem(table, item.id, { ...item, sort_order: index })
    ));
    
    load();
  }

  async function save() {
    setSaving(true);
    const payload: any = {};
    def.fields.forEach((f) => {
      const v = editing[f.key];
      payload[f.key] = f.type === "number" ? Number(v) || 0 : v || null;
    });

    try {
      if (table === "settings") {
        await saveSettings(payload);
      } else if (editing.id) {
        await updateItem(table, editing.id, payload);
      } else {
        await addItem(table, payload);
      }
      setEditing(null);
      load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) { if (!confirm("Are you sure?")) return; await deleteItem(table, id); load(); }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
        setEditing((prev: any) => ({ ...prev, [key]: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {saved && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          <CheckCircle className="h-4 w-4" />
          Saved successfully! Changes are now live on the website.
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl text-slate-900">{def.label}</h2>
          <p className="text-sm text-slate-500">
            {table === "settings" ? "Edit site-wide settings." : `${rows.length} ${rows.length === 1 ? "entry" : "entries"} · Add, edit or delete.`}
          </p>
        </div>
        {table !== "settings" && (
          <button
            onClick={() => setEditing({ ...blank })}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-white shadow-md hover:shadow-lg transition"
            style={{ background: "linear-gradient(135deg, #ff6a00, #ee0979)" }}
          >
            <Plus className="h-4 w-4" /> ADD NEW
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 text-sm">
          No entries yet. {table !== "settings" && "Click ADD NEW to create one."}
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedRows.map((r, rowIdx) => (
            <div
              key={r.id || "settings"}
              className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-4 hover:border-orange-300 hover:shadow-sm transition"
            >
              {(r.image_url || r.photo_url || r.logo_url) ? (
                <img
                  src={r.image_url || r.photo_url || r.logo_url}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg border border-slate-200 bg-slate-100 grid place-items-center text-slate-400 text-xs flex-shrink-0">
                  {(r.title || r.name || r.hero_title || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 truncate flex items-center gap-2">
                  {def.fields.some(f => f.key === "sort_order") && (
                    <span className="text-[10px] font-bold tracking-widest bg-orange-100 text-orange-600 rounded-full px-2 py-0.5 shrink-0">
                      #{rowIdx + 1}
                    </span>
                  )}
                  {r.title || r.name || r.hero_title || r.day_label || "Untitled"}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {r.description || r.caption || r.role || r.hero_subtitle || r.time_label || r.email || r.tier || r.category || ""}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0 items-center">
                {def.fields.some(f => f.key === "sort_order") && table !== "settings" && (
                  <div className="flex flex-col gap-0.5 mr-1">
                    <button
                      onClick={() => reorderItem(r.id, "up")}
                      disabled={rowIdx === 0}
                      className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => reorderItem(r.id, "down")}
                      disabled={rowIdx === sortedRows.length - 1}
                      className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setEditing({ ...r })}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {table !== "settings" && (
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-slate-900">
                {editing.id ? "Edit" : "New"} {def.label}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {def.fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-[10px] tracking-[0.3em] text-slate-500">
                    {f.label.toUpperCase()}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="mt-1 w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:bg-white outline-none"
                    />
                  ) : f.type === "image" ? (
                    <div className="mt-1">
                      {editing[f.key] && (
                        <img src={editing[f.key]} className="h-20 w-20 object-cover rounded mb-2 border border-slate-200" alt="Preview" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, f.key)}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                    </div>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      className="mt-1 w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:bg-white outline-none"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg px-4 py-2 text-xs font-bold tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                CANCEL
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-white shadow-md hover:shadow-lg disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #ff6a00, #ee0979)" }}
              >
                <Save className="h-4 w-4" /> {saving ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

