import Logout from '@/assets/icons/logout';
import Book from '@/assets/icons/book-open-page-variant-outline';
import List from '@/assets/icons/format-list-bulleted';
import Game from '@/assets/icons/puzzle-star-outline';

export const BASE_DATA_URL = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/`;

export const DATA_URL = `${BASE_DATA_URL}data/wordCollectionLevel`;
export const IMG_URL = `${BASE_DATA_URL}images/`;

export const USER_EMPTY = { name: '', surname: '' };
export const USER_SETTINGS_EMPTY = { isShowTranslate: true, isShowAudio: true, isShowImage: true };
export const LAST_GAME_DATA_EMPTY = { level: 0, round: 0, sentence: 0, winData: [] };

export const MENU_ICONS = [Book, List, Game, Logout];
