// ===== Admin Panel Functions =====

// Tab switching
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabs = document.querySelectorAll('.admin-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabs.forEach(tab => tab.style.display = 'none');
            
            // Add active class to clicked button and show corresponding tab
            this.classList.add('active');
            document.getElementById(tabName + '-tab').style.display = 'block';
            
            // Load data for the tab
            if (tabName === 'projects') {
                loadProjectsTable();
            } else if (tabName === 'portfolio') {
                loadPortfolioTable();
            }
        });
    });

    // Load initial data
    loadProjectsTable();
});

// ===== Project Management =====

function showProjectForm() {
    document.getElementById('projectForm').style.display = 'block';
    // Clear form
    document.getElementById('projectTitleAr').value = '';
    document.getElementById('projectTitleEn').value = '';
    document.getElementById('projectDescriptionAr').value = '';
    document.getElementById('projectLocation').value = '';
    document.getElementById('projectType').value = '';
    document.getElementById('projectArea').value = '';
    document.getElementById('projectDate').value = '';
    document.getElementById('projectImage').value = '';
    document.getElementById('projectFeatured').checked = false;
}

function hideProjectForm() {
    document.getElementById('projectForm').style.display = 'none';
}

function saveProject(event) {
    event.preventDefault();

    const titleAr = document.getElementById('projectTitleAr').value;
    if (!titleAr) {
        alert('يرجى إدخال اسم المشروع');
        return;
    }

    const imageInput = document.getElementById('projectImage');
    let imageUrl = '';

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            
            const project = {
                titleAr: titleAr,
                titleEn: document.getElementById('projectTitleEn').value,
                descriptionAr: document.getElementById('projectDescriptionAr').value,
                location: document.getElementById('projectLocation').value,
                projectType: document.getElementById('projectType').value,
                area: document.getElementById('projectArea').value,
                completionDate: document.getElementById('projectDate').value,
                featured: document.getElementById('projectFeatured').checked ? 1 : 0,
                imageUrl: imageUrl
            };

            dataManager.saveProject(project);
            alert('تم حفظ المشروع بنجاح');
            hideProjectForm();
            loadProjectsTable();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // No image selected, create placeholder
        const project = {
            titleAr: titleAr,
            titleEn: document.getElementById('projectTitleEn').value,
            descriptionAr: document.getElementById('projectDescriptionAr').value,
            location: document.getElementById('projectLocation').value,
            projectType: document.getElementById('projectType').value,
            area: document.getElementById('projectArea').value,
            completionDate: document.getElementById('projectDate').value,
            featured: document.getElementById('projectFeatured').checked ? 1 : 0,
            imageUrl: `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23d4af37%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231a1a1a%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${titleAr}%3C/text%3E%3C/svg%3E`
        };

        dataManager.saveProject(project);
        alert('تم حفظ المشروع بنجاح');
        hideProjectForm();
        loadProjectsTable();
    }
}

function editProject(id) {
    const project = dataManager.getProjectById(id);
    if (!project) return;

    document.getElementById('projectTitleAr').value = project.titleAr;
    document.getElementById('projectTitleEn').value = project.titleEn || '';
    document.getElementById('projectDescriptionAr').value = project.descriptionAr || '';
    document.getElementById('projectLocation').value = project.location || '';
    document.getElementById('projectType').value = project.projectType || '';
    document.getElementById('projectArea').value = project.area || '';
    document.getElementById('projectDate').value = project.completionDate || '';
    document.getElementById('projectFeatured').checked = project.featured === 1;

    // Store the ID for update
    document.getElementById('projectForm').dataset.projectId = id;
    showProjectForm();
}

function deleteProject(id) {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
        dataManager.deleteProject(id);
        alert('تم حذف المشروع بنجاح');
        loadProjectsTable();
    }
}

function loadProjectsTable() {
    const tbody = document.getElementById('projectsList');
    if (!tbody) return;

    const projects = dataManager.getProjects();

    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">لا توجد مشاريع حالياً</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${project.titleAr}</td>
            <td>${project.location || '-'}</td>
            <td>${project.projectType || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editProject(${project.id})">تعديل</button>
                <button class="btn btn-delete" onclick="deleteProject(${project.id})">حذف</button>
            </td>
        </tr>
    `).join('');
}

// ===== Portfolio Management =====

function showPortfolioForm() {
    document.getElementById('portfolioForm').style.display = 'block';
    // Clear form
    document.getElementById('portfolioTitleAr').value = '';
    document.getElementById('portfolioCategory').value = '';
    document.getElementById('portfolioDescriptionAr').value = '';
    document.getElementById('portfolioImage').value = '';
}

function hidePortfolioForm() {
    document.getElementById('portfolioForm').style.display = 'none';
}

function savePortfolioItem(event) {
    event.preventDefault();

    const titleAr = document.getElementById('portfolioTitleAr').value;
    if (!titleAr) {
        alert('يرجى إدخال اسم النموذج');
        return;
    }

    const imageInput = document.getElementById('portfolioImage');
    if (!imageInput.files || !imageInput.files[0]) {
        alert('يرجى اختيار صورة للنموذج');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const item = {
            titleAr: titleAr,
            titleEn: '',
            descriptionAr: document.getElementById('portfolioDescriptionAr').value,
            category: document.getElementById('portfolioCategory').value,
            imageUrl: e.target.result
        };

        dataManager.savePortfolioItem(item);
        alert('تم حفظ النموذج بنجاح');
        hidePortfolioForm();
        loadPortfolioTable();
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function editPortfolioItem(id) {
    const item = dataManager.getPortfolioById(id);
    if (!item) return;

    document.getElementById('portfolioTitleAr').value = item.titleAr;
    document.getElementById('portfolioCategory').value = item.category || '';
    document.getElementById('portfolioDescriptionAr').value = item.descriptionAr || '';

    document.getElementById('portfolioForm').dataset.itemId = id;
    showPortfolioForm();
}

function deletePortfolioItem(id) {
    if (confirm('هل أنت متأكد من حذف هذا النموذج؟')) {
        dataManager.deletePortfolioItem(id);
        alert('تم حذف النموذج بنجاح');
        loadPortfolioTable();
    }
}

function loadPortfolioTable() {
    const tbody = document.getElementById('portfolioList');
    if (!tbody) return;

    const portfolio = dataManager.getPortfolio();

    if (portfolio.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">لا توجد نماذج أعمال حالياً</td></tr>';
        return;
    }

    tbody.innerHTML = portfolio.map(item => `
        <tr>
            <td>${item.titleAr}</td>
            <td>${item.category || '-'}</td>
            <td>
                <button class="btn btn-edit" onclick="editPortfolioItem(${item.id})">تعديل</button>
                <button class="btn btn-delete" onclick="deletePortfolioItem(${item.id})">حذف</button>
            </td>
        </tr>
    `).join('');
}
