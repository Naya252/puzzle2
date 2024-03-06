import BaseComponent from '@/components/base-component.ts';
import '@/features/header/header.scss';

import BurgerComponent from '@/features/header/components/burger-component.ts';
import CollapseComponent from '@/features/header/components/collapse-component.ts';
import NavComponent from '@/features/header/components/nav-component.ts';

export default class Header {
  public header: BaseComponent;
  private readonly collapse: BaseComponent;
  private readonly burger: BaseComponent;
  public nav: BaseComponent;

  constructor() {
    this.header = new BaseComponent('header', [
      'navbar',
      'navbar-expand-md',
      'bd-navbar',
      'pb-0',
      'bg-body-tertiary',
      'sticky-top',
    ]);

    const collapse = new CollapseComponent('nav-collapse');
    const burger = new BurgerComponent('nav-collapse');
    const nav = new NavComponent();

    this.collapse = collapse.collapse;
    this.burger = burger.burger;
    this.nav = nav.nav;

    this.header.append(this.nav.getElement());
    this.nav.append(this.burger.getElement(), this.collapse.getElement());

    this.burger.addListener('click', () => {
      this.toggleCollapse();
    });
  }

  public appendLinks(...data: HTMLAnchorElement[]): void {
    const linksWrapper = new BaseComponent('div', ['links']);
    linksWrapper.append(...data);
    this.nav.append(linksWrapper);
  }

  private toggleCollapse(): void {
    const parent = this.header.getElement().parentNode?.parentNode;
    const sibling = this.header.getElement().nextSibling;

    if (parent === null || parent === undefined || sibling === null) {
      return;
    }

    if (!(parent instanceof HTMLElement) || !(sibling instanceof HTMLElement)) {
      return;
    }

    if (this.collapse.getElement().classList.contains('show')) {
      this.burger.getElement().classList.remove('cog-rotate');
      this.collapse.getElement().classList.remove('translateY');

      setTimeout(() => {
        parent.classList.remove('burger-open');
        sibling.removeAttribute('inert');
        this.collapse.getElement().classList.remove('show');
      }, 300);
    } else {
      this.burger.getElement().classList.add('cog-rotate');
      this.collapse.getElement().classList.add('show');
      parent.classList.add('burger-open');
      sibling.setAttribute('inert', 'true');

      setTimeout(() => {
        this.collapse.getElement().classList.add('translateY');
      }, 300);
    }
  }
}
