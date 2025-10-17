import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCurrency, removeCurrency } from "../store/currencyActions";

export const CurrencyControls = ({
  baseCurrency,
  selectedDate,
  availableCurrencies,
  onBaseCurrencyChange,
  onDateChange,
  targetCurrencies = [],
}) => {
  const dispatch = useDispatch();
  const [showAddCurrency, setShowAddCurrency] = useState(false);

  const handleAddCurrency = (currency) => {
    dispatch(addCurrency(currency));
    setShowAddCurrency(false);
  };

  const handleRemoveCurrency = (currency) => {
    if (targetCurrencies.length > 3) {
      dispatch(removeCurrency(currency));
    }
  };

  // Filter available currencies, excluding base currency and already added ones
  const availableForAdd = Object.keys(availableCurrencies).filter(
    (currency) =>
      currency !== baseCurrency && !targetCurrencies.includes(currency)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Currency
          </label>
          <select
            value={baseCurrency}
            onChange={(e) => onBaseCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(availableCurrencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code.toUpperCase()} - {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            min={
              new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Кнопка додавання валюти */}
        <div className="flex items-end">
          <button
            onClick={() => setShowAddCurrency(!showAddCurrency)}
            disabled={
              targetCurrencies.length >= 7 || availableForAdd.length === 0
            }
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Currency
          </button>
        </div>

        {/* Інформація про кількість валют */}
        <div className="flex items-end">
          <div className="text-sm text-gray-600">
            {targetCurrencies.length}/7 currencies selected
          </div>
        </div>
      </div>

      {/* Dropdown для додавання валюти */}
      {showAddCurrency && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Currency to Add
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddCurrency(e.target.value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a currency...</option>
            {availableForAdd.map((currency) => (
              <option key={currency} value={currency}>
                {currency.toUpperCase()} - {availableCurrencies[currency]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Список поточних валют */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Current Currencies:
        </h3>
        <div className="flex flex-wrap gap-2">
          {targetCurrencies.map((currency) => (
            <span
              key={currency}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {currency.toUpperCase()} - {availableCurrencies[currency]}
              {targetCurrencies.length > 3 && (
                <button
                  onClick={() => handleRemoveCurrency(currency)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
