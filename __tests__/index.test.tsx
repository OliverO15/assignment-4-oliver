import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // 🧑‍🏫 Use this to act like a user
import Home from "../pages/index";
import { server } from "./setupMSW";
import { http, HttpResponse } from "msw";

// 🧑‍🏫 Todo add your UI tests here
describe("Todo List", () => {
  afterEach(() => {
    cleanup(); // 🧑‍🏫 Clean up the DOM after each test
  });

  // 🧑‍🏫 Example test
  it("should show todos when page is loaded", async () => {
    render(<Home />);

    const todo1 = await screen.findByText("Learn Testing"); // 🧑‍🏫 These are defined in __tests__/mocks/handlers.ts
    const todo2 = await screen.findByText("Write Tests");

    expect(todo1).toBeDefined();
    expect(todo2).toBeDefined();
    expect(
      todo2.parentElement?.querySelector('input[type="checkbox"]')
    ).toBeDefined();
  });

  // Write a test that asserts that loading is displayed when the response is not correct
  it("should show loading when response is not correct", async () => {
    server.use(
      // 🧑‍🏫 This will return a 500 status code
      http.get("/api/todos", (req, res, ctx) => {
        return new HttpResponse(null, {status: 500});
      }),
    )

    render(<Home />);
    const loading = await screen.findByText("Loading...");
    expect(loading).toBeDefined();
  });

  // Write a test that asserts that a single item is in the list when the component is loaded
  it("should show a single item in the list when the component is loaded", async () => {
    server.use(
      // 🧑‍🏫 This will return a single item
      http.get("/api/todos", (req, res, ctx) => {
        return HttpResponse.json([{ id: "1", text: "Learn Testing", completed: false }]);
      }),
    )

    render(<Home />);

    const todo1 = await screen.findByText("Learn Testing");
    expect(todo1).toBeDefined();
  });

  // Write a test that adds a new item to the list
  it("should add a new item to the list", async () => {
    render(<Home />);

    const input = await screen.findAllByPlaceholderText("Add a new todo...");
    const button = await screen.findAllByText("Add ✨");

    await userEvent.type(input[0], "New Todo");
    await userEvent.click(button[0]);

    await waitFor(async () => {
      const newTodo = await screen.findByText("New Todo");
      expect(newTodo).toBeDefined();
    }, {timeout: 2000});
  });

  // Write a test that removes an item from the list
  it("should remove an item from the list", async () => {
    render(<Home />);

    const todoElem1 = await screen.findByText("Learn Testing");
    const deleteButton = todoElem1.parentElement?.querySelector('button');
    
    await userEvent.click(deleteButton!);

    await waitFor(async () => {
      const todo = screen.queryByText("Learn Testing");
      expect(todo).toBeNull();
    }, {timeout: 2000});
  });
});
