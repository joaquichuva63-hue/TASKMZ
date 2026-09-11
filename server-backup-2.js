const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/proofs/");
    },

    filename: (req, file, cb) => {
        const nome = Date.now() + "-" + file.originalname;
        cb(null, nome);
    }
});

const upload = multer({ storage });
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "taskmz_segredo_2026",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbPath = path.join(__dirname, "database.json");

function carregarDB() {
    try {
        const dados = fs.readFileSync(dbPath, "utf8");

        if (!dados.trim()) {
return {
    users: [],
    tasks: [],
    withdrawals: []
};        }

        const db = JSON.parse(dados);

        if (!db.users) db.users = [];
        if (!db.tasks) db.tasks = [];
if (!db.withdrawals) db.withdrawals = [];
        return db;

    } catch (error) {
return {
    users: [],
    tasks: [],
    withdrawals: []
};    }
}

function salvarDB(dados) {
    fs.writeFileSync(
        dbPath,
        JSON.stringify(dados, null, 2)
    );
}

// ===============================
// PÁGINA INICIAL
// ===============================

app.get("/", (req, res) => {
    res.render("index", {
        user: req.session.user || null
    });
});

// ===============================
// REGISTO
// ===============================

app.get("/register", (req, res) => {
    res.render("register", {
        error: null
    });
});

app.post("/register", async (req, res) => {

    const { telefone, password, confirmPassword } = req.body;

    if (!telefone || !password || !confirmPassword) {
        return res.render("register", {
            error: "Preencha todos os campos."
        });
    }

    if (password !== confirmPassword) {
        return res.render("register", {
            error: "As palavras-passe não coincidem."
        });
    }

    const db = carregarDB();

    const existe = db.users.find(
        user => user.telefone === telefone
    );

    if (existe) {
        return res.render("register", {
            error: "Este número já está registado."
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const novoUser = {
        id: Date.now(),
        telefone: telefone,
        password: passwordHash,
        saldo: 0,
        criadoEm: new Date().toLocaleString("pt-PT")
    };

    db.users.push(novoUser);

    salvarDB(db);

    req.session.user = {
        id: novoUser.id,
        telefone: novoUser.telefone
    };

    res.redirect("/dashboard");
});
// ===============================
// TAREFAS DISPONÍVEIS
// ===============================

app.get("/tasks", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const tarefasAtivas = db.tasks.filter(
        task => task.status === "ativa"
    );

    res.render("tasks", {
        user: req.session.user,
        tasks: tarefasAtivas
    });
});
// ===============================
// ACEITAR TAREFA
// ===============================

app.post("/tasks/:id/accept", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const taskId = Number(req.params.id);
    const userId = req.session.user.id;

    const db = carregarDB();

    const task = db.tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return res.send("Tarefa não encontrada.");
    }

    if (task.status !== "ativa") {
        return res.send("Esta tarefa não está disponível.");
    }

    // Criar lista de participantes caso não exista
    if (!task.participantes) {
        task.participantes = [];
    }

    // Verificar se o utilizador já aceitou
    const jaAceitou = task.participantes.find(
        participante => participante.userId === userId
    );

    if (jaAceitou) {
        return res.send(`
            <h2>⚠️ Já aceitaste esta tarefa.</h2>
            <a href="/tasks">← Voltar às tarefas</a>
        `);
    }

    // Verificar vagas
    if (task.participantes.length >= task.vagas) {

        return res.send(`
            <h2>😔 As vagas desta tarefa terminaram.</h2>
            <a href="/tasks">← Voltar às tarefas</a>
        `);
    }

    // Adicionar participante
    task.participantes.push({
        userId: userId,
        status: "aceita",
        aceitaEm: new Date().toLocaleString("pt-PT")
    });

    salvarDB(db);

    res.redirect("/my-tasks");
});


// ===============================
// MINHAS TAREFAS
// ===============================

app.get("/my-tasks", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const userId = req.session.user.id;

    const db = carregarDB();

    const minhasTarefas = db.tasks.filter(task => {

        if (!task.participantes) return false;

        return task.participantes.some(
            participante => participante.userId === userId
        );
    });

    res.render("my-tasks", {
        tasks: minhasTarefas,
        user: req.session.user
    });
});
// ===============================
// ENVIAR PROVA
// ===============================

