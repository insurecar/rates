import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { CurrencyApp } from "./components";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Currency Exchange Rates
          </h1>
          <h2>
            {" "}
            <a
              href="https://github.com/insurecar/rates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              GitHub Repository
            </a>
          </h2>
          <CurrencyApp />
        </div>
      </div>
    </Provider>
  );
}

export default App;
