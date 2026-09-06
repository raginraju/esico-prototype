import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ViewPDF from "../src/pages/ViewPDF";

describe("ViewPDF", () => {
  beforeEach(() => vi.restoreAllMocks());

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
});