// Página para enviar prova
app.get("/tasks/:id/proof", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const taskId = Number(req.params.id);
    const userId = req.session.user.id;

    const db = carregarDB();

    const task = db.tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return res.send("Tarefa não encontrada.");
    }

    const participante = task.participantes?.find(
        p => p.userId === userId
    );

    if (!participante) {
        return res.redirect("/tasks");
    }

    res.render("send-proof", {
        task,
        participante,
        error: null
    });
});


// Guardar prova
app.post(
    "/tasks/:id/proof",
    upload.single("foto"),
    (req, res) => {

        if (!req.session.user) {
            return res.redirect("/login");
        }

        const taskId = Number(req.params.id);
        const userId = req.session.user.id;

        const { link } = req.body;

        const db = carregarDB();

        const task = db.tasks.find(
            task => task.id === taskId
        );

        if (!task) {
            return res.send("Tarefa não encontrada.");
        }

        const participante = task.participantes?.find(
            p => p.userId === userId
        );

        if (!participante) {
            return res.redirect("/tasks");
        }

        if (!req.file || !link) {

            return res.render("send-proof", {
                task,
                participante,
                error: "Envie a foto e o link da publicação."
            });
        }

        participante.fotoProva =
            "/uploads/proofs/" + req.file.filename;

        participante.linkProva = link;

        participante.status = "aguardando";

        participante.provaEnviadaEm =
            new Date().toLocaleString("pt-PT");

        salvarDB(db);

        res.redirect("/my-tasks");
    }
);
// ===============================
// LOGIN UTILIZADOR
// ===============================

app.get("/login", (req, res) => {
    res.render("login", {
        error: null
    });
});

app.post("/login", async (req, res) => {

    const { telefone, password } = req.body;

    const db = carregarDB();

    const user = db.users.find(
        user => user.telefone === telefone
    );

    if (!user) {
        return res.render("login", {
            error: "Número ou palavra-passe incorretos."
        });
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordCorrecta) {
        return res.render("login", {
            error: "Número ou palavra-passe incorretos."
        });
    }

    req.session.user = {
        id: user.id,
        telefone: user.telefone
    };

    res.redirect("/dashboard");
});

// ===============================
// DASHBOARD UTILIZADOR
// ===============================

app.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const user = db.users.find(
        user => user.id === req.session.user.id
    );

    if (!user) {
        return res.redirect("/login");
    }

    res.render("dashboard", {
        user: user
    });
});

// ===============================
// FORMA DE PAGAMENTO
// ===============================

app.get("/payment-method", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const user = db.users.find(
        user => user.id === req.session.user.id
    );

    res.render("payment-method", {
        user: user,
        success: null,
        error: null
    });
});

app.post("/payment-method", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const { nomeCompleto, metodo, numeroPagamento } = req.body;

    const db = carregarDB();

    const userIndex = db.users.findIndex(
        user => user.id === req.session.user.id
    );

    if (userIndex === -1) {
        return res.redirect("/login");
    }

    if (!nomeCompleto || !metodo || !numeroPagamento) {

        return res.render("payment-method", {
            user: db.users[userIndex],
            success: null,
            error: "Preencha todos os campos."
        });
    }

    db.users[userIndex].nomeCompleto = nomeCompleto;
    db.users[userIndex].metodoPagamento = metodo;
    db.users[userIndex].numeroPagamento = numeroPagamento;

    salvarDB(db);

    res.render("payment-method", {
        user: db.users[userIndex],
        success: "Forma de pagamento guardada com sucesso!",
        error: null
    });
});
// ===============================
// PEDIR LEVANTAMENTO
// ===============================
app.get("/withdraw", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const user = db.users.find(
        u => u.id === req.session.user.id
    );

    if (!user) {
        return res.redirect("/login");
    }

    res.render("withdraw", {
        user,
        error: null
    });
});


