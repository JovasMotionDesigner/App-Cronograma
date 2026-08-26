/**
 * Main Application Logic - Cronograma Manual de Marca (Light Minimalist Edition)
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
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    loadData() {
        const stored = localStorage.getItem('crono_brand_data_light_v3');
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
        localStorage.setItem('crono_brand_data_light_v3', JSON.stringify(this.data));
    }

    resetData() {
        if (confirm("¿Deseas restablecer todas las tareas al estado inicial predeterminado?")) {
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

        // View switcher tabs
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
                btn.className = "px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-white text-slate-800 shadow-sm flex items-center gap-2";
            } else {
                btn.className = "px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 flex items-center gap-2 transition";
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
            btn.classList.remove('tab-active-maverick', 'tab-active-franco', 'tab-active-unified', 'text-slate-500', 'bg-transparent');
            
            if (comp === this.currentCompany) {
                if (comp === 'maverick') btn.classList.add('tab-active-maverick');
                else if (comp === 'franco') btn.classList.add('tab-active-franco');
                else btn.classList.add('tab-active-unified');
            } else {
                btn.classList.add('text-slate-500', 'bg-transparent');
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
                <div class="p-6 md:p-8 rounded-3xl minimal-panel relative overflow-hidden bg-white shadow-sm">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-purple-50 text-purple-700">Vista Global Unificada</span>
                                <span class="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">2 Empresas Salvadoreñas</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Cronograma de Identidad: Artesanías Maverick & Variedades Franco</h1>
                            <p class="text-slate-500 mt-2 max-w-3xl text-sm leading-relaxed">
                                Planificación, seguimiento colaborativo y control de entregables para la elaboración del manual de marca de ambas empresas del Mercado Sagrado Corazón.
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center">
                            <button onclick="app.downloadCombinedBriefs()" class="px-5 py-3 bg-grad-purple text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:opacity-95 transition flex items-center gap-2">
                                <i data-lucide="file-down" class="w-4 h-4"></i> Descargar Ambos Briefs
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const comp = this.data[this.currentCompany];
            const isMav = this.currentCompany === 'maverick';
            const gradClass = isMav ? 'bg-grad-cyan shadow-cyan-500/20' : 'bg-grad-amber shadow-amber-500/20';

            headerContainer.innerHTML = `
                <div class="p-6 md:p-8 rounded-3xl minimal-panel relative overflow-hidden bg-white shadow-sm">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${comp.theme.lightBadge}">${comp.badge}</span>
                                <span class="text-xs text-slate-500 flex items-center gap-1 font-medium"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${comp.location}</span>
                            </div>
                            <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">${comp.name}</h1>
                            <p class="text-slate-500 font-medium italic text-sm mt-1">"${comp.tagline}"</p>
                            <div class="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
                                <span><strong>Contacto:</strong> ${comp.contact}</span>
                                <span>•</span>
                                <span><strong>Responsable:</strong> ${comp.owner}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-3 items-center">
                            <a href="${comp.docFile}" download class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center gap-2">
                                <i data-lucide="download" class="w-4 h-4 text-slate-500"></i> DOCX Original
                            </a>
                            <button onclick="app.setView('brief')" class="px-5 py-3 ${gradClass} text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition hover:opacity-95 flex items-center gap-2">
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

        // Clean Vibrant SaaS Cards like the screenshot reference!
        statsContainer.innerHTML = `
            <!-- Card 1: Avance Global (Pink/Rose Gradient) -->
            <div class="p-6 rounded-3xl bg-grad-pink text-white shadow-lg shadow-pink-500/15 relative overflow-hidden flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-pink-100">Avance General</p>
                        <h3 class="text-3xl font-extrabold mt-1 text-white">${pct}%</h3>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <i data-lucide="trending-up" class="w-6 h-6"></i>
                    </div>
                </div>
                <div class="w-full bg-black/15 h-2 rounded-full mt-4 overflow-hidden">
                    <div class="bg-white h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
                <p class="text-xs text-pink-100 font-medium mt-2">${completadas} de ${total} tareas completadas</p>
            </div>

            <!-- Card 2: En Proceso (Purple/Indigo Gradient) -->
            <div class="p-6 rounded-3xl bg-grad-purple text-white shadow-lg shadow-purple-500/15 relative overflow-hidden flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-purple-100">En Proceso</p>
                        <h3 class="text-3xl font-extrabold mt-1 text-white">${enProceso}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-purple-100 font-medium mt-4">Actividades en desarrollo activo</p>
            </div>

            <!-- Card 3: En Revisión (Cyan/Blue Gradient) -->
            <div class="p-6 rounded-3xl bg-grad-cyan text-white shadow-lg shadow-cyan-500/15 relative overflow-hidden flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-sky-100">En Revisión</p>
                        <h3 class="text-3xl font-extrabold mt-1 text-white">${enRevision}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <i data-lucide="eye" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-sky-100 font-medium mt-4">Listas para control de calidad</p>
            </div>

            <!-- Card 4: Pendientes (Amber/Orange Gradient) -->
            <div class="p-6 rounded-3xl bg-grad-amber text-white shadow-lg shadow-amber-500/15 relative overflow-hidden flex flex-col justify-between">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-amber-100">Pendientes</p>
                        <h3 class="text-3xl font-extrabold mt-1 text-white">${pendientes}</h3>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <i data-lucide="list-todo" class="w-6 h-6"></i>
                    </div>
                </div>
                <p class="text-xs text-amber-100 font-medium mt-4">Próximas entregas programadas</p>
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
                <div class="p-12 text-center minimal-panel rounded-3xl bg-white">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <i data-lucide="search-x" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">No se encontraron tareas</h3>
                    <p class="text-sm text-slate-400 mt-1">Prueba cambiando los filtros de búsqueda o agrega una nueva tarea.</p>
                </div>
            `;
            return;
        }

        let html = '<div class="space-y-6">';
        
        PHASES.forEach(phase => {
            const phaseTasks = tasks.filter(t => t.phaseId === phase.id);
            if (phaseTasks.length === 0) return;

            const completedInPhase = phaseTasks.filter(t => t.status === 'completada').length;
            const phasePct = Math.round((completedInPhase / phaseTasks.length) * 100);

            html += `
                <div class="minimal-panel rounded-3xl p-6 bg-white shadow-sm space-y-4">
                    
                    <!-- Phase Header -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl ${phase.bg} flex items-center justify-center font-extrabold text-sm shadow-sm">
                                ${phase.number}
                            </div>
                            <div>
                                <h2 class="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    ${phase.name}
                                </h2>
                                <p class="text-xs text-slate-400 font-medium">${phaseTasks.length} actividades programadas en esta fase</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="text-right">
                                <span class="text-xs font-bold text-slate-600">${completedInPhase}/${phaseTasks.length} Completadas (${phasePct}%)</span>
                                <div class="w-32 bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                                    <div class="bg-emerald-500 h-full rounded-full transition-all" style="width: ${phasePct}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tasks Table / Rows -->
                    <div class="space-y-3">
                        ${phaseTasks.map(task => this.renderTaskRow(task)).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    renderTaskRow(task) {
        const assignedMember = TEAM_MEMBERS.find(m => m.name === task.assignedTo) || TEAM_MEMBERS[0];
        
        let priorityColor = "bg-slate-100 text-slate-600";
        if (task.priority === 'alta') priorityColor = "bg-rose-50 text-rose-600 font-bold";
        else if (task.priority === 'media') priorityColor = "bg-amber-50 text-amber-600 font-bold";

        const companyBadge = task.companyName ? `
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700">
                ${task.companyName}
            </span>
        ` : '';

        return `
            <div class="p-4 rounded-2xl minimal-card bg-slate-50/70 hover:bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition" id="task-${task.id}">
                <div class="flex-1 space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                        ${companyBadge}
                        <span class="px-2.5 py-0.5 text-[11px] font-bold rounded-full ${priorityColor}">
                            Prioridad ${task.priority || 'Normal'}
                        </span>
                        <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i> ${task.deadline || 'En curso'}
                        </span>
                    </div>

                    <h4 class="text-sm font-bold text-slate-900">${task.title}</h4>
                    <p class="text-xs text-slate-600 leading-relaxed">${task.description}</p>
                    
                    <div class="p-2.5 rounded-xl bg-white shadow-sm flex items-start gap-2 mt-2">
                        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                        <div class="text-xs">
                            <strong class="text-slate-800">Entregable:</strong>
                            <span class="text-slate-600 ml-1 font-medium">${task.deliverable}</span>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                    
                    <!-- Assignee Selector -->
                    <div class="w-full sm:w-auto">
                        <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Encargado</label>
                        <select onchange="app.updateTaskAssignee('${task.id}', this.value, '${task.companyId || this.currentCompany}')" 
                                class="custom-select-light w-full sm:w-48 text-xs px-3 py-2">
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
                                class="custom-select-light w-full sm:w-40 text-xs px-3 py-2 badge-${task.status}">
                            ${TASK_STATUSES.map(s => `
                                <option value="${s.id}" class="bg-white text-slate-800" ${task.status === s.id ? 'selected' : ''}>
                                    ${s.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-1 self-end sm:self-center mt-3 sm:mt-4">
                        <button onclick="app.openTaskModal('${task.id}', '${task.companyId || this.currentCompany}')" title="Editar Tarea" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="app.deleteTask('${task.id}', '${task.companyId || this.currentCompany}')" title="Eliminar Tarea" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition">
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
                        <div class="minimal-panel rounded-3xl p-5 bg-white shadow-sm flex flex-col h-full min-h-[600px]">
                            
                            <!-- Column Header -->
                            <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full ${status.dot}"></span>
                                    <h3 class="font-extrabold text-sm text-slate-800">${status.label}</h3>
                                </div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
                                    ${colTasks.length}
                                </span>
                            </div>

                            <!-- Tasks list in column -->
                            <div class="space-y-3 flex-1 overflow-y-auto pr-1">
                                ${colTasks.length === 0 ? `
                                    <div class="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
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
            <div class="p-4 rounded-2xl minimal-card bg-slate-50/90 hover:bg-white shadow-sm space-y-3 transition">
                <div class="flex items-center justify-between gap-2">
                    <span class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-lg ${phase.bg}">
                        ${phase.name}
                    </span>
                    <span class="text-[11px] text-slate-400 font-semibold">${task.deadline || ''}</span>
                </div>

                <h4 class="text-sm font-bold text-slate-900 line-clamp-2">${task.title}</h4>
                <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">${task.description}</p>

                <div class="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full ${assignedMember.color} text-[10px] font-bold flex items-center justify-center shadow-sm">
                            ${assignedMember.avatar}
                        </div>
                        <span class="text-xs text-slate-600 font-bold truncate max-w-[100px]">${task.assignedTo.split(' ')[0]}</span>
                    </div>

                    <select onchange="app.updateTaskStatus('${task.id}', this.value, '${task.companyId || this.currentCompany}')" 
                            class="custom-select-light text-[11px] font-bold px-2 py-1 badge-${task.status}">
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
                        <div class="minimal-panel rounded-3xl p-6 md:p-8 bg-white shadow-sm space-y-8">
                            
                            <!-- Header Brief -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                <div>
                                    <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-700">
                                        Ficha de Identidad & ADN
                                    </span>
                                    <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">${comp.name}</h2>
                                    <p class="text-slate-500 text-sm mt-1">Ubicación: ${comp.location} | Contacto: ${comp.contact}</p>
                                </div>
                                <div class="flex flex-wrap gap-3">
                                    <button onclick="app.downloadFormattedBrief('${key}')" class="px-5 py-3 bg-grad-purple text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:opacity-95 transition flex items-center gap-2">
                                        <i data-lucide="file-text" class="w-4 h-4"></i> Descargar Ficha (.txt)
                                    </button>
                                    <a href="${comp.docFile}" download class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition flex items-center gap-2">
                                        <i data-lucide="download" class="w-4 h-4 text-slate-500"></i> DOCX Original
                                    </a>
                                </div>
                            </div>

                            <!-- Grid of Brief Sections -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                
                                <!-- Historia y Propósito -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-sky-600 font-bold text-sm">
                                        <i data-lucide="history" class="w-4 h-4"></i> Historia & Origen
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">${comp.brief.summary}</p>
                                </div>

                                <!-- Propuesta de Valor -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-amber-600 font-bold text-sm">
                                        <i data-lucide="award" class="w-4 h-4"></i> Propuesta de Valor
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">${comp.brief.valueProposition}</p>
                                </div>

                                <!-- Público Objetivo -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-purple-600 font-bold text-sm">
                                        <i data-lucide="users" class="w-4 h-4"></i> Cliente Ideal / Público
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">${comp.brief.targetAudience}</p>
                                </div>

                                <!-- Concepto de Logotipo -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                        <i data-lucide="sparkles" class="w-4 h-4"></i> Concepto de Logotipo
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">${comp.brief.logoConcept}</p>
                                </div>

                                <!-- Paleta y Tipografía -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-rose-600 font-bold text-sm">
                                        <i data-lucide="palette" class="w-4 h-4"></i> Paleta & Estilo Visual
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">${comp.brief.colorPalette}</p>
                                    <p class="text-xs text-slate-500 mt-2 font-bold">Tipografía: <span class="font-normal text-slate-700">${comp.brief.typographyStyle}</span></p>
                                </div>

                                <!-- Productos Clave -->
                                <div class="p-6 rounded-2xl bg-slate-50/80 space-y-2">
                                    <div class="flex items-center gap-2 text-teal-600 font-bold text-sm">
                                        <i data-lucide="box" class="w-4 h-4"></i> Productos Clave
                                    </div>
                                    <ul class="text-xs text-slate-600 space-y-1.5 font-medium">
                                        ${comp.brief.keyProducts.map(p => `<li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> ${p}</li>`).join('')}
                                    </ul>
                                </div>

                            </div>

                            <!-- Puntos de Contacto -->
                            <div class="p-6 rounded-2xl bg-slate-50/80">
                                <h4 class="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                                    <i data-lucide="layers" class="w-4 h-4 text-purple-600"></i> Puntos de Contacto y Aplicaciones Requeridas
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    ${comp.brief.applications.map(app => `
                                        <div class="p-3 rounded-xl bg-white shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-2">
                                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-purple-500"></i>
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
                <div class="minimal-panel rounded-3xl p-6 md:p-8 bg-white shadow-sm">
                    <h3 class="text-xl font-extrabold text-slate-900 mb-2">Carga de Trabajo por Integrante</h3>
                    <p class="text-xs text-slate-400 mb-6">Métricas de desempeño y avance individual de José Luis Vásquez, Marcela Castillo y Ezequiel Medrano.</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        ${memberStats.map(m => `
                            <div class="p-6 rounded-2xl minimal-card bg-slate-50/90 hover:bg-white shadow-sm space-y-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-2xl ${m.color} font-extrabold text-sm flex items-center justify-center shadow-md">
                                        ${m.avatar}
                                    </div>
                                    <div>
                                        <h4 class="font-extrabold text-slate-900 text-sm">${m.name}</h4>
                                        <p class="text-[11px] text-slate-500 font-semibold">${m.role}</p>
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs font-bold">
                                        <span class="text-slate-600">Avance Individual</span>
                                        <span class="text-emerald-600">${m.pct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div class="bg-emerald-500 h-full rounded-full" style="width: ${m.pct}%"></div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                                    <div class="p-2.5 rounded-xl bg-white shadow-sm">
                                        <span class="text-slate-400 block text-[10px] font-bold uppercase">Total</span>
                                        <strong class="text-slate-900 text-base">${m.total}</strong>
                                    </div>
                                    <div class="p-2.5 rounded-xl bg-white shadow-sm">
                                        <span class="text-slate-400 block text-[10px] font-bold uppercase">Completadas</span>
                                        <strong class="text-emerald-600 text-base">${m.done}</strong>
                                    </div>
                                    <div class="p-2.5 rounded-xl bg-white shadow-sm">
                                        <span class="text-slate-400 block text-[10px] font-bold uppercase">En Proceso</span>
                                        <strong class="text-amber-600 text-base">${m.inProg}</strong>
                                    </div>
                                    <div class="p-2.5 rounded-xl bg-white shadow-sm">
                                        <span class="text-slate-400 block text-[10px] font-bold uppercase">En Revisión</span>
                                        <strong class="text-blue-600 text-base">${m.rev}</strong>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Resumen de Fases -->
                <div class="minimal-panel rounded-3xl p-6 md:p-8 bg-white shadow-sm">
                    <h3 class="text-xl font-extrabold text-slate-900 mb-6">Estado de las 8 Fases del Proyecto</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        ${PHASES.map(phase => {
                            const pTasks = tasks.filter(t => t.phaseId === phase.id);
                            const done = pTasks.filter(t => t.status === 'completada').length;
                            const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                            return `
                                <div class="p-4 rounded-2xl bg-slate-50/80 hover:bg-white shadow-sm transition">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="w-6 h-6 rounded-lg ${phase.bg} text-xs font-bold flex items-center justify-center">
                                            ${phase.number}
                                        </span>
                                        <h5 class="text-xs font-bold text-slate-800 truncate">${phase.name}</h5>
                                    </div>
                                    <div class="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                                        <span>${done}/${pTasks.length} tareas</span>
                                        <span class="font-bold text-slate-800">${pct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div class="bg-emerald-500 h-full rounded-full" style="width: ${pct}%"></div>
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
        this.showToast("Estado actualizado.", "success");
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
        this.showToast(`Asignado a ${newAssignee}.`, "info");
    }

    // --- MODAL HANDLING ---
    openTaskModal(taskId = null, companyKey = this.currentCompany) {
        const modal = document.getElementById('task-modal');
        const titleElem = document.getElementById('modal-title');
        const form = document.getElementById('task-form');
        
        if (!modal || !form) return;

        form.reset();
        document.getElementById('task-id').value = '';

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
        this.showToast("Cronograma exportado a CSV.", "success");
    }

    exportToJSON() {
        const jsonStr = JSON.stringify(this.data, null, 2);
        this.downloadFile(jsonStr, `Cronograma_Backup_${Date.now()}.json`, 'application/json');
        this.showToast("Copia JSON descargada.", "success");
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
        let bg = 'bg-slate-800 text-white';
        if (type === 'success') bg = 'bg-emerald-600 text-white';
        else if (type === 'info') bg = 'bg-pink-600 text-white';

        toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 transition-all transform duration-300 ${bg}`;
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

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CronogramaApp();
});
