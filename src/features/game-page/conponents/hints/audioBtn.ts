import '@/features/game-page/conponents/hints/audio.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';
import Play from '@/assets/icons/play-circle-outline.svg';

export default class AudioBtn extends BaseButton {
  private audio: HTMLAudioElement;

  constructor(audioUrl: string) {
    super('button', '', ['audio', 'icon-btn']);

    const audioHintIcon = new BaseComponent('img', ['icon'], { alt: '', src: Play });

    this.append(audioHintIcon);

    this.addListener('click', () => {
      this.playAudio();
    });

    this.audio = new Audio();
    this.changeAudioHint(audioUrl);
  }

  public changeAudioHint(url: string): void {
    this.audio = new Audio(url);

    this.audio.addEventListener('ended', () => {
      this.removeActive();
    });
  }

  public removeActive(): void {
    this.removeClasses(['animated']);
  }

  public playAudio(): void {
    this.audio
      .play()
      .then(() => {
        this.setClasses(['animated']);
      })
      .catch(() => {});
  }
}
