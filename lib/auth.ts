import User from "../models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function login(email: string, password: string): Promise<string | null> {
  try {
    const user = await User.findOne({ where: { email } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      })
      return token
    }
    return null
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

export async function register(name: string, email: string, password: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: hashedPassword })
    return true
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; email: string }
  } catch (error) {
    return null
  }
}

