import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrencyRates,
  fetchAvailableCurrencies,
  setBaseCurrency,
  setSelectedDate,
} from "../store/currencyActions";
import { getLastSevenDays, isValidDateRange } from "../services/currencyApi";
import {
  CurrencyControls,
  CurrencyTable,
  LoadingSpinner,
  ErrorMessage,
  ProjectInfo,
} from "./index";

export const CurrencyApp = () => {
  const dispatch = useDispatch();
  const {
    baseCurrency,
    selectedDate,
    targetCurrencies,
    availableCurrencies,
    ratesData,
    loading,
    error,
  } = useSelector((state) => state.currency);

  // Load available currencies on initialization
  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, [dispatch]);

  // Load currency rates when base currency or date changes
  useEffect(() => {
    if (Object.keys(availableCurrencies).length > 0) {
      const dates = getLastSevenDays(selectedDate);

      dates.forEach((date) => {
        // Check if date is valid (not more than 90 days in the past)
        if (isValidDateRange(date)) {
          dispatch(fetchCurrencyRates(baseCurrency, date));
        }
      });
    }
  }, [dispatch, baseCurrency, selectedDate, availableCurrencies]);

  const handleBaseCurrencyChange = (currency) => {
    dispatch(setBaseCurrency(currency));
  };

  const handleDateChange = (date) => {
    if (isValidDateRange(date)) {
      dispatch(setSelectedDate(date));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ProjectInfo />

      {error && <ErrorMessage message={error} />}

      <CurrencyControls
        baseCurrency={baseCurrency}
        selectedDate={selectedDate}
        availableCurrencies={availableCurrencies}
        targetCurrencies={targetCurrencies}
        onBaseCurrencyChange={handleBaseCurrencyChange}
        onDateChange={handleDateChange}
      />

      {loading && <LoadingSpinner />}

      <CurrencyTable
        baseCurrency={baseCurrency}
        targetCurrencies={targetCurrencies}
        ratesData={ratesData}
        selectedDate={selectedDate}
        availableCurrencies={availableCurrencies}
      />
    </div>
  );
};
