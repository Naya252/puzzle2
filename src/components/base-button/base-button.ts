import BaseComponent from '@/components/base-component.ts';
// import '@/components/base-button/button.scss';

type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

export default class BaseButton extends BaseComponent {
  constructor(type: ButtonType, text: string, className: string) {
    super('button', ['btn', 'btn-primary', className], { type }, text);
  }
}
