import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/lib/site-data";
import { apiUrl, tradeAssetUrl } from "@/lib/api";
import { MediaPreview } from "@/components/media-preview";
import { getLinkPlatform, linkPlatformLabel } from "@/lib/media";
import { LogOut, Package, ImageIcon, Upload, Pencil, Trash2, Link2, Film } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password: pwd }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        toast.error(data.error || "Login failed");
        return;
      }
      localStorage.setItem("adminToken", data.token);
      onLogin();
      toast.success("Logged in");
    } catch {
      toast.error("Could not reach server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4" style={{ background: "#F7F9FC" }}>
      <form onSubmit={submit} className="card-haf p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="font-display text-xl text-navy">HAF Import & Supply Trade</div>
          <div className="text-sm text-label mt-1">Admin Login</div>
        </div>
        <input required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-[var(--border)] mb-3 focus:outline-none focus:border-[var(--brand-blue)]" />
        <input required type="password" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={6}
          className="w-full px-4 py-3 rounded-md border border-[var(--border)] mb-4 focus:outline-none focus:border-[var(--brand-blue)]" />
        <button disabled={loading} className="btn-primary w-full">{loading ? "..." : "Login"}</button>
      </form>
    </div>
  );
}

type Tab = "dashboard" | "post-media" | "post-product" | "manage-products" | "manage-media";

function AdminPage() {
  const nav = useNavigate();
  const [token, setToken] = useState<string>("");
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    setToken(localStorage.getItem("adminToken") || "");
  }, []);

  if (!token) return <Login onLogin={() => setToken(localStorage.getItem("adminToken") || "")} />;

  const tabLabels: Record<Tab, string> = {
    dashboard: "Dashboard",
    "post-product": "Post product",
    "post-media": "Post media",
    "manage-products": "Products",
    "manage-media": "Media",
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F9FC" }}>
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-20">
        <div className="container-haf flex flex-wrap items-center justify-between gap-3 min-h-16 py-3">
          <div>
            <div className="font-display text-lg text-navy leading-tight">HAF Admin</div>
            <div className="text-[11px] text-label uppercase tracking-wider">Content management</div>
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {(["dashboard","post-product","post-media","manage-products","manage-media"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-2 rounded-md capitalize transition-colors"
                style={{ color: tab === t ? "var(--brand-blue)" : "var(--navy)", background: tab === t ? "var(--tint-blue)" : "transparent" }}>
                {tabLabels[t]}
              </button>
            ))}
            <button onClick={() => { localStorage.removeItem("adminToken"); setToken(""); nav({ to: "/" }); }}
              className="ml-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs text-label hover:bg-red-50 hover:text-destructive transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="container-haf py-10">
        {tab === "dashboard" && <Dashboard onPick={setTab} />}
        {tab === "post-product" && <PostProduct token={token} />}
        {tab === "post-media" && <PostMedia token={token} />}
        {tab === "manage-products" && <ManageProducts token={token} />}
        {tab === "manage-media" && <ManageMedia token={token} />}
      </main>
    </div>
  );
}

function AdminPageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="admin-page-title">{title}</h1>
      <p className="admin-page-sub">{subtitle}</p>
    </div>
  );
}

