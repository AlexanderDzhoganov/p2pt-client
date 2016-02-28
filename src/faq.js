import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('faq')
export class Faq {
  faqShown = false;

  showFaq() {
    if(!this.faqShown) {
      this.faqShown = true;
      $('.faq').addClass('shown');
    } else {
      this.faqShown = false;
      $('.faq').removeClass('shown');
    }
  }

  showFaqItem(i) {
    var item = $('.faq .list-item[data-faq-item="' + i + '"] .content');

    if (!item.hasClass("show")) {
      if ($('.faq .list-item .content').hasClass("show")) {
        $('.faq .list-item .content').removeClass("show")
        $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");

        setTimeout(function () {
          item.addClass("show");
          $('.faq .list-item[data-faq-item="' + i + '"] .title i').removeClass("fa-angle-right").addClass("fa-angle-down");
        }, 100);
      } else {
        $('.faq .list-item .content').removeClass("show")
        $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");

        item.addClass("show");
        $('.faq .list-item[data-faq-item="' + i + '"] .title i').removeClass("fa-angle-right").addClass("fa-angle-down");
      }
    } else {
      $('.faq .list-item .content').removeClass("show")
      $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");
    }
  }
}