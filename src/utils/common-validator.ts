import { type NumLevel, type NumSentence } from '@/types/types';

export const isNull = (value: unknown): value is null => {
  if (value === null) {
    return true;
  }

  return false;
};

export const isUndefined = (value: unknown): value is undefined => {
  if (typeof value === 'undefined') {
    return true;
  }

  return false;
};

export const isHTMLElement = (value: unknown): value is HTMLElement => {
  if (value instanceof HTMLElement) {
    return true;
  }

  return false;
};

export const isNumSentence = (value: unknown): value is NumSentence => {
  if (typeof value === 'number' && value <= 9) {
    return true;
  }

  return false;
};

export const isNumLevel = (value: unknown): value is NumLevel => {
  if (typeof value === 'number' && value <= 9) {
    return true;
  }

  return false;
};
