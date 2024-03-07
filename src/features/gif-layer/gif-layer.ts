import BaseComponent from '@/components/base-component.ts';
import '@/features/gif-layer/gif-layer.scss';

export default class GifLayer extends BaseComponent {
  constructor() {
    super('div', ['gif-layer']);
  }
}
