import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10); //hasea la password

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save(); // guarda el usuario en la db
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token); // creo la cookie
    // que queremos que nos devuelva, para poder usarlo en el front end. No neceistamos el password.
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updaeAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password); //compara el password con el que busca en MongoDB

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token); // creo la cookie
    // que queremos que nos devuelva, para poder usarlo en el front end. No neceistamos el password.
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updaeAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
