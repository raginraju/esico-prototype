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
    expect(screen.getByLabelText("Gender")).toHaveValue("");
    vi.unstubAllGlobals();
  });

  it("sends the selected gender when creating a user", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (input === "/api/users" && init?.method === "POST") {
        return new Response(JSON.stringify({ status: "success" }));
      }
      return new Response(JSON.stringify({ status: "success", data: [], pagination: { total: 0 } }));
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<Users />);

    fireEvent.click(screen.getByRole("button", { name: "Add New" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Aisha Khan" } });
    fireEvent.change(screen.getByLabelText("Mobile"), { target: { value: "0501234567" } });
    fireEvent.change(screen.getByLabelText("Gender"), { target: { value: "Female" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "aisha@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Add User" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Aisha Khan",
          mobile: "0501234567",
          gender: "Female",
          email: "aisha@example.com",
          password: "password123",
          status: "Pending",
        }),
      })
    ));
    vi.unstubAllGlobals();
  });
});