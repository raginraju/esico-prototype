import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IDCards from "../src/pages/IDCards";

describe("IDCards", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders fetched ID cards", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: [{ id: "1", name: "Aisha", file_number: "F-1", civil_id_number: "C-1", designation: "Inspector", expiry_date: "2027-01-01" }] }))
    );
    render(<IDCards />, { wrapper: MemoryRouter });

    expect(await screen.findByText("Aisha")).toBeInTheDocument();
    expect(screen.getByText("1 - 1 of 1 Entries")).toBeInTheDocument();
  });

  it("opens the add-card modal", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: [] }))
    );
    render(<IDCards />, { wrapper: MemoryRouter });
    await screen.findByText(/No ID cards found/);

    fireEvent.click(screen.getByRole("button", { name: "Add New" }));

    expect(screen.getByText("Add New ID Card")).toBeInTheDocument();
  });
});