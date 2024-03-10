import BaseComponent from '@/components/base-component';

export default function create404Page(): BaseComponent {
  const notFoundPage = new BaseComponent('div', ['not-found-page'], {}, '404');

  return notFoundPage;
}
