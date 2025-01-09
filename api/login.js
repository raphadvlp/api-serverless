import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = [
  { id: 1, login: "user1", password: bcrypt.hashSync("123", 8) },
  { id: 2, login: "user2", password: bcrypt.hashSync("123", 8) },
];

const SECRET_KEY = "minha_chave_secreta";

export default (req, res) => {
  // Configuração de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Trata requisição OPTIONS (Preflight do CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  // Suporte para Query Parameters ou JSON Body
  const { login, password } = req.query || req.body;

  if (!login || !password) {
    return res
      .status(400)
      .json({ message: "Login e Password são obrigatórios!" });
  }

  const user = users.find((u) => u.login === login);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Senha inválida!" });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.status(200).json({ message: "Login realizado com sucesso!", token });
};
