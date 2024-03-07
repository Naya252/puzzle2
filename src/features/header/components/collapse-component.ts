import BaseComponent from '@/components/base-component.ts';

export default class CollapseComponent extends BaseComponent {
  constructor(id: string) {
    super('div', ['collapse', 'navbar-collapse'], { id, 'data-bs-theme': 'dark' });

    this.createInfo();
  }

  private createInfo(): void {
    const info = new BaseComponent('container', ['d-flex', 'container-fluid', 'top-controls', 'flex-wrap']);
    this.append(info);
  }
}
