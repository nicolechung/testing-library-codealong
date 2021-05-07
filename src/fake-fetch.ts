export type FetchResponse = {
  text: string;
  date: string;
};

export const fakeFetch: () => Promise<FetchResponse> = () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ date: "2021-02-21", text: "#invalid" }), 2000)
  );
};
