// ============================================
//  HIDRATADOR ULTRA - COMPLETE APP v3.0
//  Professional Hydration Tracking with ALL Features
// ============================================

class HidratadorApp {
    constructor() {
        // Core Settings
        this.settings = {
            dailyGoal: 8,
            glassSize: 250,
            reminderInterval: 60,
            notificationsEnabled: true,
            soundEnabled: true,
            vibrationEnabled: true,
            darkMode: false,
            userName: 'Usuario'
        };

        // App State
        this.waterCount = 0;
        this.history = [];
        this.streak = 0;
        this.lastDrinkDate = null;

        // Gamification
        this.level = 1;
        this.xp = 0;
        this.badges = [];
        this.totalLifetimeWater = 0;

        // Onboarding
        this.onboardingStep = 0;
        this.hasCompletedOnboarding = false;

        // Calendar & History
        this.completedDays = {};
        this.weeklyData = [];

        // Current View
        this.currentView = 'home';

        // Daily Challenge
        this.dailyChallenge = null;
        this.challengeCompleted = false;

        // Health Tips
        this.healthTips = [
            "El agua ayuda a mantener tu piel hidratada y saludable",
            "Beber agua antes de las comidas puede ayudar a la digestión",
            "Tu cerebro es 73% agua, ¡mantente hidratado para pensar mejor!",
            "El agua ayuda a eliminar toxinas de tu cuerpo",
            "Mantenerse hidratado mejora tu estado de ánimo y energía",
            "El agua regula la temperatura de tu cuerpo",
            "Beber suficiente agua puede reducir dolores de cabeza",
            "La hidratación adecuada mejora el rendimiento físico",
            "El agua ayuda a transportar nutrientes en tu cuerpo",
            "Mantenerse hidratado puede mejorar la calidad del sueño"
        ];
        this.currentTipIndex = 0;

        // UI Elements Cache
        this.elements = {};

        // Initialize
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Hidratador Ultra v3.0 - Initializing...');

        this.cacheElements();
        this.loadFromStorage();

        // Check onboarding
        if (!this.hasCompletedOnboarding) {
            this.showOnboarding();
        } else {
            this.setupEventListeners();
            this.updateAllUI();
            this.startDailyCheck();
            this.requestNotificationPermission();
            this.startReminderTimer();
            this.generateDailyChallenge();
            this.updateHealthTip();
            this.registerServiceWorker();
            this.applyDarkMode();
            this.switchView('home');
        }

        console.log('✅ App initialized successfully');
    }

    cacheElements() {
        // Onboarding
        this.elements.onboardingOverlay = document.getElementById('onboardingOverlay');
        this.elements.onboardingSteps = document.querySelectorAll('.onboarding-step');

        // Main Stats
        this.elements.mainStatValue = document.getElementById('mainStatValue');
        this.elements.goalValue = document.getElementById('goalValue');
        this.elements.percentageValue = document.getElementById('percentageValue');
        this.elements.progressRing = document.getElementById('progressRing');

        // Quick Stats
        this.elements.litersValue = document.getElementById('litersValue');
        this.elements.remainingValue = document.getElementById('remainingValue');
        this.elements.streakValue = document.getElementById('streakValue');

        // Level System
        this.elements.levelBadge = document.getElementById('levelBadge');
        this.elements.xpText = document.getElementById('xpText');
        this.elements.xpFill = document.getElementById('xpFill');
        this.elements.levelUpOverlay = document.getElementById('levelUpOverlay');

        // Buttons
        this.elements.addWaterBtn = document.getElementById('addWaterBtn');
        this.elements.quickAdd500 = document.getElementById('quickAdd500');
        this.elements.customAmountBtn = document.getElementById('customAmountBtn');
        this.elements.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        // Dark Mode
        this.elements.darkModeToggle = document.getElementById('darkModeToggle');

        // Settings
        this.elements.settingsPanel = document.getElementById('settingsPanel');
        this.elements.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.elements.dailyGoal = document.getElementById('dailyGoal');
        this.elements.glassSize = document.getElementById('glassSize');
        this.elements.reminderInterval = document.getElementById('reminderInterval');
        this.elements.notificationsEnabled = document.getElementById('notificationsEnabled');
        this.elements.soundEnabled = document.getElementById('soundEnabled');
        this.elements.vibrationEnabled = document.getElementById('vibrationEnabled');

        // Profile
        this.elements.profileName = document.getElementById('profileName');
        this.elements.profileLevel = document.getElementById('profileLevel');
        this.elements.profileTotalWater = document.getElementById('profileTotalWater');
        this.elements.profileStreak = document.getElementById('profileStreak');
        this.elements.userNameInput = document.getElementById('userNameInput');

        // Modal
        this.elements.customModal = document.getElementById('customModal');
        this.elements.customAmount = document.getElementById('customAmount');
        this.elements.closeModalBtn = document.getElementById('closeModalBtn');
        this.elements.cancelCustomBtn = document.getElementById('cancelCustomBtn');
        this.elements.confirmCustomBtn = document.getElementById('confirmCustomBtn');

        // Other
        this.elements.timeline = document.getElementById('timeline');
        this.elements.achievementBadge = document.getElementById('achievementBadge');
        this.elements.achievementText = document.getElementById('achievementText');
        this.elements.toastContainer = document.getElementById('toastContainer');

        // Views
        this.elements.homeView = document.getElementById('homeView');
        this.elements.statsView = document.getElementById('statsView');
        this.elements.historyView = document.getElementById('historyView');
        this.elements.settingsView = document.getElementById('settingsView');

        // Stats View
        this.elements.weeklyChart = document.getElementById('weeklyChart');
        this.elements.todayTotal = document.getElementById('todayTotal');
        this.elements.weekAverage = document.getElementById('weekAverage');
        this.elements.bestDay = document.getElementById('bestDay');
        this.elements.totalLifetime = document.getElementById('totalLifetime');

        // Calendar
        this.elements.calendarGrid = document.getElementById('calendarGrid');
        this.elements.calendarMonth = document.getElementById('calendarMonth');

        // Health Tips
        this.elements.tipText = document.getElementById('tipText');

        // Daily Challenge
        this.elements.challengeText = document.getElementById('challengeText');
    }

