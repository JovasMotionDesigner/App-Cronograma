/**
 * Main Application Logic - Cronograma Manual de Marca
 * Artesanías Maverick & Variedades Franco
 */

class CronogramaApp {
    constructor() {
        this.currentCompany = 'maverick'; // 'maverick', 'franco', or 'all'
        this.currentView = 'list'; // 'list', 'kanban', 'brief', 'metrics'
        this.filters = {
            search: '',
            phase: 'all',
            assignee: 'all',
            status: 'all',
            priority: 'all'
        };
        
        this.data = this.loadData();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        // Initialize Lucide icons if available
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Load data with LocalStorage fallback
    loadData() {
        const stored = localStorage.getItem('crono_brand_data_v2');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing stored data", e);
            }
        }
        return JSON.parse(JSON.stringify(INITIAL_COMPANIES_DATA));
    }

    saveData() {
        localStorage.setItem('crono_brand_data_v2', JSON.stringify(this.data));
    }

    resetData() {
        if (confirm("¿Estás seguro de que deseas restablecer todas las tareas a su estado inicial predeterminado?")) {
            this.data = JSON.parse(JSON.stringify(INITIAL_COMPANIES_DATA));
            this.saveData();
            this.render();
            this.showToast("Datos restablecidos con éxito.", "info");
        }
    }

    bindEvents() {
        // Company switcher tabs
        document.querySelectorAll('[data-company-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-company-tab');
                this.setCompany(target);
            });
        });

        // View switcher tabs (List, Kanban, Brief, Metrics)
        document.querySelectorAll('[data-view-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-view-tab');
                this.setView(target);
            });
        });

        // Filter Inputs
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase().trim();
                this.renderContent();
            });
        }

        const filterAssignee = document.getElementById('filter-assignee');
        if (filterAssignee) {
            filterAssignee.addEventListener('change', (e) => {
                this.filters.assignee = e.target.value;
                this.renderContent();
            });
        }

        const filterStatus = document.getElementById('filter-status');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.renderContent();
            });
        }

        const filterPhase = document.getElementById('filter-phase');
        if (filterPhase) {
            filterPhase.addEventListener('change', (e) => {
                this.filters.phase = e.target.value;
                this.renderContent();
            });
        }

        // Action Buttons
        const btnNewTask = document.getElementById('btn-new-task');
        if (btnNewTask) {
            btnNewTask.addEventListener('click', () => this.openTaskModal());
        }

        const btnExportCsv = document.getElementById('btn-export-csv');
        if (btnExportCsv) {
            btnExportCsv.addEventListener('click', () => this.exportToCSV());
        }

        const btnExportJson = document.getElementById('btn-export-json');
        if (btnExportJson) {
            btnExportJson.addEventListener('click', () => this.exportToJSON());
        }

        const btnResetData = document.getElementById('btn-reset-data');
        if (btnResetData) {
            btnResetData.addEventListener('click', () => this.resetData());
        }

        const btnPrintReport = document.getElementById('btn-print-report');
        if (btnPrintReport) {
            btnPrintReport.addEventListener('click', () => window.print());
        }

        // Modal Form Submit
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTaskFormSubmit();
            });
        }
    }

    setCompany(companyId) {
        this.currentCompany = companyId;
        this.renderTabs();
        this.renderHeaderInfo();
        this.renderStats();
        this.renderContent();
    }

    setView(viewId) {
        this.currentView = viewId;
        document.querySelectorAll('[data-view-tab]').forEach(btn => {
            const isTarget = btn.getAttribute('data-view-tab') === viewId;
            if (isTarget) {
                btn.className = "px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white shadow-sm border border-slate-700 flex items-center gap-2";
            } else {
                btn.className = "px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 flex items-center gap-2 transition";
            }
        });
        this.renderContent();
    }

    render() {
        this.renderTabs();
        this.renderHeaderInfo();
        this.renderStats();
        this.renderContent();
    }

    renderTabs() {
        document.querySelectorAll('[data-company-tab]').forEach(btn => {
            const comp = btn.getAttribute('data-company-tab');
            btn.classList.remove('tab-active-maverick', 'tab-active-franco', 'tab-active-unified', 'border-transparent', 'text-slate-400');
            
            if (comp === this.currentCompany) {
                if (comp === 'maverick') btn.classList.add('tab-active-maverick');
                else if (comp === 'franco') btn.classList.add('tab-active-franco');
                else btn.classList.add('tab-active-unified');
            } else {
                btn.classList.add('border-transparent', 'text-slate-400');
            }
        });
    }

    getTasks(companyKey = this.currentCompany) {
        if (companyKey === 'all') {
            const allTasks = [];
            Object.keys(this.data).forEach(k => {
                const compTasks = this.data[k].tasks.map(t => ({ ...t, companyId: k, companyName: this.data[k].name }));
                allTasks.push(...compTasks);
            });
            return allTasks;
        }
        return (this.data[companyKey] && this.data[companyKey].tasks) ? this.data[companyKey].tasks : [];
    }

    getFilteredTasks() {
        let tasks = this.getTasks();

        if (this.filters.search) {
            tasks = tasks.filter(t => 
                t.title.toLowerCase().includes(this.filters.search) ||
                t.description.toLowerCase().includes(this.filters.search) ||
                t.deliverable.toLowerCase().includes(this.filters.search) ||
                t.assignedTo.toLowerCase().includes(this.filters.search)
            );
        }

        if (this.filters.assignee !== 'all') {
            tasks = tasks.filter(t => t.assignedTo === this.filters.assignee);
        }

        if (this.filters.status !== 'all') {
            tasks = tasks.filter(t => t.status === this.filters.status);
        }

        if (this.filters.phase !== 'all') {
            tasks = tasks.filter(t => t.phaseId === this.filters.phase);
        }

        return tasks;
    }

    renderHeaderInfo() {
        const headerContainer = document.getElementById('company-hero-banner');
        if (!headerContainer) return;

        if (this.currentCompany === 'all') {
            headerContainer.innerHTML = `
                <div class="p-6 md:p-8 rounded-2xl glass-panel relative overflow-hidden bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-slate-950/80 border border-purple-500/30">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">Vista Global Unificada</span>
                                <span class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300">2 Empresas</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Cronograma General: Artesanías Maverick & Variedades Franco</h1>
                            <p class="text-slate-300 mt-2 max-w-3xl text-sm leading-relaxed">
                                Supervisión y seguimiento consolidado de las 8 fases de diseño para ambas marcas salvadoreñas del Mercado Sagrado Corazón.
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center">
                            <button onclick="app.downloadCombinedBriefs()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-purple-900/40 flex items-center gap-2">
                                <i data-lucide="file-down" class="w-4 h-4"></i> Descargar Ambos Briefs
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const comp = this.data[this.currentCompany];
            const isMav = this.currentCompany === 'maverick';
            const badgeColor = isMav ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            const btnColor = isMav ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/40' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40';

            headerContainer.innerHTML = `
                <div class="p-6 md:p-8 rounded-2xl glass-panel relative overflow-hidden bg-gradient-to-r ${comp.theme.heroGradient} border ${comp.theme.cardBorder}">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${badgeColor} border">${comp.badge}</span>
                                <span class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-300"></i> ${comp.location}</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">${comp.name}</h1>
                            <p class="text-slate-300 font-medium italic text-sm mt-1">"${comp.tagline}"</p>
                            <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                                <span><strong>Contacto:</strong> ${comp.contact}</span>
                                <span>•</span>
                                <span><strong>Propietario / Encargado:</strong> ${comp.owner}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-3 items-center">
                            <a href="${comp.docFile}" download class="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition border border-slate-700 flex items-center gap-2">
                                <i data-lucide="download" class="w-4 h-4 text-slate-400"></i> Descargar DOCX Original
                            </a>
                            <button onclick="app.setView('brief')" class="px-4 py-2.5 ${btnColor} text-white text-sm font-semibold rounded-xl transition shadow-lg flex items-center gap-2">
                                <i data-lucide="file-text" class="w-4 h-4"></i> Ver Brief Completo
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    renderStats() {
        const statsContainer = document.getElementById('stats-grid');
        if (!statsContainer) return;

        const tasks = this.getTasks();
        const total = tasks.length;
        const completadas = tasks.filter(t => t.status === 'completada').length;
        const enProceso = tasks.filter(t => t.status === 'en_proceso').length;
        const enRevision = tasks.filter(t => t.status === 'en_revision').length;
        const pendientes = tasks.filter(t => t.status === 'pendiente').length;
        const pct = total > 0 ? Math.round((completadas / total) * 100) : 0;

        statsContainer.innerHTML = `
            <!-- Progreso General -->
            <div class="p-5 rounded-2xl glass-card border border-slate-800 relative overflow-hidden">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avance Global</p>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-white mt-1">${pct}%</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <i data-lucide="trending-up" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
                <p class="text-[11px] text-slate-400 mt-2">${completadas} de ${total} entregables finalizados</p>
            </div>

            <!-- En Proceso -->
            <div class="p-5 rounded-2xl glass-card border border-slate-800">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider">En Proceso</p>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-white mt-1">${enProceso}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-slate-400 mt-4">Tareas en desarrollo activo</p>
            </div>

            <!-- En Revisión -->
            <div class="p-5 rounded-2xl glass-card border border-slate-800">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-blue-400 uppercase tracking-wider">En Revisión</p>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-white mt-1">${enRevision}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <i data-lucide="eye" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-slate-400 mt-4">Listas para control de calidad</p>
            </div>

            <!-- Pendientes -->
            <div class="p-5 rounded-2xl glass-card border border-slate-800">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendientes</p>
                        <h3 class="text-2xl md:text-3xl font-extrabold text-white mt-1">${pendientes}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-slate-700/40 border border-slate-600/40 flex items-center justify-center text-slate-400">
                        <i data-lucide="list-todo" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-slate-400 mt-4">Próximos sprints de trabajo</p>
            </div>
        `;

        if (window.lucide) window.lucide.createIcons();
    }

    renderContent() {
        const container = document.getElementById('view-container');
        if (!container) return;

        if (this.currentView === 'list') {
            this.renderListView(container);
        } else if (this.currentView === 'kanban') {
            this.renderKanbanView(container);
        } else if (this.currentView === 'brief') {
            this.renderBriefView(container);
        } else if (this.currentView === 'metrics') {
            this.renderMetricsView(container);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // --- LIST VIEW ---
    renderListView(container) {
        const tasks = this.getFilteredTasks();

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="p-12 text-center glass-panel rounded-2xl border border-slate-800">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <i data-lucide="search-x" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white">No se encontraron tareas</h3>
                    <p class="text-sm text-slate-400 mt-1">Prueba cambiando los filtros de búsqueda o agrega una nueva tarea.</p>
                </div>
            `;
            return;
        }

        // Group tasks by phase
        let html = '<div class="space-y-8">';
        
        PHASES.forEach(phase => {
            const phaseTasks = tasks.filter(t => t.phaseId === phase.id);
            if (phaseTasks.length === 0) return;

            const completedInPhase = phaseTasks.filter(t => t.status === 'completada').length;
            const phasePct = Math.round((completedInPhase / phaseTasks.length) * 100);

            html += `
                <div class="glass-panel rounded-2xl p-6 border border-slate-800">
                    <!-- Phase Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-${phase.color}-500/20 text-${phase.color}-400 border border-${phase.color}-500/30 flex items-center justify-center font-bold">
                                ${phase.number}
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                                    ${phase.name}
                                </h2>
                                <p class="text-xs text-slate-400">${phaseTasks.length} tareas asignadas en esta fase</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="text-right">
                                <span class="text-xs font-semibold text-slate-300">${completedInPhase}/${phaseTasks.length} Listas</span>
                                <div class="w-32 bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
                                    <div class="bg-emerald-500 h-full rounded-full transition-all" style="width: ${phasePct}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tasks Table / Cards -->
                    <div class="space-y-4">
                        ${phaseTasks.map(task => this.renderTaskCard(task)).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    renderTaskCard(task) {
        const statusObj = TASK_STATUSES.find(s => s.id === task.status) || TASK_STATUSES[0];
        const assignedMember = TEAM_MEMBERS.find(m => m.name === task.assignedTo) || TEAM_MEMBERS[0];
        
        let priorityColor = "bg-slate-700 text-slate-300";
        if (task.priority === 'alta') priorityColor = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
        else if (task.priority === 'media') priorityColor = "bg-amber-500/20 text-amber-300 border border-amber-500/30";

        const companyBadge = task.companyName ? `
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
                ${task.companyName}
            </span>
        ` : '';

        return `
            <div class="p-4 rounded-xl glass-card border border-slate-800 hover:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="task-${task.id}">
                <div class="flex-1 space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                        ${companyBadge}
                        <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded ${priorityColor}">
                            Prioridad ${task.priority || 'Normal'}
                        </span>
                        <span class="text-xs text-slate-400 flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-500"></i> ${task.deadline || 'En curso'}
                        </span>
                    </div>

                    <h4 class="text-base font-bold text-white">${task.title}</h4>
                    <p class="text-xs text-slate-300 leading-relaxed">${task.description}</p>
                    
                    <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-2 mt-2">
                        <i data-lucide="check-square" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
                        <div class="text-xs">
                            <strong class="text-slate-200">Entregable requerido:</strong>
                            <span class="text-slate-300 ml-1">${task.deliverable}</span>
                        </div>
                    </div>
                </div>

                <!-- Interactive Controls (Assignee & Status Dropdowns) -->
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    
                    <!-- Assignee Selector -->
                    <div class="w-full sm:w-auto">
                        <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Encargado</label>
                        <select onchange="app.updateTaskAssignee('${task.id}', this.value, '${task.companyId || this.currentCompany}')" 
                                class="custom-select w-full sm:w-48 text-xs font-semibold bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition">
                            ${TEAM_MEMBERS.map(m => `
                                <option value="${m.name}" ${task.assignedTo === m.name ? 'selected' : ''}>
                                    ${m.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Status Selector -->
                    <div class="w-full sm:w-auto">
                        <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Estado</label>
                        <select onchange="app.updateTaskStatus('${task.id}', this.value, '${task.companyId || this.currentCompany}')" 
                                class="custom-select w-full sm:w-40 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none transition ${statusObj.color}">
                            ${TASK_STATUSES.map(s => `
                                <option value="${s.id}" class="bg-slate-900 text-white" ${task.status === s.id ? 'selected' : ''}>
                                    ${s.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Actions (Edit/Delete) -->
                    <div class="flex items-center gap-1 self-end sm:self-center mt-3 sm:mt-4">
                        <button onclick="app.openTaskModal('${task.id}', '${task.companyId || this.currentCompany}')" title="Editar Tarea" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="app.deleteTask('${task.id}', '${task.companyId || this.currentCompany}')" title="Eliminar Tarea" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>

                </div>
            </div>
        `;
    }

    // --- KANBAN VIEW ---
    renderKanbanView(container) {
        const tasks = this.getFilteredTasks();

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                ${TASK_STATUSES.map(status => {
                    const colTasks = tasks.filter(t => t.status === status.id);
                    return `
                        <div class="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col h-full min-h-[600px]">
                            <!-- Column Header -->
                            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full ${status.color.split(' ')[0]}"></span>
                                    <h3 class="font-bold text-sm text-white">${status.label}</h3>
                                </div>
                                <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
                                    ${colTasks.length}
                                </span>
                            </div>

                            <!-- Tasks list in column -->
                            <div class="space-y-3 flex-1 overflow-y-auto pr-1">
                                ${colTasks.length === 0 ? `
                                    <div class="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                        Sin tareas en esta etapa
                                    </div>
                                ` : colTasks.map(t => this.renderKanbanCard(t)).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderKanbanCard(task) {
        const assignedMember = TEAM_MEMBERS.find(m => m.name === task.assignedTo) || TEAM_MEMBERS[0];
        const phase = PHASES.find(p => p.id === task.phaseId) || PHASES[0];

        return `
            <div class="p-4 rounded-xl glass-card border border-slate-800 hover:border-slate-600 transition space-y-3">
                <div class="flex items-center justify-between gap-2">
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-${phase.color}-500/20 text-${phase.color}-300">
                        ${phase.name}
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">${task.deadline || ''}</span>
                </div>

                <h4 class="text-sm font-bold text-white line-clamp-2">${task.title}</h4>
                <p class="text-xs text-slate-300 line-clamp-3">${task.description}</p>

                <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full ${assignedMember.color} text-[10px] font-bold text-white flex items-center justify-center">
                            ${assignedMember.avatar}
                        </div>
                        <span class="text-xs text-slate-300 font-medium truncate max-w-[110px]">${task.assignedTo.split(' ')[0]}</span>
                    </div>

                    <select onchange="app.updateTaskStatus('${task.id}', this.value, '${task.companyId || this.currentCompany}')" 
                            class="custom-select text-[11px] font-semibold bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200">
                        ${TASK_STATUSES.map(s => `
                            <option value="${s.id}" ${task.status === s.id ? 'selected' : ''}>
                                ${s.label}
                            </option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;
    }

    // --- BRIEF VIEW ---
    renderBriefView(container) {
        const isUnified = this.currentCompany === 'all';
        const companiesToShow = isUnified ? ['maverick', 'franco'] : [this.currentCompany];

        container.innerHTML = `
            <div class="space-y-8">
                ${companiesToShow.map(key => {
                    const comp = this.data[key];
                    return `
                        <div class="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-8">
                            
                            <!-- Header Brief -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                                <div>
                                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                        Brief Estratégico de Identidad
                                    </span>
                                    <h2 class="text-2xl md:text-3xl font-extrabold text-white mt-2">${comp.name}</h2>
                                    <p class="text-slate-400 text-sm mt-1">Ubicación: ${comp.location} | Contacto: ${comp.contact}</p>
                                </div>
                                <div class="flex flex-wrap gap-3">
                                    <button onclick="app.downloadFormattedBrief('${key}')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow flex items-center gap-2">
                                        <i data-lucide="file-text" class="w-4 h-4"></i> Descargar Ficha de Brief (.txt)
                                    </button>
                                    <a href="${comp.docFile}" download class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition border border-slate-700 flex items-center gap-2">
                                        <i data-lucide="download" class="w-4 h-4"></i> Descargar DOCX Original
                                    </a>
                                </div>
                            </div>

                            <!-- Grid of Brief Sections -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                
                                <!-- Historia y Propósito -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-sky-400 font-bold text-sm">
                                        <i data-lucide="history" class="w-4 h-4"></i> Historia & Origen
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${comp.brief.summary}</p>
                                </div>

                                <!-- Propuesta de Valor -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-amber-400 font-bold text-sm">
                                        <i data-lucide="award" class="w-4 h-4"></i> Propuesta de Valor
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${comp.brief.valueProposition}</p>
                                </div>

                                <!-- Público Objetivo -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-purple-400 font-bold text-sm">
                                        <i data-lucide="users" class="w-4 h-4"></i> Cliente Ideal / Público
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${comp.brief.targetAudience}</p>
                                </div>

                                <!-- Concepto de Logotipo -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                        <i data-lucide="sparkles" class="w-4 h-4"></i> Concepto de Logotipo
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${comp.brief.logoConcept}</p>
                                </div>

                                <!-- Paleta y Tipografía -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-rose-400 font-bold text-sm">
                                        <i data-lucide="palette" class="w-4 h-4"></i> Paleta & Estilo Visual
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">${comp.brief.colorPalette}</p>
                                    <p class="text-xs text-slate-400 mt-2"><strong>Tipografía:</strong> ${comp.brief.typographyStyle}</p>
                                </div>

                                <!-- Productos Clave -->
                                <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-2">
                                    <div class="flex items-center gap-2 text-teal-400 font-bold text-sm">
                                        <i data-lucide="box" class="w-4 h-4"></i> Oferta de Productos Clave
                                    </div>
                                    <ul class="text-xs text-slate-300 space-y-1">
                                        ${comp.brief.keyProducts.map(p => `<li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> ${p}</li>`).join('')}
                                    </ul>
                                </div>

                            </div>

                            <!-- Puntos de Contacto y Aplicaciones -->
                            <div class="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                                <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <i data-lucide="layers" class="w-4 h-4 text-blue-400"></i> Puntos de Contacto y Aplicaciones Requeridas
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    ${comp.brief.applications.map(app => `
                                        <div class="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-center gap-2">
                                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400"></i>
                                            <span>${app}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // --- METRICS VIEW ---
    renderMetricsView(container) {
        const tasks = this.getTasks();
        
        // Compute workload by member
        const memberStats = TEAM_MEMBERS.map(m => {
            const mTasks = tasks.filter(t => t.assignedTo === m.name);
            const done = mTasks.filter(t => t.status === 'completada').length;
            const inProg = mTasks.filter(t => t.status === 'en_proceso').length;
            const rev = mTasks.filter(t => t.status === 'en_revision').length;
            const pend = mTasks.filter(t => t.status === 'pendiente').length;
            const pct = mTasks.length > 0 ? Math.round((done / mTasks.length) * 100) : 0;
            return { ...m, total: mTasks.length, done, inProg, rev, pend, pct };
        });

        container.innerHTML = `
            <div class="space-y-8">
                <div class="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
                    <h3 class="text-xl font-bold text-white mb-2">Distribución de Carga de Trabajo por Integrante</h3>
                    <p class="text-xs text-slate-400 mb-6">Seguimiento individual del avance y responsabilidades de José Luis, Marcela y Ezequiel.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        ${memberStats.map(m => `
                            <div class="p-5 rounded-xl glass-card border border-slate-800 space-y-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-xl ${m.color} text-white font-extrabold text-sm flex items-center justify-center shadow">
                                        ${m.avatar}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-white text-sm">${m.name}</h4>
                                        <p class="text-[11px] text-slate-400">${m.role}</p>
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs font-semibold">
                                        <span class="text-slate-300">Avance Individual</span>
                                        <span class="text-emerald-400">${m.pct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div class="bg-emerald-500 h-full rounded-full" style="width: ${m.pct}%"></div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                                    <div class="p-2 rounded-lg bg-slate-900/60">
                                        <span class="text-slate-400 block text-[10px]">Total Tareas</span>
                                        <strong class="text-white text-base">${m.total}</strong>
                                    </div>
                                    <div class="p-2 rounded-lg bg-slate-900/60">
                                        <span class="text-slate-400 block text-[10px]">Completadas</span>
                                        <strong class="text-emerald-400 text-base">${m.done}</strong>
                                    </div>
                                    <div class="p-2 rounded-lg bg-slate-900/60">
                                        <span class="text-slate-400 block text-[10px]">En Proceso</span>
                                        <strong class="text-amber-400 text-base">${m.inProg}</strong>
                                    </div>
                                    <div class="p-2 rounded-lg bg-slate-900/60">
                                        <span class="text-slate-400 block text-[10px]">En Revisión</span>
                                        <strong class="text-blue-400 text-base">${m.rev}</strong>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Resumen de Fases -->
                <div class="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
                    <h3 class="text-xl font-bold text-white mb-6">Estado de las 8 Fases del Proyecto</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${PHASES.map(phase => {
                            const pTasks = tasks.filter(t => t.phaseId === phase.id);
                            const done = pTasks.filter(t => t.status === 'completada').length;
                            const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                            return `
                                <div class="p-4 rounded-xl glass-card border border-slate-800">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="w-6 h-6 rounded-lg bg-${phase.color}-500/20 text-${phase.color}-400 text-xs font-bold flex items-center justify-center">
                                            ${phase.number}
                                        </span>
                                        <h5 class="text-xs font-bold text-white truncate">${phase.name}</h5>
                                    </div>
                                    <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                                        <span>${done}/${pTasks.length} tareas</span>
                                        <span class="font-bold text-white">${pct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div class="bg-${phase.color}-500 h-full rounded-full" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // --- TASK UPDATES ---
    updateTaskStatus(taskId, newStatus, companyKey = this.currentCompany) {
        if (companyKey === 'all') {
            // Find which company has this task
            Object.keys(this.data).forEach(k => {
                const task = this.data[k].tasks.find(t => t.id === taskId);
                if (task) task.status = newStatus;
            });
        } else if (this.data[companyKey]) {
            const task = this.data[companyKey].tasks.find(t => t.id === taskId);
            if (task) task.status = newStatus;
        }

        this.saveData();
        this.renderStats();
        this.renderContent();
        this.showToast("Estado de tarea actualizado.", "success");
    }

    updateTaskAssignee(taskId, newAssignee, companyKey = this.currentCompany) {
        if (companyKey === 'all') {
            Object.keys(this.data).forEach(k => {
                const task = this.data[k].tasks.find(t => t.id === taskId);
                if (task) task.assignedTo = newAssignee;
            });
        } else if (this.data[companyKey]) {
            const task = this.data[companyKey].tasks.find(t => t.id === taskId);
            if (task) task.assignedTo = newAssignee;
        }

        this.saveData();
        this.renderStats();
        this.renderContent();
        this.showToast(`Tarea reasignada a ${newAssignee}.`, "info");
    }

    // --- MODAL HANDLING ---
    openTaskModal(taskId = null, companyKey = this.currentCompany) {
        const modal = document.getElementById('task-modal');
        const titleElem = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        if (!modal || !form) return;

        form.reset();
        document.getElementById('task-id').value = '';

        // Populate company select
        const compSelect = document.getElementById('task-company');
        if (compSelect) {
            compSelect.value = companyKey === 'all' ? 'maverick' : companyKey;
        }

        if (taskId) {
            titleElem.textContent = "Editar Tarea";
            let task = null;
            const targetCompany = companyKey === 'all' ? 'maverick' : companyKey;
            
            if (this.data[targetCompany]) {
                task = this.data[targetCompany].tasks.find(t => t.id === taskId);
            }
            if (!task) {
                // Search across all
                Object.keys(this.data).forEach(k => {
                    const found = this.data[k].tasks.find(t => t.id === taskId);
                    if (found) {
                        task = found;
                        if (compSelect) compSelect.value = k;
                    }
                });
            }

            if (task) {
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-phase').value = task.phaseId;
                document.getElementById('task-assigned').value = task.assignedTo;
                document.getElementById('task-status').value = task.status;
                document.getElementById('task-priority').value = task.priority || 'media';
                document.getElementById('task-deadline').value = task.deadline || '';
                document.getElementById('task-desc').value = task.description || '';
                document.getElementById('task-deliverable').value = task.deliverable || '';
            }
        } else {
            titleElem.textContent = "Nueva Tarea de Cronograma";
        }

        modal.classList.remove('hidden');
    }

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.add('hidden');
    }

    handleTaskFormSubmit() {
        const id = document.getElementById('task-id').value;
        const compKey = document.getElementById('task-company').value || 'maverick';
        const title = document.getElementById('task-title').value;
        const phaseId = document.getElementById('task-phase').value;
        const assignedTo = document.getElementById('task-assigned').value;
        const status = document.getElementById('task-status').value;
        const priority = document.getElementById('task-priority').value;
        const deadline = document.getElementById('task-deadline').value;
        const description = document.getElementById('task-desc').value;
        const deliverable = document.getElementById('task-deliverable').value;

        if (!title.trim()) {
            alert("Por favor ingresa el título de la tarea.");
            return;
        }

        if (id) {
            // Edit existing task
            const task = this.data[compKey].tasks.find(t => t.id === id);
            if (task) {
                task.title = title;
                task.phaseId = phaseId;
                task.assignedTo = assignedTo;
                task.status = status;
                task.priority = priority;
                task.deadline = deadline;
                task.description = description;
                task.deliverable = deliverable;
            }
            this.showToast("Tarea editada correctamente.", "success");
        } else {
            // Create new task
            const newTask = {
                id: 'custom-' + Date.now(),
                title,
                phaseId,
                assignedTo,
                status,
                priority,
                deadline,
                description,
                deliverable
            };
            this.data[compKey].tasks.push(newTask);
            this.showToast("Nueva tarea agregada al cronograma.", "success");
        }

        this.saveData();
        this.closeTaskModal();
        this.renderStats();
        this.renderContent();
    }

    deleteTask(taskId, companyKey = this.currentCompany) {
        if (!confirm("¿Deseas eliminar esta tarea del cronograma?")) return;

        if (companyKey === 'all') {
            Object.keys(this.data).forEach(k => {
                this.data[k].tasks = this.data[k].tasks.filter(t => t.id !== taskId);
            });
        } else if (this.data[companyKey]) {
            this.data[companyKey].tasks = this.data[companyKey].tasks.filter(t => t.id !== taskId);
        }

        this.saveData();
        this.renderStats();
        this.renderContent();
        this.showToast("Tarea eliminada.", "info");
    }

    // --- DOWNLOADS & EXPORTS ---
    downloadFormattedBrief(companyKey) {
        const comp = this.data[companyKey];
        if (!comp) return;

        let content = `====================================================\n`;
        content += `FICHA TÉCNICA Y BRIEF DE IDENTIDAD VISUAL\n`;
        content += `EMPRESA: ${comp.name.toUpperCase()}\n`;
        content += `====================================================\n\n`;
        content += `1. DATOS GENERALES:\n`;
        content += `   - Ubicación: ${comp.location}\n`;
        content += `   - Contacto: ${comp.contact}\n`;
        content += `   - Propietario / Encargado: ${comp.owner}\n`;
        content += `   - Eslogan / Mensaje: "${comp.tagline}"\n\n`;
        content += `2. HISTORIA Y ORIGEN:\n   ${comp.brief.summary}\n\n`;
        content += `3. CLIENTE IDEAL Y PÚBLICO OBJETIVO:\n   ${comp.brief.targetAudience}\n\n`;
        content += `4. PROPUESTA DE VALOR Y DIFERENCIACIÓN:\n   ${comp.brief.valueProposition}\n\n`;
        content += `5. CONCEPTO DE LOGOTIPO:\n   ${comp.brief.logoConcept}\n\n`;
        content += `6. PALETA CROMÁTICA Y TIPOGRAFÍA:\n   - Paleta: ${comp.brief.colorPalette}\n   - Tipografía: ${comp.brief.typographyStyle}\n\n`;
        content += `7. PRODUCTOS CLAVE:\n`;
        comp.brief.keyProducts.forEach(p => content += `   * ${p}\n`);
        content += `\n8. PUNTOS DE CONTACTO Y APLICACIONES:\n`;
        comp.brief.applications.forEach(a => content += `   * ${a}\n`);
        content += `\n----------------------------------------------------\n`;
        content += `Equipo de Diseño Responsable: José Luis Vásquez, Marcela Castillo, Ezequiel Medrano.\n`;

        this.downloadFile(content, `Brief_${comp.name.replace(/\s+/g, '_')}.txt`, 'text/plain;charset=utf-8');
    }

    downloadCombinedBriefs() {
        this.downloadFormattedBrief('maverick');
        setTimeout(() => this.downloadFormattedBrief('franco'), 500);
    }

    exportToCSV() {
        const tasks = this.getTasks('all');
        let csv = "ID,Empresa,Fase,Tarea,Descripcion,Entregable,Encargado,Estado,Prioridad,Fecha Limite\n";
        
        tasks.forEach(t => {
            const phase = PHASES.find(p => p.id === t.phaseId) || { name: t.phaseId };
            const row = [
                `"${t.id}"`,
                `"${t.companyName || ''}"`,
                `"${phase.name}"`,
                `"${(t.title || '').replace(/"/g, '""')}"`,
                `"${(t.description || '').replace(/"/g, '""')}"`,
                `"${(t.deliverable || '').replace(/"/g, '""')}"`,
                `"${t.assignedTo || ''}"`,
                `"${t.status || ''}"`,
                `"${t.priority || ''}"`,
                `"${t.deadline || ''}"`
            ].join(',');
            csv += row + "\n";
        });

        this.downloadFile(csv, `Cronograma_Manual_Marca_${Date.now()}.csv`, 'text/csv;charset=utf-8');
        this.showToast("Cronograma exportado a CSV exitosamente.", "success");
    }

    exportToJSON() {
        const jsonStr = JSON.stringify(this.data, null, 2);
        this.downloadFile(jsonStr, `Cronograma_Backup_${Date.now()}.json`, 'application/json');
        this.showToast("Copia de seguridad en JSON descargada.", "success");
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        let bg = 'bg-slate-800 border-slate-700 text-white';
        if (type === 'success') bg = 'bg-emerald-600 border-emerald-500 text-white';
        else if (type === 'info') bg = 'bg-blue-600 border-blue-500 text-white';

        toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold flex items-center gap-2 transition-all transform duration-300 ${bg}`;
        toast.innerHTML = `<i data-lucide="info" class="w-4 h-4"></i> ${message}`;
        document.body.appendChild(toast);
        
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global App instance
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CronogramaApp();
});
