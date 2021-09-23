import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Reviews from "./Reviews";

const queryClient = new QueryClient();

const App = ({ productId }) => {
  // if for some reason there is no product id, for this
  // exercise we'll just not render the app
  if (!productId) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* 
      <Reviews />' only purpose is to act as a proxy, 
      cause we cannot use useQuery in <App /> as that's 
      where we wrap with <QueryClientProvider /> 
    */}
      <Reviews productId={productId} />
    </QueryClientProvider>
  );
};

export default App;
