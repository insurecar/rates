export const ProjectInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        About This Project
      </h3>
      <div className="text-sm text-blue-700 space-y-2">
        <p>
          <strong>Features:</strong> View exchange rates for the last 7 days
          from any selected date (up to 90 days in the past).
        </p>
        <p>
          <strong>Default:</strong> GBP compared against 7 major currencies
          (USD, EUR, JPY, CHF, CAD, AUD, ZAR).
        </p>
        <p>
          <strong>Customization:</strong> Add/remove currencies (minimum 3,
          maximum 7) and change the base currency.
        </p>
        <p>
          <strong>Data Source:</strong> Real-time currency data from external
          API.
        </p>
      </div>
    </div>
  );
};
