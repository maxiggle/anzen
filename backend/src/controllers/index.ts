import { NextFunction, Request, Response } from "express";
import User from "../database/models/User";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, publicKey } = req.body;
  const user = await User.findOne({ where: { email } });
}


export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ where: { id: req.params.publicKey } });
  res.json({ user });
}