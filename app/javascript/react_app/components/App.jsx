import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import actioncable from "actioncable";

import Reviews from "./Reviews";

const CableApp = {};
CableApp.cable = actioncable.createConsumer(`${process.env.ACTIONCABLE_HOST}/cable`);

const queryClient = new QueryClient({
  // this is just to demonstrate live data better. react-query will refetch data every
  // time the browser is focused, which is neat feature but it's not live data and it
  // makes working live data difficult to spot in testing
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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
      <Reviews productId={productId} cable={CableApp.cable} />
    </QueryClientProvider>
  );
};

export default App;
