// para limitar rutas de acceso en funcion de si estas registrado

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies; // es necesario instalar cookie-parse e importarlo en app.js para que nos de solamente la cookie

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid Token",
      });
    }
    req.user = user;
    next();
  });
};
