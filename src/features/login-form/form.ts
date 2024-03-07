import BaseComponent from '@/components/base-component.ts';
import BaseInput from '@/components/base-input/base-input.ts';
import BaseButton from '@/components/base-button/base-button.ts';
import '@/features/login-form/form.scss';

type FormMethod = 'post' | 'get';

export default class LoginForm extends BaseComponent {
  public nameInput: BaseInput;
  public surnameInput: BaseInput;
  public button: BaseButton;

  constructor(method: FormMethod = 'post') {
    super('form', [], { method });
    this.nameInput = new BaseInput('name', 'Name', 'name-text', 'subtext', {
      required: '',
      autocomplete: 'off',
    });
    this.surnameInput = new BaseInput('surname', 'Surname', 'surname-text', 'subtext', {
      required: '',
      autocomplete: 'off',
    });
    this.button = new BaseButton('submit', 'Login', 'login-submit');

    this.append(this.nameInput, this.surnameInput, this.button);
  }
}
