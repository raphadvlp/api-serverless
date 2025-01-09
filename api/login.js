import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = [
  { id: 1, login: "user1", password: bcrypt.hashSync("123", 8) },
  { id: 2, login: "user2", password: bcrypt.hashSync("123", 8) },
];

const SECRET_KEY = "minha_chave_secreta";

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  // Verifique o req.query para Query Parameters
  const { login, password } = req.query;

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
