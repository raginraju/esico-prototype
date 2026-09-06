import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import NewCertificate from "../src/pages/NewCertificate";

describe("NewCertificate", () => {
  it("renders the certificate form and supports a custom title", () => {
    render(<NewCertificate />, { wrapper: MemoryRouter });

    expect(screen.getByText("Add New Certificate")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "New" }));

    expect(screen.getByPlaceholderText("Enter custom certificate title...")).toBeInTheDocument();
  });

  it("validates required fields before submitting", () => {
    render(<NewCertificate />, { wrapper: MemoryRouter });
    const reportNumber = screen.getByPlaceholderText("ESICO-LFT-RXX-XXX");
    fireEvent.change(reportNumber, { target: { value: "ESICO-123" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Name and Address of employer is required.")).toBeInTheDocument();
  });

  it("submits the required certificate data", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "success" }), { status: 200 })
    );
    render(<NewCertificate />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("ESICO-LFT-RXX-XXX"), { target: { value: "esico-123" } });
    fireEvent.change(screen.getAllByPlaceholderText("Type something...")[1], { target: { value: "Acme" } });
    fireEvent.change(screen.getByPlaceholderText("Equipment description, specifications, serial numbers..."), { target: { value: "Crane" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/certificates", expect.objectContaining({ method: "POST" })));
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({ report_number: "ESICO-123", equipment_description: "Crane" });
  });
});