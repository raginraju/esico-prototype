import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Settings from "../src/pages/Settings";

describe("Settings", () => {
  it("loads the signed-in user's details and signature controls", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({
      authenticated: true,
      user: { id: "u-1", name: "Aisha Khan", email: "aisha@example.com", mobile: "0501234567", role: "INSPECTOR" },
    })));
    render(<Settings />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Aisha Khan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("aisha@example.com")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("0501234567")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("toggles password visibility and saves profile changes", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      if (input === "/api/auth/profile") {
        return new Response(JSON.stringify({
          status: "success",
          user: { id: "u-1", name: "Aisha Updated", email: "aisha@example.com", mobile: "0501234567", gender: "Female", role: "INSPECTOR" },
        }));
      }
      return new Response(JSON.stringify({
        authenticated: true,
        user: { id: "u-1", name: "Aisha Khan", email: "aisha@example.com", mobile: "0501234567", gender: "Male", role: "INSPECTOR" },
      }));
    });
    render(<Settings />);

    const fullNameInput = await screen.findByDisplayValue("Aisha Khan");
    const passwordInputs = screen.getAllByPlaceholderText("Password");
    expect(passwordInputs[0]).toHaveAttribute("type", "password");
    fireEvent.click(passwordInputs[0].parentElement!.querySelector("button")!);
    expect(passwordInputs[0]).toHaveAttribute("type", "text");

    fireEvent.change(fullNameInput, { target: { value: "Aisha Updated" } });
    fireEvent.change(screen.getByLabelText("Gender"), { target: { value: "Female" } });
    fireEvent.change(passwordInputs[0], { target: { value: "new-password-123" } });
    fireEvent.change(passwordInputs[1], { target: { value: "new-password-123" } });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/profile",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ name: "Aisha Updated", gender: "Female", password: "new-password-123" }),
      })
    ));
    expect(await screen.findByText("Profile updated successfully.")).toBeInTheDocument();
  });

  it("captures the signature into the inspector signature preview", () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({
      authenticated: true,
      user: { id: "u-1", name: "Aisha Khan", email: "aisha@example.com", mobile: "0501234567", role: "INSPECTOR" },
    })));
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,captured-signature");
    render(<Settings />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("img", { name: "Inspector Signature" })).toHaveAttribute(
      "src",
      "data:image/png;base64,captured-signature"
    );
  });

  it("renders inspector and QC signatures in equally sized preview slots", () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({
      authenticated: true,
      user: { id: "u-1", name: "Aisha Khan", email: "aisha@example.com", mobile: "0501234567", role: "INSPECTOR" },
    })));
    render(<Settings />);

    expect(screen.getByRole("img", { name: "Inspector Signature" })).toHaveClass("h-full", "w-full", "object-contain");
    expect(screen.getByRole("img", { name: "QC Signature" })).toHaveClass("h-full", "w-full", "object-contain");
  });
});