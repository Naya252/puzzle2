import BaseComponent from '@/components/base-component';
import '@/features/header/header.scss';
import store from '@/store/store';

// TODO add mobile design with burger

// import BurgerComponent from '@/features/header/components/burger-component';
// import CollapseComponent from '@/features/header/components/collapse-component';
import NavComponent from '@/features/header/components/nav-component';

export default class Header extends BaseComponent {
  // private readonly collapse: CollapseComponent;
  // private readonly burger: BurgerComponent;
  private readonly nav: NavComponent;

  constructor() {
    super('header', ['navbar', 'navbar-expand-md', 'bd-navbar', 'pb-0', 'bg-body-tertiary', 'sticky-top']);

    // this.collapse = new CollapseComponent('nav-collapse');
    // this.burger = new BurgerComponent('nav-collapse');
    this.nav = new NavComponent();

    this.append(this.nav);
    // this.nav.append(this.burger, this.collapse);

    // this.burger.addListener('click', () => {
    //   this.toggleCollapse();
    // });
  }

  public appendLinks(...data: HTMLElement[]): void {
    const linksWrapper = new BaseComponent('div', ['links']);
    linksWrapper.append(...data);
    this.nav.append(linksWrapper);

    this.changeHeader();
  }

  public changeHeader(): void {
    const firstChild = this.element?.childNodes[0];

    if (firstChild !== undefined && firstChild instanceof HTMLElement) {
      const { lastChild } = firstChild;

      if (lastChild !== null && lastChild !== undefined && lastChild instanceof HTMLElement) {
        if (store.user.hasUser()) {
          lastChild.classList.remove('invisible');
        } else {
          lastChild.classList.add('invisible');
        }
      }
    }
  }

  // private toggleCollapse(): void {
  //   const parent = this.element.parentNode?.parentNode;
  //   const sibling = this.element.nextSibling;

  //   if (parent === null || parent === undefined || sibling === null) {
  //     return;
  //   }

  //   if (!(parent instanceof HTMLElement) || !(sibling instanceof HTMLElement)) {
  //     return;
  //   }

  //   if (this.collapse.getElement().classList.contains('show')) {
  //     this.burger.getElement().classList.remove('cog-rotate');
  //     this.collapse.getElement().classList.remove('translate-y');

  //     setTimeout(() => {
  //       parent.classList.remove('burger-open');
  //       sibling.removeAttribute('inert');
  //       this.collapse.getElement().classList.remove('show');
  //     }, 300);
  //   } else {
  //     this.burger.getElement().classList.add('cog-rotate');
  //     this.collapse.getElement().classList.add('show');
  //     parent.classList.add('burger-open');
  //     sibling.setAttribute('inert', 'true');

  //     setTimeout(() => {
  //       this.collapse.getElement().classList.add('translate-y');
  //     }, 300);
  //   }
  // }
}
