// ===== لوحة التحكم CMS — تعمل مع Supabase =====
const $ = id => document.getElementById(id);
const loginBox = $('loginBox'), panel = $('panel');

// ---- تسجيل الدخول: بريد/كلمة مرور (Supabase) أو admin/admin123 (محلي) ----
$('loginForm').onsubmit = async e => {
  e.preventDefault();
  $('loginBtn').disabled = true; $('loginBtn').textContent = 'جارٍ الدخول...';
  $('loginErr').textContent = '';
  try{
    const ok = await ArchDB.login($('email').value.trim(), $('pw').value);
    if(ok){
      if(!ArchDB.online) sessionStorage.setItem('cms_auth','1');
      showPanel();
    } else $('loginErr').textContent = 'بيانات الدخول غير صحيحة';
  }catch(err){ $('loginErr').textContent = 'خطأ: ' + (err.message || err); }
  $('loginBtn').disabled = false; $('loginBtn').textContent = 'دخول';
};
(async()=>{ if(await ArchDB.checkSession().catch(()=>false)) showPanel(); })();

function showPanel(){
  loginBox.style.display='none'; panel.style.display='block';
  $('dbBadge').textContent = ArchDB.online ? '🟢 متصل بـ Supabase' : '🟡 وضع محلي (LocalStorage)';
  loadAll();
}
$('logout').onclick = async ()=>{ await ArchDB.logout().catch(()=>{}); location.reload(); };

// ---- التبويبات ----
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.tab-pane').forEach(x=>x.style.display='none');
  t.classList.add('on'); $(t.dataset.tab).style.display='block';
});

// ---- الإعدادات ----
function loadSettings(s){
  $('s_officeName').value=s.officeName||''; $('s_tagline').value=s.tagline||'';
  $('s_phone').value=s.phone||''; $('s_email').value=s.email||'';
  $('s_address').value=s.address||''; $('s_about').value=s.about||'';
}
$('settingsForm').onsubmit = async e=>{
  e.preventDefault();
  try{
    await ArchDB.saveSettings({
      officeName:$('s_officeName').value, tagline:$('s_tagline').value,
      phone:$('s_phone').value, email:$('s_email').value,
      address:$('s_address').value, about:$('s_about').value
    });
    toast('تم حفظ الإعدادات');
  }catch(err){ toast('خطأ: '+(err.message||err)); }
};

// ---- الخدمات ----
function loadServices(list){
  $('servicesList').innerHTML = list.map(s=>`
    <div class="row-item"><b>${s.icon} ${s.title}</b><span class="muted">${(s.desc||'').slice(0,60)}...</span>
    <span><button onclick="editService(${s.id})">تعديل</button>
    <button class="del" onclick="delService(${s.id})">حذف</button></span></div>`).join('')
    || '<p class="muted">لا توجد خدمات.</p>';
}
$('serviceForm').onsubmit = async e=>{
  e.preventDefault();
  try{
    await ArchDB.saveItem('services',
      {icon:$('sv_icon').value, title:$('sv_title').value, desc:$('sv_desc').value},
      $('sv_idx').value || null);
    e.target.reset(); $('sv_idx').value=''; await loadAll(); toast('تم حفظ الخدمة');
  }catch(err){ toast('خطأ: '+(err.message||err)); }
};
function editService(id){
  const s = dbCache.services.find(x=>x.id===id); if(!s) return;
  $('sv_icon').value=s.icon; $('sv_title').value=s.title; $('sv_desc').value=s.desc; $('sv_idx').value=id;
}
async function delService(id){
  if(!confirm('حذف الخدمة؟')) return;
  try{ await ArchDB.deleteItem('services', id); await loadAll(); toast('تم الحذف'); }
  catch(err){ toast('خطأ: '+(err.message||err)); }
}

// ---- المشاريع ----
function loadProjects(list){
  $('projectsList').innerHTML = list.map(p=>`
    <div class="row-item"><b>${p.icon} ${p.title}</b><span class="tag">${p.cat}</span>
    <span><button onclick="editProject(${p.id})">تعديل</button>
    <button class="del" onclick="delProject(${p.id})">حذف</button></span></div>`).join('')
    || '<p class="muted">لا توجد مشاريع.</p>';
}
$('projectForm').onsubmit = async e=>{
  e.preventDefault();
  try{
    await ArchDB.saveItem('projects',
      {icon:$('p_icon').value, cat:$('p_cat').value, title:$('p_title').value, desc:$('p_desc').value},
      $('p_idx').value || null);
    e.target.reset(); $('p_idx').value=''; await loadAll(); toast('تم حفظ المشروع');
  }catch(err){ toast('خطأ: '+(err.message||err)); }
};
function editProject(id){
  const p = dbCache.projects.find(x=>x.id===id); if(!p) return;
  $('p_icon').value=p.icon; $('p_cat').value=p.cat; $('p_title').value=p.title; $('p_desc').value=p.desc; $('p_idx').value=id;
}
async function delProject(id){
  if(!confirm('حذف المشروع؟')) return;
  try{ await ArchDB.deleteItem('projects', id); await loadAll(); toast('تم الحذف'); }
  catch(err){ toast('خطأ: '+(err.message||err)); }
}

// ---- الرسائل ----
async function loadMessages(){
  try{
    const msgs = await ArchDB.getMessages();
    $('messagesList').innerHTML = msgs.length ? msgs.map(m=>`
      <div class="row-item"><b>${m.name}</b>
      <span class="muted">${m.email} — ${m.msg} <small>(${new Date(m.created_at).toLocaleString('ar')})</small></span></div>`).join('')
      : '<p class="muted">لا توجد رسائل بعد.</p>';
  }catch(err){ $('messagesList').innerHTML = '<p class="muted">تعذر تحميل الرسائل.</p>'; }
}
$('clearMsgs').onclick = async ()=>{
  if(!confirm('حذف كل الرسائل؟')) return;
  try{ await ArchDB.clearMessages(); await loadMessages(); toast('تم الحذف'); }
  catch(err){ toast('خطأ: '+(err.message||err)); }
};

// ---- تصدير JSON ----
$('exportBtn').onclick = async ()=>{
  const db = await ArchDB.fetchAll();
  const blob = new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'cms-database.json'; a.click();
};

// ---- التحميل العام ----
let dbCache = {settings:{}, services:[], projects:[]};
async function loadAll(){
  try{
    const db = await ArchDB.fetchAll();
    if(db){
      dbCache = db;
      loadSettings(db.settings||{});
      loadServices(db.services||[]);
      loadProjects(db.projects||[]);
    }
  }catch(e){ toast('تعذر الاتصال بقاعدة البيانات'); }
  await loadMessages();
}
function toast(t){
  const el = $('toast'); el.textContent = t;
  el.classList.add('show'); setTimeout(()=>el.classList.remove('show'), 2200);
}
