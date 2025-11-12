// Hidratador App - JavaScript
class HydrationTracker {
    constructor() {
        this.waterCount = 0;
        this.history = [];
        this.settings = {
            dailyGoal: 8,
            glassSize: 250, // ml
            reminderInterval: 60, // minutes
            notificationsEnabled: true
        };
        this.reminderTimer = null;
        this.quotes = [
            "💧 ¡El agua es vida! Sigue así.",
            "🌊 Tu cuerpo te agradece cada sorbo.",
            "💪 ¡Excelente! Mantén el ritmo.",
            "🎉 ¡Vas por buen camino!",
            "✨ Hidrátate como campeón.",
            "🏆 ¡Tu salud es lo primero!",
            "🌟 Cada vaso cuenta, ¡sigue así!",
            "💙 El agua es tu mejor aliado."
        ];
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.checkNewDay();
        this.startReminderTimer();
        this.requestNotificationPermission();
    }

    // Local Storage
    loadData() {
        const savedData = localStorage.getItem('hydrationData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const today = new Date().toDateString();

            // Reset if it's a new day
            if (data.date === today) {
                this.waterCount = data.waterCount || 0;
                this.history = data.history || [];
            } else {
                this.resetDay();
            }
        }

        const savedSettings = localStorage.getItem('hydrationSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
            this.updateSettingsUI();
        }
    }

    saveData() {
        const data = {
            date: new Date().toDateString(),
            waterCount: this.waterCount,
            history: this.history
        };
        localStorage.setItem('hydrationData', JSON.stringify(data));
    }

    saveSettings() {
        localStorage.setItem('hydrationSettings', JSON.stringify(this.settings));
    }

    // Event Listeners
    setupEventListeners() {
        document.getElementById('addWaterBtn').addEventListener('click', () => {
            this.addWater(this.settings.glassSize);
        });

        document.getElementById('customAmountBtn').addEventListener('click', () => {
            this.showCustomModal();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.updateSettings();
        });

        document.getElementById('resetDayBtn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres reiniciar el contador de hoy?')) {
                this.resetDay();
            }
        });

        document.getElementById('cancelCustomBtn').addEventListener('click', () => {
            this.hideCustomModal();
        });

        document.getElementById('confirmCustomBtn').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('customAmount').value);
            this.addWater(amount);
            this.hideCustomModal();
        });

        // Enter key on custom amount
        document.getElementById('customAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('confirmCustomBtn').click();
            }
        });
    }

    // Add Water
    addWater(ml) {
        const glasses = ml / this.settings.glassSize;
        this.waterCount += glasses;

        const now = new Date();
        this.history.push({
            time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            amount: ml
        });

        this.saveData();
        this.updateUI();
        this.showCelebration();
        this.updateQuote();
    }

    // UI Updates
    updateUI() {
        // Update water count
        document.getElementById('waterCount').textContent = this.waterCount.toFixed(1);

        // Update liters
        const liters = (this.waterCount * this.settings.glassSize) / 1000;
        document.getElementById('waterLiters').textContent = liters.toFixed(2);

        // Update progress
        const progress = Math.min((this.waterCount / this.settings.dailyGoal) * 100, 100);
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.round(progress) + '%';

        // Update history
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        const historyList = document.getElementById('historyList');

        if (this.history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; opacity: 0.6;">No hay registros aún</p>';
            return;
        }

        historyList.innerHTML = '';
        this.history.slice().reverse().forEach((entry) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="history-time">${entry.time}</span>
                <span class="history-amount">💧 ${entry.amount} ml</span>
            `;
            historyList.appendChild(item);
        });
    }

    updateSettingsUI() {
        document.getElementById('dailyGoal').value = this.settings.dailyGoal;
        document.getElementById('glassSize').value = this.settings.glassSize;
        document.getElementById('reminderInterval').value = this.settings.reminderInterval;
        document.getElementById('notificationsEnabled').checked = this.settings.notificationsEnabled;
    }

    updateSettings() {
        this.settings.dailyGoal = parseInt(document.getElementById('dailyGoal').value);
        this.settings.glassSize = parseInt(document.getElementById('glassSize').value);
        this.settings.reminderInterval = parseInt(document.getElementById('reminderInterval').value);
        this.settings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;

        this.saveSettings();
        this.updateUI();
        this.startReminderTimer();

        // Show confirmation
        this.showNotification('⚙️ Configuración guardada', 'Tus preferencias han sido actualizadas.');
    }

    // Modal
    showCustomModal() {
        document.getElementById('customModal').classList.add('active');
        document.getElementById('customAmount').focus();
    }

    hideCustomModal() {
        document.getElementById('customModal').classList.remove('active');
    }

    // Celebration
    showCelebration() {
        const progress = (this.waterCount / this.settings.dailyGoal) * 100;

        if (progress >= 100 && progress < 105) {
            this.showNotification('🎉 ¡Meta alcanzada!', '¡Felicidades! Has cumplido tu meta diaria de hidratación.');
        } else if (progress === 50) {
            this.showNotification('💪 ¡Mitad del camino!', '¡Vas súper bien! Ya estás a la mitad de tu meta.');
        }
    }

    // Quote
    updateQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        document.getElementById('motivationalQuote').textContent = randomQuote;
    }

    // Notifications
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted' && this.settings.notificationsEnabled) {
            new Notification(title, {
                body: body,
                icon: 'icon.png',
                badge: 'icon.png'
            });
        }
    }

    // Reminder Timer
    startReminderTimer() {
        // Clear existing timer
        if (this.reminderTimer) {
            clearInterval(this.reminderTimer);
        }

        // Set new timer
        const intervalMs = this.settings.reminderInterval * 60 * 1000;
        this.reminderTimer = setInterval(() => {
            if (this.settings.notificationsEnabled) {
                const progress = (this.waterCount / this.settings.dailyGoal) * 100;
                if (progress < 100) {
                    this.showNotification(
                        '💧 ¡Hora de hidratarte!',
                        `Has tomado ${this.waterCount.toFixed(1)} de ${this.settings.dailyGoal} vasos. ¡Toma un poco de agua!`
                    );
                }
            }
        }, intervalMs);
    }

    // Reset Day
    resetDay() {
        this.waterCount = 0;
        this.history = [];
        this.saveData();
        this.updateUI();
        this.updateQuote();
    }

    // Check New Day
    checkNewDay() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow - now;

        setTimeout(() => {
            this.resetDay();
            this.showNotification('🌅 ¡Nuevo día!', 'Contador reiniciado. ¡Comienza un nuevo día de hidratación!');
            this.checkNewDay(); // Schedule next check
        }, msUntilMidnight);
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error al registrar Service Worker:', err));
    });
}

// Initialize app
const app = new HydrationTracker();

// Handle visibility change (when user returns to app)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        app.checkNewDay();
    }
});
