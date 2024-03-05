export default function setupCounter(element: HTMLButtonElement): void {
  const elem = element;

  let counter = 0;
  const setCounter = (count: number): void => {
    counter = count;
    elem.innerHTML = `count is ${counter}`;
  };
  elem.addEventListener('click', () => {
    setCounter(counter + 1);
  });
  setCounter(0);
}
