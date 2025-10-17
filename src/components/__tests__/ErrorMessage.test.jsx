import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { ErrorMessage } from "../ErrorMessage";
import { createStore } from "redux";
import currencyReducer from "../../store/currencyReducer";

// Mock store for testing
const createMockStore = (initialState = {}) => {
  return createStore(currencyReducer, initialState);
};

describe("ErrorMessage", () => {
  it("renders error message", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <ErrorMessage message="Test error message" />
      </Provider>
    );

    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("has close button", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <ErrorMessage message="Test error message" />
      </Provider>
    );

    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls clearError when close button is clicked", () => {
    const mockStore = createMockStore();
    const dispatchSpy = vi.spyOn(mockStore, "dispatch");

    render(
      <Provider store={mockStore}>
        <ErrorMessage message="Test error message" />
      </Provider>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "CLEAR_ERROR" });
  });
});
