import '@/features/game-page/game-page.scss';
import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { type Round, type Word, type GameData, type GameFullData, type NumSentence } from '@/types/types';
import { IMG_URL, BASE_DATA_URL } from '@/shared/constants';
import { isNull, isUndefined, isHTMLElement, isNumSentence, isNumLevel } from '@/utils/common-validator';

import {
  dragStart,
  dragEnter,
  dragLeave,
  dragOver,
  drop,
  touchDrag,
  addAbsolute,
  removeAbsolute,
  changeWidth,
  changeColParent,
} from '@/features/game-page/services/drag-and-drop-service';
import {
  getStyles,
  changePuzzleHead,
  createData,
  getLevel,
  changeDisabled,
  changeCompletedRounds,
  checkCompletedLevel,
} from '@/features/game-page/services/game-service';

import GameTitle from './conponents/game-title';
import GameHints from './conponents/hints/game-hints';
import GameField from './conponents/game-field';
import WordsContainer from './conponents/words-container';
import GameButtons from './conponents/buttons/game-buttons';

const splitText = (text: string, operator: string): string[] => {
  const data = text.split(operator);
  return data;
};

class GamePage extends BaseComponent {
  private readonly gameTitle: GameTitle;
  private readonly gameHints: GameHints;
  private readonly gameField: GameField;
  private readonly wordsContainer: WordsContainer;
  private readonly gameWrapper: BaseComponent;
  private readonly gameButtons: GameButtons;

  private currentPoint: NumSentence;
  private data: Round;
  private gameData: Record<number, GameFullData>;

  private puzzle: HTMLElement | null;
  private puzzleParent: ParentNode | null;
  private curRow: ChildNode;
  private readonly arrWords: BaseComponent;

  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    console.log(pushRouter);
    super('div', ['game'], {});
    this.puzzle = null;
    this.puzzleParent = null;
    this.gameData = {};
    this.data = store.game.getActiveGame();
    this.currentPoint = store.game.getActiveSentence();
    this.arrWords = new BaseComponent('div');

    this.gameTitle = new GameTitle();
    this.gameTitle.changeLevel();
    this.gameTitle.changeName(this.data.levelData.name);
    this.gameHints = new GameHints(this.getAudioUrl());
    this.gameWrapper = new BaseComponent('div', ['game-wrapper']);
    this.wordsContainer = new WordsContainer();
    this.gameField = new GameField();
    const url = this.getUrl();
    this.gameField.changeImage(url);
    this.gameWrapper.append(this.gameField, this.wordsContainer);
    this.gameButtons = new GameButtons();
    this.append(this.gameTitle, this.gameHints, this.gameWrapper, this.gameButtons);

    this.checkListener();
    this.autocompleteListener();
    this.nextRoundListener();
    this.curRow = this.gameField.selectRow(0);

