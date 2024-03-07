import BaseComponent from '@/components/base-component.ts';
import GifLayer from '@/features/gif-layer/gif-layer.ts';
import VideoLayer from '@/features/video-layer/video-layer.ts';
import LoginForm from '@/features/login-form/form.ts';

export default function createStartPage(): BaseComponent {
  const startPage = new BaseComponent('div', ['layout-content'], {});
  const gifLayer = new GifLayer();
  const videoLayer = new VideoLayer();
  const loginForm = new LoginForm();

  const content = new BaseComponent('div', ['login-card'], {});
  content.append(loginForm);
  startPage.append(gifLayer, videoLayer, content);

  return startPage;
}
