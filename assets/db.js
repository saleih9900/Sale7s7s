// ============================================================
// طبقة قاعدة البيانات — تعمل مع Supabase السحابية
// مع تلقائي: fallback إلى LocalStorage إذا لم يُضبط Supabase
// ============================================================
const LS_DB = 'arch_cms_db_v1';
const LS_MSG = 'arch_cms_messages';

let sb = null;
if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.includes('YOUR-PROJECT') &&
    window.supabase) {
  sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

const ArchDB = {
  get online(){ return !!sb; },

  async fetchAll(){
    if(!sb) return JSON.parse(localStorage.getItem(LS_DB) || 'null');
    const [s, sv, p] = await Promise.all([
      sb.from('settings').select('*'),
      sb.from('services').select('*').order('sort'),
      sb.from('projects').select('*').order('sort'),
    ]);
    const settings = {};
    (s.data || []).forEach(r => settings[r.key] = r.value);
    return { settings, services: sv.data || [], projects: p.data || [] };
  },

  async saveSettings(settings){
    if(!sb){ const db = JSON.parse(localStorage.getItem(LS_DB)||'{}'); db.settings = settings;
      localStorage.setItem(LS_DB, JSON.stringify(db)); return; }
    const rows = Object.entries(settings).map(([key, value]) => ({key, value: String(value)}));
    const { error } = await sb.from('settings').upsert(rows, { onConflict: 'key' });
    if(error) throw error;
  },

  async saveItem(table, item, id){
    if(!sb){ // وضع محلي
      const db = JSON.parse(localStorage.getItem(LS_DB)||'{"services":[],"projects":[]}');
      const list = db[table] = db[table] || [];
      if(id != null && id !== ''){ const i = list.findIndex(x=>String(x.id)===String(id)); if(i>-1) list[i]={...list[i],...item}; else list.push({id:Date.now(),...item}); }
      else list.push({id:Date.now(),...item});
      localStorage.setItem(LS_DB, JSON.stringify(db)); return;
    }
    if(id != null && id !== ''){
      const { error } = await sb.from(table).update(item).eq('id', id);
      if(error) throw error;
    } else {
      const { error } = await sb.from(table).insert(item);
      if(error) throw error;
    }
  },

  async deleteItem(table, id){
    if(!sb){
      const db = JSON.parse(localStorage.getItem(LS_DB)||'{"services":[],"projects":[]}');
      db[table] = (db[table]||[]).filter(x=>String(x.id)!==String(id));
      localStorage.setItem(LS_DB, JSON.stringify(db)); return;
    }
    const { error } = await sb.from(table).delete().eq('id', id);
    if(error) throw error;
  },

  async addMessage(m){
    if(!sb){ const msgs = JSON.parse(localStorage.getItem(LS_MSG)||'[]');
      msgs.push({...m, created_at:new Date().toISOString()});
      localStorage.setItem(LS_MSG, JSON.stringify(msgs)); return; }
    const { error } = await sb.from('messages').insert(m);
    if(error) throw error;
  },

  async getMessages(){
    if(!sb) return JSON.parse(localStorage.getItem(LS_MSG)||'[]').reverse();
    const { data, error } = await sb.from('messages').select('*').order('created_at', {ascending:false});
    if(error) throw error;
    return data || [];
  },

  async clearMessages(){
    if(!sb){ localStorage.removeItem(LS_MSG); return; }
    const { error } = await sb.from('messages').delete().neq('id', 0);
    if(error) throw error;
  },

  // ---- المصادقة (لوحة التحكم) ----
  async login(email, password){
    if(!sb) return email === 'admin' && password === 'admin123'; // وضع محلي
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if(error) throw error;
    return true;
  },
  async checkSession(){
    if(!sb) return sessionStorage.getItem('cms_auth') === '1';
    const { data } = await sb.auth.getSession();
    return !!data.session;
  },
  async logout(){
    if(!sb){ sessionStorage.removeItem('cms_auth'); return; }
    await sb.auth.signOut();
  }
};
