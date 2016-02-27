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
        }

        _createClass(Faq, [{
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
                }, 650);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhcS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7dUNBR2EsR0FBRzs7Ozs7Ozs7aUNBSFIsTUFBTTt3Q0FBRSxhQUFhO21DQUFFLFFBQVE7OztBQUcxQixTQUFHO2lCQUFILEdBQUc7Ozs7cUJBQUgsR0FBRzs7aUJBQ0gscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsZ0JBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxpQ0FBaUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7O0FBRXBFLGdCQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN6QixrQkFBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDakQsaUJBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqRCxpQkFBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV0RiwwQkFBVSxDQUFDLFlBQVc7QUFDcEIsc0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsbUJBQUMsQ0FBQyxpQ0FBaUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUNsSCxFQUFFLEdBQUcsQ0FBQyxDQUFDO2VBQ1QsTUFBTTtBQUNMLGlCQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakQsaUJBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFdEYsb0JBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsaUJBQUMsQ0FBQyxpQ0FBaUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2VBQ2xIO2FBQ0YsTUFBTTtBQUNMLGVBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqRCxlQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDdkY7V0FDRjs7O21CQXhCVSxHQUFHO0FBQUgsV0FBRyxHQURmLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FDUixHQUFHLEtBQUgsR0FBRztlQUFILEdBQUciLCJmaWxlIjoiZmFxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpbmplY3QsIGN1c3RvbUVsZW1lbnQsIGJpbmRhYmxlfSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XG5cbkBjdXN0b21FbGVtZW50KCdmYXEnKVxuZXhwb3J0IGNsYXNzIEZhcSB7XG4gIHNob3dGYXFJdGVtKGkpIHtcbiAgICB2YXIgaXRlbSA9ICQoJy5mYXEgLmxpc3QtaXRlbVtkYXRhLWZhcS1pdGVtPVwiJyArIGkgKyAnXCJdIC5jb250ZW50Jyk7XG5cbiAgICBpZighaXRlbS5oYXNDbGFzcyhcInNob3dcIikpIHtcbiAgICAgIGlmKCQoJy5mYXEgLmxpc3QtaXRlbSAuY29udGVudCcpLmhhc0NsYXNzKFwic2hvd1wiKSkge1xuICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW0gLmNvbnRlbnQnKS5yZW1vdmVDbGFzcyhcInNob3dcIilcbiAgICAgICAgJCgnLmZhcSAubGlzdC1pdGVtIC50aXRsZSBpJykucmVtb3ZlQ2xhc3MoXCJmYS1hbmdsZS1kb3duXCIpLmFkZENsYXNzKFwiZmEtYW5nbGUtcmlnaHRcIik7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpdGVtLmFkZENsYXNzKFwic2hvd1wiKTtcbiAgICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW1bZGF0YS1mYXEtaXRlbT1cIicgKyBpICsgJ1wiXSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtcmlnaHRcIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS1kb3duXCIpO1xuICAgICAgICB9LCA2NTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmZhcSAubGlzdC1pdGVtIC5jb250ZW50JykucmVtb3ZlQ2xhc3MoXCJzaG93XCIpXG4gICAgICAgICQoJy5mYXEgLmxpc3QtaXRlbSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtZG93blwiKS5hZGRDbGFzcyhcImZhLWFuZ2xlLXJpZ2h0XCIpO1xuXG4gICAgICAgIGl0ZW0uYWRkQ2xhc3MoXCJzaG93XCIpO1xuICAgICAgICAkKCcuZmFxIC5saXN0LWl0ZW1bZGF0YS1mYXEtaXRlbT1cIicgKyBpICsgJ1wiXSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtcmlnaHRcIikuYWRkQ2xhc3MoXCJmYS1hbmdsZS1kb3duXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuZmFxIC5saXN0LWl0ZW0gLmNvbnRlbnQnKS5yZW1vdmVDbGFzcyhcInNob3dcIilcbiAgICAgICQoJy5mYXEgLmxpc3QtaXRlbSAudGl0bGUgaScpLnJlbW92ZUNsYXNzKFwiZmEtYW5nbGUtZG93blwiKS5hZGRDbGFzcyhcImZhLWFuZ2xlLXJpZ2h0XCIpO1xuICAgIH1cbiAgfVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
