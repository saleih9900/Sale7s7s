// ====== طبقة قاعدة البيانات (Supabase أو LocalStorage) ======
(function () {
  let supabaseClient = null;

  if (!window.LOCAL_MODE && window.supabase) {
    supabaseClient = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  }

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
      officeName: "مكتب الهندسة المعمارية",
      tagline: "نصمّم المستقبل",
      phone: "+967 000 000",
      email: "info@example.com",
      address: "صنعاء - اليمن",
      about: "مكتب متخصص في التصميم المعماري والإشراف الهندسي."
    },
    uiSettings: {
      site_name: "مكتب الهندسة",
      logo_url: "",
      primary_color: "#c8a15a",
      default_theme: "dark",
      show_services: true,
      show_projects: true
    },
    services: [
      { icon: "✎", title: "التصميم المعماري", desc: "تصاميم عصرية ومبتكرة" }
    ],
    projects: []
  };

  function readLocal(key) {
    try {
      const raw = localStorage.getItem(KEYS[key]);
      return raw ? JSON.parse(raw) : (DEFAULTS[key] ?? []);
    } catch { return DEFAULTS[key] ?? []; }
  }

  function writeLocal(key, val) {
    localStorage.setItem(KEYS[key], JSON.stringify(val));
  }

  function slugify(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || ("project-" + Date.now());
  }

  window.DB = {
    isLocal: window.LOCAL_MODE,
    slugify,

    // ===== Auth =====
    async login(email, pw) {
      if (window.LOCAL_MODE) {
        if (email === "admin" && pw === "admin123") {
          localStorage.setItem(KEYS.auth, "1");
          return true;
        }
        return false;
      }
      const { error } = await supabaseClient.auth.signInWithPassword({
        email, password: pw
      });
      return !error;
    },

    async logout() {
      if (window.LOCAL_MODE) localStorage.removeItem(KEYS.auth);
      else await supabaseClient.auth.signOut();
    },

    async isLogged() {
      if (window.LOCAL_MODE) return localStorage.getItem(KEYS.auth) === "1";
      const { data } = await supabaseClient.auth.getSession();
      return !!data.session;
    },

    // ===== Settings =====
    async getSettings() {
      if (window.LOCAL_MODE) return readLocal("settings");
      const { data } = await supabaseClient.from("settings").select("*").maybeSingle();
      return data || DEFAULTS.settings;
    },

    async saveSettings(obj) {
      if (window.LOCAL_MODE) { writeLocal("settings", obj); return true; }
      const { error } = await supabaseClient.from("settings").upsert({ id: 1, ...obj });
      return !error;
    },

    // ===== UI Settings =====
    async getUiSettings() {
      if (window.LOCAL_MODE) return readLocal("uiSettings");
      const { data } = await supabaseClient.from("ui_settings").select("*").maybeSingle();
      return data || DEFAULTS.uiSettings;
    },

    async saveUiSettings(obj) {
      if (window.LOCAL_MODE) { writeLocal("uiSettings", obj); return true; }
      const { error } = await supabaseClient.from("ui_settings").upsert({ id: 1, ...obj });
      return !error;
    },

    // ===== Services =====
    async getServices() {
      if (window.LOCAL_MODE) return readLocal("services");
      const { data } = await supabaseClient.from("services").select("*").order("id");
      return data || [];
    },

    async saveService(item, idx) {
      if (window.LOCAL_MODE) {
        const list = readLocal("services");
        if (idx >= 0) list[idx] = item; else list.push(item);
        writeLocal("services", list);
        return true;
      }
      const q = idx >= 0
        ? supabaseClient.from("services").update(item).eq("id", item.id)
        : supabaseClient.from("services").insert(item);
      const { error } = await q;
      return !error;
    },

    async deleteService(item, idx) {
      if (window.LOCAL_MODE) {
        const list = readLocal("services");
        list.splice(idx, 1);
        writeLocal("services", list);
        return true;
      }
      const { error } = await supabaseClient.from("services").delete().eq("id", item.id);
      return !error;
    },

    // ===== Projects =====
    async getProjects() {
      if (window.LOCAL_MODE) return readLocal("projects");
      const { data } = await supabaseClient.from("projects").select("*").order("id", { ascending: false });
      return data || [];
    },

    async getProjectBySlug(slug) {
      if (window.LOCAL_MODE) {
        const list = readLocal("projects");
        return list.find(p => p.slug === slug) || null;
      }
      const { data } = await supabaseClient.from("projects").select("*").eq("slug", slug).maybeSingle();
      return data;
    },

    async saveProject(item, idx) {
      if (!item.slug) item.slug = slugify(item.title);
      if (window.LOCAL_MODE) {
        const list = readLocal("projects");
        if (idx >= 0) list[idx] = item; else list.unshift(item);
        writeLocal("projects", list);
        return true;
      }
      const q = idx >= 0
        ? supabaseClient.from("projects").update(item).eq("id", item.id)
        : supabaseClient.from("projects").insert(item);
      const { error } = await q;
      return !error;
    },

    async deleteProject(item, idx) {
      if (window.LOCAL_MODE) {
        const list = readLocal("projects");
        list.splice(idx, 1);
        writeLocal("projects", list);
        return true;
      }
      const { error } = await supabaseClient.from("projects").delete().eq("id", item.id);
      return !error;
    },

    // ===== Messages =====
    async getMessages() {
      if (window.LOCAL_MODE) return readLocal("messages");
      const { data } = await supabaseClient.from("messages").select("*").order("created_at", { ascending: false });
      return data || [];
    },

    async addMessage(msg) {
      if (window.LOCAL_MODE) {
        const list = readLocal("messages");
        list.unshift({ ...msg, created_at: new Date().toISOString() });
        writeLocal("messages", list);
        return true;
      }
      const { error } = await supabaseClient.from("messages").insert(msg);
      return !error;
    },

    async clearMessages() {
      if (window.LOCAL_MODE) { writeLocal("messages", []); return true; }
      const { error } = await supabaseClient.from("messages").delete().neq("id", 0);
      return !error;
    },

    // ===== Storage (رفع الصور) =====
    async uploadImage(file, folder = "projects") {
      if (window.LOCAL_MODE) {
        // في الوضع المحلي: نُحوّل الصورة إلى base64 ونخزّنها في LocalStorage
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      }

      const ext = file.name.split(".").pop();
      const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabaseClient.storage
        .from("media")
        .upload(name, file, { cacheControl: "3600", upsert: false });

      if (error) { console.error(error); return null; }

      const { data } = supabaseClient.storage.from("media").getPublicUrl(name);
      return data.publicUrl;
    },

    async deleteImage(url) {
      if (window.LOCAL_MODE) return true;
      if (!url || !url.includes("/media/")) return true;
      const path = url.split("/media/")[1];
      const { error } = await supabaseClient.storage.from("media").remove([path]);
      return !error;
    },

    // ===== Theme (وضع ليلي) =====
    getTheme() {
      return localStorage.getItem(KEYS.theme) || "dark";
    },
    setTheme(theme) {
      localStorage.setItem(KEYS.theme, theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  };
})();