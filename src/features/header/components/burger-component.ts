import BaseComponent from '@/components/base-component.ts';
import cog from '@/assets/icons/cog.ts';

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
