// ============================================
//  HIDRATADOR ULTRA PRO v4.0 - COMPLETO
//  Aplicación Robusta y Dinámica
// ============================================

class HidratadorApp {
    constructor() {
        // Core Settings
        this.settings = {
            dailyGoal: 8,
            glassSize: 250,
            reminderInterval: 60,
            notificationsEnabled: false,
            soundEnabled: true,
            vibrationEnabled: true,
            darkMode: false,
            userName: 'Usuario',
            weight: 70,
            activity: 'light'
        };

        // App State
        this.waterCount = 0;
        this.history = [];
        this.allTimeHistory = []; // Para estadísticas y calendario
        this.streak = 0;
        this.lastDrinkDate = null;
        this.bestStreak = 0;

        // Gamification
        this.level = 1;
        this.xp = 0;
        this.totalLifetimeWater = 0;
        this.achievements = [];
        this.unlockedAchievements = [];

        // Onboarding
        this.currentOnboardingStep = 1;
        this.hasCompletedOnboarding = false;

        // Daily Challenge
        this.dailyChallenge = null;
        this.challengeCompleted = false;

        // Current View
        this.currentView = 'home';

        // Calendar
        this.currentMonth = new Date();

        // Reminder interval
        this.reminderTimerId = null;

        // BUSINESS FEATURES - Premium
        this.lastCheckIn = null;
        this.checkInStreak = 0;
        this.dailyTip = null;
        this.streakFreezes = 3; // Permitir 3 "freeze" de racha
        this.personalizedGoal = null;

        // UI Elements Cache
        this.elements = {};

        // Define achievements
        this.defineAchievements();

        // Initialize
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Hidratador Ultra Pro - Starting...');

        this.cacheElements();
        this.loadFromStorage();

        // Check onboarding
        if (!this.hasCompletedOnboarding) {
            this.showOnboarding();
        } else {
            this.setupEventListeners();
            this.hideOnboarding();
            this.updateAllUI();
            this.startDailyCheck();
            this.generateDailyChallenge();
            this.applyDarkMode();
            this.startReminders();
            this.renderCalendar();
            this.renderAchievements();
            this.updateMonthlyStats();

            // BUSINESS FEATURES
            this.checkDailyCheckIn();
            this.generateDailyTip();
            this.calculatePersonalizedGoal();
        }

        console.log('✅ App initialized - Premium Business Edition');
    }

    cacheElements() {
        // Onboarding
        this.elements.onboardingOverlay = document.getElementById('onboardingOverlay');
        this.elements.onboardingSteps = document.querySelectorAll('.onboarding-step');
        this.elements.onboardingBack = document.getElementById('onboardingBack');
        this.elements.onboardingNext = document.getElementById('onboardingNext');
        this.elements.onboardingDots = document.querySelectorAll('.onboarding-dots .dot');
        this.elements.enableNotificationsBtn = document.getElementById('enableNotificationsBtn');

        // Main elements
        this.elements.mainStatValue = document.getElementById('mainStatValue');
        this.elements.goalValue = document.getElementById('goalValue');
        this.elements.percentageValue = document.getElementById('percentageValue');
        this.elements.progressRing = document.getElementById('progressRing');

        // Buttons
        this.elements.addWaterBtn = document.getElementById('addWaterBtn');
        this.elements.quickAdd500 = document.getElementById('quickAdd500');
        this.elements.customAmountBtn = document.getElementById('customAmountBtn');

        // Modal
        this.elements.customModal = document.getElementById('customModal');
        this.elements.customAmount = document.getElementById('customAmount');
        this.elements.closeModalBtn = document.getElementById('closeModalBtn');
        this.elements.cancelCustomBtn = document.getElementById('cancelCustomBtn');
        this.elements.confirmCustomBtn = document.getElementById('confirmCustomBtn');

        // Other
        this.elements.darkModeToggle = document.getElementById('darkModeToggle');
        this.elements.userLevel = document.getElementById('userLevel');
        this.elements.xpFill = document.getElementById('xpFill');
        this.elements.currentXP = document.getElementById('currentXP');
        this.elements.requiredXP = document.getElementById('requiredXP');
        this.elements.dailyChallengeText = document.getElementById('dailyChallengeText');
        this.elements.timeline = document.getElementById('timeline');

        // Calendar
        this.elements.calendarMonth = document.getElementById('calendarMonth');
        this.elements.calendarGrid = document.getElementById('calendarGrid');
        this.elements.prevMonth = document.getElementById('prevMonth');
        this.elements.nextMonth = document.getElementById('nextMonth');

        // Stats
        this.elements.achievementGrid = document.getElementById('achievementGrid');

        // Settings
        this.elements.profileName = document.getElementById('profileName');
        this.elements.userWeight = document.getElementById('userWeight');
        this.elements.activityLevel = document.getElementById('activityLevel');
        this.elements.dailyGoalInput = document.getElementById('dailyGoalInput');
        this.elements.glassSizeInput = document.getElementById('glassSizeInput');
        this.elements.reminderIntervalInput = document.getElementById('reminderIntervalInput');
        this.elements.notificationsEnabled = document.getElementById('notificationsEnabled');
        this.elements.soundEnabled = document.getElementById('soundEnabled');
        this.elements.vibrationEnabled = document.getElementById('vibrationEnabled');
        this.elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.elements.exportAllDataBtn = document.getElementById('exportAllDataBtn');
        this.elements.importDataBtn = document.getElementById('importDataBtn');
        this.elements.importFileInput = document.getElementById('importFileInput');
        this.elements.resetAllDataBtn = document.getElementById('resetAllDataBtn');
        this.elements.exportDataBtn = document.getElementById('exportDataBtn');
        this.elements.shareBtn = document.getElementById('shareBtn');
        this.elements.clearHistoryBtn = document.getElementById('clearHistoryBtn');
    }

