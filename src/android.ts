
export const getAndroidVersion = async (storeURL = "") => {

  const response = await fetch(storeURL).then((r) => {
    if (r.status === 200) {
      return r.text();
    }

    throw new Error('androidStoreURL is invalid.');
  });

  const matches = response.match(/\[\[\[['"]((\d+\.)+\d+)['"]\]\],/);

  if (!matches) {
    throw new Error("can't get android app version.");
  }

  return matches[1];
};
