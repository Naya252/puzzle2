import User from '@/store/user-store/user-data-store';
import Game from '@/store/game-store/game-store';

class Store {
  public user: User;
  public game: Game;

  constructor() {
    this.user = new User();
    this.game = new Game();
  }
}

const store = new Store();

export default store;
