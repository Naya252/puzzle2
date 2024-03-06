import BaseComponent from '@/components/base-component.ts';

export default function createStartPage(): BaseComponent {
  const startPage = new BaseComponent('div', [], {}, 'Unauth');

  return startPage;
}
