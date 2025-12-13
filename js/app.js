// ===== Data Management =====
// Using localStorage to store projects and portfolio items

class DataManager {
    constructor() {
        this.projectsKey = 'arch_projects';
        this.portfolioKey = 'arch_portfolio';
        this.initializeSampleData();
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        if (!localStorage.getItem(this.projectsKey)) {
            const sampleProjects = [
                {
                    id: 1,
                    titleAr: 'مجمع سكني حديث',
                    titleEn: 'Modern Residential Complex',
                    descriptionAr: 'مجمع سكني متكامل يجمع بين الفخامة والراحة، يتضمن 150 وحدة سكنية مع مرافق متعددة تشمل حمامات سباحة، صالات رياضية، ومساحات خضراء واسعة.',
                    location: 'الرياض - حي الملقا',
                    projectType: 'مبنى سكني',
                    area: '45,000 متر مربع',
                    completionDate: '2023',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمجمع سكني حديث%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 2,
                    titleAr: 'مركز تجاري فاخر',
                    titleEn: 'Luxury Shopping Mall',
                    descriptionAr: 'مركز تجاري عصري يتميز بتصميم معماري فريد، يضم 200 متجر وعدة مطاعم عالمية، مع مواقف سيارات متعددة الطوابق ومرافق ترفيهية.',
                    location: 'جدة - حي البلد',
                    projectType: 'مركز تجاري',
                    area: '60,000 متر مربع',
                    completionDate: '2022',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمركز تجاري فاخر%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 3,
                    titleAr: 'مستشفى متخصص',
                    titleEn: 'Specialized Hospital',
                    descriptionAr: 'مستشفى حديث مجهز بأحدث التقنيات الطبية، تصميم يراعي احتياجات المرضى والعاملين مع توفير بيئة علاجية مريحة وآمنة.',
                    location: 'الدمام - حي الخليج',
                    projectType: 'مستشفى',
                    area: '35,000 متر مربع',
                    completionDate: '2023',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمستشفى متخصص%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 4,
                    titleAr: 'فيلا سكنية فاخرة',
                    titleEn: 'Luxury Villa',
                    descriptionAr: 'فيلا سكنية فاخرة بتصميم عصري يجمع بين الأصالة والحداثة، تتضمن 6 غرف نوم رئيسية، صالات واسعة، حديقة خاصة، ومسبح.',
                    location: 'الرياض - حي الياسمين',
                    projectType: 'فيلا سكنية',
                    area: '850 متر مربع',
                    completionDate: '2024',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eفيلا سكنية فاخرة%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 5,
                    titleAr: 'مبنى إداري متعدد الطوابق',
                    titleEn: 'Multi-Story Office Building',
                    descriptionAr: 'مبنى إداري حديث يتكون من 15 طابق، مصمم لتوفير بيئة عمل مثالية مع مساحات مكتبية مرنة، قاعات اجتماعات مجهزة، ومواقف سيارات تحت الأرض.',
                    location: 'الخبر - الكورنيش',
                    projectType: 'مبنى إداري',
                    area: '28,000 متر مربع',
                    completionDate: '2023',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2222%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمبنى إداري متعدد الطوابق%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 6,
                    titleAr: 'مجمع تعليمي متكامل',
                    titleEn: 'Educational Complex',
                    descriptionAr: 'مجمع تعليمي شامل يضم مدارس من جميع المراحل، مع مرافق رياضية وترفيهية، مختبرات علمية حديثة، ومكتبات رقمية متطورة.',
                    location: 'جدة - حي الزهراء',
                    projectType: 'مجمع تعليمي',
                    area: '52,000 متر مربع',
                    completionDate: '2022',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2222%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمجمع تعليمي متكامل%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 7,
                    titleAr: 'فندق خمس نجوم',
                    titleEn: 'Five-Star Hotel',
                    descriptionAr: 'فندق فاخر من فئة خمس نجوم يتميز بتصميم معماري استثنائي، يضم 200 جناح فندقي، مطاعم عالمية، قاعات مؤتمرات، ومرافق ترفيهية متنوعة.',
                    location: 'الرياض - حي السفارات',
                    projectType: 'فندق',
                    area: '48,000 متر مربع',
                    completionDate: '2024',
                    featured: 1,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eفندق خمس نجوم%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 8,
                    titleAr: 'مركز طبي متخصص',
                    titleEn: 'Specialized Medical Center',
                    descriptionAr: 'مركز طبي متخصص في الجراحات التجميلية والعلاج الطبيعي، مجهز بأحدث الأجهزة الطبية وغرف عمليات متطورة.',
                    location: 'الدمام - حي الفيصلية',
                    projectType: 'مركز طبي',
                    area: '12,000 متر مربع',
                    completionDate: '2023',
                    featured: 0,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2222%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمركز طبي متخصص%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 9,
                    titleAr: 'مسجد جامع',
                    titleEn: 'Grand Mosque',
                    descriptionAr: 'مسجد جامع بتصميم إسلامي عصري يتسع لـ 3000 مصلي، مع مرافق للوضوء، مواقف سيارات واسعة، ومكتبة إسلامية.',
                    location: 'مكة المكرمة - حي العزيزية',
                    projectType: 'مسجد',
                    area: '8,500 متر مربع',
                    completionDate: '2022',
                    featured: 0,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمسجد جامع%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 10,
                    titleAr: 'منتجع سياحي',
                    titleEn: 'Tourist Resort',
                    descriptionAr: 'منتجع سياحي متكامل على شاطئ البحر الأحمر، يضم شاليهات فاخرة، مطاعم بحرية، مرافق رياضية مائية، ومساحات ترفيهية للعائلات.',
                    location: 'جدة - أبحر الشمالية',
                    projectType: 'منتجع سياحي',
                    area: '75,000 متر مربع',
                    completionDate: '2024',
                    featured: 0,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمنتجع سياحي%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 11,
                    titleAr: 'مركز ثقافي وفني',
                    titleEn: 'Cultural & Art Center',
                    descriptionAr: 'مركز ثقافي وفني يحتوي على قاعات عرض، مسرح كبير، ورش فنية، ومكتبة عامة، مصمم لدعم الحركة الثقافية والفنية في المنطقة.',
                    location: 'الرياض - حي الملز',
                    projectType: 'مركز ثقافي',
                    area: '18,000 متر مربع',
                    completionDate: '2023',
                    featured: 0,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2222%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمركز ثقافي وفني%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 12,
                    titleAr: 'مجمع رياضي متعدد الأغراض',
                    titleEn: 'Multi-Purpose Sports Complex',
                    descriptionAr: 'مجمع رياضي شامل يضم ملاعب كرة قدم، كرة سلة، صالات رياضية مغلقة، مسابح أولمبية، ومضمار للجري.',
                    location: 'الخبر - حي العقربية',
                    projectType: 'مجمع رياضي',
                    area: '42,000 متر مربع',
                    completionDate: '2022',
                    featured: 0,
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمجمع رياضي متعدد الأغراض%3C/text%3E%3C/svg%3E'
                }
            ];
            localStorage.setItem(this.projectsKey, JSON.stringify(sampleProjects));
        }

        if (!localStorage.getItem(this.portfolioKey)) {
            const samplePortfolio = [
                {
                    id: 1,
                    titleAr: 'تصميم واجهة حديثة',
                    titleEn: 'Modern Facade Design',
                    descriptionAr: 'تصميم واجهة معمارية عصرية تجمع بين الزجاج والحجر الطبيعي',
                    category: 'تصاميم',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23d4af37%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eتصميم واجهة%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 2,
                    titleAr: 'مفهوم معماري مبتكر',
                    titleEn: 'Innovative Concept',
                    descriptionAr: 'مفهوم معماري يجمع بين الفن والوظيفة في تصميم مستدام',
                    category: 'مفاهيم',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%231a1a1a%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمفهوم مبتكر%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 3,
                    titleAr: 'تصميم داخلي فاخر',
                    titleEn: 'Luxury Interior Design',
                    descriptionAr: 'تصميم داخلي يعكس الذوق الرفيع مع استخدام مواد فاخرة',
                    category: 'تصاميم',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23d4af37%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eتصميم داخلي%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 4,
                    titleAr: 'تصميم حديقة عصرية',
                    titleEn: 'Modern Garden Design',
                    descriptionAr: 'تصميم حديقة عصرية مع مساحات خضراء وممرات مائية',
                    category: 'تصاميم خارجية',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%231a1a1a%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eتصميم حديقة%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 5,
                    titleAr: 'تصميم مكتب عصري',
                    titleEn: 'Modern Office Design',
                    descriptionAr: 'تصميم مكتب عصري يوفر بيئة عمل مريحة ومحفزة',
                    category: 'تصاميم',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23d4af37%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eتصميم مكتب%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 6,
                    titleAr: 'مفهوم معماري مستدام',
                    titleEn: 'Sustainable Architecture Concept',
                    descriptionAr: 'مفهوم معماري يركز على الاستدامة والطاقة المتجددة',
                    category: 'مفاهيم',
                    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%231a1a1a%22 width=%22250%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3Eمعماري مستدام%3C/text%3E%3C/svg%3E'
                }
            ];
            localStorage.setItem(this.portfolioKey, JSON.stringify(samplePortfolio));
        }
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

    saveProject(project) {
        const projects = this.getProjects();
        if (project.id) {
            const index = projects.findIndex(p => p.id === project.id);
            if (index !== -1) {
                projects[index] = { ...projects[index], ...project };
            }
        } else {
            project.id = Math.max(...projects.map(p => p.id), 0) + 1;
            projects.push(project);
        }
        localStorage.setItem(this.projectsKey, JSON.stringify(projects));
        return project;
    }

    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.projectsKey, JSON.stringify(projects));
    }

    // Portfolio
    getPortfolio() {
        return JSON.parse(localStorage.getItem(this.portfolioKey)) || [];
    }

    getPortfolioById(id) {
        return this.getPortfolio().find(p => p.id === parseInt(id));
    }

    savePortfolioItem(item) {
        const portfolio = this.getPortfolio();
        if (item.id) {
            const index = portfolio.findIndex(p => p.id === item.id);
            if (index !== -1) {
                portfolio[index] = { ...portfolio[index], ...item };
            }
        } else {
            item.id = Math.max(...portfolio.map(p => p.id), 0) + 1;
            portfolio.push(item);
        }
        localStorage.setItem(this.portfolioKey, JSON.stringify(portfolio));
        return item;
    }

    deletePortfolioItem(id) {
        const portfolio = this.getPortfolio().filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.portfolioKey, JSON.stringify(portfolio));
    }
}

