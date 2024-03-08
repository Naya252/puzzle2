import { type UserType } from '@/store/user-store/user-data-store.ts';
import store from '@/store/store.ts';

const User: UserType = { name: '', surname: '' };

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

export const getUser = (): UserType => {
  const data = localStorage.getItem('User');
  if (data === null) {
    return User;
  }

  const userData: unknown = JSON.parse(data);
  if (!isValidUser(userData)) {
    throw new Error('Invalid data format');
  }

  return userData;
};

export const saveUser = (data: UserType): void => {
  localStorage.setItem('User', JSON.stringify(data));
  store.user.SET_USER(data);
};

export const removeUser = (): void => {
  localStorage.removeItem('User');
  store.user.SET_USER({ name: '', surname: '' });
};
