import { http, HttpResponse } from "msw";
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
];
