import { NextFunction, Request, Response } from "express";
import User from "../database/models/User";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, publicKey } = req.body;
  let user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    publicKey,
  });

  res.json({ user });
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user = await User.findOne({ where: { email } });
}


export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ where: { id: req.params.publicKey } });
  res.json({ user });
}