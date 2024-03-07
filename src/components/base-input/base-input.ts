import BaseComponent from '@/components/base-component.ts';

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
    const input = new BaseComponent('input', ['form-control'], {
      ...attr,
      id: inputId,
      'aria-describedby': textId,
      type: inputType,
    });
    const text = new BaseComponent('div', ['form-text'], { id: textId, text: subtext });

    this.append(label, input, text);
  }
}
