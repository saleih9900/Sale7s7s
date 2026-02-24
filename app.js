// ===== Data Management =====
// Using localStorage to store projects and portfolio items

class DataManager {
    constructor() {
        // ⭐⭐ إضافة إصدار البيانات للتحديث التلقائي ⭐⭐
        this.projectsKey = 'arch_projects_v3';
        this.portfolioKey = 'arch_portfolio_v3';
        this.dataVersion = '3.0';
        
        // مسح البيانات القديمة تلقائياً
        this.migrateOldData();
        this.initializeSampleData();
    }
    
    // مسح البيانات القديمة من الإصدارات السابقة
    migrateOldData() {
        const oldKeys = [
            'arch_projects', 'arch_portfolio',
            'arch_projects_v1', 'arch_portfolio_v1',
            'arch_projects_v2', 'arch_portfolio_v2'
        ];
        
        oldKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log('🗑️ تم مسح البيانات القديمة:', key);
            }
        });
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        if (!localStorage.getItem(this.projectsKey)) {
            // ================================
            // ⭐⭐ إضافة المشاريع هنا ⭐⭐
            // ================================
            const sampleProjects = [
                // ===== مشروع 1 =====
                {
                    id: 1,
                    titleAr: 'مركز تجاري فاخر',
                    titleEn: 'Luxury Shopping Mall',
                    descriptionAr:' تصميم مركز تجاري فاخر بتصميم عصري وحديث نتمنى ان ينال التصميم اعجابكم .',
                    location: '  مدينة المكلا - شارع الستين',
                    projectType: 'مركز تجاري',
                    area: '3200 متر مربع',
                    completionDate: '2023',
                    featured: 1,
                    imageUrl: 'images/projects/project1.jpg'
                },
                // ===== مشروع 2 =====
                {
                    id: 2,
                    titleAr: '  عمارة سكنية',
                    titleEn: 'Residential building',
                    descriptionAr: 'عمارة سكنية مكونة من 7 أدوار تم تصميمها على الطراز الحديث ',
                    location: 'مدينة المكلا - منطقة أربعين شقة مقابل أبراج بن محفوظ ',
                    projectType: ' مبنى سكني',
                    area: '150 متر مربع',
                    completionDate: '2024',
                    featured: 1,
                    imageUrl: 'images/projects/project2.jpg'
                },
                // ===== مشروع 3 =====
                {
                    id: 3,
                    titleAr: 'فيلا سكنية ',
                    titleEn: ' Luxury Villa',
                    descriptionAr: 'فيلا سكنية بطراز كلاسيكي',
                    location: ' مدينة المكلا - ربوة خلف',
                    projectType: 'مبنى سكني',
                    area: '350 متر مربع',
                    completionDate: '2023',
                    featured: 1,
                    imageUrl: 'images/projects/project3.jpg'
                },
                // ===== مشروع 4 =====
                {
                    id: 4,
                    titleAr: 'عمارة سكنية تجارية',
                    titleEn: ' Commercial residential building',
                    descriptionAr: 'تصميم عصري عملي يدمج بين الوظيفة التجارية في الطابق الأرضي والراحة السكنية في الطوابق العليا',
                    location: 'مدينة المكلا - حي الانشاءات',
                    projectType: ' مبنى سكني تجاري',
                    area: '200 متر مربع',
                    completionDate: '2022',
                    featured: 1,
                    imageUrl: 'images/projects/project4.jpg'
                }
                // ════════════════════════════
                // 🆕 أضف مشاريع جديدة هنا 🆕
                // ════════════════════════════
                /*
                {
                    id: 5,
                    titleAr: 'اسم المشروع بالعربي',
                    titleEn: 'Project Name in English',
                    descriptionAr: 'وصف المشروع بالتفصيل هنا...',
                    location: 'المدينة - الحي',
                    projectType: 'نوع المشروع',
                    area: 'المساحة بالمتر المربع',
                    completionDate: 'سنة الإنجاز',
                    featured: 1,
                    imageUrl: 'images/projects/اسم-صورتك.jpg'
                }
                */
            ];
            localStorage.setItem(this.projectsKey, JSON.stringify(sampleProjects));
            console.log('✅ تم تحميل المشاريع الجديدة');
        }

        if (!localStorage.getItem(this.portfolioKey)) {
            // ================================
            // ⭐⭐ إضافة نماذج الأعمال هنا ⭐⭐
            // ================================
            const samplePortfolio = [
                // ===== نموذج عمل 1 =====
                {
                    id: 1,
                    titleAr: 'تصميم واجهات حديثة',
                    titleEn: 'Modern Facade Design',
                    descriptionAr: 'تصميم واجهات معمارية عصرية تجمع بين الزجاج والحجر الطبيعي',
                    category: 'تصاميم',
                    imageUrl: 'images/portfolio/portfolio1.jpg'
                },
                // ===== نموذج عمل 2 =====
                {
                    id: 2,
                    titleAr: ' تصاميم خارجية',
                    titleEn: ' Exterior designs',
                    descriptionAr: ' تصاميم خارجية عصرية تجمع بين الجمال والمتانة باستخدام مواد فاخرة وتراعي العوامل المناخية والاستدامة مع تعزيز الهوية المعمارية للمشروع ',
                    category: 'مفاهيم',
                    imageUrl: 'images/portfolio/portfolio2.jpg'
                },
                // ===== نموذج عمل 3 =====
                {
                    id: 3,
                    titleAr: 'تصاميم داخلية ',
                    titleEn: 'Interior Designs',
                    descriptionAr: 'تصاميم داخلية تعكس الذوق الرفيع مع استخدام مواد فاخرة',
                    category: 'تصاميم',
                    imageUrl: 'images/portfolio/portfolio3.jpg'
                }
                // ════════════════════════════
                // 🆕 أضف نماذج جديدة هنا 🆕
                // ════════════════════════════
                /*
                {
                    id: 4,
                    titleAr: 'اسم النموذج بالعربي',
                    titleEn: 'Portfolio Item in English',
                    descriptionAr: 'وصف النموذج بالتفصيل هنا...',
                    category: 'التصنيف',
                    imageUrl: 'images/portfolio/اسم-صورتك.jpg'
                }
                */
            ];
            localStorage.setItem(this.portfolioKey, JSON.stringify(samplePortfolio));
            console.log('✅ تم تحميل نماذج الأعمال الجديدة');
        }
        
        // حفظ تاريخ آخر تحديث
        localStorage.setItem('site_last_update', new Date().toISOString());
    }

    // Projects
    getProjects() {
        return JSON.parse(localStorage.getItem(this.projectsKey)) || [];
    }

    getFeaturedProjects() {
        return this.getProjects().filter(p => p.featured === 1);
    }

    getProjectById(id) {
        return this.getProjects().find(p => p.id === parseInt(id));
    }

    addProject(projectData) {
        const projects = this.getProjects();
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        
        const newProject = {
            id: newId,
            titleAr: projectData.titleAr || 'مشروع جديد',
            titleEn: projectData.titleEn || 'New Project',
            descriptionAr: projectData.descriptionAr || 'وصف المشروع',
            location: projectData.location || '',
            projectType: projectData.projectType || 'مشروع',
            area: projectData.area || '',
            completionDate: projectData.completionDate || '',
            featured: projectData.featured || 0,
            imageUrl: projectData.imageUrl || 'images/default-project.jpg'
        };
        
        projects.push(newProject);
        localStorage.setItem(this.projectsKey, JSON.stringify(projects));
        console.log('➕ تم إضافة مشروع جديد:', newProject.titleAr);
        return newProject;
    }

    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.projectsKey, JSON.stringify(projects));
        console.log('🗑️ تم حذف المشروع رقم:', id);
    }

    // Portfolio
    getPortfolio() {
        return JSON.parse(localStorage.getItem(this.portfolioKey)) || [];
    }

    getPortfolioById(id) {
        return this.getPortfolio().find(p => p.id === parseInt(id));
    }

    addPortfolioItem(portfolioData) {
        const portfolio = this.getPortfolio();
        const newId = portfolio.length > 0 ? Math.max(...portfolio.map(p => p.id)) + 1 : 1;
        
        const newPortfolioItem = {
            id: newId,
            titleAr: portfolioData.titleAr || 'نموذج جديد',
            titleEn: portfolioData.titleEn || 'New Portfolio',
            descriptionAr: portfolioData.descriptionAr || 'وصف النموذج',
            category: portfolioData.category || 'تصميم',
            imageUrl: portfolioData.imageUrl || 'images/default-portfolio.jpg'
        };
        
        portfolio.push(newPortfolioItem);
        localStorage.setItem(this.portfolioKey, JSON.stringify(portfolio));
        console.log('➕ تم إضافة نموذج جديد:', newPortfolioItem.titleAr);
        return newPortfolioItem;
    }

    deletePortfolioItem(id) {
        const portfolio = this.getPortfolio().filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.portfolioKey, JSON.stringify(portfolio));
        console.log('🗑️ تم حذف النموذج رقم:', id);
    }

    // 🔄 مسح جميع البيانات وإعادة التعيين
    clearAllData() {
        localStorage.removeItem(this.projectsKey);
        localStorage.removeItem(this.portfolioKey);
        localStorage.removeItem('site_last_update');
        this.initializeSampleData();
        return '✅ تم إعادة تعيين جميع البيانات';
    }
}