app.post("/withdraw", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const valor = Number(req.body.valor);

    const db = carregarDB();

    const userIndex = db.users.findIndex(
        u => u.id === req.session.user.id
    );

    if (userIndex === -1) {
        return res.redirect("/login");
    }

    const user = db.users[userIndex];

    // Valor mínimo para levantamento
    const MINIMO_LEVANTAMENTO = 20;

    if (!valor || valor < MINIMO_LEVANTAMENTO) {

        return res.render("withdraw", {
            user,
            error: `O levantamento mínimo é ${MINIMO_LEVANTAMENTO} MT.`
        });
    }

    if (valor > Number(user.saldo || 0)) {

        return res.render("withdraw", {
            user,
            error: "Saldo insuficiente."
        });
    }

    // Verificar dados de pagamento
    if (
        !user.nomeCompleto ||
        !user.metodoPagamento ||
        !user.numeroPagamento
    ) {

        return res.render("withdraw", {
            user,
            error: "Primeiro preencha os seus dados de pagamento."
        });
    }

    // Criar pedido
    const novoPedido = {
        id: Date.now(),
        userId: user.id,

        nomeCompleto: user.nomeCompleto,
        telefone: user.telefone,

        metodoPagamento: user.metodoPagamento,
        numeroPagamento: user.numeroPagamento,

        valor: valor,

        status: "pendente",

        criadoEm: new Date().toLocaleString("pt-PT")
    };

    // Diminuir imediatamente do saldo
    user.saldo = Number(user.saldo || 0) - valor;

    db.withdrawals.push(novoPedido);

    salvarDB(db);

    res.redirect("/withdraw/history");
});// ===============================
// HISTÓRICO DE LEVANTAMENTOS
// ===============================

app.get("/withdraw/history", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const pedidos = db.withdrawals.filter(
        pedido => pedido.userId === req.session.user.id
    );

    res.render("withdraw-history", {
        pedidos
    });
});

// ===============================
// LOGOUT UTILIZADOR
// ===============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });
});

// ===============================
// ADMIN LOGIN
// ===============================

app.get("/admin", (req, res) => {

    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }

    res.render("admin-login", {
        error: null
    });
});

app.post("/admin/login", (req, res) => {

    const { username, password } = req.body;

    const ADMIN_USER = "admin";
    const ADMIN_PASSWORD = "123456";

    if (
        username === ADMIN_USER &&
        password === ADMIN_PASSWORD
    ) {

        req.session.admin = true;

        return res.redirect("/admin/dashboard");
    }

    res.render("admin-login", {
        error: "Dados de administrador incorretos."
    });
});

// ===============================
// DASHBOARD ADMIN
// ===============================

app.get("/admin/dashboard", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const db = carregarDB();

    res.render("admin-dashboard", {
        totalUsers: db.users.length,
        totalTasks: db.tasks.length
    });
});

// ===============================
// CRIAR TAREFA
// ===============================

app.get("/admin/create-task", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    res.render("create-task", {
        error: null,
        success: null
    });
});

app.post("/admin/create-task", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const {
        titulo,
        descricao,
        valor,
        vagas
    } = req.body;

    if (!titulo || !descricao || !valor || !vagas) {

        return res.render("create-task", {
            error: "Preencha todos os campos.",
            success: null
        });
    }

    const db = carregarDB();

    const novaTarefa = {
        id: Date.now(),
        titulo: titulo,
        descricao: descricao,
        valor: Number(valor),
        vagas: Number(vagas),
        participantes: [],
        status: "ativa",
        criadoEm: new Date().toLocaleString("pt-PT")
    };

    db.tasks.push(novaTarefa);

    salvarDB(db);

    res.render("create-task", {
        error: null,
        success: "Tarefa criada e publicada com sucesso!"
    });
});
// ===============================
// ADMIN - VER PROVAS
// ===============================

app.get("/admin/proofs", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const db = carregarDB();

    const provas = [];

    db.tasks.forEach(task => {

        if (!task.participantes) return;

        task.participantes.forEach(participante => {

            if (
                participante.status === "aguardando" &&
                participante.fotoProva
            ) {

                const user = db.users.find(
                    u => u.id === participante.userId
                );

                provas.push({
                    taskId: task.id,
                    taskTitulo: task.titulo,
                    taskValor: task.valor,

                    userId: participante.userId,
                    telefone: user ? user.telefone : "Desconhecido",

                    fotoProva: participante.fotoProva,
                    linkProva: participante.linkProva,

                    enviadaEm: participante.provaEnviadaEm
                });
            }

        });

    });

    res.render("admin-proofs", {
        provas: provas
    });
});
// ===============================
// ADMIN - APROVAR PROVA
// ===============================

app.post("/admin/proofs/:taskId/:userId/approve", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const taskId = Number(req.params.taskId);
    const userId = Number(req.params.userId);

    const db = carregarDB();

    const task = db.tasks.find(
        task => task.id === taskId
    );

    const user = db.users.find(
        user => user.id === userId
    );

    if (!task || !user) {
        return res.send("Tarefa ou utilizador não encontrado.");
    }

    const participante = task.participantes.find(
        p => p.userId === userId
    );

    if (!participante) {
        return res.send("Participante não encontrado.");
    }

    // Segurança: não pagar duas vezes
    if (participante.status === "aprovada") {
        return res.redirect("/admin/proofs");
    }

    participante.status = "aprovada";

    participante.aprovadaEm =
        new Date().toLocaleString("pt-PT");

    // Adicionar valor ao saldo
    user.saldo = Number(user.saldo || 0) + Number(task.valor);

    salvarDB(db);

    res.redirect("/admin/proofs");
});
// ===============================
// ADMIN - REJEITAR PROVA
// ===============================

