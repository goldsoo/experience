;(function($) {
  $.fn.inViewport = function(opts) {
    $elems = this;

    if (!$elems.length) {
      return;
    }

    opts = $.extend({
      className: 'inView',
      delay: 300,
      tolerance: 40
    }, opts);

    var isInview = function($elem) {
      var offsetTop = $elem.offset().top;
      var scrollTop = window.scrollY;
      var winHeight = window.innerHeight;

      return offsetTop + opts.tolerance < scrollTop + winHeight;
    };

    var eventWithNamespace = function(id, key, events) {
      var newNamespace = '.' + key + id;
      var newEventNames = [].concat(events).map(function(event) {
        return event + newNamespace;
      }).join(' ');

      return {
        names: newEventNames,
        namespace: newNamespace
      };
    };

    var init = function(i) {
      var $this = $(this);
      var events = eventWithNamespace(i, 'inView', [
        'DOMContentLoaded',
        'load',
        'scroll',
        'resize'
      ]);

      var timeout;

      $(window).on(events.names, function() {
        if (isInview($this)) {
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function() {
            $this.addClass(opts.className);
          }, opts.delay);

          $(window).off(events.namespace);
        }
      });
    };

    return $elems.each(init);
  };

  $(document).ready(function() {
    $('.inViewport').inViewport();
  });
})(jQuery);
