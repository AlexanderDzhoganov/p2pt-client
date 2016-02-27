import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('faq')
export class Faq {
  showFaqItem(i) {
    var item = $('.faq .list-item[data-faq-item="' + i + '"] .content');

    if(!item.hasClass("show")) {
      $('.faq .list-item .content').removeClass("show")

      item.addClass("show");
    } else {
      $('.faq .list-item .content').removeClass("show")
    }
  }
}