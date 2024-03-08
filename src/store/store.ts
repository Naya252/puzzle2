import { User } from '@/store/user-store/user-data-store.ts';

class Store {
  public user: User;

  constructor() {
    this.user = new User();
  }
}

const store = new Store();

export default store;