    setupEventListeners() {
        // Dark mode toggle
        this.elements.darkModeToggle?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Profile button
        const profileBtn = document.getElementById('profileBtn');
        profileBtn?.addEventListener('click', () => {
            this.switchView('settings');
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.view === 'settings');
            });
        });

        // Add water button
        this.elements.addWaterBtn?.addEventListener('click', () => {
            this.addWater(this.settings.glassSize);
        });

        // Quick add 500ml
        this.elements.quickAdd500?.addEventListener('click', () => {
            this.addWater(500);
        });

        // Custom amount - open modal
        this.elements.customAmountBtn?.addEventListener('click', () => {
            this.openCustomModal();
        });

        // Modal controls
        this.elements.closeModalBtn?.addEventListener('click', () => {
            this.closeCustomModal();
        });

        this.elements.cancelCustomBtn?.addEventListener('click', () => {
            this.closeCustomModal();
        });

        this.elements.confirmCustomBtn?.addEventListener('click', () => {
            const amount = parseInt(this.elements.customAmount.value);
            if (amount && amount >= 50 && amount <= 2000) {
                this.addWater(amount);
                this.closeCustomModal();
            } else {
                this.showToast('❌ Cantidad inválida (50-2000ml)');
            }
        });

        // Quick amount buttons in modal
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                this.elements.customAmount.value = amount;
            });
        });

        // Calendar navigation
        this.elements.prevMonth?.addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
            this.renderCalendar();
        });

        this.elements.nextMonth?.addEventListener('click', () => {
            this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
            this.renderCalendar();
        });

        // Settings - Number buttons with delegation
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.number-btn');
            if (!btn) return;

            const action = btn.dataset.action;
            const target = btn.dataset.target;

            if (action === 'increment') {
                this.incrementSetting(target);
            } else if (action === 'decrement') {
                this.decrementSetting(target);
            }
        });

        // Save settings
        this.elements.saveSettingsBtn?.addEventListener('click', () => {
            this.saveSettings();
        });

        // Export/Import/Reset
        this.elements.exportAllDataBtn?.addEventListener('click', () => {
            this.exportData('json');
        });

        this.elements.exportDataBtn?.addEventListener('click', () => {
            this.exportData('csv');
        });

        this.elements.importDataBtn?.addEventListener('click', () => {
            this.elements.importFileInput?.click();
        });

        this.elements.importFileInput?.addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        this.elements.resetAllDataBtn?.addEventListener('click', () => {
            if (confirm('⚠️ ¿Estás seguro? Esto borrará TODOS tus datos de forma permanente.')) {
                this.resetAllData();
            }
        });

        // Share button
        this.elements.shareBtn?.addEventListener('click', () => {
            this.shareProgress();
        });

        // Clear history
        this.elements.clearHistoryBtn?.addEventListener('click', () => {
            if (confirm('¿Limpiar historial completo?')) {
                this.allTimeHistory = [];
                this.saveToStorage();
                this.renderCalendar();
                this.updateMonthlyStats();
                this.showToast('Historial limpiado');
            }
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);

                // Update stats when switching to stats view
                if (view === 'stats') {
                    this.updateMonthlyStats();
                    this.renderAchievements();
                }

                // Update calendar when switching to history
                if (view === 'history') {
                    this.renderCalendar();
                    this.updateTimeline();
                }
            });
        });
    }

    // ============================================
    // MODAL
    // ============================================

    openCustomModal() {
        if (this.elements.customModal) {
            this.elements.customModal.classList.add('active');
            this.elements.customAmount.value = this.settings.glassSize;
            this.elements.customAmount.focus();
        }
    }

    closeCustomModal() {
        if (this.elements.customModal) {
            this.elements.customModal.classList.remove('active');
            this.elements.customAmount.value = '';
        }
    }

    // ============================================
    // ONBOARDING
    // ============================================

    showOnboarding() {
        if (!this.elements.onboardingOverlay) return;

        this.elements.onboardingOverlay.classList.add('active');
        this.showOnboardingStep(1);
        this.setupOnboardingListeners();
    }

    hideOnboarding() {
        if (this.elements.onboardingOverlay) {
            this.elements.onboardingOverlay.classList.remove('active');
        }
    }

    setupOnboardingListeners() {
        // Back button
        this.elements.onboardingBack?.addEventListener('click', () => {
            if (this.currentOnboardingStep > 1) {
                this.currentOnboardingStep--;
                this.showOnboardingStep(this.currentOnboardingStep);
            }
        });

        // Next button
        this.elements.onboardingNext?.addEventListener('click', () => {
            if (this.currentOnboardingStep < 4) {
                this.currentOnboardingStep++;
                this.showOnboardingStep(this.currentOnboardingStep);
            } else {
                this.completeOnboarding();
            }
        });

        // Goal buttons
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.dailyGoal = parseInt(btn.dataset.goal);
            });
        });

        // Name input
        const nameInput = document.getElementById('onboardingName');
        nameInput?.addEventListener('input', (e) => {
            this.settings.userName = e.target.value || 'Usuario';
        });

        // Weight input
        const weightInput = document.getElementById('onboardingWeight');
        weightInput?.addEventListener('input', (e) => {
            this.settings.weight = parseInt(e.target.value) || 70;
        });

        // Activity selector
        const activitySelect = document.getElementById('onboardingActivity');
        activitySelect?.addEventListener('change', (e) => {
            this.settings.activity = e.target.value;
        });

        // Enable notifications button
        this.elements.enableNotificationsBtn?.addEventListener('click', async () => {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.settings.notificationsEnabled = true;
                    this.showToast('Notificaciones activadas ✅');
                }
            }
        });
    }

    showOnboardingStep(step) {
        this.currentOnboardingStep = step;

        // Update steps visibility
        this.elements.onboardingSteps?.forEach((stepEl, index) => {
            stepEl.classList.toggle('active', index + 1 === step);
        });

        // Update dots
        this.elements.onboardingDots?.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === step);
        });

        // Update buttons
        if (this.elements.onboardingBack) {
            this.elements.onboardingBack.style.visibility = step === 1 ? 'hidden' : 'visible';
        }

        if (this.elements.onboardingNext) {
            this.elements.onboardingNext.textContent = step === 4 ? 'Comenzar' : 'Siguiente';
        }
    }

    completeOnboarding() {
        this.hasCompletedOnboarding = true;
        this.saveToStorage();
        this.hideOnboarding();
        this.setupEventListeners();
        this.updateAllUI();
        this.startDailyCheck();
        this.generateDailyChallenge();
        this.startReminders();
        this.renderCalendar();
        this.renderAchievements();
        this.showToast('¡Bienvenido a Hidratador Ultra Pro! 🎉');
    }

    // ============================================
    // WATER MANAGEMENT
    // ============================================

    addWater(ml) {
        // Validate
        if (ml < 50 || ml > 2000) {
            this.showToast('❌ Cantidad inválida');
            return;
        }

        const glasses = ml / this.settings.glassSize;
        this.waterCount += glasses;

        // Add to today's history
        const entry = {
            time: new Date().toISOString(),
            amount: ml,
            id: Date.now()
        };
        this.history.unshift(entry);

        // Add to all-time history
        this.allTimeHistory.push({
            date: new Date().toDateString(),
            amount: ml,
            time: new Date().toISOString()
        });

        // Update stats
        this.lastDrinkDate = new Date().toDateString();
        this.totalLifetimeWater += ml;

        // Add XP
        this.addXP(10);

        // Check achievements
        this.checkGoalCompletion();
        this.checkAchievements();
        this.checkDailyChallenge();

        // Save and update
        this.saveToStorage();
        this.updateAllUI();

        // Show feedback
        this.showToast(`+${ml}ml agregados 💧`);
        this.playSound();
        this.vibrate();
    }

    deleteHistoryItem(id) {
        const index = this.history.findIndex(item => item.id === id);
        if (index !== -1) {
            if (confirm('¿Eliminar este registro?')) {
                const item = this.history[index];
                const glasses = item.amount / this.settings.glassSize;
                this.waterCount -= glasses;
                this.totalLifetimeWater -= item.amount;
                this.history.splice(index, 1);

                this.saveToStorage();
                this.updateAllUI();
                this.showToast('Registro eliminado');
            }
        }
    }

    checkGoalCompletion() {
        const percentage = (this.waterCount / this.settings.dailyGoal) * 100;

        if (percentage >= 100 && percentage < 105) {
            this.showToast('🎉 ¡Meta completada!');
            this.addXP(100);
            this.updateStreak();
            this.playSound();
        } else if (Math.round(percentage) === 50) {
            this.showToast('💪 ¡50% completado!');
            this.addXP(25);
        } else if (Math.round(percentage) === 25) {
            this.showToast('⭐ ¡25% completado!');
            this.addXP(10);
        }
    }

    checkDailyChallenge() {
        if (this.challengeCompleted) return;

        // Check if challenge is completed
        const percentage = (this.waterCount / this.settings.dailyGoal) * 100;

        if (percentage >= 100) {
            this.challengeCompleted = true;
            this.addXP(50);
            this.showToast('🏆 ¡Desafío diario completado! +50 XP');
            this.saveToStorage();
        }
    }

    // ============================================
    // GAMIFICATION
    // ============================================

    defineAchievements() {
        this.achievements = [
            { id: 'first_glass', name: 'Primera Gota', desc: 'Bebe tu primer vaso', icon: '💧', condition: () => this.totalLifetimeWater >= 250 },
            { id: 'first_day', name: 'Primer Día', desc: 'Completa tu primera meta', icon: '🎯', condition: () => this.waterCount >= this.settings.dailyGoal },
            { id: 'streak_3', name: 'Constante', desc: 'Racha de 3 días', icon: '🔥', condition: () => this.streak >= 3 },
            { id: 'streak_7', name: 'Semana Perfecta', desc: 'Racha de 7 días', icon: '⭐', condition: () => this.streak >= 7 },
            { id: 'streak_30', name: 'Mes Legendario', desc: 'Racha de 30 días', icon: '👑', condition: () => this.streak >= 30 },
            { id: 'level_5', name: 'Novato', desc: 'Alcanza nivel 5', icon: '🌱', condition: () => this.level >= 5 },
            { id: 'level_10', name: 'Experto', desc: 'Alcanza nivel 10', icon: '💪', condition: () => this.level >= 10 },
            { id: 'level_25', name: 'Maestro', desc: 'Alcanza nivel 25', icon: '🏆', condition: () => this.level >= 25 },
            { id: 'total_10L', name: 'Hidratado', desc: 'Bebe 10L totales', icon: '🌊', condition: () => this.totalLifetimeWater >= 10000 },
            { id: 'total_100L', name: 'Océano', desc: 'Bebe 100L totales', icon: '🌊', condition: () => this.totalLifetimeWater >= 100000 },
            { id: 'early_bird', name: 'Madrugador', desc: 'Bebe antes de las 8 AM', icon: '🌅', condition: () => {
                const hour = new Date().getHours();
                return hour < 8 && this.waterCount > 0;
            }},
            { id: 'night_owl', name: 'Noctámbulo', desc: 'Bebe después de las 10 PM', icon: '🌙', condition: () => {
                const hour = new Date().getHours();
                return hour >= 22 && this.waterCount > 0;
            }}
        ];
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.unlockedAchievements.includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.unlockedAchievements.push(achievement.id);
        this.addXP(50);
        this.showToast(`🏆 Logro desbloqueado: ${achievement.name}!`);
        this.playSound();
        this.saveToStorage();
        this.renderAchievements();
    }

    renderAchievements() {
        if (!this.elements.achievementGrid) return;

        const html = this.achievements.map(achievement => {
            const unlocked = this.unlockedAchievements.includes(achievement.id);
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" title="${achievement.desc}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                </div>
            `;
        }).join('');

        this.elements.achievementGrid.innerHTML = html;
    }

    addXP(amount) {
        this.xp += amount;
        const xpNeeded = this.level * 100;

        if (this.xp >= xpNeeded) {
            this.levelUp();
        }

        this.updateLevelUI();
        this.saveToStorage();
    }

    levelUp() {
        this.level++;
        this.xp = 0;
        this.showToast(`🎉 ¡Subiste al Nivel ${this.level}!`);
        this.playSound();
        this.checkAchievements();
        this.saveToStorage();
    }

    updateLevelUI() {
        const xpNeeded = this.level * 100;
        const xpProgress = (this.xp / xpNeeded) * 100;

        if (this.elements.userLevel) {
            this.elements.userLevel.textContent = `Nivel ${this.level}`;
        }

        if (this.elements.xpFill) {
            this.elements.xpFill.style.width = `${xpProgress}%`;
        }

        if (this.elements.currentXP) {
            this.elements.currentXP.textContent = this.xp;
        }

        if (this.elements.requiredXP) {
            this.elements.requiredXP.textContent = xpNeeded;
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (this.lastDrinkDate === yesterday) {
            this.streak++;
        } else if (this.lastDrinkDate !== today) {
            this.streak = 1;
        }

        if (this.streak > this.bestStreak) {
            this.bestStreak = this.streak;
        }

        this.checkAchievements();
        this.saveToStorage();
    }

    // ============================================
    // DAILY CHALLENGE
    // ============================================

    generateDailyChallenge() {
        const challenges = [
            'Completa tu meta antes de las 8 PM',
            'Bebe 4 vasos antes del mediodía',
            'Alcanza tu meta sin saltarte ningún horario',
            'Bebe agua cada 2 horas hoy',
            'Completa tu meta diaria',
            'Bebe un vaso al despertar'
        ];

        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('challenge_date');

        if (savedDate !== today) {
            const randomIndex = Math.floor(Math.random() * challenges.length);
            this.dailyChallenge = challenges[randomIndex];
            this.challengeCompleted = false;
            localStorage.setItem('challenge_date', today);
            localStorage.setItem('challenge_text', this.dailyChallenge);
        } else {
            this.dailyChallenge = localStorage.getItem('challenge_text') || challenges[0];
        }

        if (this.elements.dailyChallengeText) {
            this.elements.dailyChallengeText.textContent = this.dailyChallenge;
        }
    }

    // ============================================
    // BUSINESS FEATURES - Premium
    // ============================================

    checkDailyCheckIn() {
        const today = new Date().toDateString();

        if (this.lastCheckIn !== today) {
            // First check-in of the day
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (this.lastCheckIn === yesterday) {
                // Consecutive day
                this.checkInStreak++;
            } else if (this.lastCheckIn !== null) {
                // Missed a day - check if can use freeze
                if (this.streakFreezes > 0) {
                    this.showToast('🧊 ¡Racha congelada! Streak salvado');
                    this.streakFreezes--;
                } else {
                    this.checkInStreak = 1;
                    this.showToast('Racha reiniciada - ¡Empieza de nuevo!');
                }
            } else {
                this.checkInStreak = 1;
            }

            this.lastCheckIn = today;

            // Give daily check-in bonus
            const bonusXP = 20 + (this.checkInStreak * 5);
            this.addXP(bonusXP);
            this.showToast(`✅ Check-in diario! +${bonusXP} XP 🎁`);

            // Extra reward for milestones
            if (this.checkInStreak === 7) {
                this.showToast('🎉 ¡7 días seguidos! +100 XP bonus!');
                this.addXP(100);
            } else if (this.checkInStreak === 30) {
                this.showToast('👑 ¡30 días seguidos! +500 XP bonus!');
                this.addXP(500);
            } else if (this.checkInStreak === 100) {
                this.showToast('🏆 ¡100 días seguidos! +1000 XP bonus!');
                this.addXP(1000);
            }

            this.saveToStorage();
        }
    }

    generateDailyTip() {
        const tips = [
            {
                title: '💡 Hidratación matutina',
                text: 'Bebe agua al despertar. Tu cuerpo perdió líquidos durante la noche.'
            },
            {
                title: '🏃 Antes del ejercicio',
                text: 'Hidrátate 30 minutos antes de hacer ejercicio para mejor rendimiento.'
            },
            {
                title: '🍽️ Con las comidas',
                text: 'Beber agua con las comidas ayuda a la digestión.'
            },
            {
                title: '🧠 Concentración',
                text: 'La deshidratación reduce la concentración hasta un 20%.'
            },
            {
                title: '☀️ Clima cálido',
                text: 'En días calurosos, aumenta tu consumo de agua un 50%.'
            },
            {
                title: '💪 Después del ejercicio',
                text: 'Repone el 150% del líquido perdido después de entrenar.'
            },
            {
                title: '😴 Mejor sueño',
                text: 'Beber agua durante el día mejora la calidad del sueño.'
            },
            {
                title: '🎯 Temperatura ideal',
                text: 'El agua a temperatura ambiente se absorbe más rápido.'
            },
            {
                title: '🌡️ Señales de sed',
                text: 'La sed es una señal tardía. Hidratate antes de sentirla.'
            },
            {
                title: '⚡ Energía natural',
                text: 'La fatiga suele ser síntoma de deshidratación.'
            },
            {
                title: '🥗 Frutas y verduras',
                text: 'Consume alimentos ricos en agua como sandía y pepino.'
            },
            {
                title: '📱 Recordatorios',
                text: 'Configura alarmas cada 2 horas para beber agua.'
            }
        ];

        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('tip_date');

        if (savedDate !== today) {
            const randomIndex = Math.floor(Math.random() * tips.length);
            this.dailyTip = tips[randomIndex];
            localStorage.setItem('tip_date', today);
            localStorage.setItem('tip_data', JSON.stringify(this.dailyTip));
        } else {
            const saved = localStorage.getItem('tip_data');
            this.dailyTip = saved ? JSON.parse(saved) : tips[0];
        }

        // Show tip in UI if element exists
        const tipElement = document.getElementById('dailyTip');
        if (tipElement) {
            tipElement.innerHTML = `
                <strong>${this.dailyTip.title}</strong><br>
                <span>${this.dailyTip.text}</span>
            `;
        }
    }

    calculatePersonalizedGoal() {
        // Fórmula científica basada en peso y actividad
        const baseHydration = this.settings.weight * 35; // ml por kg de peso

        // Ajuste por nivel de actividad
        const activityMultiplier = {
            'sedentary': 1.0,
            'light': 1.2,
            'moderate': 1.4,
            'active': 1.6,
            'very_active': 1.8
        };

        const multiplier = activityMultiplier[this.settings.activity] || 1.2;
        const totalMl = Math.round(baseHydration * multiplier);

        // Convert to glasses
        this.personalizedGoal = Math.ceil(totalMl / this.settings.glassSize);

        // Show recommendation
        const recommendationEl = document.getElementById('personalizedRecommendation');
        if (recommendationEl) {
            recommendationEl.innerHTML = `
                <div class="personalized-goal-card">
                    <div class="goal-icon">🎯</div>
                    <div class="goal-content">
                        <h4>Tu meta personalizada</h4>
                        <p class="goal-amount">${this.personalizedGoal} vasos (${(totalMl/1000).toFixed(1)}L)</p>
                        <p class="goal-desc">Basado en tu peso (${this.settings.weight}kg) y actividad</p>
                    </div>
                </div>
            `;
        }

        return this.personalizedGoal;
    }

    getSmartReminder() {
        const hour = new Date().getHours();

        let message = '💧 ¡Es hora de hidratarte!';

        if (hour >= 6 && hour < 9) {
            message = '🌅 Buenos días! Empieza tu día con agua';
        } else if (hour >= 9 && hour < 12) {
            message = '☕ Media mañana - ¡Un vaso de agua!';
        } else if (hour >= 12 && hour < 15) {
            message = '🍽️ Hora de almuerzo - ¡No olvides el agua!';
        } else if (hour >= 15 && hour < 18) {
            message = '⚡ Tarde activa - ¡Hidrátate ahora!';
        } else if (hour >= 18 && hour < 21) {
            message = '🌆 Atardecer - Bebe agua antes de la cena';
        } else if (hour >= 21 && hour < 23) {
            message = '🌙 Antes de dormir - Último vaso del día';
        }

        return message;
    }

    // ============================================
    // CALENDAR
    // ============================================

    renderCalendar() {
        if (!this.elements.calendarGrid || !this.elements.calendarMonth) return;

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();

        // Update month title
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.elements.calendarMonth.textContent = `${monthNames[month]} ${year}`;

        // Get first day and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Calculate water data for each day
        const monthData = {};
        this.allTimeHistory.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (entryDate.getMonth() === month && entryDate.getFullYear() === year) {
                const day = entryDate.getDate();
                monthData[day] = (monthData[day] || 0) + entry.amount;
            }
        });

        // Build calendar HTML
        let html = '';

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const totalMl = monthData[day] || 0;
            const goalMl = this.settings.dailyGoal * this.settings.glassSize;
            const percentage = Math.min((totalMl / goalMl) * 100, 100);

            let className = 'calendar-day';
            if (percentage >= 100) className += ' complete';
            else if (percentage >= 50) className += ' partial';
            else if (percentage > 0) className += ' minimal';

            const isToday = day === new Date().getDate() &&
                           month === new Date().getMonth() &&
                           year === new Date().getFullYear();
            if (isToday) className += ' today';

            html += `
                <div class="${className}" title="${totalMl}ml (${Math.round(percentage)}%)">
                    <div class="day-number">${day}</div>
                    <div class="day-progress" style="height: ${percentage}%"></div>
                </div>
            `;
        }

        this.elements.calendarGrid.innerHTML = html;
    }

    // ============================================
    // TIMELINE
    // ============================================

    updateTimeline() {
        if (!this.elements.timeline) return;

        if (this.history.length === 0) {
            this.elements.timeline.innerHTML = '<p class="empty-message">No hay registros para hoy</p>';
            return;
        }

        const html = this.history.map(entry => {
            const time = new Date(entry.time);
            const timeStr = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            return `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-time">${timeStr}</div>
                        <div class="timeline-amount">${entry.amount}ml</div>
                    </div>
                    <button class="timeline-delete" onclick="app.deleteHistoryItem(${entry.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        this.elements.timeline.innerHTML = html;
    }

    // ============================================
    // STATS
    // ============================================

    updateMonthlyStats() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter this month's data
        const monthHistory = this.allTimeHistory.filter(entry => {
            const date = new Date(entry.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        // Calculate stats
        const daysWithData = new Set(monthHistory.map(e => e.date)).size;
        const totalLiters = monthHistory.reduce((sum, e) => sum + e.amount, 0) / 1000;
        const avgDaily = daysWithData > 0 ? totalLiters / daysWithData : 0;

        // Update UI
        const monthDaysEl = document.getElementById('monthDays');
        const monthLitersEl = document.getElementById('monthLiters');
        const monthBestEl = document.getElementById('monthBest');
        const monthAvgEl = document.getElementById('monthAvg');

        if (monthDaysEl) monthDaysEl.textContent = daysWithData;
        if (monthLitersEl) monthLitersEl.textContent = totalLiters.toFixed(1);
        if (monthBestEl) monthBestEl.textContent = this.bestStreak;
        if (monthAvgEl) monthAvgEl.textContent = avgDaily.toFixed(1);
    }

    // ============================================
    // UI UPDATES
    // ============================================

    updateAllUI() {
        this.updateWaterDisplay();
        this.updateProgress();
        this.updateTimeline();
        this.updateLevelUI();
        this.updateAchievementBadge();
        this.updateQuickStats();
    }

    updateAchievementBadge() {
        const achievementText = document.getElementById('achievementText');
        if (!achievementText) return;

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

        achievementText.textContent = text;
    }

    updateQuickStats() {
        // Liters
        const litersValue = document.getElementById('litersValue');
        if (litersValue) {
            const liters = (this.waterCount * this.settings.glassSize) / 1000;
            litersValue.textContent = liters.toFixed(1) + ' L';
        }

        // Remaining
        const remainingValue = document.getElementById('remainingValue');
        if (remainingValue) {
            const remaining = Math.max(0, this.settings.dailyGoal - this.waterCount);
            remainingValue.textContent = Math.ceil(remaining);
        }

        // Streak
        const streakValue = document.getElementById('streakValue');
        if (streakValue) {
            streakValue.textContent = this.streak;
        }
    }

    updateWaterDisplay() {
        if (this.elements.mainStatValue) {
            this.elements.mainStatValue.textContent = this.waterCount.toFixed(1);
        }

        if (this.elements.goalValue) {
            this.elements.goalValue.textContent = this.settings.dailyGoal;
        }
    }

    updateProgress() {
        const percentage = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);

        if (this.elements.progressRing) {
            const circumference = 534; // 2 * π * radius (85)
            const offset = circumference - (percentage / 100) * circumference;
            this.elements.progressRing.style.strokeDashoffset = offset;
        }

        if (this.elements.percentageValue) {
            this.elements.percentageValue.textContent = `${Math.round(percentage)}%`;
        }
    }

    // ============================================
    // SETTINGS
    // ============================================

    incrementSetting(target) {
        const limits = {
            dailyGoal: { min: 1, max: 20, step: 1 },
            glassSize: { min: 100, max: 1000, step: 50 },
            reminderInterval: { min: 15, max: 240, step: 15 }
        };

        const limit = limits[target];
        if (!limit) return;

        const input = document.getElementById(`${target}Input`);
        if (!input) return;

        let value = parseInt(input.value) || limit.min;
        value = Math.min(value + limit.step, limit.max);
        input.value = value;
    }

    decrementSetting(target) {
        const limits = {
            dailyGoal: { min: 1, max: 20, step: 1 },
            glassSize: { min: 100, max: 1000, step: 50 },
            reminderInterval: { min: 15, max: 240, step: 15 }
        };

        const limit = limits[target];
        if (!limit) return;

        const input = document.getElementById(`${target}Input`);
        if (!input) return;

        let value = parseInt(input.value) || limit.min;
        value = Math.max(value - limit.step, limit.min);
        input.value = value;
    }

    saveSettings() {
        // Profile
        if (this.elements.profileName) {
            this.settings.userName = this.elements.profileName.value || 'Usuario';
        }

        if (this.elements.userWeight) {
            const weight = parseInt(this.elements.userWeight.value);
            if (weight >= 30 && weight <= 200) {
                this.settings.weight = weight;
            }
        }

        if (this.elements.activityLevel) {
            this.settings.activity = this.elements.activityLevel.value;
        }

        // Goals
        if (this.elements.dailyGoalInput) {
            const goal = parseInt(this.elements.dailyGoalInput.value);
            if (goal >= 1 && goal <= 20) {
                this.settings.dailyGoal = goal;
            }
        }

        if (this.elements.glassSizeInput) {
            const size = parseInt(this.elements.glassSizeInput.value);
            if (size >= 100 && size <= 1000) {
                this.settings.glassSize = size;
            }
        }

        // Notifications
        if (this.elements.notificationsEnabled) {
            this.settings.notificationsEnabled = this.elements.notificationsEnabled.checked;
        }

        if (this.elements.reminderIntervalInput) {
            const interval = parseInt(this.elements.reminderIntervalInput.value);
            if (interval >= 15 && interval <= 240) {
                this.settings.reminderInterval = interval;
            }
        }

        if (this.elements.soundEnabled) {
            this.settings.soundEnabled = this.elements.soundEnabled.checked;
        }

        if (this.elements.vibrationEnabled) {
            this.settings.vibrationEnabled = this.elements.vibrationEnabled.checked;
        }

        // Save and update
        this.saveToStorage();
        this.updateAllUI();
        this.showToast('⚙️ Configuración guardada');

        // Restart reminders with new interval
        this.startReminders();
    }

    loadSettingsToUI() {
        if (this.elements.profileName) {
            this.elements.profileName.value = this.settings.userName;
        }

        if (this.elements.userWeight) {
            this.elements.userWeight.value = this.settings.weight;
        }

        if (this.elements.activityLevel) {
            this.elements.activityLevel.value = this.settings.activity;
        }

        if (this.elements.dailyGoalInput) {
            this.elements.dailyGoalInput.value = this.settings.dailyGoal;
        }

        if (this.elements.glassSizeInput) {
            this.elements.glassSizeInput.value = this.settings.glassSize;
        }

        if (this.elements.reminderIntervalInput) {
            this.elements.reminderIntervalInput.value = this.settings.reminderInterval;
        }

        if (this.elements.notificationsEnabled) {
            this.elements.notificationsEnabled.checked = this.settings.notificationsEnabled;
        }

        if (this.elements.soundEnabled) {
            this.elements.soundEnabled.checked = this.settings.soundEnabled;
        }

        if (this.elements.vibrationEnabled) {
            this.elements.vibrationEnabled.checked = this.settings.vibrationEnabled;
        }
    }

    // ============================================
    // EXPORT/IMPORT
    // ============================================

    exportData(format = 'json') {
        const data = {
            settings: this.settings,
            waterCount: this.waterCount,
            history: this.history,
            allTimeHistory: this.allTimeHistory,
            streak: this.streak,
            bestStreak: this.bestStreak,
            level: this.level,
            xp: this.xp,
            totalLifetimeWater: this.totalLifetimeWater,
            unlockedAchievements: this.unlockedAchievements,
            exportDate: new Date().toISOString()
        };

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hidratador-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📥 Datos exportados (JSON)');
        } else if (format === 'csv') {
            let csv = 'Fecha,Hora,Cantidad (ml)\n';
            this.allTimeHistory.forEach(entry => {
                const date = new Date(entry.time);
                csv += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${entry.amount}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hidratador-historial-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📥 Historial exportado (CSV)');
        }
    }

    importData(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (confirm('⚠️ ¿Importar datos? Esto sobrescribirá tus datos actuales.')) {
                    // Validate and import
                    if (data.settings) this.settings = { ...this.settings, ...data.settings };
                    if (data.waterCount !== undefined) this.waterCount = data.waterCount;
                    if (data.history) this.history = data.history;
                    if (data.allTimeHistory) this.allTimeHistory = data.allTimeHistory;
                    if (data.streak !== undefined) this.streak = data.streak;
                    if (data.bestStreak !== undefined) this.bestStreak = data.bestStreak;
                    if (data.level !== undefined) this.level = data.level;
                    if (data.xp !== undefined) this.xp = data.xp;
                    if (data.totalLifetimeWater !== undefined) this.totalLifetimeWater = data.totalLifetimeWater;
                    if (data.unlockedAchievements) this.unlockedAchievements = data.unlockedAchievements;

                    this.saveToStorage();
                    this.updateAllUI();
                    this.renderCalendar();
                    this.renderAchievements();
                    this.loadSettingsToUI();
                    this.showToast('✅ Datos importados correctamente');
                }
            } catch (error) {
                this.showToast('❌ Error: Archivo inválido');
            }
        };
        reader.readAsText(file);
    }

    resetAllData() {
        // Clear all data
        this.waterCount = 0;
        this.history = [];
        this.allTimeHistory = [];
        this.streak = 0;
        this.bestStreak = 0;
        this.level = 1;
        this.xp = 0;
        this.totalLifetimeWater = 0;
        this.unlockedAchievements = [];

        // Reset settings to defaults
        this.settings = {
            dailyGoal: 8,
            glassSize: 250,
            reminderInterval: 60,
            notificationsEnabled: false,
            soundEnabled: true,
            vibrationEnabled: true,
            darkMode: false,
            userName: 'Usuario',
            weight: 70,
            activity: 'light'
        };

        // Clear localStorage
        localStorage.clear();

        // Update UI
        this.updateAllUI();
        this.renderCalendar();
        this.renderAchievements();
        this.loadSettingsToUI();

        this.showToast('🗑️ Todos los datos han sido borrados');
    }

    // ============================================
    // SHARE
    // ============================================

    async shareProgress() {
        const percentage = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);
        const liters = ((this.waterCount * this.settings.glassSize) / 1000).toFixed(1);

        const text = `💧 Hidratador Pro
📊 Progreso hoy: ${Math.round(percentage)}%
🌊 Consumido: ${liters}L
🔥 Racha: ${this.streak} días
⭐ Nivel: ${this.level}

¡Mantente hidratado! 🚀`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Progreso - Hidratador Pro',
                    text: text
                });
                this.showToast('📤 Compartido exitosamente');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.copyToClipboard(text);
                }
            }
        } else {
            this.copyToClipboard(text);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            this.showToast('📋 Copiado al portapapeles');
        } else {
            this.showToast('❌ No se pudo compartir');
        }
    }

    // ============================================
    // NOTIFICATIONS & REMINDERS
    // ============================================

    startReminders() {
        // Clear existing timer
        if (this.reminderTimerId) {
            clearInterval(this.reminderTimerId);
        }

        if (!this.settings.notificationsEnabled) return;

        // Start new timer
        const intervalMs = this.settings.reminderInterval * 60 * 1000;
        this.reminderTimerId = setInterval(() => {
            this.sendReminder();
        }, intervalMs);
    }

    sendReminder() {
        if (!this.settings.notificationsEnabled) return;
        if (Notification.permission !== 'granted') return;

        const percentage = (this.waterCount / this.settings.dailyGoal) * 100;

        if (percentage >= 100) return; // No reminder if goal completed

        // Use smart context-aware reminder
        const message = this.getSmartReminder();

        new Notification('Hidratador Ultra Pro', {
            body: message,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: this.settings.vibrationEnabled ? [200, 100, 200] : undefined,
            tag: 'hydration-reminder',
            requireInteraction: false
        });
    }

    // ============================================
    // VIEWS
    // ============================================

    switchView(viewName) {
        this.currentView = viewName;

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        // Load settings to UI when switching to settings
        if (viewName === 'settings') {
            this.loadSettingsToUI();
        }
    }

    // ============================================
    // DARK MODE
    // ============================================

    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        this.applyDarkMode();
        this.saveToStorage();
    }

    applyDarkMode() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            const sunIcon = this.elements.darkModeToggle?.querySelector('.sun-icon');
            const moonIcon = this.elements.darkModeToggle?.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            document.body.classList.remove('dark-mode');
            const sunIcon = this.elements.darkModeToggle?.querySelector('.sun-icon');
            const moonIcon = this.elements.darkModeToggle?.querySelector('.moon-icon');
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    }

    // ============================================
    // STORAGE
    // ============================================

    loadFromStorage() {
        try {
            // Onboarding status
            const onboarding = localStorage.getItem('onboarding_complete');
            this.hasCompletedOnboarding = onboarding === 'true';

            // Settings
            const settings = localStorage.getItem('settings');
            if (settings) {
                this.settings = { ...this.settings, ...JSON.parse(settings) };
            }

            // Daily data
            const data = localStorage.getItem('daily_data');
            if (data) {
                const parsed = JSON.parse(data);
                const today = new Date().toDateString();

                if (parsed.date === today) {
                    this.waterCount = parsed.waterCount || 0;
                    this.history = parsed.history || [];
                } else {
                    this.waterCount = 0;
                    this.history = [];
                }
            }

            // All-time history
            const allHistory = localStorage.getItem('all_time_history');
            if (allHistory) {
                this.allTimeHistory = JSON.parse(allHistory);
            }

            // Game data
            const gameData = localStorage.getItem('game_data');
            if (gameData) {
                const parsed = JSON.parse(gameData);
                this.level = parsed.level || 1;
                this.xp = parsed.xp || 0;
                this.streak = parsed.streak || 0;
                this.bestStreak = parsed.bestStreak || 0;
                this.totalLifetimeWater = parsed.totalLifetimeWater || 0;
                this.unlockedAchievements = parsed.unlockedAchievements || [];
            }

            // Challenge
            const challengeComplete = localStorage.getItem('challenge_complete');
            this.challengeCompleted = challengeComplete === 'true';

            // BUSINESS FEATURES - Premium
            const businessData = localStorage.getItem('business_data');
            if (businessData) {
                const parsed = JSON.parse(businessData);
                this.lastCheckIn = parsed.lastCheckIn || null;
                this.checkInStreak = parsed.checkInStreak || 0;
                this.streakFreezes = parsed.streakFreezes !== undefined ? parsed.streakFreezes : 3;
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('onboarding_complete', this.hasCompletedOnboarding.toString());
            localStorage.setItem('settings', JSON.stringify(this.settings));

            const dailyData = {
                date: new Date().toDateString(),
                waterCount: this.waterCount,
                history: this.history
            };
            localStorage.setItem('daily_data', JSON.stringify(dailyData));

            localStorage.setItem('all_time_history', JSON.stringify(this.allTimeHistory));

            const gameData = {
                level: this.level,
                xp: this.xp,
                streak: this.streak,
                bestStreak: this.bestStreak,
                totalLifetimeWater: this.totalLifetimeWater,
                unlockedAchievements: this.unlockedAchievements
            };
            localStorage.setItem('game_data', JSON.stringify(gameData));

            localStorage.setItem('challenge_complete', this.challengeCompleted.toString());

            // BUSINESS FEATURES - Premium
            const businessData = {
                lastCheckIn: this.lastCheckIn,
                checkInStreak: this.checkInStreak,
                streakFreezes: this.streakFreezes
            };
            localStorage.setItem('business_data', JSON.stringify(businessData));
        } catch (error) {
            console.error('Error saving to storage:', error);
            if (error.name === 'QuotaExceededError') {
                this.showToast('⚠️ Almacenamiento lleno');
            }
        }
    }

    // ============================================
    // UTILITIES
    // ============================================

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    playSound() {
        if (!this.settings.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silently fail
        }
    }

    vibrate() {
        if (!this.settings.vibrationEnabled) return;
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    startDailyCheck() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow - now;

        setTimeout(() => {
            this.waterCount = 0;
            this.history = [];
            this.challengeCompleted = false;
            this.generateDailyChallenge();
            this.saveToStorage();
            this.updateAllUI();
            this.showToast('🌅 ¡Nuevo día! Contador reiniciado');
            this.startDailyCheck();
        }, msUntilMidnight);
    }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new HidratadorApp();
    window.app = app;
});

