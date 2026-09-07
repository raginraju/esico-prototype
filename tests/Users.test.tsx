import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Users from "../src/pages/Users";

describe("Users", () => {
  it("renders users from the API and pagination", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({
        status: "success",
        data: [{ id: "1", name: "Osama El Fayoumy", mobile: "0596842937", email: "osama@smart-const.com", status: "Pending" }],
        pagination: { total: 31 },
      }),
    }));

    render(<Users />);

    await waitFor(() => expect(screen.getByText("Osama El Fayoumy")).toBeInTheDocument());
    expect(screen.getByText("osama@smart-const.com")).toBeInTheDocument();
    expect(screen.getByText("1 - 1 of 31 Entries")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("renders the user table and pagination", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({ status: "success", data: [], pagination: { total: 0 } }),
    }));
    render(<Users />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Loading users...")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("opens the add-user action", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: async () => ({ status: "success", data: [], pagination: { total: 0 } }),
    }));
    render(<Users />);

    fireEvent.click(screen.getByRole("button", { name: "Add New" }));

    expect(screen.getByRole("dialog", { name: "Add New User" })).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});