    setupEventListeners() {
        // Dark Mode Toggle
        this.elements.darkModeToggle?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Add Water Buttons
        this.elements.addWaterBtn?.addEventListener('click', () => {
            this.addRipple(this.elements.addWaterBtn);
            this.addWater(this.settings.glassSize);
            this.playSound('water');
            this.vibrate();
        });

        this.elements.quickAdd500?.addEventListener('click', () => {
            this.addWater(500);
            this.playSound('water');
            this.vibrate();
        });

        this.elements.customAmountBtn?.addEventListener('click', () => {
            this.openCustomModal();
        });

        // Custom Amount Modal
        this.elements.closeModalBtn?.addEventListener('click', () => {
            this.closeCustomModal();
        });

        this.elements.cancelCustomBtn?.addEventListener('click', () => {
            this.closeCustomModal();
        });

        this.elements.confirmCustomBtn?.addEventListener('click', () => {
            const amount = parseInt(this.elements.customAmount.value);
            if (amount >= 50 && amount <= 2000) {
                this.addWater(amount);
                this.closeCustomModal();
                this.elements.customAmount.value = '';
                this.playSound('water');
                this.vibrate();
            } else {
                this.showToast('Por favor ingresa una cantidad válida (50-2000ml)', 'error');
            }
        });

        this.elements.customAmount?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.confirmCustomBtn.click();
            }
        });

        // Quick Amount Buttons
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                this.elements.customAmount.value = amount;
            });
        });

        // Settings
        this.elements.closeSettingsBtn?.addEventListener('click', () => {
            this.saveSettings();
            this.closeSettings();
        });

        // Number Input Buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const target = btn.dataset.target;
                const input = document.getElementById(target);

                if (!input) return;

                let value = parseInt(input.value);
                const min = parseInt(input.min) || 0;
                const max = parseInt(input.max) || 999;
                const step = parseInt(input.step) || 1;

                if (action === 'increase') {
                    value = Math.min(value + step, max);
                } else if (action === 'decrease') {
                    value = Math.max(value - step, min);
                }

                input.value = value;
                this.animateNumber(input);
            });
        });

        // Clear History
        this.elements.clearHistoryBtn?.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres limpiar el historial de hoy?')) {
                this.resetDay();
                this.showToast('Historial limpiado', 'success');
            }
        });

        // Bottom Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                if (view) {
                    this.switchView(view);
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        // Data Management
        const exportBtn = document.getElementById('exportDataBtn');
        const importBtn = document.getElementById('importDataBtn');
        const resetBtn = document.getElementById('resetDataBtn');
        const shareBtn = document.getElementById('shareAchievementBtn');
        const importFileInput = document.getElementById('importFileInput');

        exportBtn?.addEventListener('click', () => this.exportData());
        importBtn?.addEventListener('click', () => importFileInput?.click());
        importFileInput?.addEventListener('change', (e) => this.importData(e));
        resetBtn?.addEventListener('click', () => this.resetAllData());
        shareBtn?.addEventListener('click', () => this.shareAchievement());

        // User Name Input
        this.elements.userNameInput?.addEventListener('change', (e) => {
            this.settings.userName = e.target.value || 'Usuario';
            this.saveToStorage();
            this.updateProfileUI();
        });

        // Modal Overlay Click
        this.elements.customModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.customModal) {
                this.closeCustomModal();
            }
        });

        // Level Up Overlay Click
        this.elements.levelUpOverlay?.addEventListener('click', () => {
            this.elements.levelUpOverlay.classList.remove('active');
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCustomModal();
                this.closeSettings();
                this.elements.levelUpOverlay?.classList.remove('active');
            }
        });

        // Calendar Navigation
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        prevMonthBtn?.addEventListener('click', () => this.changeCalendarMonth(-1));
        nextMonthBtn?.addEventListener('click', () => this.changeCalendarMonth(1));
    }

    // ============================================
    // ONBOARDING
    // ============================================

    showOnboarding() {
        this.elements.onboardingOverlay?.classList.add('active');
        this.showOnboardingStep(0);
    }

    showOnboardingStep(step) {
        this.onboardingStep = step;
        this.elements.onboardingSteps?.forEach((el, i) => {
            el.classList.toggle('active', i === step);
        });

        // Update indicators
        document.querySelectorAll('.indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === step);
        });
    }

    nextOnboardingStep() {
        if (this.onboardingStep < 3) {
            this.showOnboardingStep(this.onboardingStep + 1);
        } else {
            this.completeOnboarding();
        }
    }

    prevOnboardingStep() {
        if (this.onboardingStep > 0) {
            this.showOnboardingStep(this.onboardingStep - 1);
        }
    }

    selectGoal(glasses) {
        // Remove previous selection
        document.querySelectorAll('.goal-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Select new
        event.target.closest('.goal-option')?.classList.add('selected');
        this.settings.dailyGoal = glasses;
    }

    async requestNotificationPermissionOnboarding() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.settings.notificationsEnabled = true;
                this.showToast('¡Notificaciones activadas!', 'success');
            }
        }
        this.nextOnboardingStep();
    }

    completeOnboarding() {
        const nameInput = document.getElementById('onboardingName');
        if (nameInput?.value) {
            this.settings.userName = nameInput.value;
        }

        this.hasCompletedOnboarding = true;
        this.saveToStorage();
        this.elements.onboardingOverlay?.classList.remove('active');

        // Setup app
        this.setupEventListeners();
        this.updateAllUI();
        this.startDailyCheck();
        this.startReminderTimer();
        this.generateDailyChallenge();
        this.updateHealthTip();
        this.registerServiceWorker();
        this.switchView('home');

        this.showToast('¡Bienvenido a Hidratador! 🎉', 'success');
        this.playSound('levelup');
    }

    // ============================================
    // WATER MANAGEMENT
    // ============================================

    addWater(ml) {
        const glasses = ml / this.settings.glassSize;
        this.waterCount += glasses;

        // Add to history
        const entry = {
            time: new Date().toISOString(),
            amount: ml,
            id: Date.now()
        };
        this.history.push(entry);

        // Update last drink date
        this.lastDrinkDate = new Date().toDateString();

        // Update lifetime total
        this.totalLifetimeWater += ml;

        // Add XP
        this.addXP(10);

        // Save and update
        this.saveToStorage();
        this.updateAllUI();
        this.checkAchievements();
        this.checkDailyChallenge();
        this.animateProgressRing();

        // Show toast
        this.showToast(`+${ml}ml agregados 💧`, 'success');

        // Update button subtext
        if (this.elements.addWaterBtn) {
            const btnSubtext = this.elements.addWaterBtn.querySelector('.btn-subtext');
            if (btnSubtext) {
                btnSubtext.textContent = `${this.settings.glassSize} ml`;
            }
        }
    }

    deleteHistoryItem(id) {
        const index = this.history.findIndex(item => item.id === id);
        if (index !== -1) {
            const item = this.history[index];
            const glasses = item.amount / this.settings.glassSize;
            this.waterCount -= glasses;
            this.totalLifetimeWater -= item.amount;
            this.history.splice(index, 1);

            this.saveToStorage();
            this.updateAllUI();
            this.showToast('Registro eliminado', 'success');
        }
    }

    resetDay() {
        this.waterCount = 0;
        this.history = [];
        this.challengeCompleted = false;
        this.saveToStorage();
        this.updateAllUI();
    }

    // ============================================
    // GAMIFICATION - LEVELS & XP
    // ============================================

    addXP(amount) {
        this.xp += amount;
        const xpNeeded = this.getXPForLevel(this.level);

        if (this.xp >= xpNeeded) {
            this.levelUp();
        }

        this.updateLevelUI();
        this.saveToStorage();
    }

    getXPForLevel(level) {
        return level * 100; // 100 XP per level
    }

    levelUp() {
        this.level++;
        this.xp = this.xp - this.getXPForLevel(this.level - 1);

        // Award badge
        this.unlockBadge(`level_${this.level}`);

        // Show level up animation
        this.showLevelUpAnimation();
        this.playSound('levelup');
        this.vibrate([200, 100, 200]);

        this.saveToStorage();
    }

    showLevelUpAnimation() {
        const overlay = this.elements.levelUpOverlay;
        const levelNumber = document.getElementById('levelUpNumber');

        if (overlay && levelNumber) {
            levelNumber.textContent = this.level;
            overlay.classList.add('active');

            setTimeout(() => {
                overlay.classList.remove('active');
            }, 3000);
        }
    }

    unlockBadge(badgeId) {
        if (!this.badges.includes(badgeId)) {
            this.badges.push(badgeId);
            this.showToast(`🏆 ¡Nuevo logro desbloqueado!`, 'success');
        }
    }

    updateLevelUI() {
        if (this.elements.levelBadge) {
            this.elements.levelBadge.textContent = `Nivel ${this.level}`;
        }

        const xpNeeded = this.getXPForLevel(this.level);
        const xpProgress = (this.xp / xpNeeded) * 100;

        if (this.elements.xpText) {
            this.elements.xpText.textContent = `${this.xp} / ${xpNeeded} XP`;
        }

        if (this.elements.xpFill) {
            this.elements.xpFill.style.width = `${xpProgress}%`;
        }
    }

    // ============================================
    // DAILY CHALLENGE
    // ============================================

    generateDailyChallenge() {
        const challenges = [
            { text: 'Bebe 4 vasos antes del mediodía', goal: 4, type: 'glasses' },
            { text: 'Alcanza tu meta diaria', goal: this.settings.dailyGoal, type: 'complete' },
            { text: 'Bebe agua cada 2 horas', goal: 6, type: 'glasses' },
            { text: 'Comienza el día con 2 vasos', goal: 2, type: 'early' }
        ];

        const today = new Date().toDateString();
        const savedChallenge = localStorage.getItem('hidratador_daily_challenge');
        const savedDate = localStorage.getItem('hidratador_challenge_date');

        if (savedChallenge && savedDate === today) {
            this.dailyChallenge = JSON.parse(savedChallenge);
            const completed = localStorage.getItem('hidratador_challenge_completed');
            this.challengeCompleted = completed === 'true';
        } else {
            const randomIndex = Math.floor(Math.random() * challenges.length);
            this.dailyChallenge = challenges[randomIndex];
            this.challengeCompleted = false;

            localStorage.setItem('hidratador_daily_challenge', JSON.stringify(this.dailyChallenge));
            localStorage.setItem('hidratador_challenge_date', today);
            localStorage.setItem('hidratador_challenge_completed', 'false');
        }

        this.updateChallengeUI();
    }

    checkDailyChallenge() {
        if (!this.dailyChallenge || this.challengeCompleted) return;

        let completed = false;

        if (this.dailyChallenge.type === 'complete') {
            completed = this.waterCount >= this.settings.dailyGoal;
        } else if (this.dailyChallenge.type === 'glasses') {
            completed = this.waterCount >= this.dailyChallenge.goal;
        }

        if (completed && !this.challengeCompleted) {
            this.challengeCompleted = true;
            this.addXP(50);
            this.showToast('🏆 ¡Desafío diario completado! +50 XP', 'success');
            this.playSound('achievement');
            localStorage.setItem('hidratador_challenge_completed', 'true');
        }
    }

    updateChallengeUI() {
        if (this.elements.challengeText && this.dailyChallenge) {
            this.elements.challengeText.textContent = this.dailyChallenge.text;
        }
    }

    // ============================================
    // UI UPDATES
    // ============================================

    updateAllUI() {
        this.updateMainStats();
        this.updateQuickStats();
        this.updateProgressRing();
        this.updateTimeline();
        this.updateLevelUI();
        this.updateProfileUI();
        this.updateStatsView();
        this.updateCalendar();
        this.updateAchievementBadge();
    }

    updateMainStats() {
        // Main stat value
        if (this.elements.mainStatValue) {
            this.animateValue(this.elements.mainStatValue, this.waterCount.toFixed(1));
        }

        // Goal value
        if (this.elements.goalValue) {
            this.elements.goalValue.textContent = this.settings.dailyGoal;
        }

        // Percentage
        const percentage = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);
        if (this.elements.percentageValue) {
            this.elements.percentageValue.textContent = Math.round(percentage) + '%';
        }
    }

    updateQuickStats() {
        // Liters
        const liters = (this.waterCount * this.settings.glassSize) / 1000;
        if (this.elements.litersValue) {
            this.elements.litersValue.textContent = liters.toFixed(1) + ' L';
        }

        // Remaining
        const remaining = Math.max(0, this.settings.dailyGoal - this.waterCount);
        if (this.elements.remainingValue) {
            this.elements.remainingValue.textContent = Math.ceil(remaining);
        }

        // Streak
        if (this.elements.streakValue) {
            this.elements.streakValue.textContent = this.streak;
        }
    }

    updateProgressRing() {
        if (!this.elements.progressRing) return;

        const percentage = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);
        const circumference = 534; // 2 * π * radius (85)
        const offset = circumference - (percentage / 100) * circumference;

        this.elements.progressRing.style.strokeDashoffset = offset;
    }

    animateProgressRing() {
        if (!this.elements.progressRing) return;

        // Add pulse animation
        this.elements.progressRing.style.animation = 'none';
        setTimeout(() => {
            this.elements.progressRing.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }

    updateTimeline() {
        if (!this.elements.timeline) return;

        if (this.history.length === 0) {
            this.elements.timeline.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 2.69L17.66 8.35C20.78 11.47 20.78 16.53 17.66 19.65C14.54 22.77 9.46 22.77 6.34 19.65C3.22 16.53 3.22 11.47 6.34 8.35L12 2.69Z"/>
                    </svg>
                    <p>Aún no has registrado agua hoy</p>
                    <span>¡Comienza ahora para mantenerte hidratado!</span>
                </div>
            `;
            return;
        }

        const timelineHTML = [...this.history].reverse().map(entry => {
            const time = new Date(entry.time);
            const timeStr = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            return `
                <div class="timeline-item" data-id="${entry.id}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-time">${timeStr}</div>
                        <div class="timeline-amount">${entry.amount} ml</div>
                    </div>
                    <button class="timeline-delete" onclick="app.deleteHistoryItem(${entry.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        this.elements.timeline.innerHTML = timelineHTML;
    }

    updateAchievementBadge() {
        if (!this.elements.achievementText) return;

        const percentage = (this.waterCount / this.settings.dailyGoal) * 100;

        let text = '¡Comienza tu día!';
        if (percentage >= 100) {
            text = '🎉 ¡Meta completada!';
        } else if (percentage >= 75) {
            text = '💪 ¡Casi allí!';
        } else if (percentage >= 50) {
            text = '👍 ¡Buen progreso!';
        } else if (percentage >= 25) {
            text = '⭐ ¡Sigue así!';
        } else if (percentage > 0) {
            text = '🚀 ¡Gran comienzo!';
        }

        this.elements.achievementText.textContent = text;
    }

    updateProfileUI() {
        if (this.elements.profileName) {
            this.elements.profileName.textContent = this.settings.userName;
        }
        if (this.elements.profileLevel) {
            this.elements.profileLevel.textContent = this.level;
        }
        if (this.elements.profileTotalWater) {
            this.elements.profileTotalWater.textContent = (this.totalLifetimeWater / 1000).toFixed(1) + 'L';
        }
        if (this.elements.profileStreak) {
            this.elements.profileStreak.textContent = this.streak;
        }
        if (this.elements.userNameInput) {
            this.elements.userNameInput.value = this.settings.userName;
        }
    }

    // ============================================
    // STATS VIEW
    // ============================================

    updateStatsView() {
        // Update stat cards
        if (this.elements.todayTotal) {
            const todayLiters = (this.waterCount * this.settings.glassSize) / 1000;
            this.elements.todayTotal.textContent = todayLiters.toFixed(1) + 'L';
        }

        if (this.elements.totalLifetime) {
            this.elements.totalLifetime.textContent = (this.totalLifetimeWater / 1000).toFixed(1) + 'L';
        }

        // Render chart if canvas available
        if (this.elements.weeklyChart) {
            this.renderWeeklyChart();
        }
    }

    renderWeeklyChart() {
        const canvas = this.elements.weeklyChart;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2; // Retina
        const height = canvas.height = canvas.offsetHeight * 2;

        ctx.clearRect(0, 0, width, height);

        // Sample data for last 7 days
        const data = this.getWeeklyData();
        const max = Math.max(...data, this.settings.dailyGoal);

        // Drawing settings
        const barWidth = width / (data.length * 2);
        const barSpacing = barWidth;
        const chartHeight = height - 60;

        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / max) * chartHeight;
            const x = (barWidth + barSpacing) * index + barSpacing;
            const y = height - barHeight - 30;

            // Gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#38BDF8');
            gradient.addColorStop(1, '#0EA5E9');

            // Bar
            ctx.fillStyle = gradient;
            ctx.roundRect = function (x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };

            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 8);
            ctx.fill();

            // Day label
            ctx.fillStyle = '#6B7280';
            ctx.font = '24px Inter';
            ctx.textAlign = 'center';
            const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const dayIndex = (new Date().getDay() - (6 - index) + 7) % 7;
            ctx.fillText(days[dayIndex], x + barWidth / 2, height - 10);
        });

        // Goal line
        const goalY = height - ((this.settings.dailyGoal / max) * chartHeight) - 30;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(0, goalY);
        ctx.lineTo(width, goalY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    getWeeklyData() {
        // Return last 7 days of data (simulated for now)
        // In production, this would come from historical data
        return [6, 7, 5, 8, 6, 7, this.waterCount];
    }

    // ============================================
    // CALENDAR VIEW
    // ============================================

    updateCalendar() {
        if (!this.elements.calendarGrid) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        this.renderCalendar(year, month);
    }

    renderCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Update header
        if (this.elements.calendarMonth) {
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            this.elements.calendarMonth.textContent = `${monthNames[month]} ${year}`;
        }

        // Clear grid
        this.elements.calendarGrid.innerHTML = '';

        // Day names
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayNames.forEach(name => {
            const dayName = document.createElement('div');
            dayName.className = 'calendar-day-name';
            dayName.textContent = name;
            this.elements.calendarGrid.appendChild(dayName);
        });

        // Empty cells before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            this.elements.calendarGrid.appendChild(emptyDay);
        }

        // Days of month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const dateKey = `${year}-${month + 1}-${day}`;

            // Check if this day was completed
            if (this.completedDays[dateKey]) {
                dayElement.classList.add('completed');
            }

            // Mark today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            this.elements.calendarGrid.appendChild(dayElement);
        }
    }

    changeCalendarMonth(direction) {
        // This would need to track current calendar month
        // For simplicity, just refresh current month
        this.updateCalendar();
    }

    // ============================================
    // VIEWS MANAGEMENT
    // ============================================

    switchView(viewName) {
        this.currentView = viewName;

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const viewElement = document.getElementById(`${viewName}View`);
        if (viewElement) {
            viewElement.classList.add('active');
        }

        // Update view-specific content
        if (viewName === 'stats') {
            this.updateStatsView();
        } else if (viewName === 'history') {
            this.updateCalendar();
        } else if (viewName === 'settings') {
            this.openSettings();
        }
    }

    // ============================================
    // DARK MODE
    // ============================================

    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        this.applyDarkMode();
        this.saveToStorage();
        this.playSound('click');
    }

    applyDarkMode() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // ============================================
    // HEALTH TIPS
    // ============================================

    updateHealthTip() {
        if (this.elements.tipText) {
            this.currentTipIndex = Math.floor(Math.random() * this.healthTips.length);
            this.elements.tipText.textContent = this.healthTips[this.currentTipIndex];
        }

        // Rotate tips every 30 seconds
        setInterval(() => {
            this.updateHealthTip();
        }, 30000);
    }

    // ============================================
    // DATA MANAGEMENT
    // ============================================

    exportData() {
        const data = {
            settings: this.settings,
            waterCount: this.waterCount,
            history: this.history,
            streak: this.streak,
            level: this.level,
            xp: this.xp,
            badges: this.badges,
            totalLifetimeWater: this.totalLifetimeWater,
            completedDays: this.completedDays,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `hidratador-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showToast('Datos exportados correctamente', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Restore data
                this.settings = data.settings || this.settings;
                this.waterCount = data.waterCount || 0;
                this.history = data.history || [];
                this.streak = data.streak || 0;
                this.level = data.level || 1;
                this.xp = data.xp || 0;
                this.badges = data.badges || [];
                this.totalLifetimeWater = data.totalLifetimeWater || 0;
                this.completedDays = data.completedDays || {};

                this.saveToStorage();
                this.updateAllUI();
                this.applyDarkMode();

                this.showToast('Datos importados correctamente', 'success');
            } catch (error) {
                this.showToast('Error al importar datos', 'error');
                console.error('Import error:', error);
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    resetAllData() {
        if (!confirm('¿Estás seguro? Esto eliminará TODOS tus datos permanentemente.')) {
            return;
        }

        if (!confirm('¿Realmente quieres continuar? Esta acción no se puede deshacer.')) {
            return;
        }

        // Clear all data
        localStorage.clear();

        // Reset to defaults
        this.waterCount = 0;
        this.history = [];
        this.streak = 0;
        this.level = 1;
        this.xp = 0;
        this.badges = [];
        this.totalLifetimeWater = 0;
        this.completedDays = {};
        this.hasCompletedOnboarding = false;

        this.showToast('Datos eliminados. Recargando...', 'success');

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    shareAchievement() {
        const text = `¡He alcanzado el nivel ${this.level} en Hidratador! 💧\n` +
                     `Meta de hoy: ${this.waterCount.toFixed(1)}/${this.settings.dailyGoal} vasos\n` +
                     `Racha: ${this.streak} días 🔥`;

        if (navigator.share) {
            navigator.share({
                title: 'Mi progreso en Hidratador',
                text: text
            }).catch(() => {
                this.copyToClipboard(text);
            });
        } else {
            this.copyToClipboard(text);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copiado al portapapeles', 'success');
        }).catch(() => {
            this.showToast('No se pudo copiar', 'error');
        });
    }

    // ============================================
    // ANIMATIONS
    // ============================================

    addRipple(element) {
        const ripple = element.querySelector('.btn-ripple');
        if (!ripple) return;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.opacity = '1';

        // Trigger animation
        setTimeout(() => {
            ripple.style.transition = 'transform 0.6s, opacity 0.6s';
            ripple.style.transform = 'translate(-50%, -50%) scale(2)';
            ripple.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            ripple.style.transition = 'none';
        }, 600);
    }

    animateValue(element, newValue) {
        if (!element) return;

        element.style.transform = 'scale(1.2)';
        element.textContent = newValue;

        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    animateNumber(element) {
        if (!element) return;

        element.style.transform = 'scale(1.15)';
        element.style.color = 'var(--primary-600)';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }

    // ============================================
    // SOUND & HAPTICS
    // ============================================

    playSound(type) {
        if (!this.settings.soundEnabled) return;

        // Create simple sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'water') {
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (type === 'levelup') {
            oscillator.frequency.value = 523;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);

            setTimeout(() => {
                oscillator.frequency.value = 659;
            }, 100);

            setTimeout(() => {
                oscillator.frequency.value = 784;
            }, 200);

            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.stop(audioContext.currentTime + 0.4);
        } else if (type === 'achievement') {
            oscillator.frequency.value = 1000;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    vibrate(pattern = 50) {
        if (!this.settings.vibrationEnabled) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // ============================================
    // MODAL & PANELS
    // ============================================

    openCustomModal() {
        this.elements.customModal?.classList.add('active');
        setTimeout(() => {
            this.elements.customAmount?.focus();
        }, 100);
    }

    closeCustomModal() {
        this.elements.customModal?.classList.remove('active');
        this.elements.customAmount.value = '';
    }

    openSettings() {
        this.elements.settingsPanel?.classList.add('active');
        this.updateSettingsUI();
    }

    closeSettings() {
        this.elements.settingsPanel?.classList.remove('active');
    }

    updateSettingsUI() {
        if (this.elements.dailyGoal) this.elements.dailyGoal.value = this.settings.dailyGoal;
        if (this.elements.glassSize) this.elements.glassSize.value = this.settings.glassSize;
        if (this.elements.reminderInterval) this.elements.reminderInterval.value = this.settings.reminderInterval;
        if (this.elements.notificationsEnabled) this.elements.notificationsEnabled.checked = this.settings.notificationsEnabled;
        if (this.elements.soundEnabled) this.elements.soundEnabled.checked = this.settings.soundEnabled;
        if (this.elements.vibrationEnabled) this.elements.vibrationEnabled.checked = this.settings.vibrationEnabled;
    }

    // ============================================
    // SETTINGS
    // ============================================

    saveSettings() {
        this.settings.dailyGoal = parseInt(this.elements.dailyGoal?.value || this.settings.dailyGoal);
        this.settings.glassSize = parseInt(this.elements.glassSize?.value || this.settings.glassSize);
        this.settings.reminderInterval = parseInt(this.elements.reminderInterval?.value || this.settings.reminderInterval);
        this.settings.notificationsEnabled = this.elements.notificationsEnabled?.checked ?? this.settings.notificationsEnabled;
        this.settings.soundEnabled = this.elements.soundEnabled?.checked ?? this.settings.soundEnabled;
        this.settings.vibrationEnabled = this.elements.vibrationEnabled?.checked ?? this.settings.vibrationEnabled;

        this.saveToStorage();
        this.updateAllUI();
        this.startReminderTimer();

        this.showToast('Configuración guardada', 'success');
    }

    // ============================================
    // STORAGE
    // ============================================

    loadFromStorage() {
        try {
            // Load onboarding status
            const onboarding = localStorage.getItem('hidratador_onboarding');
            this.hasCompletedOnboarding = onboarding === 'true';

            // Load data
            const data = localStorage.getItem('hidratador_data');
            if (data) {
                const parsed = JSON.parse(data);
                const today = new Date().toDateString();

                if (parsed.date === today) {
                    this.waterCount = parsed.waterCount || 0;
                    this.history = parsed.history || [];
                    this.lastDrinkDate = parsed.lastDrinkDate;
                } else {
                    // New day - update streak
                    const completed = this.waterCount >= this.settings.dailyGoal;
                    if (completed) {
                        const dateKey = `${parsed.date}`;
                        this.completedDays[dateKey] = true;
                    }
                    this.updateStreak(parsed.lastDrinkDate);
                    this.resetDay();
                }
            }

            // Load settings
            const settings = localStorage.getItem('hidratador_settings');
            if (settings) {
                this.settings = { ...this.settings, ...JSON.parse(settings) };
            }

            // Load gamification data
            const gameData = localStorage.getItem('hidratador_game');
            if (gameData) {
                const parsed = JSON.parse(gameData);
                this.level = parsed.level || 1;
                this.xp = parsed.xp || 0;
                this.badges = parsed.badges || [];
                this.totalLifetimeWater = parsed.totalLifetimeWater || 0;
            }

            // Load streak
            const streak = localStorage.getItem('hidratador_streak');
            if (streak) {
                this.streak = parseInt(streak);
            }

            // Load completed days
            const completedDays = localStorage.getItem('hidratador_completed_days');
            if (completedDays) {
                this.completedDays = JSON.parse(completedDays);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            // Save data
            const data = {
                date: new Date().toDateString(),
                waterCount: this.waterCount,
                history: this.history,
                lastDrinkDate: this.lastDrinkDate
            };
            localStorage.setItem('hidratador_data', JSON.stringify(data));

            // Save settings
            localStorage.setItem('hidratador_settings', JSON.stringify(this.settings));

            // Save game data
            const gameData = {
                level: this.level,
                xp: this.xp,
                badges: this.badges,
                totalLifetimeWater: this.totalLifetimeWater
            };
            localStorage.setItem('hidratador_game', JSON.stringify(gameData));

            // Save streak
            localStorage.setItem('hidratador_streak', this.streak.toString());

            // Save completed days
            localStorage.setItem('hidratador_completed_days', JSON.stringify(this.completedDays));

            // Save onboarding status
            localStorage.setItem('hidratador_onboarding', this.hasCompletedOnboarding.toString());
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // ============================================
    // ACHIEVEMENTS & STREAK
    // ============================================

    checkAchievements() {
        const percentage = (this.waterCount / this.settings.dailyGoal) * 100;

        if (percentage >= 100 && percentage < 105) {
            // Mark day as completed
            const today = new Date().toDateString();
            this.completedDays[today] = true;

            this.showToast('🎉 ¡Meta completada! Excelente trabajo', 'success');
            this.updateStreak(this.lastDrinkDate);
            this.addXP(100);
            this.unlockBadge('goal_completed');
            this.playSound('achievement');
        } else if (Math.round(percentage) === 50) {
            this.showToast('💪 ¡Mitad del camino! Sigue así', 'success');
            this.addXP(25);
        } else if (Math.round(percentage) === 25) {
            this.showToast('⭐ ¡Buen comienzo! 25% completado', 'success');
            this.addXP(10);
        }

        this.updateAchievementBadge();
    }

    updateStreak(lastDate) {
        if (!lastDate) {
            this.streak = 1;
            return;
        }

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastDate === yesterday) {
            this.streak++;
            if (this.streak % 7 === 0) {
                this.showToast(`🔥 ¡${this.streak} días de racha!`, 'success');
                this.addXP(200);
                this.unlockBadge(`streak_${this.streak}`);
            }
        } else if (lastDate !== today) {
            this.streak = 1;
        }

        this.saveToStorage();
    }

    // ============================================
    // NOTIFICATIONS
    // ============================================

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(title, body) {
        if ('Notification' in window &&
            Notification.permission === 'granted' &&
            this.settings.notificationsEnabled) {
            new Notification(title, {
                body: body,
                icon: 'icon.png',
                badge: 'icon.png',
                tag: 'hidratador'
            });
        }
    }

    startReminderTimer() {
        if (this.reminderTimer) {
            clearInterval(this.reminderTimer);
        }

        const intervalMs = this.settings.reminderInterval * 60 * 1000;

        this.reminderTimer = setInterval(() => {
            if (this.settings.notificationsEnabled) {
                const percentage = (this.waterCount / this.settings.dailyGoal) * 100;
                if (percentage < 100) {
                    this.showNotification(
                        '💧 ¡Hora de hidratarte!',
                        `Has tomado ${this.waterCount.toFixed(1)} de ${this.settings.dailyGoal} vasos. ¡Toma un poco de agua!`
                    );
                }
            }
        }, intervalMs);
    }

    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        this.elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // ============================================
    // DAILY CHECK
    // ============================================

    startDailyCheck() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow - now;

        setTimeout(() => {
            this.resetDay();
            this.generateDailyChallenge();
            this.updateHealthTip();
            this.showNotification('🌅 ¡Nuevo día!', 'Contador reiniciado. ¡Comienza un nuevo día de hidratación!');
            this.updateAllUI();
            this.startDailyCheck(); // Schedule next check
        }, msUntilMidnight);
    }

    // ============================================
    // SERVICE WORKER
    // ============================================

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('✅ Service Worker registered'))
                    .catch(err => console.log('❌ Service Worker registration failed:', err));
            });
        }
    }
}

// ============================================
// GLOBAL FUNCTIONS (for inline onclick)
// ============================================

function selectGoal(glasses) {
    if (window.app) {
        window.app.selectGoal(glasses);
    }
}

function nextOnboardingStep() {
    if (window.app) {
        window.app.nextOnboardingStep();
    }
}

function prevOnboardingStep() {
    if (window.app) {
        window.app.prevOnboardingStep();
    }
}

function requestNotificationPermission() {
    if (window.app) {
        window.app.requestNotificationPermissionOnboarding();
    }
}

function completeOnboarding() {
    if (window.app) {
        window.app.completeOnboarding();
    }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new HidratadorApp();
    window.app = app; // Make globally accessible
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && app) {
        app.loadFromStorage();
        app.updateAllUI();
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);
