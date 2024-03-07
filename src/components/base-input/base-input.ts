import BaseComponent from '@/components/base-component.ts';
import '@/components/base-input/input.scss';

type InputType =
  | 'text'
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'time'
  | 'url'
  | 'week';

export default class BaseInput extends BaseComponent {
  private readonly input: BaseComponent;

  constructor(
    inputId: string,
    labelText: string,
    textId: string,
    subtext: string,
    attr: Record<string, string>,
    inputType: InputType = 'text',
  ) {
    super('div', ['input-wrapper']);

    const label = new BaseComponent('label', ['form-label'], { for: inputId }, labelText);
    this.input = new BaseComponent('input', ['form-control'], {
      ...attr,
      id: inputId,
      'aria-describedby': textId,
      type: inputType,
    });
    const text = new BaseComponent('div', ['form-text'], { id: textId, text: subtext });

    this.append(label, this.input, text);
  }

  public inputListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
    this.input.addListener(eventName, listener);
  }
}
