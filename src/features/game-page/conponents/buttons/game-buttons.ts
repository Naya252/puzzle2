import '@/features/game-page/conponents/buttons/buttons.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';

export default class GameButtons extends BaseComponent {
  public checkBtn: BaseButton;
  public autocompleteBtn: BaseButton;

  constructor() {
    super('div', ['buttons-container'], {});

    this.checkBtn = new BaseButton('button', 'Check', ['check-btn', 'outlined'], { disabled: 'true' });
    this.autocompleteBtn = new BaseButton('button', `I don't know`, ['autocomplete-btn', 'outlined']);

    this.append(this.autocompleteBtn, this.checkBtn);
  }
}
