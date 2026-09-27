// ============================================
//  assets/db.js
//  طبقة البيانات — Supabase + LocalStorage fallback
//  مكتب باداؤود للهندسة والمقاولات
// ============================================
(function () {
  "use strict";

  // ============================================
  //  1) تحديد الوضع (محلي / Supabase)
  // ============================================
  const SUPABASE_URL = (window.SUPABASE_URL || "").trim();
  const SUPABASE_KEY = (window.SUPABASE_ANON_KEY || "").trim();

  const isLocalMode =
    !SUPABASE_URL ||
    !SUPABASE_KEY ||
    SUPABASE_URL.includes("YOUR-PROJECT") ||
    SUPABASE_URL.includes("abcdefgh") ||
    SUPABASE_KEY.includes("YOUR-ANON");

  // ============================================
  //  2) تهيئة Supabase client
  // ============================================
  let sb = null;
  if (!isLocalMode) {
    if (typeof window.supabase === "undefined") {
      console.error("❌ مكتبة Supabase غير محمّلة! تأكد من تحميل CDN قبل db.js");
    } else {
      try {
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        console.log("✅ تم تهيئة Supabase client");
      } catch (e) {
        console.error("❌ فشل تهيئة Supabase:", e);
        sb = null;
      }
    }
  }

  // ============================================
  //  3) المفاتيح والقيم الافتراضية
  // ============================================
  const KEYS = {
    settings: "cms_settings",
    uiSettings: "cms_ui_settings",
    services: "cms_services",
    projects: "cms_projects",
    messages: "cms_messages",
    auth: "cms_auth",
    theme: "cms_theme"
  };

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

  // ============================================
  //  4) أدوات مساعدة
  // ============================================
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
      .replace(/-+/g, "-")
      .slice(0, 60);
    return s || ("project-" + Date.now());
  }

  // ============================================
  //  5) API العام
  // ============================================
  const DB = {
    get isLocal() { return isLocalMode; },
    slugify,

    // ----------------------------------------
    //  AUTH
    // ----------------------------------------
    async login(email, pw) {
      console.log("[DB.login] الوضع:", isLocalMode ? "محلي" : "Supabase");

      // ===== محلي =====
      if (isLocalMode) {
        if ((email === "admin" || email === "admin@example.com") && pw === "admin123") {
          localStorage.setItem(KEYS.auth, "1");
          return true;
        }
        return false;
      }

      // ===== Supabase =====
      if (!sb) {
        console.error("[DB.login] Supabase client غير مهيأ");
        return false;
      }

      try {
        const { data, error } = await sb.auth.signInWithPassword({
          email: email.trim(),
          password: pw
        });

        if (error) {
          console.error("[DB.login] Supabase error:", error);
          window.__lastAuthError = error.message;
          return false;
        }

        console.log("[DB.login] ✅ نجح:", data?.user?.email);
        window.__lastAuthError = null;
        return true;
      } catch (e) {
        console.error("[DB.login] Exception:", e);
        window.__lastAuthError = e.message;
        return false;
      }
    },

    async logout() {
      if (isLocalMode) {
        localStorage.removeItem(KEYS.auth);
        return;
      }
      if (sb) {
        try { await sb.auth.signOut(); } catch (e) {}
      }
    },

    async isLogged() {
      if (isLocalMode) return localStorage.getItem(KEYS.auth) === "1";
      if (!sb) return false;
      try {
        const { data } = await sb.auth.getSession();
        return !!data?.session;
      } catch { return false; }
    },

    async getUser() {
      if (isLocalMode) return null;
      if (!sb) return null;
      try {
        const { data } = await sb.auth.getUser();
        return data?.user || null;
      } catch { return null; }
    },

    // ----------------------------------------
    //  SETTINGS
    // ----------------------------------------
    async getSettings() {
      if (isLocalMode) {
        return { ...DEFAULTS.settings, ...readLocal("settings") };
      }
      try {
        const { data, error } = await sb
          .from("settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (error) {
          console.warn("[getSettings]", error.message);
          return { ...DEFAULTS.settings };
        }
        return { ...DEFAULTS.settings, ...(data || {}) };
      } catch (e) {
        console.error("[getSettings]", e);
        return { ...DEFAULTS.settings };
      }
    },

    async saveSettings(obj) {
      if (isLocalMode) {
        const current = readLocal("settings");
        return writeLocal("settings", { ...current, ...obj });
      }
      try {
        const payload = {
          id: 1,
          officeName: obj.officeName || "",
          tagline: obj.tagline || "",
          phone: obj.phone || "",
          email: obj.email || "",
          address: obj.address || "",
          about: obj.about || "",
          updated_at: new Date().toISOString()
        };
        const { error } = await sb
          .from("settings")
          .upsert(payload, { onConflict: "id" });

        if (error) {
          console.error("[saveSettings]", error);
          return false;
        }
        return true;
      } catch (e) {
        console.error("[saveSettings]", e);
        return false;
      }
    },

    // ----------------------------------------
    //  UI SETTINGS
    // ----------------------------------------
    async getUiSettings() {
      if (isLocalMode) {
        return { ...DEFAULTS.uiSettings, ...readLocal("uiSettings") };
      }
      try {
        const { data, error } = await sb
          .from("ui_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (error) {
          console.warn("[getUiSettings]", error.message);
          return { ...DEFAULTS.uiSettings };
        }
        return { ...DEFAULTS.uiSettings, ...(data || {}) };
      } catch (e) {
        console.error("[getUiSettings]", e);
        return { ...DEFAULTS.uiSettings };
      }
    },

    async saveUiSettings(obj) {
      if (isLocalMode) {
        const current = readLocal("uiSettings");
        return writeLocal("uiSettings", { ...current, ...obj });
      }
      try {
        const payload = {
          id: 1,
          site_name: obj.site_name || "",
          logo_url: obj.logo_url || "",
          primary_color: obj.primary_color || "#6366f1",
          default_theme: obj.default_theme || "dark",
          show_services: obj.show_services ?? true,
          show_projects: obj.show_projects ?? true
        };
        const { error } = await sb
          .from("ui_settings")
          .upsert(payload, { onConflict: "id" });

        if (error) {
          console.error("[saveUiSettings]", error);
          return false;
        }
        return true;
      } catch (e) {
        console.error("[saveUiSettings]", e);
        return false;
      }
    },

    // ----------------------------------------
    //  SERVICES
    // ----------------------------------------
    async getServices() {
      if (isLocalMode) return readLocal("services");
      try {
        const { data, error } = await sb
          .from("services")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.warn("[getServices]", error.message);
          return [];
        }
        return data || [];
      } catch (e) {
        console.error("[getServices]", e);
        return [];
      }
    },

    async saveService(item, idx) {
      const payload = {
        icon: item.icon || "✦",
        title: item.title || "",
        description: item.description || item.desc || ""
      };

      if (isLocalMode) {
        const list = readLocal("services");
        if (idx >= 0 && idx < list.length) list[idx] = { ...list[idx], ...payload };
        else list.push(payload);
        return writeLocal("services", list);
      }

      try {
        let res;
        if (idx >= 0 && item.id) {
          res = await sb.from("services").update(payload).eq("id", item.id);
        } else {
          res = await sb.from("services").insert(payload);
        }
        if (res.error) {
          console.error("[saveService]", res.error);
          return false;
        }
        return true;
      } catch (e) {
        console.error("[saveService]", e);
        return false;
      }
    },

    async deleteService(item, idx) {
      if (isLocalMode) {
        const list = readLocal("services");
        if (idx >= 0) list.splice(idx, 1);
        return writeLocal("services", list);
      }
      if (!item?.id) return false;
      try {
        const { error } = await sb.from("services").delete().eq("id", item.id);
        if (error) { console.error("[deleteService]", error); return false; }
        return true;
      } catch (e) {
        console.error("[deleteService]", e);
        return false;
      }
    },

    // ----------------------------------------
    //  PROJECTS
    // ----------------------------------------
    async getProjects() {
      if (isLocalMode) return readLocal("projects");
      try {
        const { data, error } = await sb
          .from("projects")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.warn("[getProjects]", error.message);
          return [];
        }
        return data || [];
      } catch (e) {
        console.error("[getProjects]", e);
        return [];
      }
    },

    async getProjectBySlug(slug) {
      if (isLocalMode) {
        const list = readLocal("projects");
        return list.find(p => p.slug === slug) || null;
      }
      try {
        const { data, error } = await sb
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error) { console.warn("[getProjectBySlug]", error); return null; }
        return data;
      } catch (e) {
        console.error("[getProjectBySlug]", e);
        return null;
      }
    },

    async saveProject(item, idx) {
      const payload = {
        slug: item.slug || slugify(item.title),
        icon: item.icon || "⌂",
        cat: item.cat || "سكني",
        title: item.title || "",
        description: item.description || item.desc || "",
        content: item.content || "",
        cover_image: item.cover_image || "",
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        location: item.location || "",
        year: item.year || "",
        area: item.area || "",
        client: item.client || ""
      };

      if (isLocalMode) {
        const list = readLocal("projects");
        if (idx >= 0 && idx < list.length) {
          list[idx] = { ...list[idx], ...payload };
        } else {
          list.unshift(payload);
        }
        return writeLocal("projects", list);
      }

      try {
        let res;
        if (idx >= 0 && item.id) {
          res = await sb.from("projects").update(payload).eq("id", item.id);
        } else {
          res = await sb.from("projects").insert(payload);
        }
        if (res.error) {
          console.error("[saveProject]", res.error);
          return false;
        }
        return true;
      } catch (e) {
        console.error("[saveProject]", e);
        return false;
      }
    },

    async deleteProject(item, idx) {
      if (isLocalMode) {
        const list = readLocal("projects");
        if (idx >= 0) list.splice(idx, 1);
        return writeLocal("projects", list);
      }
      if (!item?.id) return false;
      try {
        const { error } = await sb.from("projects").delete().eq("id", item.id);
        if (error) { console.error("[deleteProject]", error); return false; }
        return true;
      } catch (e) {
        console.error("[deleteProject]", e);
        return false;
      }
    },

    // ----------------------------------------
    //  MESSAGES
    // ----------------------------------------
    async getMessages() {
      if (isLocalMode) return readLocal("messages");
      try {
        const { data, error } = await sb
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("[getMessages]", error.message);
          return [];
        }
        return data || [];
      } catch (e) {
        console.error("[getMessages]", e);
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
        const { error } = await sb.from("messages").insert({
          name: msg.name || "",
          email: msg.email || "",
          phone: msg.phone || "",
          message: msg.message || ""
        });
        if (error) {
          console.error("[addMessage]", error);
          return false;
        }
        return true;
      } catch (e) {
        console.error("[addMessage]", e);
        return false;
      }
    },

    async clearMessages() {
      if (isLocalMode) return writeLocal("messages", []);
      try {
        const { error } = await sb
          .from("messages")
          .delete()
          .neq("id", 0);

        if (error) { console.error("[clearMessages]", error); return false; }
        return true;
      } catch (e) {
        console.error("[clearMessages]", e);
        return false;
      }
    },

    // ----------------------------------------
    //  STORAGE — رفع الصور
    // ----------------------------------------
    async uploadImage(file, folder = "projects") {
      if (!file) return null;

      // ===== محلي: Base64 =====
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

        const { error: upErr } = await sb.storage
          .from("media")
          .upload(name, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          });

        if (upErr) {
          console.error("[uploadImage]", upErr);
          // fallback: Base64
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        }

        const { data } = sb.storage.from("media").getPublicUrl(name);
        return data?.publicUrl || null;
      } catch (e) {
        console.error("[uploadImage]", e);
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
        const { error } = await sb.storage.from("media").remove([path]);
        return !error;
      } catch { return false; }
    },

    // ----------------------------------------
    //  THEME
    // ----------------------------------------
    getTheme() {
      return localStorage.getItem(KEYS.theme) || "dark";
    },

    setTheme(theme) {
      localStorage.setItem(KEYS.theme, theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  // ============================================
  //  6) تصدير عالمي
  // ============================================
  window.DB = DB;

  // ============================================
  //  7) رسالة تشخيص
  // ============================================
  if (isLocalMode) {
    console.log(
      "%c[DB] 🔧 الوضع المحلي (LocalStorage)",
      "color:#f59e0b;font-weight:bold;font-size:13px"
    );
  } else if (sb) {
    console.log(
      "%c[DB] ☁ Supabase متصل بنجاح",
      "color:#10b981;font-weight:bold;font-size:13px"
    );
    console.log("URL:", SUPABASE_URL);
  } else {
    console.error(
      "%c[DB] ❌ فشل الاتصال بـ Supabase",
      "color:#ef4444;font-weight:bold;font-size:13px"
    );
  }
})();