// ============================================
// DYNAMIC STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(6, 182, 212, 0.95));
        color: white;
        padding: 16px 32px;
        border-radius: 16px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
        backdrop-filter: blur(10px);
    }

    .toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .empty-message {
        text-align: center;
        padding: 60px 20px;
        color: var(--gray-400);
        font-size: 0.9375rem;
        font-weight: 500;
    }

    /* Timeline Styles */
    .timeline-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background: white;
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
        position: relative;
    }

    .timeline-item:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .timeline-dot {
        width: 12px;
        height: 12px;
        background: var(--primary-500);
        border-radius: 50%;
        flex-shrink: 0;
    }

    .timeline-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .timeline-time {
        font-size: 0.875rem;
        color: var(--gray-600);
        font-weight: 500;
    }

    .timeline-amount {
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-600);
    }

    .timeline-delete {
        width: 32px;
        height: 32px;
        border: none;
        background: var(--gray-100);
        border-radius: var(--radius-md);
        color: var(--gray-600);
        cursor: pointer;
        transition: all var(--transition-base);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .timeline-delete:hover {
        background: #fee;
        color: #dc2626;
    }

    .timeline-delete svg {
        width: 16px;
        height: 16px;
    }

    /* Calendar Day Styles */
    .calendar-day {
        aspect-ratio: 1;
        border-radius: var(--radius-md);
        border: 1px solid var(--gray-200);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all var(--transition-base);
        overflow: hidden;
        background: white;
    }

    .calendar-day.empty {
        border: none;
        background: transparent;
        cursor: default;
    }

    .calendar-day:not(.empty):hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    .calendar-day.today {
        border-color: var(--primary-500);
        border-width: 2px;
    }

    .day-number {
        position: relative;
        z-index: 2;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-700);
    }

    .day-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(180deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.4));
        transition: height 0.3s ease;
        z-index: 1;
    }

    .calendar-day.complete {
        background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
    }

    .calendar-day.complete .day-number {
        color: var(--primary-700);
        font-weight: 700;
    }

    .calendar-day.partial {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }

    .calendar-day.minimal {
        background: #f8fafc;
    }

    /* Achievement Cards */
    .achievement-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3);
        background: white;
        border-radius: var(--radius-xl);
        transition: all var(--transition-base);
        cursor: pointer;
        border: 2px solid var(--gray-200);
    }

    .achievement-card.unlocked {
        border-color: var(--primary-400);
        background: linear-gradient(135deg, #ecfeff 0%, white 100%);
    }

    .achievement-card.locked {
        opacity: 0.4;
        filter: grayscale(1);
    }

    .achievement-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(14, 165, 233, 0.2);
    }

    .achievement-icon {
        font-size: 2rem;
    }

    .achievement-name {
        font-size: 0.75rem;
        font-weight: 600;
        text-align: center;
        color: var(--gray-700);
    }

    .achievement-card.unlocked .achievement-name {
        color: var(--primary-700);
    }
`;
document.head.appendChild(style);
