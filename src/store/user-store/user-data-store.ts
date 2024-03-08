export type UserType = {
  name: string;
  surname: string;
};

export class User {
  private user: UserType;

  constructor(userData: UserType = { name: '', surname: '' }) {
    this.user = userData;
  }

  public GET_USER(): UserType {
    return this.user;
  }

  public SET_USER(userData: UserType): void {
    this.user = { ...userData };
  }
}
