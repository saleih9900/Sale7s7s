-- ============================================
-- إعداد قاعدة بيانات مكتب الهندسة المعمارية (Supabase)
-- شغّل هذا الملف في: Supabase Dashboard > SQL Editor > New query > Run
-- ============================================

-- 1) جدول الإعدادات (مفتاح/قيمة)
create table if not exists public.settings (
  key text primary key,
  value text not null
);

-- 2) جدول الخدمات
create table if not exists public.services (
  id bigint generated always as identity primary key,
  icon text not null default '✎',
  title text not null,
  "desc" text not null default '',
  sort int not null default 0
);

-- 3) جدول المشاريع
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  icon text not null default '⌂',
  cat text not null default 'سكني',
  title text not null,
  "desc" text not null default '',
  sort int not null default 0
);

-- 4) جدول رسائل الزوار
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  msg text not null,
  created_at timestamptz not null default now()
);

-- ============ سياسات الأمان (RLS) ============
alter table public.settings enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.messages  enable row level security;

-- القراءة متاحة للجميع (الزوار + لوحة التحكم)
create policy "public read settings"  on public.settings  for select using (true);
create policy "public read services"  on public.services  for select using (true);
create policy "public read projects"  on public.projects  for select using (true);

-- التعديل متاح فقط للمستخدم المسجّل (حساب المدير)
create policy "admin write settings" on public.settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write services" on public.services for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write projects" on public.projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- رسائل الزوار: أي أحد يرسل، والمدير وحده يقرأ/يحذف
create policy "anyone send message" on public.messages for insert with check (true);
create policy "admin read messages" on public.messages for select
  using (auth.role() = 'authenticated');
create policy "admin delete messages" on public.messages for delete
  using (auth.role() = 'authenticated');

-- ============ البيانات الافتراضية ============
insert into public.settings (key, value) values
  ('officeName','باداؤود للهندسة والمقاولات'),
  ('tagline','نصمم فضاءً يلهم الحياة'),
  ('phone','+967 733322433'),
  ('email','saleih900@gmail.com'),
  ('address','حضرموت - المكلا - جولة ابن عزون'),
  ('about','مكتب متخصص في التصميم المعماري، التخطيط العمراني، والإشراف الهندسي منذ أكثر من 15 عاماً. نجمع بين الإبداع الفني والدقة الهندسية لإنجاز مشاريع سكنية وتجارية وإدارية.'),
  ('stats','[{"n":"250+","t":"مشروع منجز"},{"n":"15","t":"عاماً من الخبرة"},{"n":"40+","t":"جائزة وتكريم"}]')
on conflict (key) do nothing;

insert into public.services (icon, title, "desc", sort) values
  ('✎','التصميم المعماري','تصاميم معاصرة تجمع بين الجمال والوظيفة لتحقيق هوية فريدة لكل مشروع.',1),
  ('⌂','التخطيط العمراني','مخططات تنموية متكاملة للأحياء والمدن تراعي الاستدامة وجودة الحياة.',2),
  ('⚙','الإشراف الهندسي','إشراف دقيق على التنفيذ لضمان مطابقة الأعمال لأعلى المعايير.',3),
  ('⬡','التصميم الداخلي','فراغات داخلية متناغمة تعكس ذوق العملاء وتحقق أقصى استفادة من المساحات.',4),
  ('☀','الاستدامة والبيئة','حلول تصميمية صديقة للبيئة تقلل استهلاك الطاقة وتعزز الاستدامة.',5),
  ('▦','إدارة المشاريع','تخطيط ومتابعة شاملة من الفكرة حتى التسليم في الموعد المحدد.',6)
on conflict do nothing;

insert into public.projects (icon, cat, title, "desc", sort) values
  ('⌂','سكني','فيلا الياسمين','فيلا سكنية فاخرة بمساحة 1200 م² تجمع الطراز الحديث بالهوية المحلية.',1),
  ('▤','تجاري','برج الأفق','برج إداري متعدد الاستخدامات من 24 طابقاً في قلب المدينة.',2),
  ('⬡','ثقافي','متحف النسيج','متحف معاصر مستوحى من التراث النسيجي بأسقف مخروطة مضيئة.',3),
  ('⌂','سكني','مجمع الواحة','مجمع سكني من 60 وحدة حول مساحات خضراء وبحيرات صناعية.',4),
  ('▦','إداري','مقر شركة أفق','مقر إداري ذكي بتصميم مفتوح يعزز التواصل والإنتاجية.',5),
  ('☀','ضيافة','منتجع الساحل','منتجع سياحي مستدام يوازن بين الفخامة والاندماج مع الطبيعة.',6)
on conflict do nothing;
