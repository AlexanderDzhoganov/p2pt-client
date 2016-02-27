import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('faq')
export class Faq {
  showFaqItem(i) {
    $('.faq .list-item[data-faq-item="' + i + '"] .content').toggle();
  }
}