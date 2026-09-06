import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Settings from "../src/pages/Settings";

describe("Settings", () => {
  it("renders editable details and signature controls", () => {
    render(<Settings />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByDisplayValue("EMAAR SUPPORT INSPECTION COMPANY")).toBeInTheDocument();
    expect(screen.getByDisplayValue("info@esico.com.sa")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("toggles password visibility and reports updated details", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Settings />);

    const passwordInputs = screen.getAllByPlaceholderText("Password");
    expect(passwordInputs[0]).toHaveAttribute("type", "password");
    fireEvent.click(passwordInputs[0].parentElement!.querySelector("button")!);
    expect(passwordInputs[0]).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    expect(alertSpy).toHaveBeenCalledWith("Personal details updated");
    alertSpy.mockRestore();
  });
});