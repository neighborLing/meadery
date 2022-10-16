import { isElement } from './utils';

/**
 * html-compile html => html ast
 */

export default class HtmlCompile {
  public htmlStr: string;
  constructor(element: string | HTMLElement) {
    this.htmlStr = isElement(element) ? (element as HTMLElement).outerHTML : element as string;
  }

  parse() {
    
  }
}