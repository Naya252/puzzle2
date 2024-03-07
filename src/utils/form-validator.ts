const checkRequired = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if (el.required && el.value === '') {
    result = false;
    clone.innerHTML = 'Required';
  }

  return result;
};

const checkPattern = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('pattern' in el && el.pattern !== '' && typeof el.pattern === 'string') {
    const regex = new RegExp(el.pattern);
    result = regex.test(el.value);

    if (!result) {
      clone.innerHTML = `Enter English letters and "-"<br>The first letter is capitalized`;
    }
  }
  return result;
};

const checkMinLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('minLength' in el) {
    result = el.value.length >= +el.minLength;

    if (!result) {
      clone.innerHTML = `Min length ${el.minLength} `;
    }
  }

  return result;
};

const checkMaxLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('maxLength' in el) {
    result = el.value.length <= +el.maxLength;

    if (!result) {
      clone.innerHTML = `Max length ${el.maxLength} `;
    }
  }

  return result;
};

const validation = (e: Event | HTMLElement): boolean => {
  let resultult = true;

  if (e instanceof Event) {
    if (e.target === null) {
      resultult = false;
      throw new Error('null');
    }

    if (e.target instanceof HTMLFormElement) {
      checkElements(e.target.elements);
    }
  }

  if (e instanceof HTMLElement) {
    let arr = Array.from(e.childNodes);
    arr = arr.map((el) => el.childNodes[1] ?? el);

    checkElements(arr);
  }

  return resultult;
};

const checkElements = (element: ChildNode[] | HTMLFormControlsCollection): void => {
  const formElements = Array.from(element);

  formElements.forEach((el) => {
    if (el instanceof HTMLInputElement) {
      const info = el.nextSibling;
      if (info === null || !(info instanceof HTMLDivElement)) {
        throw new Error('null');
      }

      info.innerHTML = '';
      checkMaxLength(el, info);
      checkPattern(el, info);
      checkMinLength(el, info);
      checkRequired(el, info);
    }
  });
};

export default validation;
