import { vi } from "vitest";
import {
  setBaseCurrency,
  setSelectedDate,
  addCurrency,
  removeCurrency,
  clearError,
  fetchCurrencyRates,
  fetchAvailableCurrencies,
} from "../currencyActions";

// Mock fetch
global.fetch = vi.fn();

describe("Currency Actions", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("Sync Actions", () => {
    it("creates setBaseCurrency action", () => {
      const action = setBaseCurrency("usd");
      expect(action).toEqual({
        type: "SET_BASE_CURRENCY",
        payload: "usd",
      });
    });

    it("creates setSelectedDate action", () => {
      const action = setSelectedDate("2024-10-17");
      expect(action).toEqual({
        type: "SET_SELECTED_DATE",
        payload: "2024-10-17",
      });
    });

    it("creates addCurrency action", () => {
      const action = addCurrency("eur");
      expect(action).toEqual({
        type: "ADD_CURRENCY",
        payload: "eur",
      });
    });

    it("creates removeCurrency action", () => {
      const action = removeCurrency("jpy");
      expect(action).toEqual({
        type: "REMOVE_CURRENCY",
        payload: "jpy",
      });
    });

    it("creates clearError action", () => {
      const action = clearError();
      expect(action).toEqual({
        type: "CLEAR_ERROR",
      });
    });
  });

  describe("Async Actions", () => {
    it("fetches currency rates successfully", async () => {
      const mockData = {
        gbp: {
          usd: 1.265,
          eur: 1.175,
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const dispatch = vi.fn();
      const thunk = fetchCurrencyRates("gbp", "2024-10-17");

      await thunk(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_CURRENCY_RATES_REQUEST",
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_CURRENCY_RATES_SUCCESS",
        payload: {
          date: "2024-10-17",
          currency: "gbp",
          rates: mockData.gbp,
        },
      });
    });

    it("handles fetch currency rates error", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const dispatch = vi.fn();
      const thunk = fetchCurrencyRates("gbp", "2024-10-17");

      await thunk(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_CURRENCY_RATES_REQUEST",
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_CURRENCY_RATES_FAILURE",
        payload: "Network error",
      });
    });

    it("fetches available currencies successfully", async () => {
      const mockCurrencies = {
        usd: "US Dollar",
        eur: "Euro",
        gbp: "British Pound Sterling",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrencies,
      });

      const dispatch = vi.fn();
      const thunk = fetchAvailableCurrencies();

      await thunk(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_AVAILABLE_CURRENCIES_REQUEST",
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: "FETCH_AVAILABLE_CURRENCIES_SUCCESS",
        payload: mockCurrencies,
      });
    });
  });
});
