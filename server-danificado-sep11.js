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
// INICIAR SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log("");
    console.log("🇲🇿 TASKMZ");
    console.log("💰 Plataforma de Microtarefas");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("");
});
