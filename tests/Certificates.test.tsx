import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Certificates from "../src/pages/Certificates";

const certificate = {
  id: "cert-1",
  unique_id: "unique-1",
  report_number: "ESICO-001",
  sticker_number: "ST-1",
  location: "Ras Tanura",
  selected_date: "2026-09-01",
  inspector_name: "Jay Prakash",
  inspected_by: "Jay Prakash",
};

describe("Certificates", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("loads and displays certificate records", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: [certificate], pagination: { total: 1, totalPages: 1 } }))
    );
    render(<Certificates />, { wrapper: MemoryRouter });

    expect(await screen.findByText("ESICO-001")).toBeInTheDocument();
    expect(screen.getByText("1 - 1 of 1 Entries")).toBeInTheDocument();
  });

  it("sends the report search term and resets filters", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: [], pagination: { total: 0, totalPages: 1 } }))
    );
    const { container } = render(<Certificates />, { wrapper: MemoryRouter });
    await screen.findByText("No certificates found.");

    const reportInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    fireEvent.change(reportInput, { target: { value: "ESICO-001" } });
    fireEvent.click(screen.getByTitle("Search"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/certificates?page=1&limit=10&search=ESICO-001"));
    fireEvent.click(screen.getByTitle("Reset filters"));
    expect(reportInput).toHaveValue("");
  });
});