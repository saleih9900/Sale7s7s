// ===== الموقع الرئيسي — يقرأ من Supabase (أو LocalStorage كاحتياطي) =====
const FALLBACK = {
  settings:{officeName:'مكتب باداؤود للهندسة والمقاولات',tagline:'نصمم فضاءً يلهم الحياة',
    phone:'+967 733322433',email:'saleih900@gmail.com',address:'المكلا ، حضرموت',
    about:'مكتب متخصص في التصميم المعماري والإشراف الهندسي.',
    stats:[{n:'250+',t:'مشروع منجز'},{n:'15',t:'عاماً من الخبرة'},{n:'40+',t:'جائزة وتكريم'}]},
  services:[], projects:[]
};

(async function init(){
  let db;
  try{ db = await ArchDB.fetchAll(); }
  catch(e){ console.warn('DB error:', e); db = null; }
  if(!db || !db.settings || !db.settings.officeName) db = FALLBACK;
  const s = db.settings;

  const set = (id,v)=>{ const el=document.getElementById(id); if(el && v!=null) el.textContent=v; };
  set('officeName', s.officeName); set('tagline', s.tagline);
  set('heroAbout', (s.about||'').split('.')[0] + '.');
  set('aboutText', s.about);
  set('contactPhone', s.phone); set('contactEmail', s.email); set('contactAddress', s.address);
  document.title = s.officeName;

  // الإحصائيات
  let stats = s.stats;
  if(typeof stats === 'string'){ try{ stats = JSON.parse(stats); }catch(e){ stats=[]; } }
  document.getElementById('stats').innerHTML = (stats||[]).map(x=>
    `<div><div class="num">${x.n}</div><div class="muted">${x.t}</div></div>`).join('');

  // الخدمات
  document.getElementById('servicesGrid').innerHTML = (db.services||[]).map(x=>`
    <div class="card service reveal">
      <div class="icon">${x.icon}</div>
      <h3>${x.title}</h3><p class="muted">${x.desc}</p>
    </div>`).join('');

  // المشاريع مع فلترة
  const prjEl = document.getElementById('projectsGrid');
  function renderProjects(cat){
    const list = cat==='all' ? db.projects||[] : (db.projects||[]).filter(p=>p.cat===cat);
    prjEl.innerHTML = list.map(p=>`
      <div class="card reveal">
        <div class="thumb">${p.icon}</div>
        <div class="body">
          <span class="tag">${p.cat}</span>
          <h3>${p.title}</h3><p class="muted">${p.desc}</p>
        </div>
      </div>`).join('') || '<p class="muted">لا توجد مشاريع في هذا التصنيف.</p>';
    observeReveal();
  }
  document.getElementById('filterBtns').addEventListener('click',e=>{
    if(e.target.dataset.cat) renderProjects(e.target.dataset.cat);
  });
  renderProjects('all');

  // أنيميشن الظهور
  function observeReveal(){
    document.querySelectorAll('.reveal:not(.on)').forEach(el=>{
      new IntersectionObserver((en,obs)=>{ if(en[0].isIntersecting){ el.classList.add('on'); obs.disconnect(); } },{threshold:.15}).observe(el);
    });
  }
  observeReveal();

  // زر الصعود
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll',()=> toTop.classList.toggle('show', scrollY>400));
  toTop.onclick = ()=> scrollTo({top:0,behavior:'smooth'});
})();

// نموذج التواصل → قاعدة البيانات
document.getElementById('contactForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = e.target, out = document.getElementById('formMsg');
  out.style.color = 'var(--muted)'; out.textContent = 'جارٍ الإرسال...';
  try{
    await ArchDB.addMessage({name:f.name.value, email:f.email.value, msg:f.msg.value});
    out.style.color = '#7bc98a';
    out.textContent = '✓ تم استلام رسالتك، سنتواصل معك قريباً.';
    f.reset();
  }catch(err){
    out.style.color = '#c05a5a';
    out.textContent = '✗ حدث خطأ أثناء الإرسال، حاول مرة أخرى.';
  }
});
