import BaseComponent from '@/components/base-component';
import '@/components/base-button/button.scss';

type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

export default class BaseButton extends BaseComponent {
  constructor(type: ButtonType, text: string, className: string[], attrs: Record<string, string> = {}) {
    super('button', ['btn', 'btn-primary', 'btn-pz-primary', ...className], { ...attrs, type }, text);
  }
}
