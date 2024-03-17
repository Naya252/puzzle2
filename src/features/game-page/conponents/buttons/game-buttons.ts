import '@/features/game-page/conponents/buttons/buttons.scss';
import BaseComponent from '@/components/base-component';
import BaseButton from '@/components/base-button/base-button';

export default class GameButtons extends BaseComponent {
  public checkBtn: BaseButton;
  public autocompleteBtn: BaseButton;
  public nextRoundBtn: BaseButton;
  public resultsdBtn: BaseButton;

  constructor() {
    super('div', ['buttons-container'], {});

    this.checkBtn = new BaseButton('button', 'Check', ['check-btn', 'outlined'], { disabled: 'true' });
    this.autocompleteBtn = new BaseButton('button', `I don't know`, ['autocomplete-btn', 'outlined']);
    this.nextRoundBtn = new BaseButton('button', `Go to next round`, [
      'check-btn',
      'next-round',
      'outlined',
      'continue',
      'hide',
    ]);
    this.resultsdBtn = new BaseButton('button', 'Results', ['check-btn', 'outlined', 'hide']);

    this.append(this.autocompleteBtn, this.checkBtn, this.resultsdBtn, this.nextRoundBtn);
  }
}
