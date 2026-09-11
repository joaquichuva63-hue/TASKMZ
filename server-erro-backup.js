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


    } catch (error) {
mkdir public
cd public
nano index.html
<html lang="pt">
<head>
</head>
<body>
<header class="topo">
</header>
<section class="hero">
</section>
<section id="menu">
</section>
<section class="combos">
<html lang="pt">
<head>
</head>
<body>
<header class="topo">
</header>
<section class="hero">
</section>
<section id="menu">
</section>
<section class="combos">
</section>
<section class="carrinho">
</section>
<footer>
</footer>
<script src="script.js"></script>
</body>
</html>
nano style.css
nano script.js
cd ..
nano server.js
npm install express
node server.js
pkg update -y
pkg install nodejs -y
mkdir -p ~/cantinho-sabores
cd ~/cantinho-sabores
npm init -y
s on nodejs | nodejs-lts; however:
(Reading database ... 24819 files and directories currently installed.)
Removing nodejs-lts (24.18.0-1) ...
Selecting previously unselected package nodejs.
(Reading database ... 24625 files and directories currently installed.)
Preparing to unpack .../nodejs_26.4.0-1_arm.deb ...
Unpacking nodejs (26.4.0-1) ...
Setting up nodejs (26.4.0-1) ...
Wrote to /data/data/com.termux/files/home/cantinho-sabores/package.json:
{   "name": "cantinho-sabores",;   "version": "1.0.0",;   "description": "",;   "main": "index.js",;   "scripts": {;     "test": "echo \"Error:













npm install express
pkg update -y


find public -maxdepth 2 -type f
cd ~/cantinho-sabores
find public -maxdepth 2 -type f
cd ~
mkdir taskmz
cd taskmz
npm init -y
npm install express ejs express-session bcrypt multer
mkdir -p views public/css public/js uploads
touch server.js database.json views/index.ejs
ls
ls views public
nano server.js
nano views/index.ejs
node server.js
nano server.js
nano views/register.ejs
nano views/login.ejs
nano views/dashboard.ejs
node server.js
nano server.js
nano views/payment-method.ejs
nano views/dashboard.ejs
node server.js
nano server.js
nano views/admin-login.ejs
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin - TASKMZ</title>
<style>
* {
}
body {
}
.container {
}
.card {
}
h1 {
}
input {
}
button {
}
.error {
}
</style>
</head>
<body>
<div class="container">
<div class="card">
<h1>👨‍💼 ADMIN TASKMZ</h1>
<p style="text-align:center;">
Área restrita à administração
</p>
<% if (error) { %>
<div class="error">
<%= error %>
</div>
<% } %>
<form action="/admin/login" method="POST">
<input
type="text"
name="username"
placeholder="Utilizador Admin"
required
>
<input
type="password"
name="password"
placeholder="Palavra-passe"
required
>
<button type="submit">
ENTRAR NO PAINEL
</button>
</form>
</div>
</di
nano views/admin-dashboard.ejs
server.js
nano server.js
nano views/create-task.ejs
node server.js
nano server.js
node server.js
cd ~/taskmz
ls
nano server.js
nano views/tasks.ejs
nano views/dashboard.ejs
node server.js
nano server.js
nano views/tasks.ejs
nano views/my-tasks.ejs
nano views/dashboard.ejs
server.js
node server.js
mkdir -p uploads/proofs
nano server.js
nano views/send-proof.ejs
nano views/my-tasks.ejs
node --check server.js
node server.js
nano server.js
nano views/admin-proofs.ejs
nano views/admin-dashboard.ejs
node server.js
nano server.js
nano views/withdraw.ejs
nano views/withdraw-history.ejs
nano views/dashboard.ejs
node server.js
~/taskmz $ node server.js
/data/data/com.termux/files/home/taskmz/server.js:607
});<a href="/withdraw">💸 Pedir levantamento</a>
SyntaxError: Unexpected token '<'
Node.js v26.4.0
~/taskmz $cd ~/taskmz
cd ~/taskmz
node server.js
~/taskmz $ node server.js
/data/data/com.termux/files/home/taskmz/server.js:607
});<a href="/withdraw">💸 Pedir levantamento</a>
SyntaxError: Unexpected token '<'
Node.js v26.4.0
~/taskmz $sed -i 's#<a href="/withdraw">💸 Pedir levantamento</a>##g' server.js
sed -n '600,610p' server.js
node --check server.js
sed -i '607s#<a href="/withdraw">💸 Pedir levantamento</a>##' server.js
sed -n '604,609p' server.js
node --check server.js
node server.js
nano server.js
cd cd ~/taskmz
sed -i '607s#<a href="/withdraw">💸 Pedir levantamento</a>##' server.js
node --check server.js
cd ~/taskmz
nano views/admin-withdrawals.ejs
cd~/taskmz
se~/taskmz
cedsed -i 's#<a href="/withdraw">💸 Pedir levantamento</a>##g' server.js
sed -i 's#<a href="/withdraw">💸 Pedir levantamento</a>##g' server.js
cd ~/taskmz
nano views/admin-dashboard.ejs
nano views/admin-withdrawals.ejs
node --check server.js
cp server.js server-backup-2.js
sed -n '885,905p' server.js
sed -i '895,$d' server.js
tail -n 20 server.js
node --check server.js
nano server.js
node --check server.js
node server.js
cp server.js server-backup-ok.js
node server.js
cd ~/taskmz
node server.js
tail -n 40 server.js
nano server.js
node --check server.js
node server.js
nano server.js
node --check server.js
node server.js
cd ~/taskmz
nano server.js
node server.js
grep -n 'app.get("/dashboard"' server.js
grep -n 'res.render("dashboard"' server.js
sed -n '401,425p' server.js
cp server.js server-before-dashboard-filter.js
nano server.js
grep -n 'task\|tasks\|tarefas' views/dashboard.ejs
grep -n 'app.get("/tasks"' server.js
grep -n 'res.render("tasks"' server.js
sed -n '144,165p' server.js
cp server.js server-before-tasks-filter.js
nano server.js
node --check server.js
sed -n '450,480p' server.js
nano server.js
node --check server.js
node server.js
cd ~/taskmz
cp server.js server-before-notification-counter.js
nano server.js
sed -n '401,470p' server.js
sed -n '450,490p' server.js
nano server.js
node --check server.js
node server.js
sed -n '415,445p' server.js
nano server.js
node --check server.js
node server.js
sed -n '425,455p' server.js
nano server.js
node --check server.js
nano server.js
node --check server.js
node server.js

};    }
}

