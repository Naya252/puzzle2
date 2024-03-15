import '@/features/game-page/conponents/hints/hints.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import Eye from '@/assets/icons/eye-outline.svg';
import EyeOff from '@/assets/icons/eye-off-outline.svg';
import Play from '@/assets/icons/play-circle-outline.svg';
import Volume from '@/assets/icons/volume-high.svg';
import VolumeOff from '@/assets/icons/volume-off.svg';

const toggleIcon = (item: BaseComponent, isTrue: boolean, trueIcon: string, falseIcon: string): void => {
  item.setAttributes({ src: isTrue ? trueIcon : falseIcon });
};

const toggleHint = (item: BaseComponent, isShow: boolean): void => {
  if (isShow) {
    item.removeClasses(['invisible']);
  } else {
    item.setClasses(['invisible']);
  }
};

export default class GameHints extends BaseComponent {
  private readonly hintsContainer: BaseComponent;

  private readonly translateHint: BaseComponent;
  private readonly translateSettingBtn: BaseButton;
  private readonly translateSettingIcon: BaseComponent;

  private readonly audioHint: BaseButton;
  private readonly audioSettingBtn: BaseButton;
  private readonly audioSettingIcon: BaseComponent;

  private isShowTranslate: boolean;
  private isShowAudio: boolean;
  private readonly audio: HTMLAudioElement;

  constructor(audioUrl: string) {
    super('div', ['head'], {});
    this.isShowTranslate = true;
    this.isShowAudio = true;

    this.hintsContainer = new BaseComponent('div', ['hints']);

    this.translateHint = new BaseComponent('p', ['text'], {}, 'text');
    this.translateSettingIcon = new BaseComponent('img', ['icon'], { alt: '', src: Eye });
    this.translateSettingBtn = new BaseButton('button', '', ['translate-hint', 'icon-btn']);
    this.translateSettingBtn.append(this.translateSettingIcon);
    this.translateSettingBtn.addListener('click', () => {
      this.toggleTranslate();
    });

    const audioHintIcon = new BaseComponent('img', ['icon'], { alt: '', src: Play });
    this.audioHint = new BaseButton('button', '', ['audio', 'icon-btn']);
    this.audioHint.append(audioHintIcon);
    this.audioHint.addListener('click', () => {
      this.playAudio();
    });
    this.audio = new Audio(audioUrl);
    this.audio.addEventListener('ended', () => {
      this.removeActive();
    });

    this.audioSettingIcon = new BaseComponent('img', ['icon'], { alt: '', src: Volume });
    this.audioSettingBtn = new BaseButton('button', '', ['translate-hint', 'icon-btn']);
    this.audioSettingBtn.append(this.audioSettingIcon);
    this.audioSettingBtn.addListener('click', () => {
      this.toggleAudio();
    });

    this.hintsContainer.append(this.translateSettingBtn, this.audioSettingBtn);

    this.append(this.audioHint, this.translateHint, this.hintsContainer);
  }

  public changeTranslateText(text: string): void {
    this.translateHint.setTextContent(text);
  }

  public toggleTranslate(): void {
    this.isShowTranslate = !this.isShowTranslate;
    toggleIcon(this.translateSettingIcon, this.isShowTranslate, Eye, EyeOff);
    toggleHint(this.translateHint, this.isShowTranslate);
  }

  private toggleAudio(): void {
    this.isShowAudio = !this.isShowAudio;
    toggleIcon(this.audioSettingIcon, this.isShowAudio, Volume, VolumeOff);
    toggleHint(this.audioHint, this.isShowAudio);
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
}
