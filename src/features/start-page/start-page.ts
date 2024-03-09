import BaseComponent from '@/components/base-component.ts';
import BaseButton from '@/components/base-button/base-button.ts';
import store from '@/store/store.ts';
import { ROUTES } from '@/router/pathes.ts';
import '@/features/start-page/start.scss';

const advantagesPoints = [
  'Improve your English language skills.',
  'Thanks to our audio hints, you will improve your listening skills.',
  'Learn something new about paintings and their authors.',
];

const createAbout = (): BaseComponent => {
  const about = new BaseComponent('div', ['about'], {});
  const aboutTitle = new BaseComponent('h3', [], {}, `About the game:`);
  const aboutText = new BaseComponent(
    'p',
    [],
    {},
    `"RSS Puzzle" is an interactive mini-game aimed at improving English language skills. In the game, you will need to assemble sentences from scrambled words. "RSS Puzzle" includes various levels of difficulty, hint options, and a unique puzzle experience using artwork.`,
  );
  about.append(aboutTitle, aboutText);
  return about;
};

const createAdvantages = (): BaseComponent => {
  const advantagesContainer = new BaseComponent('div', ['advantages'], {});
  const advantagesTitle = new BaseComponent('h3', [], {}, `Advantages of the game:`);
  const advantagesList = new BaseComponent('ul', [], {});
  advantagesPoints.forEach((el: string) => {
    const li = new BaseComponent('li', ['advantage'], {}, el);
    advantagesList.append(li);
  });

  advantagesContainer.append(advantagesTitle, advantagesList);
  return advantagesContainer;
};

const createGreeting = (name: string): BaseComponent => {
  const h1 = new BaseComponent('h1', [], {});
  const user = new BaseComponent('span', ['accent'], {}, name);
  const span1 = new BaseComponent('span', [], {}, ', welcome to the ');
  const span2 = new BaseComponent('span', ['accent'], {}, '"RSS Puzzle"');
  const span3 = new BaseComponent('span', [], {}, ' game!');
  h1.append(user, span1, span2, span3);
  return h1;
};

class AuthPage extends BaseComponent {
  constructor(pushRouter: (route: string, isAuth: boolean) => void) {
    super('div', ['layout-content'], {});
    const user = store.user.GET_USER();

    const finalText = new BaseComponent(
      'h3',
      [],
      {},
      'We hope you enjoy playing "RSS Puzzle" and improving your English language skills!',
    );

    const greeting = createGreeting(`${user.name}  ${user.surname}`);
    const about = createAbout();
    const advantages = createAdvantages();
    const content = new BaseComponent('div', ['info-card'], {});

    const startButton = new BaseButton('button', 'Start', ['start']);
    startButton.addListener('click', () => {
      pushRouter(ROUTES.Games, store.user.HAS_USER());
    });

    content.append(greeting, about, advantages, finalText, startButton);
    this.append(content);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new AuthPage(fn);
  return page;
};

export default createPage;
