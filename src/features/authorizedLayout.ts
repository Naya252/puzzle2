import BaseComponent from '@/components/base-component.ts';

export default function createStartPage(): BaseComponent {
  const secondPage = new BaseComponent('div', [], {}, 'Auth');

  return secondPage;
}
