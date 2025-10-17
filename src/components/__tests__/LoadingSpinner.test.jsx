import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner and text", () => {
    render(<LoadingSpinner />);

    expect(screen.getByText("Loading currency rates...")).toBeInTheDocument();

    // Check if spinner element exists
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toHaveClass(
      "animate-spin",
      "rounded-full",
      "h-12",
      "w-12",
      "border-b-2",
      "border-blue-600"
    );
  });
});
