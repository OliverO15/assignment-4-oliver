import type { NextApiRequest, NextApiResponse } from "next";
import type { Todo } from "../../types/todo";

let todos: Todo[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const todo: Todo = {
      id: Date.now().toString(),
      text: req.body.text,
      completed: false,
    };
    todos.push(todo);
    return res.status(201).json(todo);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    return res.status(200).json(todos);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    todos = todos.filter((todo) => todo.id !== id);
    return res.status(200).json(todos);
  }
}
