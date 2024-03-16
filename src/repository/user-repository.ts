import { type UserType, type UserSettingsType } from '@/types/types';
import { USER_EMPTY, USER_SETTINGS_EMPTY } from '@/shared/constants';
import { isValidUser, isValidUserSettings, isValidCompletedRounds, isValidCompletedLevels } from './validation';

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

export const getCompletedRounds = (): string[] => {
  const data = localStorage.getItem('CompletedRounds');
  if (data === null) {
    return [];
  }

  const completedRounds: unknown = JSON.parse(data);
  if (!isValidCompletedRounds(completedRounds)) {
    throw new Error('Invalid data format');
  }
  return completedRounds;
};

export const setCompletedRounds = (allCompletedRounds: string[]): void => {
  localStorage.setItem('CompletedRounds', JSON.stringify(allCompletedRounds));
};

export const removeCompletedRounds = (): void => {
  localStorage.removeItem('CompletedRounds');
};

export const getCompletedLevels = (): number[] => {
  const data = localStorage.getItem('CompletedLevels');
  if (data === null) {
    return [];
  }

  const completedLevels: unknown = JSON.parse(data);
  if (!isValidCompletedLevels(completedLevels)) {
    throw new Error('Invalid data format');
  }
  return completedLevels;
};

export const setCompletedLevels = (allCompletedLevels: number[]): void => {
  localStorage.setItem('CompletedLevels', JSON.stringify(allCompletedLevels));
};

export const removeCompletedLevels = (): void => {
  localStorage.removeItem('CompletedLevels');
};
