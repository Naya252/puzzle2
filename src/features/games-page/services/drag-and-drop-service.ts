import type BaseComponent from '@/components/base-component';
import { isNull, isUndefined, isHTMLElement } from '@/utils/common-validator';

export const dragStart = (event: Event): void => {
  if (
    event instanceof DragEvent &&
    !isNull(event.dataTransfer) &&
    !isNull(event.target) &&
    isHTMLElement(event.target)
  ) {
    event.dataTransfer.setData('text', event.target.id);
    setTimeout(() => {
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        event.target.classList.add('hide');
      }
    }, 0);
  }
};

export const dragEnter = (event: Event): void => {
  event.preventDefault();
  const active = event.target;
  if (!isNull(active) && isHTMLElement(active)) {
    active.classList.add('active');
  }
};

export const dragLeave = (event: Event): void => {
  const active = event.target;
  if (!isNull(active) && isHTMLElement(active)) {
    active.classList.remove('active');
  }
};

export const dragOver = (event: Event, curPuzzle: HTMLElement): void => {
  if (!isNull(event.target) && isHTMLElement(event.target)) {
    const parent = curPuzzle.parentNode;

    if (!isNull(parent) && isHTMLElement(parent)) {
      if (parent.id === event.target.id) {
        return;
      }
      event.preventDefault();
    }
  }
};

export const drop = (event: Event, puzzle: HTMLElement, curPuzzleParent: ParentNode): void => {
  event.preventDefault();

  if (
    event instanceof DragEvent &&
    !isNull(event.dataTransfer) &&
    !isNull(event.target) &&
    isHTMLElement(event.target) &&
    isHTMLElement(curPuzzleParent)
  ) {
    if (event.target.classList.contains('col-img')) {
      const parentTarget = event.target.parentNode;
      if (!isNull(parentTarget) && isHTMLElement(parentTarget)) {
        parentTarget.appendChild(puzzle);
        curPuzzleParent.append(event.target);

        changeWidth(parentTarget, puzzle);
        changeWidth(curPuzzleParent, event.target);
        event.target.classList.remove('active');
        curPuzzleParent.classList.remove('active');
      }
    } else {
      event.target.appendChild(puzzle);
      event.target.classList.remove('active');
      changeWidth(event.target, puzzle, curPuzzleParent);
    }
  }
};

export const touchDrag = (
  puzzle: HTMLElement,
  curRow: ChildNode,
  puzzleParent: ParentNode | null,
): HTMLElement | null | undefined => {
  const copy = puzzle;
  const sizePuzzle = copy.getBoundingClientRect();
  let copyNewParent;
  curRow.childNodes.forEach((el) => {
    if (isHTMLElement(el) && isHTMLElement(puzzleParent)) {
      const sizeCol = el.getBoundingClientRect();
      const child = el.firstChild;
      if (
        sizePuzzle.top + copy.offsetHeight / 2 < sizeCol.bottom &&
        sizePuzzle.right - copy.offsetWidth / 2 > sizeCol.left &&
        sizePuzzle.bottom - copy.offsetHeight / 2 > sizeCol.top &&
        sizePuzzle.left + copy.offsetWidth / 2 < sizeCol.right
      ) {
        if (isHTMLElement(child) && puzzleParent.classList.contains('col-container')) {
          el.classList.remove('active');
          return;
        }
        el.classList.add('active');
        copyNewParent = el;
      } else {
        el.classList.remove('active');
      }
    }
  });
  return copyNewParent;
};

export const addAbsolute = (
  event: Event,
  puzzle: HTMLElement,
  puzzleParent: ParentNode | null,
  gameWrapper: BaseComponent,
): void => {
  if (event instanceof TouchEvent) {
    const touch = event.targetTouches[0];
    const copy = puzzle;
    if (!isNull(copy) && !isNull(puzzleParent) && isHTMLElement(puzzleParent) && !isUndefined(touch)) {
      const wrapper = gameWrapper.getElement();
      const computedStyle = window.getComputedStyle(puzzleParent);
      const width = computedStyle.getPropertyValue('width');
      const height = computedStyle.getPropertyValue('height');
      copy.style.width = width;
      copy.style.height = height;
      copy.style.maxHeight = height;
      copy.style.maxWidth = width;
      copy.style.left = `${touch.pageX - wrapper.offsetTop - copy.offsetWidth}px`;
      copy.style.top = `${touch.pageY - wrapper.offsetLeft - copy.offsetHeight - copy.offsetHeight / 2}px`;
      copy.style.position = 'absolute';
    }
  }
};

export const removeAbsolute = (puzzle: HTMLElement): void => {
  if (!isNull(puzzle)) {
    const copy = puzzle;
    copy.style.width = '100%';
    copy.style.maxWidth = 'none';
    copy.style.maxHeight = 'none';
    copy.style.height = '100%';
    copy.style.left = `auto`;
    copy.style.top = `auto`;
    copy.style.position = 'static';
  }
};

export const changeWidth = (col: HTMLElement, puzzle: HTMLElement, lastParent: HTMLElement | null = null): void => {
  const colCopy = col;
  const copyLastParent = lastParent;
  const width = puzzle.getAttribute('data-width');
  if (typeof width === 'string') {
    colCopy.style.maxWidth = width;
    colCopy.style.minWidth = width;
    colCopy.classList.remove('active');

    if (!isNull(copyLastParent)) {
      copyLastParent.style.maxWidth = 'none';
      copyLastParent.style.minWidth = 'initial';
    }

    puzzle.classList.add('puzzle-scale');
    setTimeout(() => {
      puzzle.classList.remove('puzzle-scale');
    });
  }
};

export const changeColParent = (childNodes: NodeList, evtTarget: HTMLElement, lastParent: HTMLElement): void => {
  const array = Array.from(childNodes);
  const target = array.find((element) => element.childNodes.length === 0);
  if (isHTMLElement(target)) {
    changeWidth(target, evtTarget, lastParent);
    target?.appendChild(evtTarget);
  }
};
