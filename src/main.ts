import '@/style.css';
import typescriptLogo from '@/assets/typescript.svg';
import setupCounter from '@/counter.ts';
import viteLogo from '@/assets/vite.svg';

const el = document.querySelector<HTMLDivElement>('#app');

if (el === null) {
  throw new Error('null');
}

el.innerHTML = `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1>Vite + TypeScript</h1>
      <div class="card">
      </div>
      <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  `;

const card = document.querySelector<HTMLDivElement>('.card');

if (card === null) {
  throw new Error('null');
}

const btn = document.createElement('button');
btn.type = 'button';
btn.id = 'counter';

card.append(btn);
setupCounter(btn);
