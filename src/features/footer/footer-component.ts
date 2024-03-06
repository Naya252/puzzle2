import BaseComponent from '@/components/base-component.ts';
import '@/features/footer/footer.scss';

export default class Footer {
  public footer: BaseComponent;

  constructor() {
    this.footer = new BaseComponent('footer', ['footer', 'container']);

    const github = new BaseComponent('a', ['github'], { href: 'https://github.com/Naya252', target: '_blank' });
    const rss = new BaseComponent('a', ['rs-logo'], {
      href: 'https://rs.school/js/',
      target: '_blank',
    });

    this.footer.append(github, rss);
  }
}
