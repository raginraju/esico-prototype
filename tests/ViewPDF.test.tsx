import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CertificateRecord } from "../src/types/certificate";
import ViewPDF from "../src/pages/ViewPDF";

describe("ViewPDF", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubGlobal("URL", Object.assign(class extends URL {}, {
      createObjectURL: vi.fn(() => "blob:certificate"),
      revokeObjectURL: vi.fn(),
    }));
  });

  const certificate = {
    id: "cert-1",
    report_number: "ESICO-001",
    certificate_title: "Certificate",
    equipment_description: "Equipment",
  } as CertificateRecord;

  it("shows the loading state while retrieving a certificate", () => {
    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}) as Promise<Response>);
    render(
      <MemoryRouter initialEntries={["/viewPDF/ESICO-001"]}>
        <Routes><Route path="/viewPDF/:id" element={<ViewPDF />} /></Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Retrieving certificate record...")).toBeInTheDocument();
  });

  it("shows the not-found state and returns to search", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "error", message: "Missing certificate" }), { status: 404 })
    );
    render(
      <MemoryRouter initialEntries={["/viewPDF/MISSING"]}>
        <Routes>
          <Route path="/viewPDF/:id" element={<ViewPDF />} />
          <Route path="/viewcertificates" element={<div>Search page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Certificate Not Found")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back to Search" }));
    expect(screen.getByText("Search page")).toBeInTheDocument();
  });

  it("displays the stored PDF for a certificate", async () => {
    const fetch = vi.spyOn(global, "fetch");
    fetch
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", data: certificate })))
      .mockResolvedValueOnce(new Response("%PDF", { headers: { "content-type": "application/pdf" } }));

    render(
      <MemoryRouter initialEntries={["/viewPDF/ESICO-001"]}>
        <Routes><Route path="/viewPDF/:id" element={<ViewPDF />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTitle("Certificate PDF")).toHaveAttribute("src", "blob:certificate");
    expect(fetch.mock.calls[1][0]).toBe("/api/certificates/cert-1/pdf");
  });

  it("shows an error when the stored PDF is missing", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", data: certificate })))
      .mockResolvedValueOnce(new Response("Not found", { status: 404 }));

    render(
      <MemoryRouter initialEntries={["/viewPDF/ESICO-001"]}>
        <Routes><Route path="/viewPDF/:id" element={<ViewPDF />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Certificate PDF Unavailable")).toBeInTheDocument();
  });
});