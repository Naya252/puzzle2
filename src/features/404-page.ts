import BaseComponent from '@/components/base-component';

class ErrorPage extends BaseComponent {
  constructor() {
    super('div', ['not-found-page', 'error-card'], {});

    const h1 = new BaseComponent('h1', ['title-error'], {}, '404');
    const text = new BaseComponent('p', ['text-error'], {}, 'not found');

    this.append(h1, text);
  }
}

const createPage = (): BaseComponent => {
  const page = new ErrorPage();
  return page;
};

export default createPage;
