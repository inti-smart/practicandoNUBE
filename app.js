// ============================================
//  HIDRATADOR - PROFESSIONAL APP v2.0
//  Advanced Hydration Tracking Application
// ============================================

class HidratadorApp {
    constructor() {
        // Core Settings
        this.settings = {
            dailyGoal: 8,
            glassSize: 250,
            reminderInterval: 60,
            notificationsEnabled: true
        };

        // App State
        this.waterCount = 0;
        this.history = [];
        this.streak = 0;
        this.lastDrinkDate = null;

        // UI Elements Cache
        this.elements = {};
        this.cacheElements();

        // Initialize
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        console.log('🚀 Hidratador v2.0 - Initializing...');

        this.loadFromStorage();
        this.setupEventListeners();
        this.updateAllUI();
        this.startDailyCheck();
        this.requestNotificationPermission();
        this.startReminderTimer();
        this.updateAchievementBadge();
        this.registerServiceWorker();

        console.log('✅ App initialized successfully');
    }

    cacheElements() {
        // Main Stats
        this.elements.mainStatValue = document.getElementById('mainStatValue');
        this.elements.goalValue = document.getElementById('goalValue');
        this.elements.percentageValue = document.getElementById('percentageValue');
        this.elements.progressRing = document.getElementById('progressRing');

        // Quick Stats
        this.elements.litersValue = document.getElementById('litersValue');
        this.elements.remainingValue = document.getElementById('remainingValue');
        this.elements.streakValue = document.getElementById('streakValue');

        // Buttons
        this.elements.addWaterBtn = document.getElementById('addWaterBtn');
        this.elements.quickAdd500 = document.getElementById('quickAdd500');
        this.elements.customAmountBtn = document.getElementById('customAmountBtn');
        this.elements.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        // Settings
        this.elements.settingsNavBtn = document.getElementById('settingsNavBtn');
        this.elements.settingsPanel = document.getElementById('settingsPanel');
        this.elements.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.elements.dailyGoal = document.getElementById('dailyGoal');
        this.elements.glassSize = document.getElementById('glassSize');
        this.elements.reminderInterval = document.getElementById('reminderInterval');
        this.elements.notificationsEnabled = document.getElementById('notificationsEnabled');

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
    }

    setupEventListeners() {
        // Add Water Buttons
        this.elements.addWaterBtn?.addEventListener('click', () => {
            this.addRipple(this.elements.addWaterBtn);
            this.addWater(this.settings.glassSize);
        });

        this.elements.quickAdd500?.addEventListener('click', () => {
            this.addWater(500);
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
        this.elements.settingsNavBtn?.addEventListener('click', () => {
            this.openSettings();
        });

        this.elements.closeSettingsBtn?.addEventListener('click', () => {
            this.closeSettings();
        });

        this.elements.saveSettingsBtn?.addEventListener('click', () => {
            this.saveSettings();
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
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.dataset.view;
                if (view === 'settings') {
                    this.openSettings();
                }
            });
        });

        // Modal Overlay Click
        this.elements.customModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.customModal) {
                this.closeCustomModal();
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCustomModal();
                this.closeSettings();
            }
        });
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

        // Save and update
        this.saveToStorage();
        this.updateAllUI();
        this.checkAchievements();
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
            this.history.splice(index, 1);

            this.saveToStorage();
            this.updateAllUI();
            this.showToast('Registro eliminado', 'success');
        }
    }

    resetDay() {
        this.waterCount = 0;
        this.history = [];
        this.saveToStorage();
        this.updateAllUI();
    }

    // ============================================
    // UI UPDATES
    // ============================================

    updateAllUI() {
        this.updateMainStats();
        this.updateQuickStats();
        this.updateProgressRing();
        this.updateTimeline();
        this.updateSettingsUI();
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

    updateSettingsUI() {
        if (this.elements.dailyGoal) this.elements.dailyGoal.value = this.settings.dailyGoal;
        if (this.elements.glassSize) this.elements.glassSize.value = this.settings.glassSize;
        if (this.elements.reminderInterval) this.elements.reminderInterval.value = this.settings.reminderInterval;
        if (this.elements.notificationsEnabled) this.elements.notificationsEnabled.checked = this.settings.notificationsEnabled;
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
    }

    closeSettings() {
        this.elements.settingsPanel?.classList.remove('active');
    }

    // ============================================
    // SETTINGS
    // ============================================

    saveSettings() {
        this.settings.dailyGoal = parseInt(this.elements.dailyGoal.value);
        this.settings.glassSize = parseInt(this.elements.glassSize.value);
        this.settings.reminderInterval = parseInt(this.elements.reminderInterval.value);
        this.settings.notificationsEnabled = this.elements.notificationsEnabled.checked;

        this.saveToStorage();
        this.updateAllUI();
        this.startReminderTimer();

        this.showToast('Configuración guardada', 'success');
        this.closeSettings();
    }

    // ============================================
    // STORAGE
    // ============================================

    loadFromStorage() {
        try {
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
                    this.updateStreak(parsed.lastDrinkDate);
                    this.resetDay();
                }
            }

            // Load settings
            const settings = localStorage.getItem('hidratador_settings');
            if (settings) {
                this.settings = { ...this.settings, ...JSON.parse(settings) };
            }

            // Load streak
            const streak = localStorage.getItem('hidratador_streak');
            if (streak) {
                this.streak = parseInt(streak);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    saveToStorage() {
        try {
            const data = {
                date: new Date().toDateString(),
                waterCount: this.waterCount,
                history: this.history,
                lastDrinkDate: this.lastDrinkDate
            };

            localStorage.setItem('hidratador_data', JSON.stringify(data));
            localStorage.setItem('hidratador_settings', JSON.stringify(this.settings));
            localStorage.setItem('hidratador_streak', this.streak.toString());
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
            this.showToast('🎉 ¡Meta completada! Excelente trabajo', 'success');
            this.updateStreak(this.lastDrinkDate);
        } else if (Math.round(percentage) === 50) {
            this.showToast('💪 ¡Mitad del camino! Sigue así', 'success');
        } else if (Math.round(percentage) === 25) {
            this.showToast('⭐ ¡Buen comienzo! 25% completado', 'success');
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
// INITIALIZE APP
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new HidratadorApp();

    // Make app globally accessible for inline event handlers
    window.app = app;
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
