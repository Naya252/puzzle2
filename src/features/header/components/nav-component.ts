import BaseComponent from '@/components/base-component.ts';
import Logo from '@/assets/vite.svg';

export default class NavComponent {
  public nav: BaseComponent;

  constructor() {
    this.nav = new BaseComponent('nav', ['container-fluid', 'mb-2', 'flex-wrap', 'flex-md-nowrap']);
    this.createChildren();
  }

  private createChildren(): void {
    const logoWrap = new BaseComponent('div', ['logo-wrap']);
    const logo = new BaseComponent('img', ['logo'], { alt: 'Logo', src: Logo });

    const title = new BaseComponent('h1', ['navbar-brand'], { 'data-bs-theme': 'dark' }, 'RSS Puzzle');
    logoWrap.append(logo, title);
    this.nav.append(logoWrap.getElement());
  }
}
