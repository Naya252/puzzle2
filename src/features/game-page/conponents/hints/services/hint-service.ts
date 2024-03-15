import BaseComponent from '@/components/base-component';

export default function toggleHint(item: BaseComponent | ChildNode, isShow: boolean): void {
  if (item instanceof BaseComponent) {
    if (isShow) {
      item.removeClasses(['invisible']);
    } else {
      item.setClasses(['invisible']);
    }
  }

  if (item instanceof HTMLElement) {
    if (isShow) {
      item.classList.remove('hide-img');
    } else {
      item.classList.add('hide-img');
    }
  }
}
