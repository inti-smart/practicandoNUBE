// ============================================
//  HIDRATADOR PRO - Fixed & Simplified v3.1
//  Compatible with existing HTML structure
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
        this.streak = 0;
        this.lastDrinkDate = null;

        // Gamification
        this.level = 1;
        this.xp = 0;
        this.totalLifetimeWater = 0;

        // Onboarding
        this.currentOnboardingStep = 1;
        this.hasCompletedOnboarding = false;

        // Daily Challenge
        this.dailyChallenge = null;

        // Current View
        this.currentView = 'home';

        // UI Elements Cache
        this.elements = {};

        // Initialize
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Hidratador Pro - Starting...');

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
        }

        console.log('✅ App initialized');
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
        this.elements.waterCountDisplay = document.getElementById('waterCountDisplay');
        this.elements.progressFill = document.getElementById('progressFill');
        this.elements.progressPercentage = document.getElementById('progressPercentage');
        this.elements.dailyGoalDisplay = document.getElementById('dailyGoalDisplay');

        // Buttons
        this.elements.addWaterBtn = document.getElementById('addWaterBtn');
        this.elements.quickAdd500 = document.getElementById('quickAdd500');
        this.elements.customAmountBtn = document.getElementById('customAmountBtn');

        // Other
        this.elements.darkModeToggle = document.getElementById('darkModeToggle');
        this.elements.userLevel = document.getElementById('userLevel');
        this.elements.xpFill = document.getElementById('xpFill');
        this.elements.currentXP = document.getElementById('currentXP');
        this.elements.requiredXP = document.getElementById('requiredXP');
        this.elements.dailyChallengeText = document.getElementById('dailyChallengeText');
        this.elements.historyList = document.getElementById('historyList');
    }

    setupEventListeners() {
        // Dark mode toggle
        this.elements.darkModeToggle?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Add water button
        this.elements.addWaterBtn?.addEventListener('click', () => {
            this.addWater(this.settings.glassSize);
        });

        // Quick add 500ml
        this.elements.quickAdd500?.addEventListener('click', () => {
            this.addWater(500);
        });

        // Custom amount
        this.elements.customAmountBtn?.addEventListener('click', () => {
            const amount = prompt('¿Cuántos ml deseas agregar?', '250');
            if (amount && !isNaN(amount)) {
                this.addWater(parseInt(amount));
            }
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
            });
        });
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
        this.showToast('¡Bienvenido a Hidratador Pro! 🎉');
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
        this.history.unshift(entry); // Add to beginning

        // Update stats
        this.lastDrinkDate = new Date().toDateString();
        this.totalLifetimeWater += ml;

        // Add XP
        this.addXP(10);

        // Check achievements
        this.checkGoalCompletion();

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

    // ============================================
    // GAMIFICATION
    // ============================================

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
            'Bebe agua cada 2 horas hoy'
        ];

        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('challenge_date');

        if (savedDate !== today) {
            const randomIndex = Math.floor(Math.random() * challenges.length);
            this.dailyChallenge = challenges[randomIndex];
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
    // UI UPDATES
    // ============================================

    updateAllUI() {
        this.updateWaterDisplay();
        this.updateProgress();
        this.updateHistory();
        this.updateLevelUI();
    }

    updateWaterDisplay() {
        if (this.elements.waterCountDisplay) {
            this.elements.waterCountDisplay.textContent = this.waterCount.toFixed(1);
        }

        if (this.elements.dailyGoalDisplay) {
            this.elements.dailyGoalDisplay.textContent = this.settings.dailyGoal;
        }
    }

    updateProgress() {
        const percentage = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);

        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percentage}%`;
        }

        if (this.elements.progressPercentage) {
            this.elements.progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }

    updateHistory() {
        if (!this.elements.historyList) return;

        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = '<p class="empty-message">No hay registros hoy</p>';
            return;
        }

        const historyHTML = this.history.map(entry => {
            const time = new Date(entry.time);
            const timeStr = time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            return `
                <div class="history-item">
                    <div class="history-time">${timeStr}</div>
                    <div class="history-amount">${entry.amount}ml</div>
                    <button class="history-delete" onclick="app.deleteHistoryItem(${entry.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        this.elements.historyList.innerHTML = historyHTML;
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
            // Update icons
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
                    // New day - reset
                    this.waterCount = 0;
                    this.history = [];
                }
            }

            // Game data
            const gameData = localStorage.getItem('game_data');
            if (gameData) {
                const parsed = JSON.parse(gameData);
                this.level = parsed.level || 1;
                this.xp = parsed.xp || 0;
                this.streak = parsed.streak || 0;
                this.totalLifetimeWater = parsed.totalLifetimeWater || 0;
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            // Onboarding
            localStorage.setItem('onboarding_complete', this.hasCompletedOnboarding.toString());

            // Settings
            localStorage.setItem('settings', JSON.stringify(this.settings));

            // Daily data
            const dailyData = {
                date: new Date().toDateString(),
                waterCount: this.waterCount,
                history: this.history
            };
            localStorage.setItem('daily_data', JSON.stringify(dailyData));

            // Game data
            const gameData = {
                level: this.level,
                xp: this.xp,
                streak: this.streak,
                totalLifetimeWater: this.totalLifetimeWater
            };
            localStorage.setItem('game_data', JSON.stringify(gameData));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // ============================================
    // UTILITIES
    // ============================================

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove toast
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
            // Silently fail if audio not supported
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
    window.app = app; // Make globally accessible
});

// Add toast CSS
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: rgba(14, 165, 233, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .empty-message {
        text-align: center;
        padding: 40px 20px;
        color: #9CA3AF;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);
