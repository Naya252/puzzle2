import { type UserType, type UserSettingsType } from '@/types/types';
import { USER_EMPTY, USER_SETTINGS_EMPTY } from '@/shared/constants';

function isValidUser(data: unknown): data is UserType {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'surname' in data &&
    typeof data.name === 'string' &&
    typeof data.surname === 'string'
  );
}

function isValidUserSettings(data: unknown): data is UserSettingsType {
  return (
    typeof data === 'object' &&
    data !== null &&
    'isShowTranslate' in data &&
    'isShowAudio' in data &&
    'isShowImage' in data &&
    typeof data.isShowTranslate === 'boolean' &&
    typeof data.isShowAudio === 'boolean' &&
    typeof data.isShowImage === 'boolean'
  );
}

export const getUser = (): UserType => {
  const data = localStorage.getItem('User');
  if (data === null) {
    return USER_EMPTY;
  }

  const userData: unknown = JSON.parse(data);
  if (!isValidUser(userData)) {
    throw new Error('Invalid data format');
  }

  return userData;
};

export const saveUser = (data: UserType): void => {
  localStorage.setItem('User', JSON.stringify(data));
};

export const removeUser = (): void => {
  localStorage.removeItem('User');
};

export const getUserSettings = (): UserSettingsType => {
  const data = localStorage.getItem('UserSettings');
  if (data === null) {
    return USER_SETTINGS_EMPTY;
  }

  const userSettings: unknown = JSON.parse(data);
  if (!isValidUserSettings(userSettings)) {
    throw new Error('Invalid data format');
  }
  return userSettings;
};

export const saveUserSettings = (data: UserSettingsType): void => {
  localStorage.setItem('UserSettings', JSON.stringify(data));
};

export const removeUserSettings = (): void => {
  localStorage.removeItem('UserSettings');
};
