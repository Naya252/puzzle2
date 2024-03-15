import '@/features/game-page/conponents/hints/hints.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';

export default class HintBtn extends BaseButton {
  private readonly hintIcon: BaseComponent;
  private isShow: boolean;
  private readonly trueIcon: string;
  private readonly falseIcon: string;

  constructor(cb: (isShow: boolean) => void, trueIcon: string, falseIcon: string, isShow = true) {
    super('button', '', ['icon-btn']);

    this.isShow = isShow;
    this.trueIcon = trueIcon;
    this.falseIcon = falseIcon;

    this.hintIcon = new BaseComponent('img', ['icon'], { alt: '', src: this.isShow ? this.trueIcon : this.falseIcon });

    this.append(this.hintIcon);

    this.addListener('click', () => {
      this.toggleShow();
      this.toggleIcon();
      cb(this.isShow);
    });
  }

  private toggleShow(): void {
    this.isShow = !this.isShow;
  }

  private toggleIcon(): void {
    this.hintIcon.setAttributes({ src: this.isShow ? this.trueIcon : this.falseIcon });
  }

  public getValue(): boolean {
    return this.isShow;
  }
}
