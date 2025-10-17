// Action types
export const FETCH_CURRENCY_RATES_REQUEST = "FETCH_CURRENCY_RATES_REQUEST";
export const FETCH_CURRENCY_RATES_SUCCESS = "FETCH_CURRENCY_RATES_SUCCESS";
export const FETCH_CURRENCY_RATES_FAILURE = "FETCH_CURRENCY_RATES_FAILURE";
export const FETCH_AVAILABLE_CURRENCIES_REQUEST =
  "FETCH_AVAILABLE_CURRENCIES_REQUEST";
export const FETCH_AVAILABLE_CURRENCIES_SUCCESS =
  "FETCH_AVAILABLE_CURRENCIES_SUCCESS";
export const FETCH_AVAILABLE_CURRENCIES_FAILURE =
  "FETCH_AVAILABLE_CURRENCIES_FAILURE";
export const SET_BASE_CURRENCY = "SET_BASE_CURRENCY";
export const SET_SELECTED_DATE = "SET_SELECTED_DATE";
export const ADD_CURRENCY = "ADD_CURRENCY";
export const REMOVE_CURRENCY = "REMOVE_CURRENCY";
export const CLEAR_ERROR = "CLEAR_ERROR";

// Initial state
const initialState = {
  baseCurrency: "gbp",
  selectedDate: new Date().toISOString().split("T")[0],
  targetCurrencies: ["usd", "eur", "jpy", "chf", "cad", "aud", "zar"],
  availableCurrencies: {},
  ratesData: {},
  loading: false,
  error: null,
};

// Reducer
const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CURRENCY_RATES_REQUEST:
    case FETCH_AVAILABLE_CURRENCIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CURRENCY_RATES_SUCCESS: {
      const { date, currency, rates } = action.payload;
      return {
        ...state,
        loading: false,
        ratesData: {
          ...state.ratesData,
          [date]: {
            ...state.ratesData[date],
            [currency]: rates,
          },
        },
      };
    }

    case FETCH_CURRENCY_RATES_FAILURE:
    case FETCH_AVAILABLE_CURRENCIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_AVAILABLE_CURRENCIES_SUCCESS:
      return {
        ...state,
        loading: false,
        availableCurrencies: action.payload,
      };

    case SET_BASE_CURRENCY:
      return {
        ...state,
        baseCurrency: action.payload,
        ratesData: {},
      };

    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
        ratesData: {},
      };

    case ADD_CURRENCY:
      if (
        state.targetCurrencies.length < 7 &&
        !state.targetCurrencies.includes(action.payload)
      ) {
        return {
          ...state,
          targetCurrencies: [...state.targetCurrencies, action.payload],
          ratesData: {},
        };
      }
      return state;

    case REMOVE_CURRENCY:
      if (state.targetCurrencies.length > 3) {
        return {
          ...state,
          targetCurrencies: state.targetCurrencies.filter(
            (currency) => currency !== action.payload
          ),
          ratesData: {},
        };
      }
      return state;

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default currencyReducer;
