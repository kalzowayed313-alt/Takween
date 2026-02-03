
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const tasks = await prisma.task.findMany()
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const body = await req.json()

  const task = await prisma.task.create({
    data: body
  })

  return NextResponse.json(task)
}
