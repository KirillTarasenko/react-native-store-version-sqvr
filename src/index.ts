import compareVersions from 'compare-versions';
import { Platform } from 'react-native';

import { getAndroidVersion } from './android';
import { getIOSVersion } from './ios';

type CheckVersionParams = {
  country?: string;
  version: string;
  iosStoreURL?: string;
  androidStoreURL?: string;
};

type CheckVersionResponse = {
  local: string;
  remote: string;
  result: 'new' | 'old' | 'equal';
  detail: 'remote > local' | 'remote < local' | 'remote === local';
};

export const DEFAULT_IOS_URL = `https://sqvr.ru/apple_store`;
export const DEFAULT_ANDROID_URL = `https://sqvr.ru/google_store`;


export const compareVersion = (
  local: string,
  remote: string
): CheckVersionResponse['result'] => {
  switch (compareVersions(local, remote)) {
    case -1:
      return 'new';
    case 1:
      return 'old';
    default:
      return 'equal';
  }
};

const checkVersion = async (
  params: CheckVersionParams
): Promise<CheckVersionResponse> => {
  if (!params.version) {
    throw new Error('local version is not set.');
  }

  /* check store url */
  if (Platform.OS === 'ios' && !params.iosStoreURL) {
    console.warn("iosStoreURL is not set. Will be using " + DEFAULT_IOS_URL);
  }

  if (Platform.OS === 'android' && !params.androidStoreURL) {
    console.warn("androidStoreURL is not set. Will be using "+ DEFAULT_ANDROID_URL);
  }

  /* get version */
  let remoteVersion: string;

  try {
    remoteVersion =
      Platform.OS === 'ios'
        ? await getIOSVersion(params.iosStoreURL || DEFAULT_IOS_URL)
        : await getAndroidVersion(params.androidStoreURL || DEFAULT_ANDROID_URL);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }

    throw new Error(`can't get ${Platform.OS} version`);
  }

  console.log("Got app version: ", remoteVersion);
  
  const result = compareVersion(params.version, remoteVersion);
  let detail: CheckVersionResponse['detail'];
  switch (result) {
    case 'new':
      detail = 'remote > local';
      break;
    case 'old':
      detail = 'remote < local';
      break;
    default:
      detail = 'remote === local';
      break;
  }

  /* compare version */
  return <CheckVersionResponse>{
    local: params.version,
    remote: remoteVersion,
    result,
    detail,
  };
};

export default checkVersion;