    const resizeObserver = new ResizeObserver(() => {
      let i = 0;
      while (i <= this.currentPoint) {
        i += 1;
        const idx = i - 1;
        if (isNumSentence(idx)) {
          this.changeWidthImg(idx).catch(() => {});
        }
      }
    });
    resizeObserver.observe(this.gameField.getElement());
    this.initFirstGame().catch(() => {});
  }

  private getUrl(): string {
    const url = `${IMG_URL}${this.data.levelData.cutSrc}`;
    return url;
  }

  private getAudioUrl(): string {
    const audio = this.data.words[this.currentPoint];
    let url = '';
    if (!isUndefined(audio)) {
      url = `${BASE_DATA_URL}${audio.audioExample}`;
    }
    return url;
  }

  private changeGameField(): void {
    const url = this.getUrl();
    this.gameField.clean();
    this.gameField.changeImage(url);
  }

  private checkListener(): void {
    this.gameButtons.checkBtn.addListener('click', (e) => {
      if (!isNull(e.target) && isHTMLElement(e.target)) {
        if (e.target.textContent === 'Check') {
          const isCorrect = this.isCorrectSentense();
          if (isCorrect) {
            this.changeWinData(isCorrect);
          }
        } else {
          this.changeToDefault();
          this.changeCurrentPoint();
        }
      }
    });
  }

  private nextRoundListener(): void {
    this.gameButtons.nextRoundBtn.addListener('click', (e) => {
      if (!isNull(e.target) && isHTMLElement(e.target)) {
        this.gameButtons.nextRoundBtn.removeClasses(['move-arrow']);
        this.gameButtons.nextRoundBtn.setClasses(['hide']);
        this.gameButtons.checkBtn.removeClasses(['hide']);
        this.gameButtons.autocompleteBtn.removeClasses(['hide']);
        this.gameHints.removeClasses(['invisible-element']);
        this.wordsContainer.removeClasses(['bg-transparent']);
        this.gameField.removeClasses(['usual-image']);
        this.goTonextRound();
      }
    });
  }

  private autocompleteListener(): void {
    this.gameButtons.autocompleteBtn.addListener('click', () => {
      this.completeSentence(this.currentPoint);
      this.isCorrectSentense();
      this.changeWinData(false);
    });
  }

  private async initFirstGame(i = 0): Promise<void> {
    if (i < this.currentPoint) {
      if (isNumSentence(i)) {
        await this.createPuzzles(i);
        this.completeSentence(i);
        this.addBlock(i);
        this.showImages(i);
      }
      await this.initFirstGame(i + 1);
    } else {
      this.startNewGame().catch(() => {});
    }
  }

  private async startNewGame(): Promise<void> {
    await this.createPuzzles(this.currentPoint);
    this.changeText();
    this.gameHints.changeAudioHint(this.getAudioUrl());
  }

  private async createPuzzles(i = this.currentPoint): Promise<void> {
    this.curRow = this.gameField.selectRow(i);
    await this.fillData(i);
    this.createHtmlWords(i);
    await this.changeWidthImg(i);
    this.gameHints.changePuzzles(this.arrWords);
    this.changeToRandom(this.arrWords);
  }

  private async fillData(i: NumSentence): Promise<void> {
    const lvlId = this.data.levelData.id;
    const { data, wordsFullData } = this.changeWords(lvlId, i);

    await createData(data.textExample, wordsFullData, this.gameField);
    const sentense: GameFullData = { levelData: data, wordsFullData };
    this.gameData[i] = sentense;
  }

  private showImages(i: NumSentence): void {
    const data = this.gameData[i];
    if (!isUndefined(data) && !isNull(data)) {
      const words = data.wordsFullData;
      words.forEach((el) => {
        const child = el.node;
        child?.removeClasses(['hide-img']);
      });
    }
  }

  private addBlock(i: NumSentence): void {
    const data = this.gameData[i];
    if (!isUndefined(data) && !isNull(data)) {
      const words = data.wordsFullData;
      words.forEach((el) => {
        const child = el.node;
        child?.setClasses(['block']);
      });
    }
  }

  private changeWinData(isWin: boolean): void {
    const data = this.gameData[this.currentPoint];

    if (!isUndefined(data) && !isNull(data)) {
      const { levelData } = data;
      levelData.isWin = isWin;
      store.game.setWinData(isWin);
      this.gameHints.showTraslate();
      this.gameHints.showAudio();

      this.continueGame();
    }
  }

  private changeToDefault(): void {
    changeDisabled(this.gameButtons.autocompleteBtn, false);
    changeDisabled(this.gameButtons.checkBtn, true);
    this.gameButtons.checkBtn.setTextContent('Check');
    this.gameButtons.checkBtn.removeClasses(['continue', 'moveArrow']);
    this.gameHints.showImages();
    this.gameHints.hideTranslate();
    this.gameHints.hideAudio();

    const arr = Array.from(this.curRow.childNodes);
    arr.forEach((el) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          img.classList.remove('valid');
          img.classList.remove('invalid');
        }
      }
    });
  }

  private goTonextRound(): void {
    const curLvl = store.game.getActiveLevel();
    const levelData = store.game.getLevelData(curLvl);
    const roundId = this.data.levelData.id;
    store.game.setCompletedRounds(roundId);
    changeCompletedRounds(roundId);

    if (!isNull(levelData)) {
      checkCompletedLevel(levelData.roundsCount, curLvl);

      const curRound = store.game.getActiveRound();
      const nextRound = curRound + 1;
      const { rounds } = levelData;

      if (rounds.length === nextRound) {
        this.changeLevel();
      } else {
        const round = rounds[nextRound];

        if (isUndefined(round)) {
          return;
        }
        this.changeRound(nextRound, round);
      }
    }
  }

  private changeLevel(): void {
    const curLvl = store.game.getActiveLevel();
    let lvl = 0;
    if (curLvl < 5) {
      lvl = curLvl + 1;
    }
    if (!isNumLevel(lvl)) {
      return;
    }
    getLevel(lvl)
      .then(() => {
        const levelData = store.game.getLevelData(lvl);

        if (!isNull(levelData)) {
          const { rounds } = levelData;
          const round = rounds[0];

          if (!isUndefined(round) && isNumLevel(lvl)) {
            store.game.setActiveLevel(lvl);
            store.game.setActiveRound(0);
            store.game.setActiveGame(round);
            store.game.setActiveSentence(0);
            store.game.changeWinData([]);
            this.currentPoint = store.game.getActiveSentence();
            this.data = store.game.getActiveGame();
            this.changeGameField();

            this.startNewGame().catch(() => {});

            this.gameTitle.changeLevel();
            this.gameTitle.changeName(this.data.levelData.name);
          }
        }
      })
      .catch(() => {});
  }

  private changeRound(nextRound: number, round: Round): void {
    store.game.setActiveRound(nextRound);
    store.game.setActiveGame(round);

    this.data = store.game.getActiveGame();

    store.game.setActiveSentence(0);
    this.currentPoint = store.game.getActiveSentence();
    this.changeGameField();
    this.startNewGame().catch(() => {});

    this.gameTitle.changeName(this.data.levelData.name);
  }

  private changeCurrentPoint(): void {
    this.currentPoint += 1;
    if (isNumSentence(this.currentPoint)) {
      store.game.setActiveSentence(this.currentPoint);
      this.startNewGame().catch(() => {});
    } else {
      this.hideCompletedGame();
    }
  }

  private showcompletedImage(): void {
    this.gameField.removeClasses(['to-white']);
    this.gameField.setClasses(['invisible-element', 'usual-image']);
    setTimeout(() => {
      this.gameField.setClasses(['linear']);
      this.gameField.removeClasses(['invisible-element']);
      this.wordsContainer.setHTML('');
      this.wordsContainer.setHTML(
        `${this.data.levelData.author} - ${this.data.levelData.name} (${this.data.levelData.year})`,
      );
      this.gameButtons.nextRoundBtn.removeClasses(['hide']);
      setTimeout(() => {
        this.gameButtons.nextRoundBtn.setClasses(['moveArrow']);
      }, 300);
    }, 300);
  }

  private hideCompletedGame(): void {
    const arr = Array.from(Object.values(this.gameData));
    arr.reverse();
    this.gameField.setClasses(['to-white']);
    this.gameButtons.checkBtn.setClasses(['hide']);
    this.gameButtons.autocompleteBtn.setClasses(['hide']);
    this.gameHints.setClasses(['invisible-element']);
    this.wordsContainer.setClasses(['bg-transparent']);
    arr.forEach((el, i) => {
      setTimeout(
        () => {
          const elArr = Array.from(Object.values(el.wordsFullData));
          elArr.reverse();
          elArr.forEach((element, index) => {
            setTimeout(
              () => {
                setTimeout(
                  () => {
                    element.node?.setClasses(['invisible-element']);
                    if (i === arr.length - 1 && index === elArr.length - 1) {
                      this.showcompletedImage();
                    }
                  },
                  (index + 1) * 100,
                );
                element.node?.setClasses(['puzzle-scale']);
              },
              (index + 1) * 100,
            );
          });
        },
        (i + 1) * 100,
      );
    });
  }

  private continueGame(): void {
    console.log('continue');
    this.addBlock(this.currentPoint);

    changeDisabled(this.gameButtons.autocompleteBtn, true);
    changeDisabled(this.gameButtons.checkBtn, false);
    this.gameButtons.checkBtn.setClasses(['continue']);
    this.gameButtons.checkBtn.setTextContent('Continue');
    setTimeout(() => {
      this.gameButtons.checkBtn.setClasses(['moveArrow']);
    }, 300);
  }

  private completeSentence(idx: NumSentence): void {
    const data = this.gameData[idx];
    if (!isUndefined(data) && !isNull(data)) {
      const words = data.wordsFullData;
      const cols = Array.from(this.curRow.childNodes);
      cols.forEach((el, i) => {
        const child = words[i]?.node;
        const elChild = child?.getElement();
        if (!isUndefined(elChild) && isHTMLElement(el)) {
          el.appendChild(elChild);
          changeWidth(el, elChild);
        }
      });
    }
  }

  private isFullSentence(): void {
    const arr = Array.from(this.curRow.childNodes);
    const isFull = arr.every((el) => {
      const img = el.firstChild;
      return !isNull(img);
    });

    if (isFull) {
      changeDisabled(this.gameButtons.checkBtn, false);
    } else {
      changeDisabled(this.gameButtons.checkBtn, true);
    }
  }

  private isCorrectSentense(): boolean {
    const arr = Array.from(this.curRow.childNodes);
    const isCorrect = arr.every((el, i) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          const id = img.id.split('_');
          return Number(id[id.length - 1]) === i;
        }
      }
      return false;
    });

    arr.forEach((el, i) => {
      const img = el.firstChild;
      if (img !== null) {
        if (img instanceof HTMLElement) {
          const id = img.id.split('_');
          if (Number(id[id.length - 1]) === i) {
            img.classList.remove('invalid');
            img.classList.add('valid');
          } else {
            img.classList.remove('valid');
            img.classList.add('invalid');
          }
        }
      }
    });

    return isCorrect;
  }

  private selectSentence(i: NumSentence): Word {
    const sentense = this.data.words[i];
    if (sentense === undefined) {
      throw new Error('is undefined');
    }

    return sentense;
  }

  private changeText(): void {
    const data = this.gameData[this.currentPoint];
    if (!isUndefined(data) && !isNull(data)) {
      const text = data.levelData.textExampleTranslate;
      this.gameHints.changeTranslateHint(text);
    }
  }

  private addPuzzleImg(
    idx: NumSentence,
    word: BaseComponent,
    el: GameData,
    sumWidth: number,
    imgWidth: string,
    imgHeight: string,
    isLast: boolean,
  ): number {
    const rowWidth = imgWidth.slice(0, -2);
    const rowHeight = Number(imgHeight.slice(0, -2)) / 10;
    let copySum = sumWidth;

    if (!isNull(el.widthPercents) && typeof el.widthPercents === 'number') {
      const widthPixels = (Number(rowWidth) * Number(el.widthPercents)) / 100;
      const heightPixels = rowHeight * idx;
      const url = this.getUrl();
      word.setAttributes({
        style: `background-position-y: ${-heightPixels}px; background-position-x: ${-sumWidth}px; background-size: ${imgWidth} ${imgHeight}; background-repeat: no-repeat; background-image: url(${url});`,
      });
      copySum += widthPixels;

      changePuzzleHead(copySum, heightPixels, rowHeight, word, url, imgWidth, imgHeight, isLast);
    }
    return copySum;
  }

  private async changeWidthImg(idx: NumSentence): Promise<void> {
    const data = this.gameData[idx];
    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;
      const imageField = this.gameField.getElement();
      const styles = await getStyles(imageField);
      let sumWidth = 0;

      words.forEach((el, i) => {
        const isLast = i === words.length - 1;
        if (!isNull(el.node)) {
          sumWidth = this.addPuzzleImg(idx, el.node, el, sumWidth, styles.width, styles.height, isLast);
        }
      });
    }
  }

  private createHtmlWords(idx: NumSentence): void {
    const data = this.gameData[idx];
    this.wordsContainer.clean();
    this.arrWords.setHTML('');

    if (!isNull(data) && !isUndefined(data)) {
      const words = data.wordsFullData;

      words.forEach((el, i) => {
        const word = new BaseComponent(
          'div',
          ['col-img'],
          { id: el.id, draggable: 'true', 'data-width': `${el.widthPercents}%` },
          el.word,
        );
        if (i > 0) {
          word.setClasses(['tail-puzzle']);
        }
        const colResult = new BaseComponent('div', ['col', 'col-target'], { id: `target-${idx}-${i}` });
        const colContainer = new BaseComponent('div', ['col', 'col-container'], { id: `container-${i}` });
        this.curRow.appendChild(colResult.getElement());

        this.wordsContainer.append(colContainer);

        const wordData = words[i];
        if (!isUndefined(wordData)) {
          wordData.node = word;
        }
        this.arrWords.append(word);

        this.handlerPuzzle(word);
        this.handlerTouch(word);
        this.handleCol(colResult);
        this.handleCol(colContainer);
      });
    }
  }

  private handlerTouch(wordPuzzle: BaseComponent): void {
    let newParent: HTMLElement | null | undefined;
    wordPuzzle.addListener('touchstart', (event: Event): void => {
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        this.puzzle = event.target;
        this.puzzleParent = event.target.parentNode;
      }
    });
    wordPuzzle.addListener('touchmove', (event: Event): void => {
      event.preventDefault();
      if (isHTMLElement(this.puzzle)) {
        addAbsolute(event, this.puzzle, this.puzzleParent, this.gameWrapper);
        newParent = touchDrag(this.puzzle, this.curRow, this.puzzleParent);
      }
    });
    wordPuzzle.addListener('touchend', (): void => {
      if (isHTMLElement(this.puzzle) && isHTMLElement(this.puzzleParent)) {
        if (!isUndefined(newParent) && !isNull(newParent)) {
          const child = newParent.firstChild;
          if (isHTMLElement(child) && this.puzzleParent.classList.contains('col-container')) {
            removeAbsolute(this.puzzle);
            return;
          }
          if (isHTMLElement(child) && this.puzzleParent.classList.contains('col-target')) {
            this.puzzleParent.append(child);
            changeWidth(this.puzzleParent, child);
            newParent.append(this.puzzle);
            removeAbsolute(this.puzzle);
            changeWidth(newParent, this.puzzle);
            return;
          }
          newParent.append(this.puzzle);
          changeWidth(newParent, this.puzzle, this.puzzleParent);
        }
        removeAbsolute(this.puzzle);
      }
      this.isFullSentence();
    });
  }

  private handlerPuzzle(wordPuzzle: BaseComponent): void {
    wordPuzzle.addListener('click', (event: Event): void => {
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        const parent = event.target.parentNode;
        if (!isNull(parent) && isHTMLElement(parent)) {
          if (parent.classList.contains('col-target')) {
            const colParent = this.wordsContainer.getElement();
            changeColParent(colParent.childNodes, event.target, parent);
          }
        }
        if (!isNull(parent) && isHTMLElement(parent)) {
          if (parent.classList.contains('col-container')) {
            changeColParent(this.curRow.childNodes, event.target, parent);
          }
        }

        this.isFullSentence();
      }
    });

    wordPuzzle.addListener('dragstart', (event: Event): void => {
      dragStart(event);
      if (!isNull(event.target) && isHTMLElement(event.target)) {
        this.puzzle = event.target;
        this.puzzleParent = event.target.parentNode;
        this.puzzle.style.zIndex = '1';
      }
    });

    wordPuzzle.addListener('dragend', (): void => {
      if (!isNull(this.puzzle)) {
        this.puzzle.classList.remove('hide');
        this.isFullSentence();
      }
    });
  }

  private handleCol(col: BaseComponent): void {
    col.addListener('dragover', (event: Event): void => {
      if (!isNull(this.puzzle)) {
        dragOver(event, this.puzzle);
      }
    });

    col.addListener('dragenter', (event) => {
      dragEnter(event);
    });

    col.addListener('dragleave', (event) => {
      dragLeave(event);
    });

    col.addListener('drop', (event) => {
      if (!isNull(this.puzzle) && isHTMLElement(event.target)) {
        if (!isNull(this.puzzleParent)) {
          drop(event, this.puzzle, this.puzzleParent);
        }
      }
    });
  }

  private changeToRandom(arrWords: BaseComponent): void {
    const parent = arrWords.getElement();
    const children = Array.from(parent.childNodes);
    const colParents = this.wordsContainer.getElement();

    children.sort(() => Math.random() - 0.5);

    const { length } = children;
    let idx = 0;

    while (idx < length) {
      const el = children[idx];
      const colParent = colParents.childNodes[idx];

      if (!isUndefined(el) && isHTMLElement(el) && !isUndefined(colParent) && isHTMLElement(colParent)) {
        changeWidth(colParent, el);
        colParent.append(el);

        idx += 1;
      }
    }
  }

  private changeWords(lvlId: string, i: NumSentence): { data: Word; wordsFullData: GameData[] } {
    const data = this.selectSentence(i);
    const words = splitText(data?.textExample, ' ');
    const winData = store.game.getWinData();

    const wordsFullData: GameData[] = words.map((el, idx) => ({
      id: `img_${lvlId}_${i}_${idx}`,
      word: el,
      length: el.length,
      widthPercents: 1,
      node: null,
      isWin: winData[idx],
    }));

    return { data, wordsFullData };
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new GamePage(fn);
  return page;
};

export default createPage;
