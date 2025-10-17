import { getLastSevenDays } from "../services/currencyApi";

const CurrencyTable = ({
  baseCurrency,
  targetCurrencies,
  ratesData,
  selectedDate,
  availableCurrencies,
}) => {
  const dates = getLastSevenDays(selectedDate);

  const formatCurrencyName = (code) => {
    return availableCurrencies[code] || code.toUpperCase();
  };

  const formatRate = (rate) => {
    if (rate === null || rate === undefined) return "N/A";
    return (1 / rate).toFixed(4);
  };

  const getRateForDate = (date, currency) => {
    try {
      return ratesData[date]?.[baseCurrency]?.[currency];
    } catch (error) {
      console.error(`Error getting rate for ${currency} on ${date}:`, error);
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Exchange Rates for {baseCurrency.toUpperCase()} (
          {formatCurrencyName(baseCurrency)})
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Last 7 days ending {selectedDate}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {targetCurrencies.map((currency) => {
              const rates = dates.map((date) => getRateForDate(date, currency));
              const validRates = rates.filter(
                (rate) => rate !== null && rate !== undefined
              );
              const average =
                validRates.length > 0
                  ? validRates.reduce((sum, rate) => sum + 1 / rate, 0) /
                    validRates.length
                  : 0;

              // Determine trend (compare first and last day with valid data)
              let trend = "stable";
              if (validRates.length >= 2) {
                const firstRate = 1 / validRates[0];
                const lastRate = 1 / validRates[validRates.length - 1];
                const change = ((lastRate - firstRate) / firstRate) * 100;

                if (change > 1) trend = "up";
                else if (change < -1) trend = "down";
              }

              return (
                <tr key={currency} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {currency.toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {currency.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrencyName(currency)}
                        </div>
                      </div>
                    </div>
                  </td>
                  {dates.map((date) => {
                    const rate = getRateForDate(date, currency);
                    return (
                      <td
                        key={date}
                        className="px-6 py-4 whitespace-nowrap text-center"
                      >
                        <div className="text-sm text-gray-900">
                          {formatRate(rate)}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {average > 0 ? average.toFixed(4) : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trend === "up"
                          ? "bg-green-100 text-green-800"
                          : trend === "down"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {trend === "up" && "↗️"}
                      {trend === "down" && "↘️"}
                      {trend === "stable" && "➡️"}
                      {trend}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