function salvarDB(dados) {
    fs.writeFileSync(
        dbPath,
        JSON.stringify(dados, null, 2)
    );
}
// ===============================
// SISTEMA DE NOTIFICAÇÕES
// ===============================

function criarNotificacao(db, userId, mensagem, tipo = "info") {

    if (!db.notifications) {
        db.notifications = [];
    }

    db.notifications.push({
        id: Date.now(),
        userId: userId,
        mensagem: mensagem,
        tipo: tipo,
        lida: false,
        criadaEm: new Date().toLocaleString("pt-PT")
    });
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
const tarefasDisponiveis = db.tasks.filter(task => {

    // Mostrar apenas tarefas ativas
    if (task.status !== "ativa") {
        return false;
    }

    // Procurar se este utilizador já participou
    const participante = (task.participantes || []).find(
        p => p.userId === req.session.user.id
    );

    // Se nunca participou, mostrar a tarefa
    if (!participante) {
        return true;
    }

    // Se já enviou prova ou foi aprovado,
    // esconder das tarefas disponíveis
    if (
        participante.status === "pendente" ||
        participante.status === "aprovada" ||
        participante.status === "concluida"
    ) {
        return false;
    }

    // Se foi rejeitada, continua disponível
    return true;
});

res.render("tasks", {
    user: req.session.user,
    tasks: tarefasDisponiveis
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
// DASHBOARD UTILIZADOR/
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

    const notificacoesNaoLidas = (db.notifications || []).filter(
        n => n.userId === user.id && n.lida === false
    ).length;

    const tarefasDisponiveis = db.tasks.filter(task => {

        const participante = (task.participantes || []).find(
            p => p.userId === user.id
        );

        if (!participante) {
            return true;
        }

        if (
            participante.status === "pendente" ||
            participante.status === "aprovada" ||
            participante.status === "concluida"
        ) {
            return false;
        }

        return true;
    });

    res.render("dashboard", {
        user: user,
        tasks: tarefasDisponiveis,
        notificacoesNaoLidas: notificacoesNaoLidas
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

// Criar notificação para o utilizador
criarNotificacao(
    db,
    userId,
    `🎉 A sua tarefa "${task.titulo}" foi aprovada! Foram adicionados ${Number(task.valor).toFixed(2)} MT ao seu saldo.`,
    "sucesso"
);

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

    pedido.pagoEm = new Date().toLocaleString("pt-PT");

    salvarDB(db);

    res.redirect("/admin/withdrawals");
});


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

    req.session.destroy((err) => {

        if (err) {
            return res.redirect("/admin/dashboard");
        }

        res.redirect("/admin");
    });

});
// ===============================
// INICIAR SERVIDOR
// ===============================


app.listen(PORT, () => {
// ===============================
// NOTIFICAÇÕES DO UTILIZADOR
// ===============================

app.get("/notifications", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    const db = carregarDB();

    const notificacoes = (db.notifications || [])
        .filter(n => n.userId === req.session.user.id)
        .reverse();

    // Marcar como lidas
    (db.notifications || []).forEach(n => {
        if (n.userId === req.session.user.id) {
            n.lida = true;
        }
    });

    salvarDB(db);
    console.log("");
    console.log("🇲🇿 TASKMZ");
    console.log("💰 Plataforma de Microtarefas");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("");
});
