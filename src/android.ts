
export const getAndroidVersion = async (storeURL = "") => {

  const response = await fetch(storeURL).then((r) => {
    if (r.status === 200) {
      return r.text();
    }

    throw new Error('androidStoreURL is invalid.');
  });

  let matches;
  if (storeURL?.startsWith('https://apps.rustore.ru/')) {
     matches = [,response.match(/"versionName":"[0-9.]+"/gm)?.[0].match(/[0-9.]+/gm)?.[0]];
  } else {
     matches = response.match(/\[\[\[['"]((\d+\.)+\d+)['"]\]\],/);
  }

  if (!matches) {
    throw new Error("can't get android app version.");
  }

  return matches[1];
};
