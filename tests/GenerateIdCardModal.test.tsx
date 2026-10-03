import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GenerateIdCardModal from "../src/components/modals/GenerateIdCardModal";

describe("GenerateIdCardModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it("requires all generated card fields", async () => {
    render(<GenerateIdCardModal isOpen onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByRole("img", { name: "Saudi Aramco" })).toBeInTheDocument();
    expect(screen.getByText(/THIS IS NOT A SAUDI GOVERNMENT DRIVING LICENSE/i)).toBeInTheDocument();
    expect(screen.getByText("CO. NAME:")).toHaveClass("whitespace-nowrap");
    expect(screen.getByLabelText(/Employee Photo/)).toHaveAttribute("type", "file");
    await userEvent.click(screen.getByRole("button", { name: /Generate & Save/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/all ID card fields/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("saves the card fields and enables printing", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ status: "success" }),
    } as Response);

    render(<GenerateIdCardModal isOpen onClose={vi.fn()} onSuccess={vi.fn()} />);

    const fields = [
      ["Name", "Aisha Khan"],
      ["Company Name", "MSSI Company"],
      ["File Number", "F-100"],
      ["Civil ID", "C-200"],
      ["Designation", "Inspector"],
      ["Type / Model", "LTM 1160"],
      ["Capacity / SWL", "1100 t"],
      ["Expiry Date", "2027-01-01"],
    ];

    for (const [label, value] of fields) {
      await userEvent.type(screen.getByLabelText(label), value);
    }

    await userEvent.click(screen.getByRole("button", { name: /Generate & Save/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      "/api/idcards",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) })
    ));

    const request = vi.mocked(global.fetch).mock.calls[0][1];
    const body = request?.body as FormData;
    expect(body.get("name")).toBe("Aisha Khan");
    expect(body.get("company_name")).toBe("MSSI Company");
    expect(body.get("file_number")).toBe("F-100");
    expect(body.get("civil_id_number")).toBe("C-200");
    expect(body.get("designation")).toBe("Inspector");
    expect(body.get("type_model")).toBe("LTM 1160");
    expect(body.get("capacity_swl")).toBe("1100 t");
    expect(body.get("expiry_date")).toBe("2027-01-01");
    expect(screen.getByRole("button", { name: /Print Card/i })).toBeEnabled();
  });
});