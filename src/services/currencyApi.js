// API service for working with currency rates

export const CURRENCY_API_BASE =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";

export const getCurrencyRates = async (currency, date) => {
  try {
    const response = await fetch(
      `${CURRENCY_API_BASE}@${date}/v1/currencies/${currency}.json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data[currency]) {
      throw new Error("Invalid data received from API");
    }
    return data[currency];
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
};

export const getAvailableCurrencies = async () => {
  try {
    const response = await fetch(
      `${CURRENCY_API_BASE}@latest/v1/currencies.json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available currencies:", error);
    throw error;
  }
};

export const getLastSevenDays = (endDate) => {
  const dates = [];
  const end = new Date(endDate);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

export const isValidDateRange = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);

  return selectedDate >= ninetyDaysAgo && selectedDate <= today;
};
