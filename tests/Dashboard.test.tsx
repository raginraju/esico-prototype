import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "../src/pages/Dashboard";

describe("Dashboard", () => {
  it("loads certificate KPI values", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        status: "success",
        data: {
          total: 12,
          week: 3,
          month: 7,
          weekStart: "2026-09-14",
          weekEnd: "2026-09-20",
          monthLabel: "September",
        },
      }))
    );
    render(<Dashboard />);

    await waitFor(() => expect(screen.getByText("12")).toBeInTheDocument());
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders the page heading and KPI values", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total Certificates")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
  });
});