import { render, screen } from "@testing-library/react";
import { CurrencyTable } from "../CurrencyTable";

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

const mockRatesData = {
  "2024-10-17": {
    gbp: {
      usd: 1.265,
      eur: 1.175,
      jpy: 185.5,
    },
  },
  "2024-10-16": {
    gbp: {
      usd: 1.27,
      eur: 1.18,
      jpy: 186.0,
    },
  },
};

describe("CurrencyTable", () => {
  const defaultProps = {
    baseCurrency: "gbp",
    targetCurrencies: ["usd", "eur", "jpy"],
    ratesData: mockRatesData,
    selectedDate: "2024-10-17",
    availableCurrencies: mockAvailableCurrencies,
  };

  it("renders table with correct headers", () => {
    render(<CurrencyTable {...defaultProps} />);

    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("Average")).toBeInTheDocument();
    expect(screen.getByText("Trend")).toBeInTheDocument();
  });

  it("renders currency rows", () => {
    render(<CurrencyTable {...defaultProps} />);

    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText("JPY")).toBeInTheDocument();
  });

  it("displays currency names", () => {
    render(<CurrencyTable {...defaultProps} />);

    expect(screen.getByText("US Dollar")).toBeInTheDocument();
    expect(screen.getByText("Euro")).toBeInTheDocument();
    expect(screen.getByText("Japanese Yen")).toBeInTheDocument();
  });

  it("shows exchange rates", () => {
    render(<CurrencyTable {...defaultProps} />);

    // Check if rate values are displayed (formatted as 1/rate)
    expect(screen.getByText("0.7905")).toBeInTheDocument(); // 1/1.265
    expect(screen.getByText("0.8511")).toBeInTheDocument(); // 1/1.175
  });

  it("shows N/A for missing rates", () => {
    const propsWithMissingData = {
      ...defaultProps,
      ratesData: {},
    };

    render(<CurrencyTable {...propsWithMissingData} />);

    // Check that N/A appears in the table (there will be multiple instances due to dates and averages)
    expect(screen.getAllByText("N/A")).toHaveLength(24); // 3 currencies × 7 dates + 3 averages = 24
  });

  it("displays correct base currency in header", () => {
    render(<CurrencyTable {...defaultProps} />);

    expect(
      screen.getByText("Exchange Rates for GBP (British Pound Sterling)")
    ).toBeInTheDocument();
  });

  it("shows trend indicators", () => {
    render(<CurrencyTable {...defaultProps} />);

    // Should show trend badges
    const trendElements = screen.getAllByText(/up|down|stable/);
    expect(trendElements.length).toBeGreaterThan(0);
  });
});
