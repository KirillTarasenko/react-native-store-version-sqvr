
export const getIOSVersion = async (storeURL = "") => {

  const response = await fetch(
    storeURL,
    {
      headers: {
        'cache-control': 'no-cache',
      },
    }
  )
    .then((r) => r.text())
    .then((r) => JSON.parse(r));

  if (!response || !response.results || response.results.length === 0) {
    throw new Error(`appID is not released.`);
  }

  return response.results[0].version as string;
};
