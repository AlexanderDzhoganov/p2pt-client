System.register(['aurelia-framework'], function (_export) {
  'use strict';

  var inject, customElement, bindable, Faq;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      customElement = _aureliaFramework.customElement;
      bindable = _aureliaFramework.bindable;
    }],
    execute: function () {
      Faq = (function () {
        function Faq() {
          _classCallCheck(this, _Faq);

          this.faqShown = false;
        }

        _createClass(Faq, [{
          key: 'showFaq',
          value: function showFaq() {
            if (!this.faqShown) {
              this.faqShown = true;
              $('.faq').addClass('shown');
            } else {
              this.faqShown = false;
              $('.faq').removeClass('shown');
            }
          }
        }, {
          key: 'showFaqItem',
          value: function showFaqItem(i) {
            var item = $('.faq .list-item[data-faq-item="' + i + '"] .content');

            if (!item.hasClass("show")) {
              if ($('.faq .list-item .content').hasClass("show")) {
                $('.faq .list-item .content').removeClass("show");
                $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");

                setTimeout(function () {
                  item.addClass("show");
                  $('.faq .list-item[data-faq-item="' + i + '"] .title i').removeClass("fa-angle-right").addClass("fa-angle-down");
                }, 100);
              } else {
                $('.faq .list-item .content').removeClass("show");
                $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");

                item.addClass("show");
                $('.faq .list-item[data-faq-item="' + i + '"] .title i').removeClass("fa-angle-right").addClass("fa-angle-down");
              }
            } else {
              $('.faq .list-item .content').removeClass("show");
              $('.faq .list-item .title i').removeClass("fa-angle-down").addClass("fa-angle-right");
            }
          }
        }]);

        var _Faq = Faq;
        Faq = customElement('faq')(Faq) || Faq;
        return Faq;
      })();

      _export('Faq', Faq);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7dUNBR2EsR0FBRzs7Ozs7Ozs7aUNBSFIsTUFBTTt3Q0FBRSxhQUFhO21DQUFFLFFBQVE7OztBQUcxQixTQUFHO2lCQUFILEdBQUc7OztlQUNkLFFBQVEsR0FBRyxLQUFLOzs7cUJBREwsR0FBRzs7aUJBR1AsbUJBQUc7QUFDUixnQkFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsa0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLGVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0IsTUFBTTtBQUNMLGtCQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN0QixlQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hDO1dBQ0Y7OztpQkFFVSxxQkFBQyxDQUFDLEVBQUU7QUFDYixnQkFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGlDQUFpQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQzs7QUFFcEUsZ0JBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNsRCxpQkFBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pELGlCQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXRGLDBCQUFVLENBQUMsWUFBWTtBQUNyQixzQkFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QixtQkFBQyxDQUFDLGlDQUFpQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQ2xILEVBQUUsR0FBRyxDQUFDLENBQUM7ZUFDVCxNQUFNO0FBQ0wsaUJBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqRCxpQkFBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV0RixvQkFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QixpQkFBQyxDQUFDLGlDQUFpQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7ZUFDbEg7YUFDRixNQUFNO0FBQ0wsZUFBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pELGVBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzthQUN2RjtXQUNGOzs7bUJBcENVLEdBQUc7QUFBSCxXQUFHLEdBRGYsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUNSLEdBQUcsS0FBSCxHQUFHO2VBQUgsR0FBRyIsImZpbGUiOiJmYXEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdCwgY3VzdG9tRWxlbWVudCwgYmluZGFibGV9IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJztcblxuQGN1c3RvbUVsZW1lbnQoJ2ZhcScpXG5leHBvcnQgY2xhc3MgRmFxIHtcbiAgZmFxU2hvd24gPSBmYWxzZTtcblxuICBzaG93RmFxKCkge1xuICAgIGlmKCF0aGlzLmZhcVNob3duKSB7XG4gICAgICB0aGlzLmZhcVNob3duID0gdHJ1ZTtcbiAgICAgICQoJy5mYXEnKS5hZGRDbGFzcygnc2hvd24nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mYXFTaG93biA9IGZhbHNlO1xuICAgICAgJCgnLmZhcScpLnJlbW92ZUNsYXNzKCdzaG93bicpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dGYXFJdGVtKGkpIHtcbiAgICB2YXIgaXRlbSA9ICQoJy5mYXEgLmxpc3QtaXRlbVtkYXRhLWZhcS1pdGVtPVwiJyArIGkgKyAnXCJdIC5jb250ZW50Jyk7XG5cbiAgICBpZiAoIWl0ZW0uaGFzQ2xhc3MoXCJzaG93XCIpKSB7XG4gICAgICBpZiAoJCgnLmZhcSAubGlzdC1pdGVtIC5jb250ZW50JykuaGFzQ2xhc3MoXCJzaG93XCIpKSB7XG4gICAgICAgICQoJy5mYXEgLmxpc3QtaXRlbSAuY29udGVudCcpLnJlbW92ZUNsYXNzKFwic2hvd1wiKVxuICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW0gLnRpdGxlIGknKS5yZW1vdmVDbGFzcyhcImZhLWFuZ2xlLWRvd25cIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS1yaWdodFwiKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpdGVtLmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW1bZGF0YS1mYXEtaXRlbT1cIicgKyBpICsgJ1wiXSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtcmlnaHRcIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS1kb3duXCIpO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmZhcSAubGlzdC1pdGVtIC5jb250ZW50JykucmVtb3ZlQ2xhc3MoXCJzaG93XCIpXG4gICAgICAgICQoJy5mYXEgLmxpc3QtaXRlbSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtZG93blwiKS5hZGRDbGFzcyhcImZhLWFuZ2xlLXJpZ2h0XCIpO1xuXG4gICAgICAgIGl0ZW0uYWRkQ2xhc3MoXCJzaG93XCIpO1xuICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW1bZGF0YS1mYXEtaXRlbT1cIicgKyBpICsgJ1wiXSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtcmlnaHRcIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS1kb3duXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuZmFxIC5saXN0LWl0ZW0gLmNvbnRlbnQnKS5yZW1vdmVDbGFzcyhcInNob3dcIilcbiAgICAgICQoJy5mYXEgLmxpc3QtaXRlbSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtZG93blwiKS5hZGRDbGFzcyhcImZhLWFuZ2xlLXJpZ2h0XCIpO1xuICAgIH1cbiAgfVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
