import BaseComponent from '@/components/base-component';
import Logo from '@/assets/vite.svg';

export default class NavComponent extends BaseComponent {
  constructor() {
    super('nav', ['container', 'mb-2', 'flex-wrap', 'flex-md-nowrap']);

    this.createChildren();
  }

  private createChildren(): void {
    const logoWrap = new BaseComponent('div', ['logo-wrap']);
    const logo = new BaseComponent('img', ['logo'], { alt: 'Logo', src: Logo });

    const title = new BaseComponent('h1', ['navbar-brand'], { 'data-bs-theme': 'dark' }, 'RSS Puzzle');
    logoWrap.append(logo, title);
    this.append(logoWrap);
  }
}
