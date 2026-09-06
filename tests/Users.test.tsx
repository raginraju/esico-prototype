import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Users from "../src/pages/Users";

describe("Users", () => {
  it("renders the user table and pagination", () => {
    render(<Users />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Osama El Fayoumy")).toBeInTheDocument();
    expect(screen.getByText("osama@smart-const.com")).toBeInTheDocument();
    expect(screen.getByText("1 - 10 of 31 Entries")).toBeInTheDocument();
  });

  it("opens the add-user action", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Users />);

    fireEvent.click(screen.getByRole("button", { name: "Add New" }));

    expect(alertSpy).toHaveBeenCalledWith("Add New User");
    alertSpy.mockRestore();
  });
});