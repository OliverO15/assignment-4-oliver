import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // 🧑‍🏫 Use this to act like a user
import Home from "../pages/index";

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
});
