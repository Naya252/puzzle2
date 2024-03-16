import App from '@/app';
import store from './store/store';
import { setLastGame } from './repository/user-repository';

const app = new App();
window.addEventListener('beforeunload', () => {
  const data = store.game.getGameDataForSaveGame();
  setLastGame(data);
});

app.init();
