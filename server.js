require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// MONGODB
// ===============================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI não encontrada no ficheiro .env");
}

const mongoClient = new MongoClient(MONGODB_URI);

let mongoDB;
let databaseCollection;

let dbCache = {
    users: [],
    tasks: [],
    withdrawals: [],
    notifications: [],
    messages: []
};

// ===============================
// GARANTIR ESTRUTURA DA BASE
// ===============================

function prepararDB(db) {

    if (!db || typeof db !== "object") {
        db = {};
    }

    if (!Array.isArray(db.users)) {
        db.users = [];
    }

    if (!Array.isArray(db.tasks)) {
        db.tasks = [];
    }

    if (!Array.isArray(db.withdrawals)) {
        db.withdrawals = [];
    }

    if (!Array.isArray(db.notifications)) {
        db.notifications = [];
    }

    if (!Array.isArray(db.messages)) {
        db.messages = [];
    }

    return db;
}

// ===============================
// LIGAR AO MONGODB
// ===============================

async function ligarMongoDB() {

    try {

        console.log("🔄 A ligar ao MongoDB...");

        await mongoClient.connect();

        mongoDB = mongoClient.db("taskmz");

        databaseCollection =
            mongoDB.collection("database");

        const dadosMongo = await databaseCollection.findOne({
            _id: "taskmz_database"
        });

        // Se já existem dados no MongoDB
        if (dadosMongo) {

            dbCache = prepararDB({
                users: dadosMongo.users,
                tasks: dadosMongo.tasks,
                withdrawals: dadosMongo.withdrawals,
                notifications: dadosMongo.notifications,
                messages: dadosMongo.messages
            });

            console.log("✅ MongoDB ligado com sucesso!");
            console.log("💾 Dados carregados do MongoDB!");

        } else {

            console.log(
                "ℹ️ Ainda não existem dados no MongoDB."
            );

            // ===============================
            // MIGRAR DATABASE.JSON ANTIGO
            // ===============================

            const dbPath = path.join(
                __dirname,
                "database.json"
            );

            try {

                if (fs.existsSync(dbPath)) {

                    const dadosAntigos =
                        fs.readFileSync(dbPath, "utf8");

                    if (dadosAntigos.trim()) {

                        const antigoDB =
                            JSON.parse(dadosAntigos);

                        dbCache = prepararDB(antigoDB);

                        console.log(
                            "📦 Dados antigos encontrados!"
                        );

                    }

                }

            } catch (error) {

                console.log(
                    "⚠️ Não foi possível ler database.json"
                );

            }

            // Guardar primeira versão no MongoDB

            await databaseCollection.insertOne({
                _id: "taskmz_database",

                users: dbCache.users,

                tasks: dbCache.tasks,

                withdrawals: dbCache.withdrawals,

                notifications: dbCache.notifications,

                messages: dbCache.messages
            });

            console.log(
                "✅ Dados migrados para o MongoDB!"
            );
        }

    } catch (error) {

        console.error("");
        console.error("❌ ERRO AO LIGAR AO MONGODB");
        console.error(error.message);
        console.error("");

        throw error;
    }
}

// ===============================
// CARREGAR BASE DE DADOS
// ===============================

function carregarDB() {

    dbCache = prepararDB(dbCache);

    return dbCache;
}

// ===============================
// GUARDAR BASE DE DADOS
// ===============================

function salvarDB(dados) {

    dbCache = prepararDB(dados);

    if (!databaseCollection) {

        console.log(
            "⚠️ MongoDB ainda não está conectado."
        );

        return;
    }

    databaseCollection.updateOne(

        {
            _id: "taskmz_database"
        },

        {
            $set: {

                users: dbCache.users,

                tasks: dbCache.tasks,

                withdrawals: dbCache.withdrawals,

                notifications: dbCache.notifications,

                messages: dbCache.messages

            }
        },

        {
            upsert: true
        }

    ).catch(error => {

        console.error(
            "❌ Erro ao guardar no MongoDB:",
            error.message
        );

    });
}

// ===============================
// MULTER - UPLOAD DE PROVAS
// ===============================

const uploadFolder = path.join(
    __dirname,
    "uploads",
    "proofs"
);

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadFolder);

    },

    filename: (req, file, cb) => {

        const nome =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, nome);
    }

});

