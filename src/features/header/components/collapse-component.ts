import BaseComponent from '@/components/base-component.ts';

export default class CollapseComponent {
  public collapse: BaseComponent;

  constructor(id: string) {
    this.collapse = new BaseComponent('div', ['collapse', 'navbar-collapse'], { id, 'data-bs-theme': 'dark' });
    this.createInfo();
  }

  private createInfo(): void {
    const info = new BaseComponent('container', ['d-flex', 'container-fluid', 'top-controls', 'flex-wrap']);
    this.collapse.append(info.getElement());
  }
}
