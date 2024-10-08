import BaseComponent from '@/components/base-component';
import BaseInput from '@/components/base-input/base-input';
import BaseButton from '@/components/base-button/base-button';
import '@/features/login-page/login-form/form.scss';
import isValid from '@/utils/form-validator';
import { saveUser } from '@/repository/user-repository';
import store from '@/store/store';
import { ROUTES } from '@/router/pathes';

type FormMethod = 'post' | 'get';

export default class LoginForm extends BaseComponent {
  public nameInput: BaseInput;
  public surnameInput: BaseInput;
  public button: BaseButton;
  public isSubmit = false;
  public pushRouter: (route: string, isAuth: boolean) => void;

  constructor(pushRouter: (route: string, isAuth: boolean) => void, method: FormMethod = 'post') {
    super('form', ['needs-validation'], { novalidate: '', action: '', method });
    this.nameInput = new BaseInput('name', 'Name', 'name-text', 'subtext', {
      required: '',
      autocomplete: 'off',
      value: '',
      maxlength: '30',
      minlength: '3',
      pattern: '^[A-Z]{1}[a-z]*-?[A-Za-z]*$',
    });
    this.surnameInput = new BaseInput('surname', 'Surname', 'surname-text', 'subtext', {
      required: '',
      autocomplete: 'off',
      value: '',
      maxlength: '30',
      minlength: '4',
      pattern: '^[A-Z]{1}[a-z]*-?[A-Za-z]*$',
    });
    this.button = new BaseButton('submit', 'Login', ['login-submit']);

    this.append(this.nameInput, this.surnameInput, this.button);

    this.addListener('submit', (e: Event) => {
      this.validateForm(e);
    });

    this.validateInput();
    this.pushRouter = pushRouter;
  }

  private validateInput(): void {
    this.nameInput.inputListener('input', () => {
      if (this.isSubmit) {
        isValid(this.element);
      }
    });
    this.surnameInput.inputListener('input', () => {
      if (this.isSubmit) {
        isValid(this.element);
      }
    });
  }

  private validateForm(e: Event): void {
    this.isSubmit = true;

    e.preventDefault();
    e.stopPropagation();

    if (isValid(e)) {
      const userData = { name: this.nameInput.getValue(), surname: this.surnameInput.getValue() };
      saveUser(userData);
      store.user.setUser(userData);
      this.pushRouter(ROUTES.Start, store.user.hasUser());
      store.game.removeActiveLink();
      store.game.addActiveLink(ROUTES.Start);
    }

    this.element.classList.add('was-validated');
  }
}
