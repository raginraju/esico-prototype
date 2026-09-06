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

  it("prefills the form when duplicating a certificate", () => {
    render(
      <NewCertificate />,
      {
        wrapper: ({ children }) => (
          <MemoryRouter
            initialEntries={[{
              pathname: "/certificates/new",
              state: {
                duplicate: {
                  report_number: "ESICO-001",
                  certificate_title: "Test Certificate",
                  selected_date: "2026-09-01",
                  applied_standards: "BS 7121",
                  sticker_number: "ST-1",
                  employer_name_address: "Acme Co",
                  location: "Ras Tanura",
                  equipment_id: "EQ-1",
                  equipment_description: "Test crane",
                  safe_working_loads: "5T",
                  manufacturer_name: "Acme",
                  manufacture_date: "2020",
                  first_examined: "Yes",
                  installed_correctly: "Yes",
                  months_interval: "6",
                  exam_scheme: "Yes",
                  after_occur: "No",
                  defect: "NONE",
                  iminent_danger: "No",
                  defect2: "N/A",
                  repair_renewal: "NONE",
                  any_tests_carried: "NONE",
                  observation: "Clear",
                  safe_to_operate: "Yes",
                  date_of_issue: "2026-09-01",
                },
              },
            }]}
          >
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(screen.getByText("Duplicate Certificate")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/^ESICO-001-COPY-/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme Co")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test crane")).toBeInTheDocument();
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