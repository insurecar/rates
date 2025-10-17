import currencyReducer, {
  FETCH_CURRENCY_RATES_REQUEST,
  FETCH_CURRENCY_RATES_SUCCESS,
  FETCH_CURRENCY_RATES_FAILURE,
  FETCH_AVAILABLE_CURRENCIES_SUCCESS,
  SET_BASE_CURRENCY,
  SET_SELECTED_DATE,
  ADD_CURRENCY,
  REMOVE_CURRENCY,
  CLEAR_ERROR,
} from "../currencyReducer";

describe("Currency Reducer", () => {
  const initialState = {
    baseCurrency: "gbp",
    selectedDate: new Date().toISOString().split("T")[0],
    targetCurrencies: ["usd", "eur", "jpy", "chf", "cad", "aud", "zar"],
    availableCurrencies: {},
    ratesData: {},
    loading: false,
    error: null,
  };

  it("returns initial state", () => {
    expect(currencyReducer(undefined, {})).toEqual(initialState);
  });

  it("handles FETCH_CURRENCY_RATES_REQUEST", () => {
    const action = { type: FETCH_CURRENCY_RATES_REQUEST };
    const state = currencyReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("handles FETCH_CURRENCY_RATES_SUCCESS", () => {
    const action = {
      type: FETCH_CURRENCY_RATES_SUCCESS,
      payload: {
        date: "2024-10-17",
        currency: "gbp",
        rates: { usd: 1.265, eur: 1.175 },
      },
    };
    const state = currencyReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ratesData["2024-10-17"].gbp).toEqual({
      usd: 1.265,
      eur: 1.175,
    });
  });

  it("handles FETCH_CURRENCY_RATES_FAILURE", () => {
    const action = {
      type: FETCH_CURRENCY_RATES_FAILURE,
      payload: "Network error",
    };
    const state = currencyReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Network error");
  });

  it("handles FETCH_AVAILABLE_CURRENCIES_SUCCESS", () => {
    const currencies = {
      usd: "US Dollar",
      eur: "Euro",
      gbp: "British Pound Sterling",
    };
    const action = {
      type: FETCH_AVAILABLE_CURRENCIES_SUCCESS,
      payload: currencies,
    };
    const state = currencyReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.availableCurrencies).toEqual(currencies);
  });

  it("handles SET_BASE_CURRENCY", () => {
    const action = {
      type: SET_BASE_CURRENCY,
      payload: "usd",
    };
    const state = currencyReducer(initialState, action);

    expect(state.baseCurrency).toBe("usd");
    expect(state.ratesData).toEqual({});
  });

  it("handles SET_SELECTED_DATE", () => {
    const action = {
      type: SET_SELECTED_DATE,
      payload: "2024-10-16",
    };
    const state = currencyReducer(initialState, action);

    expect(state.selectedDate).toBe("2024-10-16");
    expect(state.ratesData).toEqual({});
  });

  it("handles ADD_CURRENCY when under limit", () => {
    const stateWithLessCurrencies = {
      ...initialState,
      targetCurrencies: ["usd", "eur"],
    };
    const action = {
      type: ADD_CURRENCY,
      payload: "jpy",
    };
    const state = currencyReducer(stateWithLessCurrencies, action);

    expect(state.targetCurrencies).toEqual(["usd", "eur", "jpy"]);
    expect(state.ratesData).toEqual({});
  });

  it("does not add currency when at limit", () => {
    const action = {
      type: ADD_CURRENCY,
      payload: "nzd",
    };
    const state = currencyReducer(initialState, action);

    expect(state.targetCurrencies).toEqual(initialState.targetCurrencies);
  });

  it("handles REMOVE_CURRENCY when above minimum", () => {
    const action = {
      type: REMOVE_CURRENCY,
      payload: "zar",
    };
    const state = currencyReducer(initialState, action);

    expect(state.targetCurrencies).not.toContain("zar");
    expect(state.ratesData).toEqual({});
  });

  it("does not remove currency when at minimum", () => {
    const stateWithMinCurrencies = {
      ...initialState,
      targetCurrencies: ["usd", "eur", "jpy"],
    };
    const action = {
      type: REMOVE_CURRENCY,
      payload: "jpy",
    };
    const state = currencyReducer(stateWithMinCurrencies, action);

    expect(state.targetCurrencies).toEqual(
      stateWithMinCurrencies.targetCurrencies
    );
  });

  it("handles CLEAR_ERROR", () => {
    const stateWithError = {
      ...initialState,
      error: "Some error",
    };
    const action = { type: CLEAR_ERROR };
    const state = currencyReducer(stateWithError, action);

    expect(state.error).toBe(null);
  });
});
