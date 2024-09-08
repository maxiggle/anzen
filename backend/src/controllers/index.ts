import { NextFunction, Request, Response } from "express";
import User from "../database/models/User";
import Attestation from "../database/models/Attestation";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, publicKey,role } = req.body;
  if(!role){
    return res.status(400).json({ message: "Role is required" });
  }
  let user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    role,
    publicKey,
  });

  res.json({ user });
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, publicKey } = req.body;
  let user = await User.findOne({ where: { email } });
  res.json({ user });
}


export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ where: { publicKey: req.params.publicKey } });
  res.json({ user });
}

export const AddAttestation = async (req: Request & { user: any }, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const attestationJson = req.body;
  const jsonString = JSON.stringify(attestationJson);

  const attestation = await Attestation.create({
    user_id: userId,
    json_data: jsonString
  });
  
  res.json({
    message: "Attestation JSON saved successfully",
    attestation
  });
}