import BaseComponent from '@/components/base-component.ts';
// import store from '@/store/store.ts';
import '@/features/start-page/start.scss';
import { videoLayer } from '@/features/video-layer/video-layer.ts';

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

class AuthPage extends BaseComponent {
  constructor(fn: (route: string, isAuth: boolean) => void) {
    super('div', ['layout-content'], {});
    // const user = store.user.GET_USER();
    // `${user.name}  ${user.surname}`
    const h1 = new BaseComponent('h1', [], {}, `Welcome to the "RSS Puzzle" game!`);

    const finalText = new BaseComponent(
      'h3',
      [],
      {},
      'We hope you enjoy playing "RSS Puzzle" and improving your English language skills!',
    );

    const about = createAbout();
    const advantages = createAdvantages();
    const content = new BaseComponent('div', ['info-card'], {});
    content.append(h1, about, advantages, finalText);
    this.append(videoLayer, content);
    console.log(fn);
  }
}

const createPage = (fn: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new AuthPage(fn);
  return page;
};

export default createPage;
