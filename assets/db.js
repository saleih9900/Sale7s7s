// ============================================
//  assets/db.js  —  طبقة البيانات
//  مكتب باداؤود للهندسة والمقاولات
// ============================================
(function () {
  "use strict";

  // ===== عميل Supabase =====
  let supabaseClient = null;

  // ===== تحقق من الوضع =====
  const isLocalMode = (() => {
    // إذا لم تكن المكتبة موجودة → محلي
    if (!window.supabase) return true;
    // إذا لم تُعرّف المفاتيح → محلي
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return true;
    // إذا كانت المفاتيح وهمية → محلي
    if (String(window.SUPABASE_URL).includes("YOUR-PROJECT")) return true;
    if (String(window.SUPABASE_ANON_KEY).includes("YOUR-ANON")) return true;
    return false;
  })();

  if (!isLocalMode) {
    try {
      supabaseClient = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      );
    } catch (e) {
      console.error("Supabase init failed:", e);
      supabaseClient = null;
    }
  }

  // ===== المفاتيح =====
  const KEYS = {
    settings:   "cms_settings",
    uiSettings: "cms_ui_settings",
    services:   "cms_services",
    projects:   "cms_projects",
    messages:   "cms_messages",
    auth:       "cms_auth",
    theme:      "cms_theme"
  };

  // ===== القيم الافتراضية =====
  const DEFAULTS = {
    settings: {
      officeName: "مكتب باداؤود للهندسة والمقاولات",
      tagline: "نصمم فضاءً يُلهم الحياة",
      phone: "",
      email: "",
      address: "",
      about: ""
    },
    uiSettings: {
      site_name: "مكتب باداؤود للهندسة والمقاولات",
      logo_url: "",
      primary_color: "#6366f1",
      default_theme: "dark",
      show_services: true,
      show_projects: true
    },
    services: [],
    projects: [],
    messages: []
  };

  // ===== Helpers للـ LocalStorage =====
  function readLocal(key) {
    try {
      const raw = localStorage.getItem(KEYS[key]);
      if (!raw) return DEFAULTS[key] ?? [];
      const parsed = JSON.parse(raw);
      return parsed ?? DEFAULTS[key] ?? [];
    } catch (e) {
      console.warn("readLocal error:", key, e);
      return DEFAULTS[key] ?? [];
    }
  }

  function writeLocal(key, val) {
    try {
      localStorage.setItem(KEYS[key], JSON.stringify(val));
      return true;
    } catch (e) {
      console.error("writeLocal error:", key, e);
      return false;
    }
  }

  function slugify(str) {
    const s = String(str || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    return s || ("project-" + Date.now());
  }

  // ============================================
  //  API العام
  // ============================================
  const DB = {

    // ===== معلومات =====
    get isLocal() { return isLocalMode; },
    slugify,

    // ============================================
    //  AUTH
    // ============================================
    async login(email, pw) {
      if (isLocalMode) {
        // وضع محلي: admin / admin123
        const okLocal =
          (email === "admin" || email === "admin@example.com") &&
          (pw === "admin123");
        if (okLocal) {
          localStorage.setItem(KEYS.auth, "1");
          return true;
        }
        // أو أي بريد + كلمة مرور من LocalStorage
        const stored = localStorage.getItem("cms_custom_user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            if (u.email === email && u.password === pw) {
              localStorage.setItem(KEYS.auth, "1");
              return true;
            }
          } catch {}
        }
        return false;
      }
      // Supabase
      try {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email, password: pw
        });
        if (error) { console.error("Login:", error); return false; }
        return true;
      } catch (e) {
        console.error("Login exception:", e);
        return false;
      }
    },

    async logout() {
      if (isLocalMode) {
        localStorage.removeItem(KEYS.auth);
        return;
      }
      try { await supabaseClient.auth.signOut(); } catch {}
    },

    async isLogged() {
      if (isLocalMode) return localStorage.getItem(KEYS.auth) === "1";
      try {
        const { data } = await supabaseClient.auth.getSession();
        return !!data?.session;
      } catch { return false; }
    },

    // ============================================
    //  SETTINGS
    // ============================================
    async getSettings() {
      if (isLocalMode) {
        const s = readLocal("settings");
        return { ...DEFAULTS.settings, ...s };
      }
      try {
        const { data, error } = await supabaseClient
          .from("settings").select("*").eq("id", 1).maybeSingle();
        if (error) { console.warn("getSettings:", error); return { ...DEFAULTS.settings }; }
        return { ...DEFAULTS.settings, ...(data || {}) };
      } catch (e) {
        console.error("getSettings ex:", e);
        return { ...DEFAULTS.settings };
      }
    },

    async saveSettings(obj) {
      if (isLocalMode) {
        const current = readLocal("settings");
        return writeLocal("settings", { ...current, ...obj });
      }
      try {
        const { error } = await supabaseClient
          .from("settings")
          .upsert({ id: 1, ...obj }, { onConflict: "id" });
        if (error) { console.error("saveSettings:", error); return false; }
        return true;
      } catch (e) {
        console.error("saveSettings ex:", e);
        return false;
      }
    },

    // ============================================
    //  UI SETTINGS
    // ============================================
    async getUiSettings() {
      if (isLocalMode) {
        const u = readLocal("uiSettings");
        return { ...DEFAULTS.uiSettings, ...u };
      }
      try {
        const { data, error } = await supabaseClient
          .from("ui_settings").select("*").eq("id", 1).maybeSingle();
        if (error) { console.warn("getUiSettings:", error); return { ...DEFAULTS.uiSettings }; }
        return { ...DEFAULTS.uiSettings, ...(data || {}) };
      } catch (e) {
        console.error("getUiSettings ex:", e);
        return { ...DEFAULTS.uiSettings };
      }
    },

    async saveUiSettings(obj) {
      if (isLocalMode) {
        const current = readLocal("uiSettings");
        return writeLocal("uiSettings", { ...current, ...obj });
      }
      try {
        const { error } = await supabaseClient
          .from("ui_settings")
          .upsert({ id: 1, ...obj }, { onConflict: "id" });
        if (error) { console.error("saveUiSettings:", error); return false; }
        return true;
      } catch (e) {
        console.error("saveUiSettings ex:", e);
        return false;
      }
    },

    // ============================================
    //  SERVICES
    // ============================================
    async getServices() {
      if (isLocalMode) return readLocal("services");
      try {
        const { data, error } = await supabaseClient
          .from("services").select("*").order("id", { ascending: true });
        if (error) { console.warn("getServices:", error); return []; }
        return data || [];
      } catch (e) {
        console.error("getServices ex:", e);
        return [];
      }
    },

    async saveService(item, idx) {
      if (isLocalMode) {
        const list = readLocal("services");
        const clean = {
          icon: item.icon || "",
          title: item.title || "",
          description: item.description || item.desc || ""
        };
        if (idx >= 0 && idx < list.length) list[idx] = clean;
        else list.push(clean);
        return writeLocal("services", list);
      }
      try {
        const payload = {
          icon: item.icon || "",
          title: item.title || "",
          description: item.description || item.desc || ""
        };
        let res;
        if (idx >= 0 && item.id) {
          res = await supabaseClient.from("services").update(payload).eq("id", item.id);
        } else {
          res = await supabaseClient.from("services").insert(payload);
        }
        if (res.error) { console.error("saveService:", res.error); return false; }
        return true;
      } catch (e) {
        console.error("saveService ex:", e);
        return false;
      }
    },

    async deleteService(item, idx) {
      if (isLocalMode) {
        const list = readLocal("services");
        if (idx >= 0) list.splice(idx, 1);
        return writeLocal("services", list);
      }
      try {
        if (!item?.id) return false;
        const { error } = await supabaseClient
          .from("services").delete().eq("id", item.id);
        if (error) { console.error("deleteService:", error); return false; }
        return true;
      } catch (e) {
        console.error("deleteService ex:", e);
        return false;
      }
    },

    // ============================================
    //  PROJECTS
    // ============================================
    async getProjects() {
      if (isLocalMode) return readLocal("projects");
      try {
        const { data, error } = await supabaseClient
          .from("projects").select("*").order("id", { ascending: false });
        if (error) { console.warn("getProjects:", error); return []; }
        return data || [];
      } catch (e) {
        console.error("getProjects ex:", e);
        return [];
      }
    },

    async getProjectBySlug(slug) {
      if (isLocalMode) {
        const list = readLocal("projects");
        return list.find(p => p.slug === slug) || null;
      }
      try {
        const { data, error } = await supabaseClient
          .from("projects").select("*").eq("slug", slug).maybeSingle();
        if (error) { console.warn("getProjectBySlug:", error); return null; }
        return data;
      } catch (e) {
        console.error("getProjectBySlug ex:", e);
        return null;
      }
    },

    async saveProject(item, idx) {
      // نظّف البيانات
      const clean = {
        slug:          item.slug || slugify(item.title),
        icon:          item.icon || "⌂",
        cat:           item.cat || "سكني",
        title:         item.title || "",
        description:   item.description || item.desc || "",
        content:       item.content || "",
        cover_image:   item.cover_image || "",
        gallery:       Array.isArray(item.gallery) ? item.gallery : [],
        location:      item.location || "",
        year:          item.year || "",
        area:          item.area || "",
        client:        item.client || ""
      };

      if (isLocalMode) {
        const list = readLocal("projects");
        if (idx >= 0 && idx < list.length) list[idx] = clean;
        else list.unshift(clean);
        return writeLocal("projects", list);
      }

      try {
        let res;
        if (idx >= 0 && item.id) {
          res = await supabaseClient.from("projects").update(clean).eq("id", item.id);
        } else {
          res = await supabaseClient.from("projects").insert(clean);
        }
        if (res.error) { console.error("saveProject:", res.error); return false; }
        return true;
      } catch (e) {
        console.error("saveProject ex:", e);
        return false;
      }
    },

    async deleteProject(item, idx) {
      if (isLocalMode) {
        const list = readLocal("projects");
        if (idx >= 0) list.splice(idx, 1);
        return writeLocal("projects", list);
      }
      try {
        if (!item?.id) return false;
        const { error } = await supabaseClient
          .from("projects").delete().eq("id", item.id);
        if (error) { console.error("deleteProject:", error); return false; }
        return true;
      } catch (e) {
        console.error("deleteProject ex:", e);
        return false;
      }
    },

    // ============================================
    //  MESSAGES
    // ============================================
    async getMessages() {
      if (isLocalMode) return readLocal("messages");
      try {
        const { data, error } = await supabaseClient
          .from("messages").select("*").order("created_at", { ascending: false });
        if (error) { console.warn("getMessages:", error); return []; }
        return data || [];
      } catch (e) {
        console.error("getMessages ex:", e);
        return [];
      }
    },

    async addMessage(msg) {
      if (isLocalMode) {
        const list = readLocal("messages");
        list.unshift({ ...msg, created_at: new Date().toISOString() });
        return writeLocal("messages", list);
      }
      try {
        const { error } = await supabaseClient.from("messages").insert(msg);
        if (error) { console.error("addMessage:", error); return false; }
        return true;
      } catch (e) {
        console.error("addMessage ex:", e);
        return false;
      }
    },

    async clearMessages() {
      if (isLocalMode) return writeLocal("messages", []);
      try {
        const { error } = await supabaseClient
          .from("messages").delete().neq("id", 0);
        if (error) { console.error("clearMessages:", error); return false; }
        return true;
      } catch (e) {
        console.error("clearMessages ex:", e);
        return false;
      }
    },

    // ============================================
    //  STORAGE — رفع الصور
    // ============================================
    async uploadImage(file, folder = "projects") {
      if (!file) return null;

      // ===== الوضع المحلي: Base64 =====
      if (isLocalMode) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
      }

      // ===== Supabase Storage =====
      try {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: upErr } = await supabaseClient.storage
          .from("media")
          .upload(name, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          });

        if (upErr) {
          console.error("uploadImage:", upErr);
          // في حال فشل الرفع، ارجع Base64 كحل بديل
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        }

        const { data } = supabaseClient.storage.from("media").getPublicUrl(name);
        return data?.publicUrl || null;
      } catch (e) {
        console.error("uploadImage ex:", e);
        // fallback
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      }
    },

    async deleteImage(url) {
      if (isLocalMode) return true;
      if (!url || !url.includes("/media/")) return true;
      try {
        const path = url.split("/media/")[1];
        const { error } = await supabaseClient.storage.from("media").remove([path]);
        return !error;
      } catch { return false; }
    },

    // ============================================
    //  THEME
    // ============================================
    getTheme() {
      return localStorage.getItem(KEYS.theme) || "dark";
    },
    setTheme(theme) {
      localStorage.setItem(KEYS.theme, theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  // ===== تصدير عالمي =====
  window.DB = DB;

  // ===== رسالة تشخيص =====
  console.log(
    "%c[DB] %c" + (isLocalMode ? "الوضع المحلي (LocalStorage)" : "متصل بـ Supabase ☁"),
    "color:#8b5cf6;font-weight:bold",
    "color:#10b981"
  );
})();