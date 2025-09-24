import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  displayName?: string;
  password?: string;
  role?: "Admin" | "User";
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  password: { type: String },
  role: { type: String, default: "User" }
}, { timestamps: true });

const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
