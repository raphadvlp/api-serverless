import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = [
  { id: 1, login: "rapha", password: bcrypt.hashSync("123", 8) },
  { id: 2, login: "user2", password: bcrypt.hashSync("123", 8) },
];

const SECRET_KEY = "minha_chave_secreta";
const REFRESH_SECRET_KEY = "minha_chave_secreta_refresh"; // Chave secreta para o refresh token
const TOKEN_EXPIRATION = "1h"; // Expiração do access token
const REFRESH_TOKEN_EXPIRATION = "30d"; // Expiração do refresh token

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

  // Gera o access token (1 hora de expiração)
  const access_token = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });

  // Gera o refresh token (30 dias de expiração)
  const refresh_token = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  // Calcula o tempo de expiração do access token em segundos
  const access_token_expires_in = 60 * 60; // Expiração do access token em segundos (1 hora)

  // Calcula o tempo de expiração do refresh token em segundos
  const refresh_token_expires_in = 60 * 60 * 24 * 30; // Expiração do refresh token em segundos (30 dias)

  res.status(200).json({
    message: "Login realizado com sucesso!",
    access_token,
    refresh_token,
    expires_in: access_token_expires_in, // Tempo de expiração do access token (em segundos)
    refresh_expires_in: refresh_token_expires_in, // Tempo de expiração do refresh token (em segundos)
  });
};
