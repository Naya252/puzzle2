import BaseComponent from '@/components/base-component';
import cog from '@/assets/icons/cog';

export default class BurgerComponent extends BaseComponent {
  constructor(target: string) {
    super('button', ['navbar-toggler'], {
      type: 'button btn-link',
      'data-bs-toggle': 'collapse',
      'data-bs-target': `#${target}`,
      'aria-controls': target,
      'aria-expanded': 'false',
      'aria-label': 'change nav',
    });

    this.setHTML(cog);
  }
}
