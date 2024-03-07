import BaseComponent from '@/components/base-component.ts';
import BaseInput from '@/components/base-input/base-input.ts';
import BaseButton from '@/components/base-button/base-button.ts';
import '@/features/login-form/form.scss';
import isValid from '@/utils/form-validator.ts';

type FormMethod = 'post' | 'get';

export default class LoginForm extends BaseComponent {
  public nameInput: BaseInput;
  public surnameInput: BaseInput;
  public button: BaseButton;
  public isSubmit = false;

  constructor(method: FormMethod = 'post') {
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
    this.button = new BaseButton('submit', 'Login', 'login-submit');

    this.append(this.nameInput, this.surnameInput, this.button);

    this.addListener('submit', (e: Event) => {
      this.validateForm(e);
    });

    this.validateInput();
  }

  private validateInput(): void {
    this.nameInput.inputListener('input', () => {
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
      // console.log(11111111);
    }

    this.element.classList.add('was-validated');
  }
}
