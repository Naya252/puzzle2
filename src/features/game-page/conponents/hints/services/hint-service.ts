import BaseComponent from '@/components/base-component';
import store from '@/store/store';
import { saveUserSettings } from '@/repository/login-repository';
import { type UserSettingsType } from '@/types/types';

export function toggleHint(item: BaseComponent | ChildNode, isShow: boolean): void {
  if (item instanceof BaseComponent) {
    if (isShow) {
      item.removeClasses(['invisible']);
    } else {
      item.setClasses(['invisible']);
    }
  }

  if (item instanceof HTMLElement) {
    if (isShow) {
      item.classList.remove('hide-img');
    } else {
      item.classList.add('hide-img');
    }
  }
}

export function setHintSettings(): void {
  const settings = store.game.getHintSettings();
  saveUserSettings(settings);
}

export function changeHintSettings(settings: UserSettingsType): void {
  const { isShowTranslate, isShowAudio, isShowImage } = settings;
  store.game.setIsShowTranslate(isShowTranslate);
  store.game.setIsShowAudio(isShowAudio);
  store.game.setIsShowImage(isShowImage);
}
