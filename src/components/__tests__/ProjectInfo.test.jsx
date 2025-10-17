import { render, screen } from "@testing-library/react";
import { ProjectInfo } from "../ProjectInfo";

describe("ProjectInfo", () => {
  it("renders project information", () => {
    render(<ProjectInfo />);

    expect(screen.getByText("About This Project")).toBeInTheDocument();
    expect(screen.getByText(/Features:/)).toBeInTheDocument();
    expect(screen.getByText(/Default:/)).toBeInTheDocument();
    expect(screen.getByText(/Customization:/)).toBeInTheDocument();
    expect(screen.getByText(/Data Source:/)).toBeInTheDocument();
  });

  it("contains correct content about features", () => {
    render(<ProjectInfo />);

    expect(
      screen.getByText(/View exchange rates for the last 7 days/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GBP compared against 7 major currencies/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Add\/remove currencies/)).toBeInTheDocument();
    expect(
      screen.getByText(/Real-time currency data from external API/)
    ).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    const { container } = render(<ProjectInfo />);
    const infoBox = container.firstChild;

    expect(infoBox).toHaveClass(
      "bg-blue-50",
      "border",
      "border-blue-200",
      "rounded-lg",
      "p-4",
      "mb-6"
    );
  });
});