const upload = multer({
    storage
});

// ===============================
// CONFIGURAÇÕES EXPRESS
// ===============================

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(session({

    secret:
        process.env.SESSION_SECRET ||
        "taskmz_segredo_2026",

    resave: false,

    saveUninitialized: false

}));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

// ===============================
// SISTEMA DE NOTIFICAÇÕES
// ===============================

function criarNotificacao(
    db,
    userId,
    mensagem,
    tipo = "info"
) {

    if (!db.notifications) {
        db.notifications = [];
    }

    db.notifications.push({

        id: Date.now() + Math.floor(Math.random() * 1000),

        userId: userId,

        mensagem: mensagem,

        tipo: tipo,

        lida: false,

        criadaEm:
            new Date().toLocaleString("pt-PT")

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

    const {
        telefone,
        password,
        confirmPassword
    } = req.body;

    if (
        !telefone ||
        !password ||
        !confirmPassword
    ) {

        return res.render("register", {

            error:
                "Preencha todos os campos."

        });

    }

    if (password !== confirmPassword) {

        return res.render("register", {

            error:
                "As palavras-passe não coincidem."

        });

    }

    const db = carregarDB();

    const existe = db.users.find(

        user => user.telefone === telefone

    );

    if (existe) {

        return res.render("register", {

            error:
                "Este número já está registado."

        });

    }

    const passwordHash =
        await bcrypt.hash(password, 10);

    const novoUser = {

        id:
            Date.now() +
            Math.floor(Math.random() * 1000),

        telefone: telefone,

        password: passwordHash,

        saldo: 0,

        bloqueado: false,

        criadoEm:
            new Date().toLocaleString("pt-PT")

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

    const tarefasDisponiveis =
        db.tasks.filter(task => {

            if (task.status !== "ativa") {

                return false;

            }

            const participante =
                (task.participantes || []).find(

                    p =>
                        p.userId ===
                        req.session.user.id

                );

            if (!participante) {

                return true;

            }

            if (

                participante.status === "pendente" ||

                participante.status === "aguardando" ||

                participante.status === "aprovada" ||

                participante.status === "concluida"

            ) {

                return false;

            }

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

        return res.send(
            "Tarefa não encontrada."
        );

    }

    if (task.status !== "ativa") {

        return res.send(
            "Esta tarefa não está disponível."
        );

    }

    if (!task.participantes) {

        task.participantes = [];

    }

    const jaAceitou =
        task.participantes.find(

            participante =>
                participante.userId === userId

        );

    if (jaAceitou) {

        return res.send(`

            <h2>⚠️ Já aceitaste esta tarefa.</h2>

            <a href="/tasks">
            ← Voltar às tarefas
            </a>

        `);

    }

    if (
        task.participantes.length >=
        Number(task.vagas)
    ) {

        return res.send(`

            <h2>
            😔 As vagas desta tarefa terminaram.
            </h2>

            <a href="/tasks">
            ← Voltar às tarefas
            </a>

        `);

    }

    task.participantes.push({

        userId: userId,

        status: "aceita",

        aceitaEm:
            new Date().toLocaleString("pt-PT")

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

    const minhasTarefas =
        db.tasks.filter(task => {

            if (!task.participantes) {

                return false;

            }

            return task.participantes.some(

                participante =>
                    participante.userId === userId

            );

        });

    res.render("my-tasks", {

        tasks: minhasTarefas,

        user: req.session.user

    });

});

// ===============================
// PÁGINA ENVIAR PROVA
// ===============================

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

        return res.send(
            "Tarefa não encontrada."
        );

    }

    const participante =
        task.participantes?.find(

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

// ===============================
// GUARDAR PROVA
// ===============================

app.post(
    "/tasks/:id/proof",

    upload.single("foto"),

    (req, res) => {

        if (!req.session.user) {

            return res.redirect("/login");

        }

        const taskId =
            Number(req.params.id);

        const userId =
            req.session.user.id;

        const { link } = req.body;

        const db = carregarDB();

        const task = db.tasks.find(

            task => task.id === taskId

        );

        if (!task) {

            return res.send(
                "Tarefa não encontrada."
            );

        }

        const participante =
            task.participantes?.find(

                p => p.userId === userId

            );

        if (!participante) {

            return res.redirect("/tasks");

        }

        if (!req.file || !link) {

            return res.render("send-proof", {

                task,

                participante,

                error:
                    "Envie a foto e o link da publicação."

            });

        }

        participante.fotoProva =
            "/uploads/proofs/" +
            req.file.filename;

        participante.linkProva = link;

        participante.status =
            "aguardando";

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

            error:
                "Número ou palavra-passe incorretos."

        });

    }

    if (user.bloqueado === true) {

        return res.render("login", {

            error:
                "A sua conta está bloqueada. Contacte o administrador."

        });

    }

    const passwordCorrecta =
        await bcrypt.compare(

            password,

            user.password

        );

    if (!passwordCorrecta) {

        return res.render("login", {

            error:
                "Número ou palavra-passe incorretos."

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

        user =>
            user.id === req.session.user.id

    );

    if (!user) {

        return res.redirect("/login");

    }

    if (user.bloqueado === true) {

        req.session.destroy(() => {

            res.redirect("/login");

        });

        return;

    }

    const notificacoesNaoLidas =
        (db.notifications || []).filter(

            n =>
                n.userId === user.id &&
                n.lida === false

        ).length;

    const tarefasDisponiveis =
        db.tasks.filter(task => {

            if (task.status !== "ativa") {
                return false;
            }

            const participante =
                (task.participantes || []).find(

                    p => p.userId === user.id

                );

            if (!participante) {

                return true;

            }

            if (

                participante.status === "aguardando" ||

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

        notificacoesNaoLidas:
            notificacoesNaoLidas

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

        user =>
            user.id === req.session.user.id

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

    const {

        nomeCompleto,

        metodo,

        numeroPagamento

    } = req.body;

    const db = carregarDB();

    const userIndex =
        db.users.findIndex(

            user =>
                user.id === req.session.user.id

        );

    if (userIndex === -1) {

        return res.redirect("/login");

    }

    if (

        !nomeCompleto ||

        !metodo ||

        !numeroPagamento

    ) {

        return res.render("payment-method", {

            user: db.users[userIndex],

            success: null,

            error:
                "Preencha todos os campos."

        });

    }

    db.users[userIndex].nomeCompleto =
        nomeCompleto;

    db.users[userIndex].metodoPagamento =
        metodo;

    db.users[userIndex].numeroPagamento =
        numeroPagamento;

    salvarDB(db);

    res.render("payment-method", {

        user: db.users[userIndex],

        success:
            "Forma de pagamento guardada com sucesso!",

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

        u =>
            u.id === req.session.user.id

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

    const valor =
        Number(req.body.valor);

    const db = carregarDB();

    const userIndex =
        db.users.findIndex(

            u =>
                u.id === req.session.user.id

        );

    if (userIndex === -1) {

        return res.redirect("/login");

    }

    const user = db.users[userIndex];

    const MINIMO_LEVANTAMENTO = 20;

    if (

        !valor ||

        valor < MINIMO_LEVANTAMENTO

    ) {

        return res.render("withdraw", {

            user,

            error:
                `O levantamento mínimo é ${MINIMO_LEVANTAMENTO} MT.`

        });

    }

    if (

        valor >
        Number(user.saldo || 0)

    ) {

        return res.render("withdraw", {

            user,

            error:
                "Saldo insuficiente."

        });

    }

    if (

        !user.nomeCompleto ||

        !user.metodoPagamento ||

        !user.numeroPagamento

    ) {

        return res.render("withdraw", {

            user,

            error:
                "Primeiro preencha os seus dados de pagamento."

        });

    }

    const novoPedido = {

        id:
            Date.now() +
            Math.floor(Math.random() * 1000),

        userId: user.id,

        nomeCompleto:
            user.nomeCompleto,

        telefone:
            user.telefone,

        metodoPagamento:
            user.metodoPagamento,

        numeroPagamento:
            user.numeroPagamento,

        valor: valor,

        status: "pendente",

        criadoEm:
            new Date().toLocaleString("pt-PT")

    };

    user.saldo =
        Number(user.saldo || 0) - valor;

    db.withdrawals.push(novoPedido);

    salvarDB(db);

    res.redirect("/withdraw/history");

});

// ===============================
// HISTÓRICO DE LEVANTAMENTOS
// ===============================

app.get("/withdraw/history", (req, res) => {

    if (!req.session.user) {

        return res.redirect("/login");

    }

    const db = carregarDB();

    const user = db.users.find(

        u =>
            u.id === req.session.user.id

    );

    if (!user) {

        return res.redirect("/login");

    }

    const pedidos =
        (db.withdrawals || []).filter(

            pedido =>
                pedido.userId === user.id

        );

    res.render("withdraw-history", {

        pedidos,

        user

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

        return res.redirect(
            "/admin/dashboard"
        );

    }

    res.render("admin-login", {

        error: null

    });

});

app.post("/admin/login", (req, res) => {

    const { username, password } = req.body;

    const ADMIN_USER =
        "sitoljoaquim5@gmail.com";

    const ADMIN_PASSWORD =
        "25122001";

    if (

        username === ADMIN_USER &&

        password === ADMIN_PASSWORD

    ) {

        req.session.admin = true;

        return res.redirect(
            "/admin/dashboard"
        );

    }

    res.render("admin-login", {

        error:
            "Dados de administrador incorretos."

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

        totalUsers:
            db.users.length,

        totalTasks:
            db.tasks.length

    });

});

// ===============================
// UTILIZADORES ADMIN
// ===============================

app.get("/admin/users", (req, res) => {

    if (!req.session.admin) {

        return res.redirect("/admin");

    }

    const db = carregarDB();

    const usuarios =
        (db.users || []).map(user => ({

            id: user.id,

            telefone: user.telefone,

            saldo: user.saldo || 0,

            bloqueado:
                user.bloqueado === true,

            criadoEm:
                user.criadoEm || "—"

        }));

    res.render("admin-users", {

        usuarios

    });

});

// ===============================
// BLOQUEAR / DESBLOQUEAR
// ===============================

app.post(
    "/admin/users/:id/toggle-block",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const userId =
            Number(req.params.id);

        const db = carregarDB();

        const user = db.users.find(

            u => u.id === userId

        );

        if (!user) {

            return res.redirect(
                "/admin/users"
            );

        }

        user.bloqueado =
            user.bloqueado !== true;

        salvarDB(db);

        res.redirect("/admin/users");

    }

);

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

    if (

        !titulo ||

        !descricao ||

        !valor ||

        !vagas

    ) {

        return res.render("create-task", {

            error:
                "Preencha todos os campos.",

            success: null

        });

    }

    const db = carregarDB();

    const novaTarefa = {

        id:
            Date.now() +
            Math.floor(Math.random() * 1000),

        titulo,

        descricao,

        valor: Number(valor),

        vagas: Number(vagas),

        participantes: [],

        status: "ativa",

        criadoEm:
            new Date().toLocaleString("pt-PT")

    };

    db.tasks.push(novaTarefa);

    salvarDB(db);

    res.render("create-task", {

        error: null,

        success:
            "Tarefa criada e publicada com sucesso!"

    });

});

// ===============================
// GERIR TAREFAS
// ===============================

app.get("/admin/tasks", (req, res) => {

    if (!req.session.admin) {

        return res.redirect("/admin");

    }

    const db = carregarDB();

    res.render("admin-tasks", {

        tasks: db.tasks || []

    });

});

// ===============================
// ELIMINAR TAREFA
// ===============================

app.post(
    "/admin/tasks/:id/delete",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const taskId =
            Number(req.params.id);

        const db = carregarDB();

        const indice =
            db.tasks.findIndex(

                task =>
                    task.id === taskId

            );

        if (indice === -1) {

            return res.redirect(
                "/admin/tasks"
            );

        }

        db.tasks.splice(indice, 1);

        salvarDB(db);

        res.redirect("/admin/tasks");

    }

);

// ===============================
// VER PROVAS
// ===============================

app.get("/admin/proofs", (req, res) => {

    if (!req.session.admin) {

        return res.redirect("/admin");

    }

    const db = carregarDB();

    const provas = [];

    db.tasks.forEach(task => {

        if (!task.participantes) {

            return;

        }

        task.participantes.forEach(
            participante => {

                if (

                    participante.status ===
                        "aguardando" &&

                    participante.fotoProva

                ) {

                    const user =
                        db.users.find(

                            u =>
                                u.id ===
                                participante.userId

                        );

                    provas.push({

                        taskId: task.id,

                        taskTitulo:
                            task.titulo,

                        taskValor:
                            task.valor,

                        userId:
                            participante.userId,

                        telefone:
                            user
                                ? user.telefone
                                : "Desconhecido",

                        fotoProva:
                            participante.fotoProva,

                        linkProva:
                            participante.linkProva,

                        enviadaEm:
                            participante.provaEnviadaEm

                    });

                }

            }

        );

    });

    res.render("admin-proofs", {

        provas

    });

});

// ===============================
// APROVAR PROVA
// ===============================

app.post(
    "/admin/proofs/:taskId/:userId/approve",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const taskId =
            Number(req.params.taskId);

        const userId =
            Number(req.params.userId);

        const db = carregarDB();

        const task = db.tasks.find(

            task =>
                task.id === taskId

        );

        const user = db.users.find(

            user =>
                user.id === userId

        );

        if (!task || !user) {

            return res.send(
                "Tarefa ou utilizador não encontrado."
            );

        }

        const participante =
            task.participantes.find(

                p =>
                    p.userId === userId

            );

        if (!participante) {

            return res.send(
                "Participante não encontrado."
            );

        }

        if (
            participante.status === "aprovada"
        ) {

            return res.redirect(
                "/admin/proofs"
            );

        }

        participante.status = "aprovada";

        participante.aprovadaEm =
            new Date().toLocaleString("pt-PT");

        user.saldo =
            Number(user.saldo || 0) +
            Number(task.valor);

        criarNotificacao(

            db,

            userId,

            `🎉 A sua tarefa "${task.titulo}" foi aprovada! Foram adicionados ${Number(task.valor).toFixed(2)} MT ao seu saldo.`,

            "sucesso"

        );

        salvarDB(db);

        res.redirect("/admin/proofs");

    }

);

// ===============================
// REJEITAR PROVA
// ===============================

app.post(
    "/admin/proofs/:taskId/:userId/reject",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const taskId =
            Number(req.params.taskId);

        const userId =
            Number(req.params.userId);

        const db = carregarDB();

        const task = db.tasks.find(

            task =>
                task.id === taskId

        );

        if (!task) {

            return res.send(
                "Tarefa não encontrada."
            );

        }

        const participante =
            task.participantes.find(

                p =>
                    p.userId === userId

            );

        if (!participante) {

            return res.send(
                "Participante não encontrado."
            );

        }

        participante.status = "rejeitada";

        participante.rejeitadaEm =
            new Date().toLocaleString("pt-PT");

        salvarDB(db);

        res.redirect("/admin/proofs");

    }

);

// ===============================
// PEDIDOS DE LEVANTAMENTO
// ===============================

app.get(
    "/admin/withdrawals",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const db = carregarDB();

        res.render("admin-withdrawals", {

            pedidos:
                db.withdrawals || []

        });

    }

);

// ===============================
// MARCAR LEVANTAMENTO PAGO
// ===============================

app.post(
    "/admin/withdrawals/:id/paid",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const pedidoId =
            Number(req.params.id);

        const db = carregarDB();

        const pedido =
            db.withdrawals.find(

                p =>
                    p.id === pedidoId

            );

        if (!pedido) {

            return res.send(
                "Pedido não encontrado."
            );

        }

        if (
            pedido.status !== "pendente"
        ) {

            return res.redirect(
                "/admin/withdrawals"
            );

        }

        pedido.status = "pago";

        pedido.pagoEm =
            new Date().toLocaleString("pt-PT");

        salvarDB(db);

        res.redirect("/admin/withdrawals");

    }

);

// ===============================
// REJEITAR LEVANTAMENTO
// ===============================

app.post(
    "/admin/withdrawals/:id/reject",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const pedidoId =
            Number(req.params.id);

        const db = carregarDB();

        const pedido =
            db.withdrawals.find(

                p =>
                    p.id === pedidoId

            );

        if (!pedido) {

            return res.send(
                "Pedido não encontrado."
            );

        }

        if (
            pedido.status !== "pendente"
        ) {

            return res.redirect(
                "/admin/withdrawals"
            );

        }

        const user =
            db.users.find(

                u =>
                    u.id === pedido.userId

            );

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

    }

);

// ===============================
// MENSAGENS ADMIN
// ===============================

app.get("/admin/messages", (req, res) => {

    if (!req.session.admin) {

        return res.redirect("/admin");

    }

    const db = carregarDB();

    res.render("admin-messages", {

        usuarios: db.users || [],

        enviado:
            req.query.enviado === "1",

        erro:
            req.query.erro || ""

    });

});

app.post("/admin/messages", (req, res) => {

    if (!req.session.admin) {

        return res.redirect("/admin");

    }

    const {

        destinatario,

        mensagem

    } = req.body;

    if (

        !mensagem ||

        !mensagem.trim()

    ) {

        return res.redirect(
            "/admin/messages?erro=Escreva uma mensagem"
        );

    }

    const db = carregarDB();

    const texto = mensagem.trim();

    if (destinatario === "todos") {

        (db.users || []).forEach(user => {

            criarNotificacao(

                db,

                user.id,

                texto,

                "admin"

            );

        });

    } else {

        const userId =
            Number(destinatario);

        const user =
            (db.users || []).find(

                u => u.id === userId

            );

        if (!user) {

            return res.redirect(

                "/admin/messages?erro=Utilizador não encontrado"

            );

        }

        criarNotificacao(

            db,

            user.id,

            texto,

            "admin"

        );

    }

    salvarDB(db);

    res.redirect(
        "/admin/messages?enviado=1"
    );

});

// ===============================
// RESPOSTA UTILIZADOR AO ADMIN
// ===============================

app.post(
    "/notifications/reply",

    (req, res) => {

        if (!req.session.user) {

            return res.redirect("/login");

        }

        const { mensagem } = req.body;

        if (

            !mensagem ||

            !mensagem.trim()

        ) {

            return res.redirect(
                "/notifications"
            );

        }

        const db = carregarDB();

        db.messages.push({

            id:
                Date.now() +
                Math.floor(Math.random() * 1000),

            userId:
                req.session.user.id,

            telefone:
                req.session.user.telefone,

            mensagem:
                mensagem.trim(),

            remetente:
                "utilizador",

            lida: false,

            criadaEm:
                new Date().toLocaleString("pt-PT")

        });

        salvarDB(db);

        res.redirect(
            "/notifications?respondido=1"
        );

    }

);

// ===============================
// CAIXA DE ENTRADA ADMIN
// ===============================

app.get(
    "/admin/messages/inbox",

    (req, res) => {

        if (!req.session.admin) {

            return res.redirect("/admin");

        }

        const db = carregarDB();

        const mensagens =
            (db.messages || [])
                .slice()
                .reverse();

        res.render("admin-message-inbox", {

            mensagens

        });

    }

);

// ===============================
// NOTIFICAÇÕES UTILIZADOR
// ===============================

app.get("/notifications", (req, res) => {

    if (!req.session.user) {

        return res.redirect("/login");

    }

    const db = carregarDB();

    const user = db.users.find(

        u =>
            u.id === req.session.user.id

    );

    if (!user) {

        return res.redirect("/login");

    }

    const notificacoes =
        (db.notifications || [])

            .filter(

                n =>
                    n.userId === user.id

            )

            .reverse();

    (db.notifications || []).forEach(n => {

        if (n.userId === user.id) {

            n.lida = true;

        }

    });

    salvarDB(db);

    res.render("notifications", {

        notificacoes,

        user

    });

});

// ===============================
// LOGOUT ADMIN
// ===============================

app.get("/admin/logout", (req, res) => {

    req.session.destroy(err => {

        if (err) {

            return res.redirect(
                "/admin/dashboard"
            );

        }

        res.redirect("/admin");

    });

});

// ===============================
// INICIAR SERVIDOR
// ===============================

async function iniciarServidor() {

    try {

        await ligarMongoDB();

        app.listen(PORT, () => {

            console.log("");
            console.log("🇲🇿 TASKMZ");
            console.log("💰 Plataforma de Microtarefas");
            console.log("💾 MongoDB conectado");
            console.log(
                `🌐 http://localhost:${PORT}`
            );
            console.log("");

        });

    } catch (error) {

        console.error(
            "❌ O servidor não conseguiu iniciar."
        );

        process.exit(1);

    }

}
iniciarServidor();
