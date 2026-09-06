import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Portal from "../src/pages/Portal";

describe("Portal", () => {
  it("renders recent inspection reports", () => {
    render(<Portal />, { wrapper: MemoryRouter });

    expect(screen.getByText("ESICO Inspector Portal")).toBeInTheDocument();
    expect(screen.getByText("Recent Inspection Reports")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /View Sheet/i }).length).toBeGreaterThan(0);
  });

  it("clears the portal token on logout", () => {
    localStorage.setItem("esico_demo_token", "demo-token");
    render(<Portal />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));

    expect(localStorage.getItem("esico_demo_token")).toBeNull();
  });

  it("shows the new inspection notice", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Portal />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /New Inspection/i }));

    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});