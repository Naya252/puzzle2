import BaseComponent from '@/components/base-component.ts';
import '@/features/video-layer/video-layer.scss';
import videoUrl from '@/assets/video/clowd.mp4';

export default class VideoLayer extends BaseComponent {
  private readonly player: BaseComponent;
  private readonly source: BaseComponent;

  constructor() {
    super('div', ['video-layer']);

    this.source = new BaseComponent('source', [], {
      type: 'video/mp4',
      src: videoUrl,
    });

    this.player = new BaseComponent('video', [], { autoplay: '', muted: '', loop: '', preload: '' });
    this.player.append(this.source);

    this.append(this.player);
  }
}
