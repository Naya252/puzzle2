import { type UserType } from '@/types/types';
import store from '@/store/store';

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
  store.user.setUser(data);
};

export const removeUser = (): void => {
  localStorage.removeItem('User');
  store.user.setUser({ name: '', surname: '' });
};
