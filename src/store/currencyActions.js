import {
  FETCH_CURRENCY_RATES_REQUEST,
  FETCH_CURRENCY_RATES_SUCCESS,
  FETCH_CURRENCY_RATES_FAILURE,
  FETCH_AVAILABLE_CURRENCIES_REQUEST,
  FETCH_AVAILABLE_CURRENCIES_SUCCESS,
  FETCH_AVAILABLE_CURRENCIES_FAILURE,
  SET_BASE_CURRENCY,
  SET_SELECTED_DATE,
  ADD_CURRENCY,
  REMOVE_CURRENCY,
  CLEAR_ERROR,
} from "./currencyReducer";

// Action creators
export const setBaseCurrency = (currency) => ({
  type: SET_BASE_CURRENCY,
  payload: currency,
});

export const setSelectedDate = (date) => ({
  type: SET_SELECTED_DATE,
  payload: date,
});

export const addCurrency = (currency) => ({
  type: ADD_CURRENCY,
  payload: currency,
});

export const removeCurrency = (currency) => ({
  type: REMOVE_CURRENCY,
  payload: currency,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Thunk action creators
export const fetchCurrencyRates = (currency, date) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CURRENCY_RATES_REQUEST });

    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${currency}.json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data[currency]) {
        throw new Error("Invalid data received from API");
      }

      dispatch({
        type: FETCH_CURRENCY_RATES_SUCCESS,
        payload: { date, currency, rates: data[currency] },
      });
    } catch (error) {
      dispatch({
        type: FETCH_CURRENCY_RATES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchAvailableCurrencies = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_AVAILABLE_CURRENCIES_REQUEST });

    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      dispatch({
        type: FETCH_AVAILABLE_CURRENCIES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_AVAILABLE_CURRENCIES_FAILURE,
        payload: error.message,
      });
    }
  };
};