app.post("/admin/proofs/:taskId/:userId/reject", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const taskId = Number(req.params.taskId);
    const userId = Number(req.params.userId);

    const db = carregarDB();

    const task = db.tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return res.send("Tarefa não encontrada.");
    }

    const participante = task.participantes.find(
        p => p.userId === userId
    );

    if (!participante) {
        return res.send("Participante não encontrado.");
    }

    participante.status = "rejeitada";

    participante.rejeitadaEm =
        new Date().toLocaleString("pt-PT");

    salvarDB(db);

    res.redirect("/admin/proofs");
});
// ===============================
// ADMIN - PEDIDOS DE LEVANTAMENTO
// ===============================

app.get("/admin/withdrawals", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const db = carregarDB();

    res.render("admin-withdrawals", {
        pedidos: db.withdrawals
    });
});

ontem 16:01

Ja funcionou

Perfeito! 🚀🇲🇿 Agora vamos criar o PAINEL ADMIN PARA CONTROLAR OS PEDIDOS DE LEVANTAMENTO.

O Admin poderá:

💸 Ver todos os pedidos

👤 Ver o nome do utilizador

📱 Ver o número M-Pesa/e-Mola

💰 Ver o valor solicitado

⏳ Ver pedidos pendentes

✅ Marcar como pago

❌ Rejeitar e devolver o dinheiro ao saldo

🟢 PASSO 1 — Parar o servidor
No Termux:

CTRL + C
Depois:

cd ~/taskmz
nano server.js
🟢 PASSO 2 — Criar página Admin dos levantamentos
No server.js, procure:

// ===============================
// LOGOUT ADMIN
// ===============================

// ===============================
// ADMIN - PEDIDOS DE LEVANTAMENTO
// ===============================

app.get("/admin/withdrawals", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const db = carregarDB();

    res.render("admin-withdrawals", {
        pedidos: db.withdrawals
    });
});
🟢 PASSO 3 — Criar botão MARCAR COMO PAGO
Logo abaixo do código anterior, cole:

// ===============================
// ADMIN - MARCAR LEVANTAMENTO PAGO
// ===============================

app.post("/admin/withdrawals/:id/paid", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const pedidoId = Number(req.params.id);

    const db = carregarDB();

    const pedido = db.withdrawals.find(
        p => p.id === pedidoId
    );

    if (!pedido) {
        return res.send("Pedido não encontrado.");
    }

    if (pedido.status !== "pendente") {
        return res.redirect("/admin/withdrawals");
    }

    pedido.status = "pago";

    pedido.pagoEm =
        new Date().toLocaleString("pt-PT");

    salvarDB(db);

    res.redirect("/admin/withdrawals");
});
🟢 PASSO 4 — Criar botão REJEITAR
Este é muito importante porque devolve o dinheiro ao utilizador.

Cole logo abaixo:

// ===============================
// ADMIN - REJEITAR LEVANTAMENTO
// ===============================

app.post("/admin/withdrawals/:id/reject", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    const pedidoId = Number(req.params.id);

    const db = carregarDB();

    const pedido = db.withdrawals.find(
        p => p.id === pedidoId
    );

    if (!pedido) {
        return res.send("Pedido não encontrado.");
    }

    if (pedido.status !== "pendente") {
        return res.redirect("/admin/withdrawals");
    }

    const user = db.users.find(
        u => u.id === pedido.userId
    );

    // Devolver dinheiro ao saldo
    if (user) {
        user.saldo =
            Number(user.saldo || 0) +
            Number(pedido.valor);
    }

    pedido.status = "rejeitado";

    pedido.rejeitadoEm =
        new Date().toLocaleString("pt-PT");

    salvarDB(db);

    res.redirect("/admin/withdrawals");
});
// ===============================
// LOGOUT ADMIN
// ===============================

app.get("/admin/logout", (req, res) => {

    req.session.admin = false;

    res.redirect("/admin");
});

// ===============================
// INICIAR SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log("");
    console.log("🇲🇿 TASKMZ");
    console.log("💰 Plataforma de Microtarefas");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("");
});
