import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const EXPIRY = (process.env.TOKEN_EXPIRY || "1h") as string; // keep as string

if (!SECRET) throw new Error("ACCESS_TOKEN_SECRET not defined");

export const signToken = (payload: Record<string, any>) => {
  const options: SignOptions = { expiresIn: EXPIRY as SignOptions["expiresIn"] };
  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as Record<string, any>;
};
