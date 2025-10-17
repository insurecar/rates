import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { CurrencyControls } from "../CurrencyControls";
import { createStore } from "redux";
import currencyReducer from "../../store/currencyReducer";

const createMockStore = (initialState = {}) => {
  return createStore(currencyReducer, initialState);
};

const mockAvailableCurrencies = {
  usd: "US Dollar",
  eur: "Euro",
  jpy: "Japanese Yen",
  gbp: "British Pound Sterling",
  chf: "Swiss Franc",
  cad: "Canadian Dollar",
  aud: "Australian Dollar",
  zar: "South African Rand",
};

describe("CurrencyControls", () => {
  const defaultProps = {
    baseCurrency: "gbp",
    selectedDate: "2024-10-17",
    availableCurrencies: mockAvailableCurrencies,
    targetCurrencies: ["usd", "eur", "jpy", "chf", "cad", "aud", "zar"],
    onBaseCurrencyChange: vi.fn(),
    onDateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form elements", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <CurrencyControls {...defaultProps} />
      </Provider>
    );

    expect(screen.getByDisplayValue("2024-10-17")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Currency" })
    ).toBeInTheDocument();
    expect(screen.getByText("7/7 currencies selected")).toBeInTheDocument();
  });

  it("shows current currencies", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <CurrencyControls {...defaultProps} />
      </Provider>
    );

    expect(screen.getAllByText("USD - US Dollar")).toHaveLength(2); // In select and in current currencies
    expect(screen.getAllByText("EUR - Euro")).toHaveLength(2);
    expect(screen.getAllByText("JPY - Japanese Yen")).toHaveLength(2);
  });

  it("calls onBaseCurrencyChange when base currency changes", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <CurrencyControls {...defaultProps} />
      </Provider>
    );

    const baseCurrencySelect = screen.getByRole("combobox");
    fireEvent.change(baseCurrencySelect, { target: { value: "usd" } });

    expect(defaultProps.onBaseCurrencyChange).toHaveBeenCalledWith("usd");
  });

  it("calls onDateChange when date changes", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <CurrencyControls {...defaultProps} />
      </Provider>
    );

    const dateInput = screen.getByDisplayValue("2024-10-17");
    fireEvent.change(dateInput, { target: { value: "2024-10-16" } });

    expect(defaultProps.onDateChange).toHaveBeenCalledWith("2024-10-16");
  });

  it("disables Add Currency button when max currencies reached", () => {
    const mockStore = createMockStore();
    render(
      <Provider store={mockStore}>
        <CurrencyControls {...defaultProps} />
      </Provider>
    );

    const addButton = screen.getByRole("button", { name: "Add Currency" });
    expect(addButton).toBeDisabled();
  });

  it("shows add currency dropdown when button is clicked", () => {
    const mockStore = createMockStore();
    const propsWithLessCurrencies = {
      ...defaultProps,
      targetCurrencies: ["usd", "eur"],
    };

    render(
      <Provider store={mockStore}>
        <CurrencyControls {...propsWithLessCurrencies} />
      </Provider>
    );

    const addButton = screen.getByRole("button", { name: "Add Currency" });
    fireEvent.click(addButton);

    expect(screen.getByText("Select Currency to Add")).toBeInTheDocument();
  });
});
