import '@/features/game-page/conponents/hints/hints.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import Eye from '@/assets/icons/eye-outline.svg';
import EyeOff from '@/assets/icons/eye-off-outline.svg';

export default class GameHints extends BaseComponent {
  private readonly hintsContainer: BaseComponent;
  private readonly translateText: BaseComponent;
  private readonly translateBtn: BaseButton;
  private readonly translateIcon: BaseComponent;

  private isShowTranslate: boolean;

  constructor() {
    super('div', ['head'], {});
    this.isShowTranslate = true;

    this.translateText = new BaseComponent('p', ['text'], {}, 'text');

    this.hintsContainer = new BaseComponent('div', ['hints']);

    this.translateIcon = new BaseComponent('img', ['icon'], { alt: '', src: Eye });
    this.translateBtn = new BaseButton('button', '', ['translate-hint', 'icon-btn'], { id: 'translate-hint' });
    this.translateBtn.append(this.translateIcon);
    this.translateBtn.addListener('click', () => {
      this.toggleTranslate();
    });

    this.hintsContainer.append(this.translateBtn);

    this.append(this.translateText, this.hintsContainer);
  }

  public changeTranslateText(text: string): void {
    this.translateText.setTextContent(text);
  }

  public toggleTranslate(): void {
    this.isShowTranslate = !this.isShowTranslate;
    this.changeTranslateICon(this.isShowTranslate);
    this.toggleTranslateText(this.isShowTranslate);
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
