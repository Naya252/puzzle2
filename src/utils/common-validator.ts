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
