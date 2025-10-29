export const fetchCurrencies = async (): Promise<string[]> => {
  const res = await fetch("https://open.er-api.com/v6/latest"); 
  const data = await res.json();
  return Object.keys(data.symbols); // Returns ['USD', 'EUR', ...]
};
