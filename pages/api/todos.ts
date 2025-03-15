import type { NextApiRequest, NextApiResponse } from "next";
// import type { Todo } from "../../types/todo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const todos = await prisma.todo.findMany(); // Fetch all todos
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const newTodo = await prisma.todo.create({
      data: { text, completed: false },
    });

    return res.status(201).json(newTodo);
  }

  if (req.method === "PUT") {
    const { id } = req.query;

    const existingTodo = await prisma.todo.findUnique({
      where: { id: id as string },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: id as string },
      data: { completed: !existingTodo.completed }, // Toggles the completed status
    });

    return res.status(200).json(updatedTodo);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    await prisma.todo.delete({
      where: { id: id as string },
    });

    return res.status(200).json({ message: "Todo deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
