import { NextResponse } from "next/server"
import Property from "@/models/Property"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const properties = await Property.findAll()
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const newProperty = await Property.create(body)
    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

