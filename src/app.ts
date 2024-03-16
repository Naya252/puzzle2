import '@/styles/core.scss';
import BaseComponent from '@/components/base-component';
import { videoLayer } from '@/features/video-layer/video-layer';
import HeaderComponent from '@/features/header/header-component';
import FooterComponent from '@/features/footer/footer-component';

import AppRouter from '@/router/router';
import { ROUTES } from '@/router/pathes';

import store from '@/store/store';
import { USER_EMPTY, USER_SETTINGS_EMPTY } from '@/shared/constants';
import {
  getUser,
  removeUser,
  getUserSettings,
  removeUserSettings,
  getCompletedRounds,
  removeCompletedRounds,
  getCompletedLevels,
  removeCompletedLevels,
} from '@/repository/user-repository';
import { changeHintSettings } from '@/features/game-page/conponents/hints/services/hint-service';
import { getLevel, initDefaultGame } from './features/game-page/services/game-service';

export default class App {
  private readonly appContainer: BaseComponent;
  private readonly router: AppRouter;
  private readonly header: HeaderComponent;
  private readonly links: HTMLElement[];

  constructor() {
    this.appContainer = new BaseComponent('div', ['app']);

    this.header = new HeaderComponent();
    const content = new BaseComponent('div', ['content', 'container']);
    const footer = new FooterComponent();
    this.links = this.createLinks();
    store.game.setLinks(this.links);

    this.header.appendLinks(...this.links);
    this.appContainer.append(videoLayer, this.header, content, footer);
    this.router = new AppRouter(content, () => {
      this.header.changeHeader();
    });
  }

  public init(): void {
    const { body } = document;
    body.setAttribute('data-bs-theme', 'dark');
    this.appContainer.appendToParent(body);

    const user = getUser();
    store.user.setUser(user);

    const hintsSettings = getUserSettings();
    changeHintSettings(hintsSettings);

    const completedRounds = getCompletedRounds();
    store.game.changeCompletedRounds(completedRounds);

    const completedLevels = getCompletedLevels();
    store.game.changeCompletedLevels(completedLevels);

    const lvl = store.game.getActiveLevel();
    getLevel(lvl)
      .then(() => {
        initDefaultGame(lvl);
        this.router.push('', store.user.hasUser());

        const active = this.links.find(
          (el) => el.textContent?.toLocaleLowerCase() === window.location.pathname.slice(1),
        );
        active?.classList.add('active-nav');
      })
      .catch(() => {
        throw new Error('error of fetch data');
      });
  }

  protected destroy(): void {
    this.appContainer.remove();
    this.router.destroy();
  }

  private createLinks(): HTMLElement[] {
    return Object.entries(ROUTES).map(([name, route]) => {
      const link = new BaseComponent('a', ['nav-link'], { id: route, href: route }, name === 'Login' ? 'Logout' : name);

      link.addListener('click', (event) => {
        event.preventDefault();
        this.router.push(route, store.user.hasUser());

        store.game.removeActiveLink();
        link.setClasses(['active-nav']);

        const el = link.getElement();

        if (el.id === 'login') {
          removeUser();
          store.user.setUser(USER_EMPTY);
          removeUserSettings();
          changeHintSettings(USER_SETTINGS_EMPTY);
          removeCompletedRounds();
          store.game.changeCompletedRounds([]);
          removeCompletedLevels();
          store.game.changeCompletedLevels([]);

          this.router.logout();
        }
      });

      return link.getElement();
    });
  }
}