// Initialize data manager
const dataManager = new DataManager();

// ===== UI Functions =====

// Load featured projects on home page
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
                <img src="${project.imageUrl}" alt="${project.titleAr}">
            </div>
            <div class="project-info">
                <h3>${project.titleAr}</h3>
                ${project.location ? `<p class="project-location">${project.location}</p>` : ''}
                ${project.projectType ? `<p class="project-type">${project.projectType}</p>` : ''}
                ${project.descriptionAr ? `<p class="project-description">${project.descriptionAr.substring(0, 100)}...</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Load all projects
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
                <img src="${project.imageUrl}" alt="${project.titleAr}">
            </div>
            <div class="project-info">
                <h3>${project.titleAr}</h3>
                ${project.location ? `<p class="project-location">${project.location}</p>` : ''}
                ${project.projectType ? `<p class="project-type">${project.projectType}</p>` : ''}
                ${project.descriptionAr ? `<p class="project-description">${project.descriptionAr.substring(0, 100)}...</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Load portfolio
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
        <div class="portfolio-item">
            <div class="project-image">
                <img src="${item.imageUrl}" alt="${item.titleAr}">
            </div>
            <div class="project-info">
                <h3>${item.titleAr}</h3>
                ${item.category ? `<p class="project-type">${item.category}</p>` : ''}
                ${item.descriptionAr ? `<p class="project-description">${item.descriptionAr}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// View project details
function viewProject(id) {
    sessionStorage.setItem('selectedProjectId', id);
    window.location.href = 'project-detail.html';
}

// Load project detail
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
                <img src="${project.imageUrl}" alt="${project.titleAr}" id="mainImage">
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
        </div>
    `;
}

// Navigation active state
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
