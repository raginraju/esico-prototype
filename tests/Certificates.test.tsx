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
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("loads and displays certificate records", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: [certificate], pagination: { total: 1, totalPages: 1 } }))
    );
    render(<Certificates />, { wrapper: MemoryRouter });

    expect(await screen.findByText("ESICO-001")).toBeInTheDocument();
    expect(screen.getByText("1 - 1 of 1 Entries")).toBeInTheDocument();
  });

  it("downloads the stored PDF for a certificate", async () => {
    const createObjectURL = vi.fn(() => "blob:certificate-pdf");
    vi.stubGlobal("URL", Object.assign(class extends URL {}, { createObjectURL }));
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      if (String(input).endsWith("/cert-1/pdf")) return new Response("%PDF");
      return new Response(JSON.stringify({
        status: "success",
        data: [certificate],
        pagination: { total: 1, totalPages: 1 },
      }));
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<Certificates />, { wrapper: MemoryRouter });
    fireEvent.click(await screen.findByRole("button", { name: "Download certificate" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/certificates/cert-1/pdf",
      expect.objectContaining({ headers: expect.any(Object) })
    ));
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });

  it("displays the inspector name before the inspected-by value", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        status: "success",
        data: [{ ...certificate, inspector_name: "Ada Inspector", inspected_by: "inspector-1" }],
        pagination: { total: 1, totalPages: 1 },
      }))
    );
    render(<Certificates />, { wrapper: MemoryRouter });

    expect(await screen.findByText("Ada Inspector")).toBeInTheDocument();
    expect(screen.queryByText("inspector-1")).not.toBeInTheDocument();
  });

  it("loads inspectors for the filter", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      if (input === "/api/certificates/inspectors") {
        return new Response(JSON.stringify({
          status: "success",
          data: [{ id: "inspector-1", name: "Ada Inspector" }],
        }));
      }

      return new Response(JSON.stringify({ status: "success", data: [], pagination: { total: 0, totalPages: 1 } }));
    });

    render(<Certificates />, { wrapper: MemoryRouter });

    expect(await screen.findByRole("option", { name: "Ada Inspector" })).toBeInTheDocument();
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

  it("sends the selected inspector as an API filter", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      if (input === "/api/certificates/inspectors") {
        return new Response(JSON.stringify({
          status: "success",
          data: [{ id: "inspector-1", name: "Ada Inspector" }],
        }));
      }

      return new Response(JSON.stringify({ status: "success", data: [], pagination: { total: 0, totalPages: 1 } }));
    });

    render(<Certificates />, { wrapper: MemoryRouter });
    const inspectorSelect = (await screen.findAllByRole("combobox"))[0];
    fireEvent.change(inspectorSelect, { target: { value: "Ada Inspector" } });
    fireEvent.click(screen.getByTitle("Search"));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/certificates?page=1&limit=10&inspector=Ada+Inspector"
      )
    );
  });
});