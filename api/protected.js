import jwt from "jsonwebtoken";

const SECRET_KEY = "minha_chave_secreta";

export default (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Token não fornecido!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido!" });
    }

    res.status(200).json({ message: "Acesso autorizado!", userId: decoded.id });
  });
};