// Initialize data manager
const dataManager = new DataManager();

// ===== UI Functions =====

function loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;

    const projects = dataManager.getFeaturedProjects();
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">لا توجد مشاريع مميزة حالياً</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="viewProject(${project.id})">
            <div class="project-image">
                <img src="${project.imageUrl}" alt="${project.titleAr}" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${encodeURIComponent(project.titleAr)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="project-info">
                <h3>${project.titleAr}</h3>
                ${project.location ? `<p class="project-location">${project.location}</p>` : ''}
                ${project.projectType ? `<p class="project-type">${project.projectType}</p>` : ''}
                ${project.descriptionAr ? `<p class="project-description">${project.descriptionAr.substring(0, 100)}...</p>` : ''}
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="viewProject(${project.id}); event.stopPropagation();">
                    عرض التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

function loadAllProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    const projects = dataManager.getProjects();
    
    if (projects.length === 0) {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="viewProject(${project.id})">
            <div class="project-image">
                <img src="${project.imageUrl}" alt="${project.titleAr}"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${encodeURIComponent(project.titleAr)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="project-info">
                <h3>${project.titleAr}</h3>
                ${project.location ? `<p class="project-location">${project.location}</p>` : ''}
                ${project.projectType ? `<p class="project-type">${project.projectType}</p>` : ''}
                ${project.descriptionAr ? `<p class="project-description">${project.descriptionAr.substring(0, 100)}...</p>` : ''}
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="viewProject(${project.id}); event.stopPropagation();">
                    عرض التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

function loadPortfolio() {
    const container = document.getElementById('portfolioList');
    if (!container) return;

    const portfolio = dataManager.getPortfolio();
    
    if (portfolio.length === 0) {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) emptyState.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    container.innerHTML = portfolio.map(item => `
        <div class="project-card" onclick="viewPortfolioDetail(${item.id})">
            <div class="project-image">
                <img src="${item.imageUrl}" alt="${item.titleAr}"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${encodeURIComponent(item.titleAr)}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="project-info">
                <h3>${item.titleAr}</h3>
                ${item.category ? `<p class="project-type">${item.category}</p>` : ''}
                ${item.descriptionAr ? `<p class="project-description">${item.descriptionAr.substring(0, 100)}...</p>` : ''}
                <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="viewPortfolioDetail(${item.id}); event.stopPropagation();">
                    عرض التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

function viewProject(id) {
    sessionStorage.setItem('selectedProjectId', id);
    window.location.href = 'project-detail.html';
}

function viewPortfolioDetail(id) {
    sessionStorage.setItem('selectedPortfolioId', id);
    window.location.href = 'portfolio-detail.html';
}

function loadProjectDetail() {
    const container = document.getElementById('projectDetail');
    if (!container) return;

    const projectId = sessionStorage.getItem('selectedProjectId');
    if (!projectId) {
        container.innerHTML = '<p>المشروع غير موجود</p>';
        return;
    }

    const project = dataManager.getProjectById(projectId);
    if (!project) {
        container.innerHTML = '<p>المشروع غير موجود</p>';
        return;
    }

    container.innerHTML = `
        <div class="project-gallery">
            <div class="main-image">
                <img src="${project.imageUrl}" alt="${project.titleAr}" id="mainImage"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${encodeURIComponent(project.titleAr)}%3C/text%3E%3C/svg%3E'">
            </div>
        </div>
        <div class="project-details">
            <h1>${project.titleAr}</h1>
            ${project.projectType ? `<p class="project-type">${project.projectType}</p>` : ''}
            
            <div class="detail-spec">
                <p class="detail-label">الموقع</p>
                <p class="detail-value">${project.location || 'غير محدد'}</p>
            </div>
            
            <div class="detail-spec">
                <p class="detail-label">المساحة</p>
                <p class="detail-value">${project.area || 'غير محددة'}</p>
            </div>
            
            <div class="detail-spec">
                <p class="detail-label">تاريخ الإنجاز</p>
                <p class="detail-value">${project.completionDate || 'غير محدد'}</p>
            </div>
            
            <div class="detail-spec">
                <p class="detail-label">الوصف</p>
                <p class="detail-value">${project.descriptionAr || 'لا يوجد وصف'}</p>
            </div>
            
            <div style="margin-top: 2rem;">
                <a href="projects.html" class="btn btn-secondary">العودة إلى المشاريع</a>
            </div>
        </div>
    `;
}

function loadPortfolioDetail() {
    const container = document.getElementById('projectDetail');
    if (!container) return;

    const portfolioId = sessionStorage.getItem('selectedPortfolioId');
    if (!portfolioId) {
        container.innerHTML = '<p>النموذج غير موجود</p>';
        return;
    }

    const item = dataManager.getPortfolioById(portfolioId);
    if (!item) {
        container.innerHTML = '<p>النموذج غير موجود</p>';
        return;
    }

    container.innerHTML = `
        <div class="project-gallery">
            <div class="main-image">
                <img src="${item.imageUrl}" alt="${item.titleAr}" id="mainImage"
                     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${encodeURIComponent(item.titleAr)}%3C/text%3E%3C/svg%3E'">
            </div>
        </div>
        <div class="project-details">
            <h1>${item.titleAr}</h1>
            ${item.category ? `<p class="project-type">${item.category}</p>` : ''}
            
            <div class="detail-spec">
                <p class="detail-label">الوصف</p>
                <p class="detail-value">${item.descriptionAr || 'لا يوجد وصف'}</p>
            </div>
            
            <div class="detail-spec">
                <p class="detail-label">التصنيف</p>
                <p class="detail-value">${item.category || 'غير محدد'}</p>
            </div>
            
            <div style="margin-top: 2rem;">
                <a href="portfolio.html" class="btn btn-secondary">العودة إلى نماذج الأعمال</a>
            </div>
        </div>
    `;
}

// ===== 🔧 وظائف إدارة من الكونسول =====
window.addNewProject = function(titleAr, descriptionAr, imageName) {
    const newProject = {
        titleAr: titleAr,
        descriptionAr: descriptionAr,
        location: 'موقع المشروع',
        projectType: 'نوع المشروع',
        area: 'المساحة',
        completionDate: '2024',
        featured: 1,
        imageUrl: 'images/projects/' + imageName
    };
    
    const result = dataManager.addProject(newProject);
    console.log('✅ تم إضافة المشروع:', result);
    if (window.location.pathname.includes('projects.html')) {
        loadAllProjects();
    }
    return result;
};

window.addNewPortfolio = function(titleAr, descriptionAr, imageName) {
    const newPortfolio = {
        titleAr: titleAr,
        descriptionAr: descriptionAr,
        category: 'تصميم',
        imageUrl: 'images/portfolio/' + imageName
    };
    
    const result = dataManager.addPortfolioItem(newPortfolio);
    console.log('✅ تم إضافة النموذج:', result);
    if (window.location.pathname.includes('portfolio.html')) {
        loadPortfolio();
    }
    return result;
};

window.deleteProjectById = function(id) {
    dataManager.deleteProject(id);
    console.log('🗑️ تم حذف المشروع رقم:', id);
    if (window.location.pathname.includes('projects.html')) {
        loadAllProjects();
    }
};

window.deletePortfolioById = function(id) {
    dataManager.deletePortfolioItem(id);
    console.log('🗑️ تم حذف النموذج رقم:', id);
    if (window.location.pathname.includes('portfolio.html')) {
        loadPortfolio();
    }
};

window.resetAllData = function() {
    const result = dataManager.clearAllData();
    console.log('🔄 ' + result);
    alert('تم إعادة تعيين البيانات. سيتم إعادة تحميل الصفحة...');
    setTimeout(() => location.reload(), 1000);
    return result;
};

// ===== 🔄 زر تحديث البيانات للمستخدمين =====
function createDataResetButton() {
    // لا تظهر إلا في الصفحات الرئيسية
    if (!document.getElementById('featuredProjects') && 
        !document.getElementById('projectsList') && 
        !document.getElementById('portfolioList')) {
        return;
    }
    
    const resetBtn = document.createElement('button');
    resetBtn.id = 'dataResetBtn';
    resetBtn.innerHTML = '🔄 تحديث البيانات';
    resetBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        background: #d4af37;
        color: #1a1a1a;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Cairo', sans-serif;
        font-weight: 600;
        font-size: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    resetBtn.onclick = function() {
        if (confirm('هل تريد تحديث بيانات الموقع؟\n\nملاحظة: سيتم تحميل أحدث المشاريع والنماذج.')) {
            localStorage.removeItem('arch_projects_v3');
            localStorage.removeItem('arch_portfolio_v3');
            localStorage.removeItem('site_last_update');
            alert('تم تحديث البيانات. سيتم إعادة تحميل الصفحة...');
            setTimeout(() => location.reload(), 1000);
        }
    };
    
    // إضافة تلميح
    resetBtn.title = 'اضغط إذا لم تظهر المشاريع الجديدة';
    
    document.body.appendChild(resetBtn);
}

// ===== تهيئة الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل القائمة النشطة
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // إنشاء زر تحديث البيانات
    createDataResetButton();
    
    // تحميل المحتوى المناسب للصفحة
    if (document.getElementById('featuredProjects')) {
        loadFeaturedProjects();
    }
    if (document.getElementById('projectsList')) {
        loadAllProjects();
    }
    if (document.getElementById('portfolioList')) {
        loadPortfolio();
    }
    if (document.getElementById('projectDetail') && 
        window.location.pathname.includes('project-detail')) {
        loadProjectDetail();
    }
    if (document.getElementById('projectDetail') && 
        window.location.pathname.includes('portfolio-detail')) {
        loadPortfolioDetail();
    }
    
    // رسالة ترحيب في الكونسول
    console.log(`
🎯 موقع باداؤود للهندسة المعمارية
📊 عدد المشاريع: ${dataManager.getProjects().length}
📁 عدد النماذج: ${dataManager.getPortfolio().length}
🔄 لإدارة المحتوى استخدم:
   addNewProject('اسم', 'وصف', 'صورة.jpg')
   addNewPortfolio('اسم', 'وصف', 'صورة.jpg')
   resetAllData()
    `);
});