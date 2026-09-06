import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "../src/pages/Dashboard";

describe("Dashboard", () => {
  it("renders the page heading and KPI values", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total Certificates")).toBeInTheDocument();
    expect(screen.getByText("11016")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
  });
});