import BaseComponent from '@/components/base-component.ts';
import '@/features/video-layer/video-layer.scss';
import videoUrl from '@/assets/video/cloud.mp4';

export default class VideoLayer extends BaseComponent {
  private readonly player: BaseComponent;
  private readonly source: BaseComponent;

  constructor() {
    super('div', ['video-layer']);

    this.source = new BaseComponent('source', [], {
      type: 'video/mp4',
      src: videoUrl,
    });

    this.player = new BaseComponent('video', [], { muted: 'true', autoplay: 'true', loop: 'true', preload: 'auto' });
    this.player.append(this.source);

    const video = this.player.getElement();
    if (video instanceof HTMLVideoElement) {
      video.muted = true;
    }

    this.append(this.player);
  }
}

export const videoLayer = new VideoLayer();
