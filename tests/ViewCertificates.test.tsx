import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ViewCertificates from "../src/pages/ViewCertificates";

describe("ViewCertificates", () => {
  it("renders the default verification form", () => {
    render(<ViewCertificates />, { wrapper: MemoryRouter });

    expect(screen.getByText("Hey! Quickly Verify Your Certificates Here.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ESICO-LFT-R26-8491")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Certificate" })).toBeChecked();
  });

  it("navigates to the PDF route when searched", () => {
    render(
      <MemoryRouter initialEntries={["/viewcertificates"]}>
        <Routes>
          <Route path="/viewcertificates" element={<ViewCertificates />} />
          <Route path="/viewPDF/:id" element={<div>PDF destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByDisplayValue("ESICO-LFT-R26-8491"), { target: { value: "CERT/42" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByText("PDF destination")).toBeInTheDocument();
  });
});