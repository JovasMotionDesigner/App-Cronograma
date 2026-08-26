/**
 * Firebase Realtime Sync Manager
 * Cronograma de Manual de Marca - Artesanías Maverick & Variedades Franco
 */

class FirebaseSyncService {
    constructor(appInstance) {
        this.app = appInstance;
        this.db = null;
        this.isConnected = false;
        this.dbRefPath = 'cronograma_marca_data';
        // Pre-configured default database URL so the team connects automatically!
        this.defaultUrl = "https://cronograma-marca-default-rtdb.firebaseio.com";
        this.config = this.loadConfig();
    }

    loadConfig() {
        const saved = localStorage.getItem('crono_firebase_config');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing saved Firebase config", e);
            }
        }
        // Default built-in project database
        return {
            databaseURL: this.defaultUrl,
            apiKey: "AIzaSy_Default_Public_Key"
        };
    }

    saveConfig(configObj) {
        localStorage.setItem('crono_firebase_config', JSON.stringify(configObj));
        this.config = configObj;
        this.init();
    }

    init() {
        if (!this.config || !this.config.databaseURL) {
            this.updateStatusBadge('offline', 'Modo Local (Sin Nube)');
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }
            this.db = firebase.database();
            
            // Connection state listener (.info/connected)
            const connectedRef = this.db.ref(".info/connected");
            connectedRef.on("value", (snap) => {
                if (snap.val() === true) {
                    this.isConnected = true;
                    this.updateStatusBadge('online', 'En Vivo (Sincronizado)');
                } else {
                    this.isConnected = false;
                    this.updateStatusBadge('connecting', 'Conectando...');
                }
            });

            // Listen for Realtime Updates from any team member in the world!
            this.db.ref(this.dbRefPath).on('value', (snapshot) => {
                const cloudData = snapshot.val();
                if (cloudData && typeof cloudData === 'object') {
                    this.app.data = cloudData;
                    this.app.renderStats();
                    this.app.renderContent();
                    console.log("⚡ [Firebase] Datos sincronizados en vivo con el equipo.");
                } else {
                    // Seed initial brand tasks to cloud on first connection
                    this.syncToCloud(this.app.data);
                }
            });

        } catch (error) {
            console.error("Firebase init error:", error);
            this.updateStatusBadge('error', 'Error de Conexión');
        }
    }

    // Push data to Firebase in real-time
    syncToCloud(data) {
        if (!this.db || !this.isConnected) {
            localStorage.setItem('crono_brand_data_light_v4', JSON.stringify(data));
            return;
        }

        try {
            this.db.ref(this.dbRefPath).set(data);
        } catch (e) {
            console.error("Error pushing to cloud:", e);
        }
    }

    updateStatusBadge(status, text) {
        const badge = document.getElementById('cloud-sync-badge');
        const dot = document.getElementById('cloud-sync-dot');
        const label = document.getElementById('cloud-sync-text');

        if (!badge || !dot || !label) return;

        label.textContent = text;

        if (status === 'online') {
            badge.className = 'px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm';
            dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping';
        } else if (status === 'connecting') {
            badge.className = 'px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm';
            dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500';
        } else {
            badge.className = 'px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center gap-2 cursor-pointer';
            dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400';
        }
    }
}
