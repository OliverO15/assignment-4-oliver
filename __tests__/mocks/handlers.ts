import { DefaultBodyType, http, HttpResponse } from "msw";
import type { Todo } from "../../types/todo";

const initialTodos: Todo[] = [
  { id: "1", text: "Learn Testing", completed: false },
  { id: "2", text: "Write Tests", completed: true },
];

let mockTodos = [...initialTodos];

export const resetTodos = () => {
  mockTodos = [...initialTodos];
};

export const handlers = [
  http.get("/api/todos", () => {
    return HttpResponse.json(mockTodos);
  }),
  // 🧑‍🏫 Add other handlers such as POST and PUT here
  http.post("/api/todos", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const { text } = (await request.json()) as { text: string };
    // Create a new post object with the received text.
    const newPost: Todo = {
      id: Date.now().toString(),
      text: text,
      completed: false,
    }

    // Add the new post to the list of posts.
    mockTodos.push(newPost)

    // Don't forget to declare a semantic "201 Created"
    return HttpResponse.json(newPost, { status: 201 })
  }),
  http.put("/api/todos", async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const todo = mockTodos.find((todo) => todo.id === id)

    if (!todo) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 })
    }

    todo.completed = !todo.completed

    return HttpResponse.json(mockTodos, { status: 201 })
  }),
  http.delete("/api/todos", async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const todoIndex = mockTodos.findIndex((todo) => todo.id === id)

    if (todoIndex === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 })
    }

    mockTodos.splice(todoIndex, 1)

    return HttpResponse.json(mockTodos, { status: 200 })
  }),
];
