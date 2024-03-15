import '@/features/game-page/conponents/hints/hints.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';

import Eye from '@/assets/icons/eye-outline.svg';
import EyeOff from '@/assets/icons/eye-off-outline.svg';
import Play from '@/assets/icons/play-circle-outline.svg';
import Volume from '@/assets/icons/volume-high.svg';
import VolumeOff from '@/assets/icons/volume-off.svg';
import Image from '@/assets/icons/image-outline.svg';
import ImageOff from '@/assets/icons/image-off-outline.svg';

import toggleHint from '@/features/game-page/conponents/hints/services/hint-service';
import HintBtn from './hint';

export default class GameHints extends BaseComponent {
  private readonly hintsSettingsContainer: BaseComponent;
  private readonly translateSettingBtn: HintBtn;
  private readonly audioSettingBtn: HintBtn;
  private readonly imgSettingBtn: HintBtn;

  private readonly translateHint: BaseComponent;
  private readonly audioHint: BaseButton;
  private audio: HTMLAudioElement;
  private puzzles: ChildNode[];

  constructor(audioUrl: string, isShowTranslate = true, isShowAudio = true, isShowImage = true) {
    super('div', ['head'], {});
    this.puzzles = [];

    this.hintsSettingsContainer = new BaseComponent('div', ['hints']);
    this.translateSettingBtn = this.initTranslateHint(isShowTranslate);
    this.audioSettingBtn = this.initAudioHint(isShowAudio);
    this.imgSettingBtn = this.initImgHint(isShowImage);

    this.translateHint = new BaseComponent('p', ['text'], {}, 'text');
    this.audioHint = new BaseButton('button', '', ['audio', 'icon-btn']);
    const audioHintIcon = new BaseComponent('img', ['icon'], { alt: '', src: Play });
    this.audioHint.append(audioHintIcon);
    this.audioHint.addListener('click', () => {
      this.playAudio();
    });

    this.audio = new Audio();
    this.changeAudioHint(audioUrl);

    this.hintsSettingsContainer.append(this.translateSettingBtn, this.audioSettingBtn, this.imgSettingBtn);
    this.append(this.audioHint, this.translateHint, this.hintsSettingsContainer);
  }

  private initTranslateHint(isShowTranslate: boolean): HintBtn {
    return new HintBtn(
      (isShow) => {
        toggleHint(this.translateHint, isShow);
      },
      Eye,
      EyeOff,
      isShowTranslate,
    );
  }

  private initAudioHint(isShowAudio: boolean): HintBtn {
    return new HintBtn(
      (isShow) => {
        toggleHint(this.audioHint, isShow);
      },
      Volume,
      VolumeOff,
      isShowAudio,
    );
  }

  private initImgHint(isShowImg: boolean): HintBtn {
    return new HintBtn(
      (isShow) => {
        this.changeVisibleImages(isShow);
      },
      Image,
      ImageOff,
      isShowImg,
    );
  }

  public showImages(): void {
    const isVisible = this.imgSettingBtn.getValue();
    if (!isVisible) {
      this.changeVisibleImages(true);
    }
  }

  public hideImages(): void {
    const isVisible = this.imgSettingBtn.getValue();
    if (!isVisible) {
      this.changeVisibleImages(false);
    }
  }

  private changeVisibleImages(isShow: boolean): void {
    this.puzzles.forEach((el) => {
      toggleHint(el, isShow);
    });
  }

  public changeTranslateHint(text: string): void {
    this.translateHint.setTextContent(text);
  }

  public changeAudioHint(url: string): void {
    this.audio = new Audio(url);
    this.audio.addEventListener('ended', () => {
      this.removeActive();
    });
  }

  public playAudio(): void {
    this.audio
      .play()
      .then(() => {
        this.audioHint.setClasses(['animated']);
      })
      .catch(() => {});
  }

  public removeActive(): void {
    this.audioHint.removeClasses(['animated']);
  }

  public changePuzzles(puzzles: BaseComponent): void {
    const el = puzzles.getElement();
    this.puzzles = Array.from(el.childNodes);
    this.hideImages();
  }
}
