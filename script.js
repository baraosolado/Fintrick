// Espera o DOM (estrutura HTML) carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    console.log("FinTrack App Inicializado!");

    // --- Seletores de Elementos DOM ---
    const loginPage = document.getElementById('login-page');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const mainHeader = document.querySelector('header');
    const mainContent = document.querySelector('main');
    const fabButton = document.getElementById('fab-add-transaction');
    const navLinks = document.querySelectorAll('#main-nav a');
    const pageSections = document.querySelectorAll('.page-section');
    const logoutButton = document.getElementById('logout-button');
    const body = document.body;

    // Dashboard
    const dashboardMonthFilter = document.getElementById('dashboard-month-filter');
    const dashboardMonthDisplay = document.getElementById('dashboard-month-display');
    const summaryCardsContainer = document.querySelector('#dashboard-page .summary-cards');
    // Adicionar seletores para os containers de gráficos no dashboard se houver
    // const expenseChartContainer = document.getElementById('expense-chart-container'); // Exemplo

    // Transações
    const transactionsTableBody = document.getElementById('transactions-table-body');
    const filterForm = document.getElementById('filter-form');
    const filterStartDate = document.getElementById('filter-start-date');
    const filterEndDate = document.getElementById('filter-end-date');
    const filterType = document.getElementById('filter-type');
    const filterCategory = document.getElementById('filter-category');
    const filterButton = document.getElementById('filter-transactions-btn');
    const clearFilterButton = document.getElementById('clear-filter-btn');

    // Orçamentos
    const budgetFilterMonthInput = document.getElementById('budget-filter-month');
    const viewBudgetButton = document.getElementById('view-budget-btn');
    const budgetListTitle = document.getElementById('budget-list-title');
    const budgetsListContainer = document.getElementById('budgets-list-container');

    // Metas
    const goalsListContainer = document.getElementById('goals-list-container');

    // Relatórios
    const generateReportButton = document.getElementById('generate-report-btn');
    const reportOutputArea = document.getElementById('report-output-area');

    // Modais e Formulários
    const transactionModal = document.getElementById('transaction-modal');
    const transactionForm = document.getElementById('transaction-form');
    const transactionModalTitle = document.getElementById('transaction-modal-title');
    const transactionIdInput = document.getElementById('transaction-id');
    const transactionTypeSelect = document.getElementById('transaction-type');
    const transactionCategorySelect = document.getElementById('transaction-category'); // Categoria no modal de transação
    const transactionDescriptionInput = document.getElementById('transaction-description');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionDateInput = document.getElementById('transaction-date');

    const budgetModal = document.getElementById('budget-modal');
    const budgetForm = document.getElementById('budget-form');
    const budgetModalTitle = document.getElementById('budget-modal-title');
    const budgetIdInput = document.getElementById('budget-id');
    const budgetCategorySelect = document.getElementById('budget-category'); // Categoria no modal de orçamento
    const budgetAmountInput = document.getElementById('budget-amount');
    const budgetMonthInput = document.getElementById('budget-month'); // Mês no modal de orçamento

    const goalModal = document.getElementById('goal-modal');
    const goalForm = document.getElementById('goal-form');
    const goalModalTitle = document.getElementById('goal-modal-title');
    const goalIdInput = document.getElementById('goal-id');
    const goalNameInput = document.getElementById('goal-name');
    const goalTargetAmountInput = document.getElementById('goal-target-amount');
    const goalCurrentAmountInput = document.getElementById('goal-current-amount');
    const goalDeadlineInput = document.getElementById('goal-deadline');

    const addGoalValueModal = document.getElementById('add-goal-value-modal');
    const addGoalValueForm = document.getElementById('add-goal-value-form');
    const addValueGoalIdInput = document.getElementById('add-value-goal-id');
    const addValueGoalName = document.getElementById('add-value-goal-name');
    const addValueGoalCurrent = document.getElementById('add-value-goal-current');
    const addValueGoalTarget = document.getElementById('add-value-goal-target');
    const goalValueToAddInput = document.getElementById('goal-value-to-add');

    // --- Estado da Aplicação ---
    let state = {
        isLoggedIn: false,
        currentPage: 'dashboard-page',
        transactions: [],
        budgets: [],
        goals: [],
        categories: { // Categorias padrão (podem ser gerenciadas em Configurações)
            income: [
                { id: 'salary', name: 'Salário' },
                { id: 'investment', name: 'Investimento' },
                { id: 'gift', name: 'Presente' },
                { id: 'other-income', name: 'Outra Receita' }
            ],
            expense: [
                { id: 'food', name: 'Alimentação', class: 'category-food' },
                { id: 'housing', name: 'Moradia', class: 'category-housing' },
                { id: 'transport', name: 'Transporte', class: 'category-transport' },
                { id: 'health', name: 'Saúde', class: 'category-health' },
                { id: 'leisure', name: 'Lazer', class: 'category-leisure' },
                { id: 'education', name: 'Educação', class: 'category-education' },
                { id: 'other-expense', name: 'Outra Despesa', class: 'category-other' }
            ]
        },
        currentEditingId: null, // Para saber qual item está sendo editado
        charts: {} // Para guardar instâncias dos gráficos Chart.js
    };

    // --- Funções de Persistência (localStorage) ---
    function saveData() {
        try {
            const dataToSave = {
                isLoggedIn: state.isLoggedIn,
                transactions: state.transactions,
                budgets: state.budgets,
                goals: state.goals,
                categories: state.categories // Salvar categorias se forem editáveis
            };
            localStorage.setItem('finTrackData', JSON.stringify(dataToSave));
            console.log("Dados salvos no localStorage.");
        } catch (error) {
            console.error("Erro ao salvar dados no localStorage:", error);
            // Informar usuário sobre o problema pode ser útil
        }
    }

    function loadData() {
        try {
            const savedData = localStorage.getItem('finTrackData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Atualiza o estado, mas mantém categorias padrão se não salvas
                state.isLoggedIn = parsedData.isLoggedIn || false;
                state.transactions = parsedData.transactions || [];
                state.budgets = parsedData.budgets || [];
                state.goals = parsedData.goals || [];
                state.categories = parsedData.categories || state.categories; // Usa padrão se não houver salvo
                console.log("Dados carregados do localStorage.");
            } else {
                console.log("Nenhum dado salvo encontrado. Usando estado inicial.");
                // Garante que o estado inicial de login seja falso se não houver dados
                state.isLoggedIn = false;
            }
        } catch (error) {
            console.error("Erro ao carregar dados do localStorage:", error);
            state.isLoggedIn = false; // Garante estado de deslogado em caso de erro
        }
    }

    // --- Funções de Utilidade ---
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(dateString) { // Formato YYYY-MM-DD para DD/MM/YYYY
        if (!dateString || !dateString.includes('-')) return 'N/A';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

     function formatMonthYear(monthString) { // Formato YYYY-MM para Mês/YYYY
        if (!monthString || !monthString.includes('-')) return 'N/A';
        const [year, month] = monthString.split('-');
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    function getCurrentMonthYear() { // Formato YYYY-MM
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    function getCategoryInfo(categoryId) {
        let category = state.categories.income.find(c => c.id === categoryId);
        if (category) return { ...category, type: 'income' };
        category = state.categories.expense.find(c => c.id === categoryId);
        if (category) return { ...category, type: 'expense' };
        return { id: categoryId, name: 'Desconhecida', class: 'category-other', type: 'unknown' };
    }

    function generateId() {
        return Date.now().toString(); // ID simples baseado no timestamp
    }

    // --- Funções de Gerenciamento de Estado (CRUD) ---

    // Transações
    function addTransaction(transactionData) {
        const newTransaction = {
            id: generateId(),
            ...transactionData
        };
        state.transactions.push(newTransaction);
        saveData();
        updateUI();
    }

    function updateTransaction(id, updatedData) {
        state.transactions = state.transactions.map(t =>
            t.id === id ? { ...t, ...updatedData } : t
        );
        saveData();
        updateUI();
    }

    function deleteTransaction(id) {
        state.transactions = state.transactions.filter(t => t.id !== id);
        saveData();
        updateUI();
    }

    // Orçamentos
    function addBudget(budgetData) {
         // Verifica se já existe orçamento para essa categoria e mês
         const existing = state.budgets.find(b => b.category === budgetData.category && b.month === budgetData.month);
         if (existing) {
             alert(`Já existe um orçamento para ${getCategoryInfo(budgetData.category).name} em ${formatMonthYear(budgetData.month)}.`);
             return false; // Impede adição
         }
        const newBudget = { id: generateId(), ...budgetData };
        state.budgets.push(newBudget);
        saveData();
        renderBudgets(); // Re-renderiza apenas a seção de orçamentos
        return true;
    }

    function updateBudget(id, updatedData) {
        // Verifica duplicidade se categoria ou mês mudou
        const originalBudget = state.budgets.find(b => b.id === id);
        if ( (updatedData.category && updatedData.category !== originalBudget.category) ||
             (updatedData.month && updatedData.month !== originalBudget.month) )
        {
            const checkCategory = updatedData.category || originalBudget.category;
            const checkMonth = updatedData.month || originalBudget.month;
            const existing = state.budgets.find(b => b.id !== id && b.category === checkCategory && b.month === checkMonth);
            if (existing) {
                alert(`Já existe um orçamento para ${getCategoryInfo(checkCategory).name} em ${formatMonthYear(checkMonth)}.`);
                return false;
            }
        }

        state.budgets = state.budgets.map(b =>
            b.id === id ? { ...b, ...updatedData } : b
        );
        saveData();
        renderBudgets();
        return true;
    }

     function deleteBudget(id) {
        state.budgets = state.budgets.filter(b => b.id !== id);
        saveData();
        renderBudgets();
    }

    // Metas
     function addGoal(goalData) {
        const newGoal = { id: generateId(), ...goalData };
        state.goals.push(newGoal);
        saveData();
        renderGoals();
    }

     function updateGoal(id, updatedData) {
        state.goals = state.goals.map(g =>
            g.id === id ? { ...g, ...updatedData } : g
        );
        saveData();
        renderGoals();
    }

    function deleteGoal(id) {
        state.goals = state.goals.filter(g => g.id !== id);
        saveData();
        renderGoals();
    }

    function addValueToGoal(id, valueToAdd) {
        state.goals = state.goals.map(g =>
            g.id === id ? { ...g, currentAmount: g.currentAmount + valueToAdd } : g
        );
        saveData();
        renderGoals();
    }


    // --- Funções de Renderização da UI ---

    // Atualiza toda a UI (chamada após login, CRUD, filtros)
    function updateUI() {
        if (!state.isLoggedIn) return;
        console.log("Atualizando UI completa...");
        renderDashboard();
        renderTransactions(); // Renderiza com filtros atuais ou todos
        renderBudgets();
        renderGoals();
        // renderReports(); // Placeholder
        // renderSettings(); // Placeholder
        populateCategoryFilters();
        populateCategorySelectsInForms(); // Preenche selects dos modais
    }

    // Dashboard
    function renderDashboard() {
        const selectedMonth = dashboardMonthFilter.value;
        dashboardMonthDisplay.textContent = `Visão geral para ${formatMonthYear(selectedMonth)}`;

        // 1. Cards de Resumo
        renderSummaryCards(selectedMonth);

        // 2. Gráficos (Exemplos - precisam de containers no HTML)
        renderExpenseChart(selectedMonth);
        // renderIncomeVsExpenseChart(selectedMonth);
        // renderBudgetProgressChart(selectedMonth);
    }

    function renderSummaryCards(month) {
        const transactionsOfMonth = state.transactions.filter(t => t.date.startsWith(month));
        const totalIncome = transactionsOfMonth
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactionsOfMonth
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;

        summaryCardsContainer.innerHTML = `
            <div class="summary-card income">
                <h3>Receita Total</h3>
                <div class="summary-amount">${formatCurrency(totalIncome)}</div>
            </div>
            <div class="summary-card expense">
                <h3>Despesa Total</h3>
                <div class="summary-amount">${formatCurrency(totalExpense)}</div>
            </div>
            <div class="summary-card balance">
                <h3>Saldo do Mês</h3>
                <div class="summary-amount ${balance >= 0 ? 'income' : 'expense'}">${formatCurrency(balance)}</div>
            </div>
        `;
    }

    // Transações
    function renderTransactions(transactionsToRender = filterTransactions()) {
        if (!transactionsTableBody) return;
        transactionsTableBody.innerHTML = ''; // Limpa tabela

        if (transactionsToRender.length === 0) {
            transactionsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma transação encontrada.</td></tr>';
            return;
        }

        transactionsToRender.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por data desc

        transactionsToRender.forEach(t => {
            const row = document.createElement('tr');
            const category = getCategoryInfo(t.category);
            const typeClass = t.type === 'income' ? 'income' : 'expense';
            const sign = t.type === 'income' ? '+' : '-';

            row.innerHTML = `
                <td>${formatDate(t.date)}</td>
                <td>${t.description}</td>
                <td><span class="category-tag ${category.class || 'category-other'}">${category.name}</span></td>
                <td class="${typeClass}" style="text-align: right;">${sign} ${formatCurrency(t.amount)}</td>
                <td class="action-buttons" style="text-align: center;">
                    <button class="btn btn-warning btn-sm edit-transaction-btn" data-id="${t.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-transaction-btn" data-id="${t.id}">Excluir</button>
                </td>
            `;
            transactionsTableBody.appendChild(row);
        });
    }

    // Orçamentos
    function renderBudgets() {
        const selectedMonth = budgetFilterMonthInput.value;
        budgetListTitle.textContent = `Orçamentos para ${formatMonthYear(selectedMonth)}`;
        budgetsListContainer.innerHTML = ''; // Limpa container

        const budgetsOfMonth = state.budgets.filter(b => b.month === selectedMonth);

         if (budgetsOfMonth.length === 0) {
            budgetsListContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhum orçamento definido para este mês.</p>';
            return;
        }

        // Calcula gastos para cada categoria no mês selecionado
        const expensesOfMonthByCategory = state.transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(selectedMonth))
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        budgetsOfMonth.forEach(b => {
            const category = getCategoryInfo(b.category);
            const spentAmount = expensesOfMonthByCategory[b.category] || 0;
            const percentage = Math.min((spentAmount / b.amountLimit) * 100, 100); // Não passa de 100% visualmente

            let progressClass = 'progress-safe';
            if (percentage > 90) progressClass = 'progress-danger';
            else if (percentage > 70) progressClass = 'progress-warning';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="budget-progress">
                    <div class="budget-header">
                        <span><span class="category-tag ${category.class || 'category-other'}">${category.name}</span></span>
                        <span title="Gasto / Limite">${formatCurrency(spentAmount)} / ${formatCurrency(b.amountLimit)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="action-buttons" style="text-align: right; margin-top: 0.5rem;">
                        <button class="btn btn-warning btn-sm edit-budget-btn" data-id="${b.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-budget-btn" data-id="${b.id}">Excluir</button>
                    </div>
                </div>
            `;
            budgetsListContainer.appendChild(card);
        });
    }

    // Metas
    function renderGoals() {
        goalsListContainer.innerHTML = ''; // Limpa

         if (state.goals.length === 0) {
            goalsListContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhuma meta definida ainda.</p>';
            return;
        }

        state.goals.forEach(g => {
            const percentage = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
            let progressClass = 'progress-safe'; // Pode adicionar lógica de cor aqui se quiser

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="goal-progress">
                    <div class="goal-header">
                        <span>${g.name}</span>
                        <small>Meta: ${formatCurrency(g.targetAmount)}</small>
                    </div>
                    <span>${formatCurrency(g.currentAmount)} (${percentage.toFixed(0)}%)</span>
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
                    </div>
                    <small>Prazo: ${g.deadline ? formatMonthYear(g.deadline) : 'Não definido'}</small>
                    <div class="action-buttons" style="text-align: right; margin-top: 0.5rem;">
                        <button class="btn btn-success btn-sm add-goal-value-btn" data-id="${g.id}">Adicionar Valor</button>
                        <button class="btn btn-warning btn-sm edit-goal-btn" data-id="${g.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-goal-btn" data-id="${g.id}">Excluir</button> </div>
                </div>
            `;
            goalsListContainer.appendChild(card);
        });
    }

    // Relatórios (Placeholder)
    function renderReports() {
        reportOutputArea.innerHTML = '<p>Funcionalidade de relatórios ainda não implementada.</p>';
        // Aqui você poderia gerar tabelas, textos ou gráficos com base nos dados
        // Ex: Um resumo anual, evolução do patrimônio, etc.
    }

    // --- Funções de Gráficos (Exemplos com Chart.js) ---

    // Gráfico de Pizza de Despesas por Categoria
    function renderExpenseChart(month) {
        const chartContainerId = 'expense-chart-container'; // **Precisa de um <canvas id="expense-chart-container"> no HTML do Dashboard**
        const canvas = document.getElementById(chartContainerId);
        if (!canvas) {
            console.warn(`Elemento canvas #${chartContainerId} não encontrado para o gráfico de despesas.`);
            // Opcional: Criar o canvas dinamicamente ou mostrar mensagem no lugar
             const dashboardGrid = document.querySelector('#dashboard-page .dashboard'); // Pega o primeiro grid
             if (dashboardGrid && !document.getElementById(chartContainerId)) {
                const chartCard = document.createElement('div');
                chartCard.className = 'card';
                chartCard.innerHTML = `
                    <div class="card-header"><div class="card-title">Despesas por Categoria (${formatMonthYear(month)})</div></div>
                    <div class="chart-container">
                        <canvas id="${chartContainerId}"></canvas>
                    </div>`;
                dashboardGrid.appendChild(chartCard); // Adiciona o card ao dashboard
             } else if (!dashboardGrid) {
                 console.error("Não foi possível encontrar o container .dashboard para adicionar o gráfico.");
                 return;
             }
        }

        const ctx = document.getElementById(chartContainerId).getContext('2d');

        // Destruir gráfico anterior se existir
        if (state.charts[chartContainerId]) {
            state.charts[chartContainerId].destroy();
        }

        // Preparar dados
        const expensesOfMonth = state.transactions.filter(t => t.type === 'expense' && t.date.startsWith(month));
        const expensesByCategory = expensesOfMonth.reduce((acc, t) => {
            const categoryName = getCategoryInfo(t.category).name;
            acc[categoryName] = (acc[categoryName] || 0) + t.amount;
            return acc;
        }, {});

        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory);

        if (labels.length === 0) {
             // Opcional: Mostrar mensagem "Sem dados" no lugar do gráfico
             ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpa canvas
             ctx.font = "16px 'Segoe UI'";
             ctx.fillStyle = "#888";
             ctx.textAlign = "center";
             ctx.fillText("Sem dados de despesa para este mês.", ctx.canvas.width / 2, ctx.canvas.height / 2);
             return; // Sai se não houver dados
        }

        // Cores (poderia pegar das categorias)
        const backgroundColors = labels.map(label => {
             const catInfo = Object.values(state.categories.expense).find(c => c.name === label);
             // Usar cores definidas no CSS se possível, ou gerar/definir cores padrão
             const colorMap = {
                'Alimentação': '#FF9800', 'Moradia': '#9C27B0', 'Transporte': '#03A9F4',
                'Saúde': '#E91E63', 'Lazer': '#8BC34A', 'Educação': '#3F51B5',
                'Outra Despesa': '#795548'
             };
             return colorMap[label] || '#cccccc'; // Cor padrão
        });


        state.charts[chartContainerId] = new Chart(ctx, {
            type: 'doughnut', // ou 'pie'
            data: {
                labels: labels,
                datasets: [{
                    label: 'Despesas',
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Adicionar mais funções de gráfico (Receita x Despesa, Progresso Orçamento) aqui...


    // --- Funções de Interação (Login, Navegação, Modais, Filtros) ---

    function handleLogin(event) {
        event.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // --- Validação Simples (HARDCODED) ---
        if (email === 'usuario@teste.com' && password === '1234') {
            state.isLoggedIn = true;
            saveData(); // Salva o estado de login
            loginPage.style.display = 'none';
            body.classList.add('logged-in');
            setDefaultFilters(); // Define filtros padrão (ex: mês atual)
            navigateTo(state.currentPage); // Vai para a última página visitada ou dashboard
            updateUI(); // Atualiza toda a interface
            loginError.style.display = 'none';
        } else {
            loginError.textContent = 'Usuário ou senha inválidos.';
            loginError.style.display = 'block';
            state.isLoggedIn = false;
            saveData(); // Salva o estado de deslogado
        }
    }

    function handleLogout() {
        state.isLoggedIn = false;
        state.currentPage = 'dashboard-page'; // Reseta para dashboard
        saveData();
        body.classList.remove('logged-in');
        loginPage.style.display = 'flex';
        loginEmailInput.value = ''; // Limpa campos
        loginPasswordInput.value = '';
        // Destruir gráficos ao deslogar para evitar problemas
         Object.values(state.charts).forEach(chart => chart.destroy());
         state.charts = {};
        console.log("Usuário deslogado.");
    }

    function navigateTo(pageId) {
        if (!state.isLoggedIn) return;

        pageSections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const targetSection = document.getElementById(pageId);
        const targetLink = document.querySelector(`#main-nav a[data-page="${pageId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            state.currentPage = pageId;
            console.log(`Navegando para: ${pageId}`);
            // Atualiza dados específicos da página se necessário
            // (updateUI já faz isso, mas poderia ser mais granular)
            // Ex: if (pageId === 'dashboard-page') renderDashboard();
        }
        if (targetLink) {
            targetLink.classList.add('active');
        }
        // Não salvar a página aqui, updateUI já salva após operações
    }

    // Modais
    window.showModal = function(modalId, itemId = null) {
        const modal = document.getElementById(modalId);
        state.currentEditingId = itemId; // Guarda o ID do item a ser editado (ou null se for novo)

        if (modal) {
            // Preencher formulário se for edição
            if (itemId) {
                if (modalId === 'transaction-modal') prepareTransactionFormForEdit(itemId);
                if (modalId === 'budget-modal') prepareBudgetFormForEdit(itemId);
                if (modalId === 'goal-modal') prepareGoalFormForEdit(itemId);
                if (modalId === 'add-goal-value-modal') prepareAddGoalValueForm(itemId);
            } else {
                // Limpar formulário se for adição
                if (modalId === 'transaction-modal') resetTransactionForm();
                if (modalId === 'budget-modal') resetBudgetForm();
                if (modalId === 'goal-modal') resetGoalForm();
                 // Não precisa resetar 'add-goal-value-modal' pois é sempre preenchido
            }
            modal.classList.add('active');
        }
    }

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            state.currentEditingId = null; // Limpa ID de edição
            // Opcional: Limpar formulários ao fechar
             // resetTransactionForm();
             // resetBudgetForm();
             // resetGoalForm();
        }
    }

    // Funções para preparar/resetar formulários dos modais
    function resetTransactionForm() {
        transactionForm.reset();
        transactionIdInput.value = '';
        transactionModalTitle.textContent = 'Nova Transação';
        transactionDateInput.valueAsDate = new Date(); // Data atual como padrão
        transactionTypeSelect.value = 'expense'; // Padrão despesa
        populateCategoriesByType(); // Popula categorias baseado no tipo padrão
    }
    function prepareTransactionFormForEdit(id) {
        const transaction = state.transactions.find(t => t.id === id);
        if (!transaction) return;
        transactionModalTitle.textContent = 'Editar Transação';
        transactionIdInput.value = id;
        transactionTypeSelect.value = transaction.type;
        transactionDescriptionInput.value = transaction.description;
        transactionAmountInput.value = transaction.amount;
        transactionDateInput.value = transaction.date;
        populateCategoriesByType(transaction.type); // Popula baseado no tipo
        transactionCategorySelect.value = transaction.category; // Seleciona a categoria correta
    }

     function resetBudgetForm() {
        budgetForm.reset();
        budgetIdInput.value = '';
        budgetModalTitle.textContent = 'Novo Orçamento';
        budgetMonthInput.value = budgetFilterMonthInput.value || getCurrentMonthYear(); // Mês atual do filtro ou do sistema
        populateExpenseCategories(budgetCategorySelect); // Popula categorias de despesa
    }
    function prepareBudgetFormForEdit(id) {
        const budget = state.budgets.find(b => b.id === id);
        if (!budget) return;
        budgetModalTitle.textContent = 'Editar Orçamento';
        budgetIdInput.value = id;
        populateExpenseCategories(budgetCategorySelect);
        budgetCategorySelect.value = budget.category;
        budgetAmountInput.value = budget.amountLimit;
        budgetMonthInput.value = budget.month;
    }

    function resetGoalForm() {
        goalForm.reset();
        goalIdInput.value = '';
        goalModalTitle.textContent = 'Nova Meta';
        goalCurrentAmountInput.value = '0'; // Valor inicial 0
    }
    function prepareGoalFormForEdit(id) {
        const goal = state.goals.find(g => g.id === id);
        if (!goal) return;
        goalModalTitle.textContent = 'Editar Meta';
        goalIdInput.value = id;
        goalNameInput.value = goal.name;
        goalTargetAmountInput.value = goal.targetAmount;
        goalCurrentAmountInput.value = goal.currentAmount;
        goalDeadlineInput.value = goal.deadline || '';
    }
     function prepareAddGoalValueForm(id) {
        const goal = state.goals.find(g => g.id === id);
        if (!goal) return;
        addValueGoalIdInput.value = id;
        addValueGoalName.textContent = goal.name;
        addValueGoalCurrent.textContent = formatCurrency(goal.currentAmount);
        addValueGoalTarget.textContent = formatCurrency(goal.targetAmount);
        goalValueToAddInput.value = ''; // Limpa campo de valor a adicionar
    }

    // Preenche selects de categoria nos formulários
    function populateCategorySelectsInForms() {
        populateCategoriesByType('expense'); // Popula form de transação inicialmente com despesas
        populateExpenseCategories(budgetCategorySelect); // Popula form de orçamento com despesas
        // Filtro de transação já é populado por populateCategoryFilters
    }

    // Popula o select de categorias no formulário de transação baseado no tipo (Receita/Despesa)
    function populateCategoriesByType(type = 'expense') {
        transactionCategorySelect.innerHTML = '<option value="">Selecione...</option>';
        const categories = type === 'income' ? state.categories.income : state.categories.expense;
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            transactionCategorySelect.appendChild(option);
        });
    }

    // Popula um select específico apenas com categorias de DESPESA
    function populateExpenseCategories(selectElement) {
         if (!selectElement) return;
         selectElement.innerHTML = '<option value="">Selecione...</option>';
         state.categories.expense.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            selectElement.appendChild(option);
         });
    }

     // Popula o select de categorias no FILTRO de transações
    function populateCategoryFilters() {
        filterCategory.innerHTML = '<option value="">Todas</option>';
        const allCategories = [...state.categories.income, ...state.categories.expense];
        // Opcional: Ordenar alfabeticamente
        allCategories.sort((a, b) => a.name.localeCompare(b.name));
        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            filterCategory.appendChild(option);
        });
    }


    // Filtros
    function filterTransactions() {
        const start = filterStartDate.value;
        const end = filterEndDate.value;
        const type = filterType.value;
        const category = filterCategory.value;

        return state.transactions.filter(t => {
            const transactionDate = new Date(t.date + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso
            const startDate = start ? new Date(start + 'T00:00:00') : null;
            const endDate = end ? new Date(end + 'T23:59:59') : null; // Usa fim do dia para incluir a data final

            const dateMatch = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
            const typeMatch = !type || t.type === type;
            const categoryMatch = !category || t.category === category;

            return dateMatch && typeMatch && categoryMatch;
        });
    }

    function applyFilters() {
        renderTransactions(); // Re-renderiza a tabela com os dados filtrados
    }

    function clearFilters() {
        filterForm.reset();
        renderTransactions(state.transactions); // Renderiza todos
    }

     function setDefaultFilters() {
        // Define o mês atual nos filtros de dashboard e orçamento
        const currentMonth = getCurrentMonthYear();
        if (dashboardMonthFilter) dashboardMonthFilter.value = currentMonth;
        if (budgetFilterMonthInput) budgetFilterMonthInput.value = currentMonth;
        // Você pode querer definir um período padrão no filtro de transações também
        // Ex: filterStartDate.value = ..., filterEndDate.value = ...
    }


    // --- Handlers de Eventos ---
    function setupEventListeners() {
        // Login / Logout
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (logoutButton) logoutButton.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

        // Navegação Principal
        navLinks.forEach(link => {
            if (link.id === 'logout-button') return; // Já tratado
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId) navigateTo(pageId);
            });
        });

        // Botão FAB
        if (fabButton) fabButton.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('transaction-modal'); // Abre modal para NOVA transação
        });

        // Filtros Dashboard
        if (dashboardMonthFilter) dashboardMonthFilter.addEventListener('change', renderDashboard);

        // Filtros Transações
        if (filterButton) filterButton.addEventListener('click', applyFilters);
        if (clearFilterButton) clearFilterButton.addEventListener('click', clearFilters);

        // Filtros Orçamento
        if (viewBudgetButton) viewBudgetButton.addEventListener('click', renderBudgets);
        if (budgetFilterMonthInput) budgetFilterMonthInput.addEventListener('change', renderBudgets); // Atualiza ao mudar mês

        // Botão Gerar Relatório
        if (generateReportButton) generateReportButton.addEventListener('click', renderReports);

        // Formulários dos Modais
        if (transactionForm) transactionForm.addEventListener('submit', handleTransactionFormSubmit);
        if (budgetForm) budgetForm.addEventListener('submit', handleBudgetFormSubmit);
        if (goalForm) goalForm.addEventListener('submit', handleGoalFormSubmit);
        if (addGoalValueForm) addGoalValueForm.addEventListener('submit', handleAddGoalValueFormSubmit);

        // Atualizar categorias no form de transação ao mudar o tipo
        if (transactionTypeSelect) transactionTypeSelect.addEventListener('change', (e) => populateCategoriesByType(e.target.value));

        // Fechar modal clicando fora (no overlay)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) { // Clicou no fundo (overlay)
                    closeModal(modal.id);
                }
            });
        });

        // Adicionar listeners para botões dentro das listas (delegação de eventos)
        document.addEventListener('click', (e) => {
            // Transações
            if (e.target.classList.contains('edit-transaction-btn')) {
                const id = e.target.getAttribute('data-id');
                showModal('transaction-modal', id);
            }
            if (e.target.classList.contains('delete-transaction-btn')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir esta transação?')) {
                    deleteTransaction(id);
                }
            }
            // Orçamentos
            if (e.target.classList.contains('edit-budget-btn')) {
                const id = e.target.getAttribute('data-id');
                showModal('budget-modal', id);
            }
            if (e.target.classList.contains('delete-budget-btn')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este orçamento?')) {
                   deleteBudget(id);
                }
            }
            // Metas
             if (e.target.classList.contains('add-goal-value-btn')) {
                const id = e.target.getAttribute('data-id');
                showModal('add-goal-value-modal', id);
            }
            if (e.target.classList.contains('edit-goal-btn')) {
                const id = e.target.getAttribute('data-id');
                showModal('goal-modal', id);
            }
            if (e.target.classList.contains('delete-goal-btn')) { // Listener para botão de excluir meta
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir esta meta?')) {
                    deleteGoal(id);
                }
            }

             // Botões de fechar modal (se não usar o onclick="")
             if (e.target.classList.contains('close-modal')) {
                 const modal = e.target.closest('.modal');
                 if (modal) closeModal(modal.id);
             }
        });

    }

    // --- Handlers de Submissão de Formulários ---
    function handleTransactionFormSubmit(event) {
        event.preventDefault();
        const data = {
            type: transactionTypeSelect.value,
            description: transactionDescriptionInput.value.trim(),
            amount: parseFloat(transactionAmountInput.value),
            date: transactionDateInput.value,
            category: transactionCategorySelect.value
        };

        // Validação simples
        if (!data.description || !data.amount || !data.date || !data.category) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (state.currentEditingId) {
            updateTransaction(state.currentEditingId, data);
        } else {
            addTransaction(data);
        }
        closeModal('transaction-modal');
    }

    function handleBudgetFormSubmit(event) {
        event.preventDefault();
         const data = {
             category: budgetCategorySelect.value,
             amountLimit: parseFloat(budgetAmountInput.value),
             month: budgetMonthInput.value
         };

         if (!data.category || !data.amountLimit || !data.month) {
            alert('Por favor, preencha todos os campos.');
            return;
         }

         let success = false;
         if (state.currentEditingId) {
            success = updateBudget(state.currentEditingId, data);
         } else {
            success = addBudget(data);
         }

         if (success) { // Fecha modal apenas se a operação foi bem-sucedida (sem duplicidade)
            closeModal('budget-modal');
         }
    }

    function handleGoalFormSubmit(event) {
        event.preventDefault();
        const data = {
            name: goalNameInput.value.trim(),
            targetAmount: parseFloat(goalTargetAmountInput.value),
            currentAmount: parseFloat(goalCurrentAmountInput.value || 0), // Usa 0 se vazio
            deadline: goalDeadlineInput.value || null // Permite prazo vazio
        };

         if (!data.name || !data.targetAmount) {
             alert('Nome da Meta e Valor Alvo são obrigatórios.');
             return;
         }
         if (data.currentAmount > data.targetAmount) {
             alert('O Valor Atual não pode ser maior que o Valor Alvo.');
             return;
         }

         if (state.currentEditingId) {
            updateGoal(state.currentEditingId, data);
         } else {
            addGoal(data);
         }
        closeModal('goal-modal');
    }

    function handleAddGoalValueFormSubmit(event) {
        event.preventDefault();
        const goalId = addValueGoalIdInput.value;
        const valueToAdd = parseFloat(goalValueToAddInput.value);

        if (!goalId || !valueToAdd || valueToAdd <= 0) {
            alert('Valor inválido.');
            return;
        }

        const goal = state.goals.find(g => g.id === goalId);
        if (!goal) return; // Segurança

        // Opcional: Verificar se não ultrapassa a meta
        // if (goal.currentAmount + valueToAdd > goal.targetAmount) {
        //     if (!confirm(`Adicionar este valor (${formatCurrency(valueToAdd)}) ultrapassará a meta de ${formatCurrency(goal.targetAmount)}. Deseja continuar?`)) {
        //         return;
        //     }
        // }

        addValueToGoal(goalId, valueToAdd);
        closeModal('add-goal-value-modal');
    }


    // --- Função de Inicialização ---
    function init() {
        loadData(); // Carrega dados salvos primeiro
        setupEventListeners();

        if (state.isLoggedIn) {
            body.classList.add('logged-in');
            setDefaultFilters();
            navigateTo(state.currentPage);
            updateUI(); // Renderiza a UI com dados carregados
        } else {
            body.classList.remove('logged-in');
            loginPage.style.display = 'flex';
        }
    }

    // Inicia a aplicação
    init();

}); // Fim do DOMContentLoaded