function Dashboard({ onPick }: { onPick: (t: Tab) => void }) {
  const cards = [
    { t: "post-media" as Tab, icon: ImageIcon, title: "Post Media", desc: "Images, videos, or YouTube / Facebook links" },
    { t: "post-product" as Tab, icon: Package, title: "Post Product", desc: "Add a new product listing" },
    { t: "manage-products" as Tab, icon: Pencil, title: "Manage Products", desc: "Edit or delete products" },
    { t: "manage-media" as Tab, icon: Film, title: "Manage Media", desc: "Review and remove coverage items" },
  ];
  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="Choose what you want to publish or manage." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <button key={c.t} onClick={() => onPick(c.t)} className="admin-panel p-6 text-left hover:-translate-y-1 transition-transform">
            <div className="icon-square mb-4"><c.icon className="h-5 w-5" /></div>
            <div className="font-semibold text-navy font-sans">{c.title}</div>
            <div className="text-xs text-label mt-1 leading-relaxed">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

type MediaKind = "image" | "video" | "link";

function PostMedia({ token }: { token: string }) {
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState<MediaKind>("image");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    try {
      const fd = new FormData(form);
      fd.set("media_type", kind);

      if (kind === "link") {
        const link = String(fd.get("external_link") || "").trim();
        if (!link) {
          toast.error("Enter a YouTube or Facebook URL");
          return;
        }
        fd.delete("file");
      } else {
        fd.delete("external_link");
        const file = fd.get("file");
        if (!(file instanceof File) || !file.size) {
          toast.error("Choose an image or video file");
          return;
        }
        fd.delete("file");
        fd.append("media", file);
      }

      const res = await fetch(apiUrl("/api/media/"), {
        method: "POST",
        headers: authHeaders(token),
        body: fd,
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || data.message || "Failed to post media");
        return;
      }

      toast.success("Media posted");
      form.reset();
      setKind("image");
    } catch {
      toast.error("Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Post media coverage"
        subtitle="Upload an image or video, or share a YouTube / Facebook link."
      />
      <form onSubmit={submit} className="admin-panel p-8 max-w-2xl space-y-6">
        <div>
          <span className="admin-label">Media type</span>
          <input type="hidden" name="media_type" value={kind} />
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--muted)" }}>
            {([
              { id: "image" as const, label: "Image", icon: ImageIcon },
              { id: "video" as const, label: "Video", icon: Film },
              { id: "link" as const, label: "Link", icon: Link2 },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-active={kind === id}
                className="admin-type-pill inline-flex items-center justify-center gap-2"
                onClick={() => setKind(id)}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="admin-label" htmlFor="media-title">Title</label>
            <input id="media-title" required name="title" className="admin-input" placeholder="e.g. Featured on national news" />
          </div>
          <div>
            <label className="admin-label" htmlFor="media-desc">Description</label>
            <textarea id="media-desc" required name="description" rows={4} className="admin-input resize-none" placeholder="Short summary for the media page" />
          </div>
        </div>

        {kind === "link" ? (
          <div
            className="rounded-lg p-5 space-y-3 border border-[var(--border)]"
            style={{ background: "var(--tint-blue)" }}
          >
            <label className="admin-label mb-0" htmlFor="external-link">YouTube or Facebook URL</label>
            <input
              id="external-link"
              required
              type="url"
              name="external_link"
              className="admin-input"
              placeholder="https://www.youtube.com/watch?v=... or https://facebook.com/..."
            />
            <p className="text-xs text-label">Paste a public video or post link. YouTube videos will embed on the site.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="media-file">{kind === "image" ? "Image file" : "Video file"}</label>
              <input
                id="media-file"
                required
                type="file"
                name="file"
                accept={kind === "image" ? "image/*" : "video/*"}
                className="admin-input py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[var(--tint-blue)] file:text-[var(--brand-blue)]"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="youtube-extra">Extra link (optional)</label>
              <input
                id="youtube-extra"
                type="url"
                name="youtube_link"
                className="admin-input"
                placeholder="YouTube or Facebook link shown below the media"
              />
            </div>
          </div>
        )}

        <button disabled={busy} className="btn-primary w-full sm:w-auto">
          <Upload className="h-4 w-4" /> {busy ? "Publishing..." : "Publish coverage"}
        </button>
      </form>
    </div>
  );
}

function PostProduct({ token }: { token: string }) {
  const [cat, setCat] = useState("Water Purification");
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    try {
      const fd = new FormData(form);
      fd.set("category", cat === "Other" ? custom : cat);

      const mainFiles = (form.elements.namedItem("main") as HTMLInputElement).files;
      const exploreFiles = (form.elements.namedItem("explore") as HTMLInputElement).files;

      fd.delete("main");
      fd.delete("explore");
      for (const file of Array.from(mainFiles || [])) fd.append("mainImages", file);
      for (const file of Array.from(exploreFiles || [])) fd.append("explore_images", file);

      const res = await fetch(apiUrl("/api/product/upload"), {
        method: "POST",
        headers: authHeaders(token),
        body: fd,
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || data.message || "Failed to post product");
        return;
      }

      toast.success("Product posted");
      form.reset();
      setCat("Water Purification");
      setCustom("");
    } catch {
      toast.error("Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="Post product" subtitle="Add a new listing to the products catalog." />
    <form onSubmit={submit} className="admin-panel p-8 max-w-2xl space-y-4">
      <input required name="title" placeholder="Title" className="w-full px-4 py-3 rounded-md border border-[var(--border)]" />
      <textarea required name="description" rows={4} placeholder="Description" className="w-full px-4 py-3 rounded-md border border-[var(--border)] resize-none" />
      <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full px-4 py-3 rounded-md border border-[var(--border)]">
        {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {cat === "Other" && <input required value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom category" className="w-full px-4 py-3 rounded-md border border-[var(--border)]" />}
      <div><label className="text-sm text-label">Main Images (required)</label><input required type="file" name="main" multiple accept="image/*" className="w-full mt-1 text-sm" /></div>
      <div><label className="text-sm text-label">Explore Images (optional)</label><input type="file" name="explore" multiple accept="image/*" className="w-full mt-1 text-sm" /></div>
      <button disabled={busy} className="btn-primary"><Upload className="h-4 w-4" /> {busy ? "Uploading..." : "Post Product"}</button>
    </form>
    </div>
  );
}

type Product = { id: string; title: string; description: string; category: string };

function ManageProducts({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);

  const reload = async () => {
    try {
      const res = await fetch(apiUrl("/api/product/"));
      const data = (await res.json()) as Product[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { reload(); }, []);

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(apiUrl(`/api/product/${id}`), {
        method: "DELETE",
        headers: authHeaders(token),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || data.message || "Delete failed");
        return;
      }
      toast.success("Deleted");
      reload();
    } catch {
      toast.error("Request failed");
    }
  }

  return (
    <div>
      <AdminPageHeader title="Manage products" subtitle="Remove listings you no longer need on the site." />
    <div className="admin-panel overflow-hidden">
      <h2 className="font-display text-xl text-navy px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]/40">All products</h2>
      <table className="w-full text-sm">
        <thead className="bg-muted text-label text-xs uppercase tracking-wider">
          <tr><th className="text-left p-3">Title</th><th className="text-left p-3">Category</th><th className="text-left p-3">Description</th><th className="p-3 w-20"></th></tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t border-[var(--border)]">
              <td className="p-3 font-medium text-navy">{p.title}</td>
              <td className="p-3 text-body">{p.category}</td>
              <td className="p-3 text-body truncate max-w-xs">{p.description}</td>
              <td className="p-3 text-right">
                <button onClick={() => del(p.id)} className="text-destructive hover:underline inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-label">No products yet.</td></tr>}
        </tbody>
      </table>
    </div>
    </div>
  );
}

type Media = { id: string; title: string; media_type: string; media_url: string; youtube_link?: string };

function ManageMedia({ token }: { token: string }) {
  const [items, setItems] = useState<Media[]>([]);

  const reload = async () => {
    try {
      const res = await fetch(apiUrl("/api/media/"));
      const data = (await res.json()) as Media[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { reload(); }, []);

  async function del(id: string) {
    if (!confirm("Delete this media item?")) return;
    try {
      const res = await fetch(apiUrl(`/api/media/${id}`), {
        method: "DELETE",
        headers: authHeaders(token),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || data.message || "Delete failed");
        return;
      }
      toast.success("Deleted");
      reload();
    } catch {
      toast.error("Request failed");
    }
  }

  const typeBadge = (t: string) => {
    const colors: Record<string, string> = {
      image: "var(--tint-blue)",
      video: "var(--tint-green)",
      link: "var(--muted)",
    };
    return (
      <span
        className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full capitalize"
        style={{ background: colors[t] || colors.link, color: "var(--navy)" }}
      >
        {t}
      </span>
    );
  };

  return (
    <div>
      <AdminPageHeader title="Manage media" subtitle="Preview coverage items and remove outdated posts." />
      <div className="admin-panel overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/80 text-label text-xs uppercase tracking-wider">
              <tr><th className="p-4 w-28">Preview</th><th className="text-left p-4">Title</th><th className="text-left p-4 w-28">Type</th><th className="p-4 w-24"></th></tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-[var(--border)] hover:bg-[var(--tint-blue)]/20 transition-colors">
                  <td className="p-4">
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-muted">
                      <MediaPreview mediaType={m.media_type} mediaUrl={m.media_url} youtubeLink={m.youtube_link} title={m.title} className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-navy">{m.title}</td>
                  <td className="p-4">{typeBadge(m.media_type)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => del(m.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-destructive hover:bg-red-50 text-xs font-medium">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-label">No media yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-[var(--border)]">
          {items.map((m) => (
            <div key={m.id} className="p-4 flex gap-4">
              <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                <MediaPreview mediaType={m.media_type} mediaUrl={m.media_url} youtubeLink={m.youtube_link} title={m.title} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-navy truncate">{m.title}</div>
                <div className="mt-2">{typeBadge(m.media_type)}</div>
                {m.media_type === "link" && (
                  <div className="text-xs text-label mt-1 truncate">
                    {linkPlatformLabel(getLinkPlatform(m.media_url))}
                  </div>
                )}
                <button onClick={() => del(m.id)} className="mt-3 inline-flex items-center gap-1 text-xs text-destructive font-medium">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="p-12 text-center text-label">No media yet.</div>}
        </div>
      </div>
    </div>
  );
}
