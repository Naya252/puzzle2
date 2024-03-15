import '@/features/game-page/conponents/hints/hints.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import Eye from '@/assets/icons/eye-outline.svg';
import EyeOff from '@/assets/icons/eye-off-outline.svg';
import Play from '@/assets/icons/play-circle-outline.svg';

export default class GameHints extends BaseComponent {
  private readonly hintsContainer: BaseComponent;

  private readonly translateText: BaseComponent;
  private readonly translateBtn: BaseButton;
  private readonly translateIcon: BaseComponent;

  private readonly play: BaseButton;

  private isShowTranslate: boolean;
  private readonly audio: HTMLAudioElement;

  constructor(audioUrl: string) {
    super('div', ['head'], {});
    this.isShowTranslate = true;

    this.hintsContainer = new BaseComponent('div', ['hints']);

    this.translateText = new BaseComponent('p', ['text'], {}, 'text');
    this.translateIcon = new BaseComponent('img', ['icon'], { alt: '', src: Eye });
    this.translateBtn = new BaseButton('button', '', ['translate-hint', 'icon-btn']);
    this.translateBtn.append(this.translateIcon);
    this.translateBtn.addListener('click', () => {
      this.toggleTranslate();
    });

    const playIcon = new BaseComponent('img', ['icon'], { alt: '', src: Play });
    this.play = new BaseButton('button', '', ['audio', 'icon-btn']);
    this.play.append(playIcon);
    this.play.addListener('click', () => {
      this.playAudio();
    });
    this.audio = new Audio(audioUrl);
    this.audio.addEventListener('ended', () => {
      this.removeActive();
    });

    this.hintsContainer.append(this.translateBtn);

    this.append(this.play, this.translateText, this.hintsContainer);
  }

  public changeTranslateText(text: string): void {
    this.translateText.setTextContent(text);
  }

  public toggleTranslate(): void {
    this.isShowTranslate = !this.isShowTranslate;
    this.changeTranslateICon(this.isShowTranslate);
    this.toggleTranslateText(this.isShowTranslate);
  }

  public playAudio(): void {
    this.audio
      .play()
      .then(() => {
        this.play.setClasses(['animated']);
      })
      .catch(() => {});
  }

  public removeActive(): void {
    this.play.removeClasses(['animated']);
  }

  public changeTranslateICon(isShowEye: boolean): void {
    this.translateIcon.setAttributes({ src: isShowEye ? Eye : EyeOff });
  }

  public toggleTranslateText(isShowEye: boolean): void {
    if (isShowEye) {
      this.translateText.removeClasses(['invisible']);
    } else {
      this.translateText.setClasses(['invisible']);
    }
  }
}
