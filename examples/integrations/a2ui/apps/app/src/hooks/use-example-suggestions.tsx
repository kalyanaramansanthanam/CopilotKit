import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export const useExampleSuggestions = () => {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Search Flights (A2UI Fixed Schema)",
        message: "Find flights from SFO to JFK for next Tuesday.",
      },
      {
        title: "Sales Dashboard (A2UI Dynamic)",
        message:
          "Using A2UI, show me a sales dashboard with total revenue, new customers, and conversion rate metrics. Include a pie chart of revenue by category and a bar chart of monthly sales.",
      },
      {
        title: "Product Analytics (A2UI Dynamic)",
        message:
          "Using A2UI, create a product analytics view with key metrics (DAU, retention, churn), a pie chart of user segments, and a data table of the top 5 features by usage.",
      },
    ],
    available: "always",
  });
};
