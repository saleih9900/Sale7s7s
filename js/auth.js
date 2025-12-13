// ===== Authentication System =====

class AuthManager {
    constructor() {
        this.usersKey = 'arch_users';
        this.sessionKey = 'arch_session';
        this.initializeUsers();
    }

    // Initialize default user
    initializeUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            const users = [
                {
                    id: 1,
                    username: 'saleh',
                    password: this.hashPassword('saleh123'),
                    email: 'saleh@arch.com',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(users));
        }
    }

    // Simple hash function (for demo purposes)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Login user
    login(username, password) {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        const user = users.find(u => u.username === username);

        if (!user) {
            return { success: false, message: 'اسم المستخدم غير صحيح' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'كلمة المرور غير صحيحة' };
        }

        // Create session
        const session = {
            userId: user.id,
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.sessionKey);
    }

    // Get current session
    getSession() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getSession() !== null;
    }

    // Change password
    changePassword(username, oldPassword, newPassword) {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        const userIndex = users.findIndex(u => u.username === username);

        if (userIndex === -1) {
            return { success: false, message: 'المستخدم غير موجود' };
        }

        if (users[userIndex].password !== this.hashPassword(oldPassword)) {
            return { success: false, message: 'كلمة المرور القديمة غير صحيحة' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' };
        }

        users[userIndex].password = this.hashPassword(newPassword);
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    }

    // Get user info
    getUserInfo(username) {
        const users = JSON.parse(localStorage.getItem(this.usersKey)) || [];
        const user = users.find(u => u.username === username);
        if (user) {
            const { password, ...userInfo } = user;
            return userInfo;
        }
        return null;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// ===== Login Page Functions =====

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    // Clear messages
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (!username || !password) {
        errorMsg.textContent = 'يرجى ملء جميع الحقول';
        errorMsg.style.display = 'block';
        return;
    }

    const result = authManager.login(username, password);

    if (result.success) {
        successMsg.textContent = result.message;
        successMsg.style.display = 'block';

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to admin panel after 1 second
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        errorMsg.textContent = result.message;
        errorMsg.style.display = 'block';
    }
}

// Check if user is logged in on admin page
function checkAuth() {
    if (!authManager.isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
        authManager.logout();
        window.location.href = 'login.html';
    }
}

// Auto-login if remember me was checked
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('rememberMe') === 'true' && window.location.pathname.includes('login.html')) {
        const session = authManager.getSession();
        if (session) {
            window.location.href = 'admin.html';
        }
    }
});
