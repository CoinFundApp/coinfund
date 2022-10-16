"use strict";

(function ($) {
  'use strict';

  $.fn.SalaGridLayout = function () {
    var $el, $grid, $queryInput, resizeTimer;
    /**
     * Calculate size for grid items
     */

    function calculateMasonrySize($isotopeOptions) {
      var windowWidth = window.innerWidth,
          $gridWidth = $grid[0].getBoundingClientRect().width,
          $column = 1,
          $gutter = 0,
          $row_gap = 0,
          settings = $grid.data('grid'),
          lgGutter = settings.gutter ? settings.gutter : 30,
          mdGutter = settings.gutterTablet ? settings.gutterTablet : lgGutter,
          smGutter = settings.gutterMobile ? settings.gutterMobile : mdGutter,
          lgRowGap = settings.RowGap ? settings.RowGap : 60,
          mdRowGap = settings.RowGapTablet ? settings.RowGapTablet : lgRowGap,
          smRowGap = settings.RowGapMobile ? settings.RowGapMobile : mdRowGap,
          lgColumns = settings.columns ? settings.columns : 1,
          mdColumns = settings.columnsTablet ? settings.columnsTablet : lgColumns,
          smColumns = settings.columnsMobile ? settings.columnsMobile : mdColumns;
      var tabletBreakPoint = 1200;
      var mobileBreakPoint = 720;

      if (typeof elementorFrontendConfig !== 'undefined') {
        tabletBreakPoint = elementorFrontendConfig.breakpoints.lg;
        mobileBreakPoint = elementorFrontendConfig.breakpoints.md;
      }

      if (windowWidth >= tabletBreakPoint) {
        $column = lgColumns;
        $gutter = lgGutter;
        $row_gap = lgRowGap;
      } else if (windowWidth >= mobileBreakPoint) {
        $column = mdColumns;
        $gutter = mdGutter;
        $row_gap = mdRowGap;
      } else {
        $column = smColumns;
        $gutter = smGutter;
        $row_gap = smRowGap;
      }

      var totalGutterPerRow = ($column - 1) * $gutter;
      var columnWidth = ($gridWidth - totalGutterPerRow) / $column;
      columnWidth = Math.floor(columnWidth);
      var columnWidth2 = columnWidth;

      if ($column > 1) {
        columnWidth2 = columnWidth * 2 + $gutter;
      }

      if (settings.type != 'metro') {
        $grid.children('.grid-sizer').css({
          'width': columnWidth + 'px'
        });
        $grid.children('.grid-item').each(function (index) {
          var gridItem = $(this);

          if (gridItem.data('width') === 2) {
            gridItem.css({
              'width': columnWidth2 + 'px'
            });
          } else {
            gridItem.css({
              'width': columnWidth + 'px'
            });
          }

          if ('masonry' !== settings.type) {
            gridItem.css({
              'marginBottom': $row_gap + 'px'
            });
          }
        });
      }

      if ($(window).width() > 767) {
        $('.sala-portfolio-mosaic .type-portfolio:nth-child(4n+2)').each(function () {
          var _this = $(this),
              cur_height = 0,
              height = 0,
              marginTop = 0;

          cur_height = _this.height();
          height = _this.next().height();

          if (height > cur_height) {
            marginTop = (height - cur_height) / 2;

            _this.css('margin-top', marginTop + 'px');
          } else if (cur_height > height) {
            marginTop = (cur_height - height) / 2;

            _this.next().css('margin-top', marginTop + 'px');
          }
        });
        $('.sala-portfolio-mosaic .type-portfolio:nth-child(4n+1)').each(function () {
          var _this = $(this),
              cur_height = 0,
              height = 0,
              marginTop = 0;

          cur_height = _this.height();
          height = _this.prev().height();

          if (height > cur_height) {
            marginTop = (height - cur_height) / 2;

            _this.css('margin-top', marginTop + 'px');
          } else if (cur_height > height) {
            marginTop = (cur_height - height) / 2;

            _this.prev().css('margin-top', marginTop + 'px');
          }
        });
      }

      if ($isotopeOptions) {
        $isotopeOptions.packery.gutter = $gutter;
        $isotopeOptions.fitRows.gutter = $gutter;
        $grid.isotope($isotopeOptions);
      }

      $grid.isotope('layout');
    }

    function handlerEntranceAnimation() {
      // Used find() for flex layout.
      var items = $grid.find('.grid-item');
      items.waypoint(function () {
        // Fix for different ver of waypoints plugin.
        var _self = this.element ? this.element : this;

        var $self = $(_self);
        $self.addClass('animate');
      }, {
        offset: '90%',
        triggerOnce: true
      });
    }

    return this.each(function () {
      $el = $(this);
      $grid = $el.find('.sala-grid');
      $queryInput = $el.find('.sala-query-input');
      var settings = $grid.data('grid');
      var gridData;

      if ($grid.length > 0 && settings && typeof settings.type !== 'undefined') {
        var $isotopeOptions = {
          itemSelector: '.grid-item',
          percentPosition: true,
          transitionDuration: 0,
          packery: {
            columnWidth: '.grid-sizer'
          },
          fitRows: {
            gutter: 30
          }
        };

        if ('masonry' === settings.type) {
          $isotopeOptions.layoutMode = 'packery';
        } else {
          $isotopeOptions.layoutMode = 'fitRows';
        }

        gridData = $grid.imagesLoaded(function () {
          calculateMasonrySize($isotopeOptions);

          if ('grid' === settings.type) {
            $grid.isotope('layout');
          }

          $grid.addClass('loaded');
        });
        gridData.one('arrangeComplete', function () {
          handlerEntranceAnimation();
        });
        $(window).on('resize', function () {
          calculateMasonrySize($isotopeOptions); // Sometimes layout can be overlap. then re-cal layout one time.

          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            // Run code here, resizing has "stopped"
            calculateMasonrySize($isotopeOptions);
          }, 500); // DO NOT decrease the time. Sometime, It'll make layout overlay on resize.
        });
      } else {
        handlerEntranceAnimation();
      }

      $el.on('SalaQueryEnd', function (event, el, $items, $pagination) {
        // $queryInput 	= $el.find( '.sala-query-input' );
        if (el.hasClass('sala-portfolio-wrapper')) {
          $queryInput = el.find('.sala-query-input');
        } else if (el.hasClass('sala-blog-wrapper')) {
          $queryInput = el.find('.sala-query-input');
        } else if (el.hasClass('sala-job-wrapper')) {
          $queryInput = el.find('.sala-query-input');
        }

        $grid = el.find('.sala-grid');

        if ($queryInput.val()) {
          el.find('.grid-item').removeClass('sala-skeleton-loading');
          var $pagination_type = el.data('pagination');

          if ($pagination_type == 'navigation' && el.length > 0) {
            var $grid_postision = parseInt(el.offset().top);
            $('html, body').animate({
              scrollTop: $grid_postision - 100
            }, 1000);
          }

          if ($grid.length > 0 && settings && typeof settings.type !== 'undefined') {
            el.find('.sala-pagination').html($pagination);
            var height = $grid.height();
            $grid.isotope().css('height', height).append($items).isotope('reloadItems', $items).imagesLoaded().always(function () {
              $items.addClass('animate');
              calculateMasonrySize($isotopeOptions);

              if ('grid' === settings.type) {
                $grid.isotope('layout');
              }
            });
          } else {
            $grid.append($items).imagesLoaded().always(function () {
              $items.addClass('animate');
            });
          }
        }
      });
    });
  };
})(jQuery);
"use strict";

(function ($) {
  'use strict';

  $.fn.SalaGridQuery = function () {
    var $el, $grid;
    var isQuerying = false;
    var $queryInput;
    /**
     * Use small loader under of the grid instead of whole grid for pagination infinite scroll + load more button.
     */

    var infiniteLoader = false;

    function initFilterCount() {
      if ($('.total-result').length == 0) {
        return;
      }

      var foundPosts = getQuery('found_posts');
      $('.total-result').text(foundPosts);
    }

    function handlerFilter() {
      $el.children('.sala-grid-filter').on('click', '.filter-wrap .btn-filter a', function (e) {
        e.preventDefault();
        var $self = $(this);
        var $parent = $self.closest('.ux-filter');
        var filterValue = [];
        $el.find('.grid-item').addClass('sala-skeleton-loading');
        $parent.find('.filter-control').each(function () {
          var filter = $(this).find('a.save').attr('data-filter');

          if (filter) {
            var arg = [];
            $(this).find('input[name="' + filter + '"]:checked').each(function () {
              arg.push($(this).val());
            });
            var obj = {};
            obj[filter] = arg;
            filterValue.push(obj);
          } else {
            var filter = $(this).find('input.input-control').attr('name');
            var arg = [];
            $(this).find('input:checked').each(function () {
              arg.push($(this).val());
            });
            var obj = {};
            obj[filter] = arg;
            filterValue.push(obj);
          }

          if ($self.hasClass('clear')) {
            var arg = [];
            obj[filter] = arg;
            $parent.find('input:checkbox').removeAttr('checked');
          }
        });

        if ('*' === filterValue) {
          setQueryVars('extra_query', '');
        } else {
          setQueryVars('extra_query', filterValue);
        }

        $el.children('.sala-grid-filter').find('.action-wrap .filter-control').slideUp(200);
        $el.trigger('SalaBeginQuery');
      });
    }

    function handlerPagination() {
      // Do nothing if in elementor editor mode.
      if ($('body').hasClass('elementor-editor-active')) {
        return;
      }

      if ($el.data('pagination') === 'loadmore') {
        $el.children('.sala-pagination').find('.sala-loadmore-button').on('click', function (e) {
          e.preventDefault();
          var current = $(this).closest('.sala-grid-wrapper');

          if (!isQuerying) {
            $(this).hide();
            var paged = getQueryVars('paged', current);
            paged++;
            setQueryVars('paged', paged, current);
            infiniteLoader = true;
            handlerQuery();
          }
        });
      } else if ($el.data('pagination') === 'infinite') {
        // Waiting for header offset top & grid layout rendered.
        var infiniteReady = setInterval(function () {
          if ($grid.hasClass('loaded')) {
            handlerScrollInfinite();
            clearInterval(infiniteReady);
          }
        }, 200);
      } else if ($el.data('pagination') === 'navigation') {
        $el.on('click', '.sala-pagination a.page-numbers', function (e) {
          e.preventDefault();

          if (isQuerying) {
            return;
          }

          var current = $(this).closest('.sala-grid-wrapper');
          current.find('.grid-item').addClass('sala-skeleton-loading');

          if ($('.uxper-search-form').length > 0) {
            $(window).scrollTop($('.uxper-search-form').offset().top - 50);
          }

          current.find('.sala-pagination .page-numbers').removeClass('current');
          $(this).addClass('current');
          var paged = getQueryVars('paged', current);

          if (!$(this).hasClass('next') && !$(this).hasClass('prev')) {
            var current_page = $(this).text();
            paged = parseInt(current_page);
          }

          if ($(this).hasClass('next')) {
            paged = parseInt(paged) + 1;
          }

          if ($(this).hasClass('prev')) {
            paged = parseInt(paged) - 1;
          }

          setQueryVars('paged', paged, current);
          var current = $(this).closest('.sala-grid-wrapper');
          handlerQuery(true);
        });
      }
    }

    function handlerScrollInfinite() {
      var windowHeight = $(window).height(); // 90% window height.

      var halfWH = 90 / 100 * windowHeight;
      halfWH = parseInt(halfWH);
      var elOffsetTop = $el.offset().top;
      var elHeight = $el.outerHeight(true);
      var offsetTop = elOffsetTop + elHeight;
      var finalOffset = offsetTop - halfWH;
      var oldST = 0; // On scroll.

      $(window).on('scroll', function () {
        var st = $(this).scrollTop(); // Scroll down & in view.

        if (st > oldST && st >= finalOffset) {
          if (!isQuerying) {
            var paged = getQueryVars('paged', $el);
            var maxNumberPages = getQuery('max_num_pages', $el);

            if (paged < maxNumberPages) {
              paged++;
              setQueryVars('paged', paged, $el);
              infiniteLoader = true;
              handlerQuery();
            }
          }
        }

        oldST = st;
      });
      $(window).on('resize', function () {
        // Fix layout not really completed.
        setTimeout(function () {
          windowHeight = $(window).height(); // 90% window height.

          halfWH = 90 / 100 * windowHeight;
          halfWH = parseInt(halfWH);
          elOffsetTop = $el.offset().top;
          elHeight = $el.outerHeight(true);
          offsetTop = elOffsetTop + elHeight;
          finalOffset = offsetTop - halfWH;
        }, 100);
      });
    }
    /**
     * Load post infinity from db.
     */


    function handlerQuery(reset) {
      isQuerying = true;
      var loader;
      var current_el;
      loader = $el.find('.sala-loader');

      if (infiniteLoader) {
        loader.addClass('show');
      }

      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
        current_el = $el;
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
        current_el = $el;
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
        current_el = $el;
      }

      setTimeout(function () {
        var query = JSON.parse($queryInput.val());
        var query_data = $.param(query);
        $.ajax({
          url: theme_vars.ajax_url,
          type: 'POST',
          data: query_data,
          dataType: 'json',
          success: function success(results) {
            setQuery('max_num_pages', results.max_num_pages);
            setQuery('found_posts', results.found_posts);
            setQuery('count', results.count);
            initFilterCount();
            var html = results.template;
            var $newItems = $(html);
            var $pagination = results.pagination;

            if (reset === true) {
              $el.find('.grid-item').remove();
            }

            $el.trigger('SalaQueryEnd', [current_el, $newItems, $pagination]);
            handlerQueryEnd();
            loader.removeClass('show');
            isQuerying = false;
            infiniteLoader = false;

            if ($(window).width() > 767) {
              $('.sala-portfolio-mosaic .type-portfolio:nth-child(4n+2)').each(function () {
                var _this = $(this),
                    cur_height = 0,
                    height = 0,
                    marginTop = 0;

                cur_height = _this.height();
                height = _this.next().height();

                if (height > cur_height) {
                  marginTop = (height - cur_height) / 2;

                  _this.css('margin-top', marginTop + 'px');
                } else if (cur_height > height) {
                  marginTop = (cur_height - height) / 2;

                  _this.next().css('margin-top', marginTop + 'px');
                }
              });
              $('.sala-portfolio-mosaic .type-portfolio:nth-child(4n+1)').each(function () {
                var _this = $(this),
                    cur_height = 0,
                    height = 0,
                    marginTop = 0;

                cur_height = _this.height();
                height = _this.prev().height();

                if (height > cur_height) {
                  marginTop = (height - cur_height) / 2;

                  _this.css('margin-top', marginTop + 'px');
                } else if (cur_height > height) {
                  marginTop = (cur_height - height) / 2;

                  _this.prev().css('margin-top', marginTop + 'px');
                }
              });
            }
          }
        });
      }, 500);
    }
    /**
     * Remove pagination if has no posts anymore
     */


    function handlerQueryEnd() {
      // Do not apply for 'navigation' type.
      if ($el.data('pagination') === 'navigation') {
        return;
      }

      var foundPosts = getQuery('found_posts');
      var paged = getQueryVars('paged');
      var numberPages = getQueryVars('posts_per_page');

      if (foundPosts <= paged * numberPages) {
        $el.children('.sala-pagination').hide();
        $el.children('.sala-pagination-messages').show(1000);
      } else {
        $el.children('.sala-pagination').show();
        $el.children('.sala-pagination').find('.sala-loadmore-button').show();
        $el.children('.sala-pagination-messages').hide(1);
      }
    }

    function getQuery(name, current) {
      if (current) {
        $el = current;
      }

      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } // var $queryInput = $el.find( '.sala-query-input' ).first();


      var query = JSON.parse($queryInput.val());
      return query[name];
    }

    function setQuery(name, newValue) {
      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      }

      if ($queryInput.val()) {
        var query = JSON.parse($queryInput.val());
        query[name] = newValue;
        $queryInput.val(JSON.stringify(query));
      }
    }

    function getQueryVars(name, current) {
      if (current) {
        $el = current;
      }

      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } // var $queryInput = $el.find( '.sala-query-input' ).first();


      var queryVars = JSON.parse($queryInput.val());
      return queryVars.query_vars[name];
    }

    function setQueryVars(name, newValue, current) {
      if (current) {
        $el = current;
      }

      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } // var $queryInput = $el.find( '.sala-query-input' ).first();


      var queryVars = JSON.parse($queryInput.val());
      queryVars.query_vars[name] = newValue;
      $queryInput.val(JSON.stringify(queryVars));
    }

    return this.each(function () {
      $el = $(this);
      $grid = $el.find('.sala-grid');

      if ($el.hasClass('sala-portfolio-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-blog-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } else if ($el.hasClass('sala-job-wrapper')) {
        $queryInput = $el.find('.sala-query-input');
      } // $queryInput = $el.find( '.sala-query-input' ).first();


      handlerFilter();
      if (!$queryInput.val()) return;
      initFilterCount();
      handlerPagination();
      $el.on('SalaBeginQuery', function () {
        // Reset to first page.
        setQueryVars('paged', 1);
        handlerQuery(true);
      });
    });
  };
})(jQuery);
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var SALA = SALA || {};

(function ($) {
  'use strict';

  var $body = $('body'),
      $window = $(window),
      ajax_url = theme_vars.ajax_url,
      _header_sticky = theme_vars.header_sticky,
      content_protected_enable = theme_vars.content_protected_enable,
      scroll_top_enable = theme_vars.scroll_top_enable;

  function isInViewport(node) {
    var rect = node.getBoundingClientRect();
    return (rect.height > 0 || rect.width > 0) && rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth);
  }

  SALA.element = {
    init: function init() {
      SALA.element.rtl();
      SALA.element.cookie_notices();
      SALA.element.general();
      SALA.element.nice_select();
      SALA.element.blog_filter();
      SALA.element.retina_logo();
      SALA.element.swiper_carousel();
      SALA.element.scroll_to_top();
      SALA.element.main_menu();
      SALA.element.header_sticky();
      SALA.element.toggle_popup();
      SALA.element.grid_layout();
      SALA.element.validate_form();
      SALA.element.forget_password();
      SALA.element.widget_toggle();
      SALA.element.colormode();
      SALA.element.salaconvertsvg();
      SALA.element.motionfx();
      SALA.element.atropos();
      SALA.element.scroll_bar();

      if (content_protected_enable == 1) {
        SALA.element.content_protected();
      }
    },
    windowLoad: function windowLoad() {
      SALA.element.page_loading_effect();
      SALA.element.handler_animation();
      SALA.element.handler_entrance_queue_animation(); // Smooth scroll to section if url has hash tag when page loaded.

      var hashTag = window.location.hash;

      if (SALA.element.is_valid_smoothscroll_target(hashTag)) {
        SALA.element.smooth_scroll(hashTag);
      }
    },
    rtl: function rtl() {
      $(window).load(function () {
        if ($('body').attr('dir') == 'rtl') {
          $('.elementor-section-stretched').each(function () {
            var val = $(this).css('left');
            $(this).css('left', 'auto');
            $(this).css('right', val);
          });
        }
      });
    },
    general: function general() {
      $('.block-search.search-icon').on('click', function (e) {
        e.preventDefault();
        $('.search-form-wrapper.canvas-search').addClass('on');
      });
      $('.canvas-search').on('click', '.btn-close,.bg-overlay', function (e) {
        e.preventDefault();
        $(this).parents('.canvas-search').removeClass('on');
      });
      $('.sala-pricing-plan-main .sala-list > .item').each(function (index, el) {
        var list_height = $(el).outerHeight();
        var idx = index + 1;
        $(el).parents('.sala-pricing-plan-main').find('.sala-pricing-features .item:nth-child(' + idx + ')').css('height', list_height);
      });
    },
    nice_select: function nice_select() {
      $('.nice-select').niceSelect();
    },
    blog_filter: function blog_filter() {
      $('.sala-filter-form .form-group select').each(function () {
        $(this).on('change', function () {
          var baseUrl = $(this).parents('form').data('homeurl'),
              cat_name = $(this).find('option:selected').val(),
              category = $(this).attr('name'),
              current_url = $(this).parents('form').data('url'),
              new_url = '';

          if (cat_name == '-1') {
            new_url = current_url;
          } else {
            new_url = baseUrl + '/' + category + '/' + cat_name;
          }

          window.location.href = new_url;
        });
      });
    },
    retina_logo: function retina_logo() {
      if (window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.5)').matches || window.matchMedia('only screen and (-o-min-device-pixel-ratio: 3/2)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.5)').matches || window.matchMedia('only screen and (min-device-pixel-ratio: 1.5)').matches) {
        $('.site-logo img').each(function () {
          $(this).addClass('logo-retina');
          $(this).attr('src', $(this).data('retina'));
        });
      }
    },
    cookie_notices: function cookie_notices() {
      if (theme_vars.notice_cookie_enable == 1 && theme_vars.notice_cookie_confirm != 'yes' && theme_vars.notice_cookie_messages != '') {
        $.growl({
          location: 'br',
          fixed: true,
          duration: 3600000,
          size: 'large',
          title: '',
          message: theme_vars.notice_cookie_messages
        });
        $('#sala-button-cookie-notice-ok').on('click', function () {
          $(this).parents('.growl-message').first().siblings('.growl-close').trigger('click');
          var _data = {
            action: 'notice_cookie_confirm'
          };
          _data = $.param(_data);
          $.ajax({
            url: theme_vars.ajax_url,
            type: 'POST',
            data: _data,
            dataType: 'json',
            success: function success(results) {},
            error: function error(errorThrown) {
              console.log(errorThrown);
            }
          });
        });
      }
    },
    page_loading_effect: function page_loading_effect() {
      setTimeout(function () {
        $body.addClass('loaded');
      }, 200);
      var $loader = $('#page-preloader');
      setTimeout(function () {
        $loader.remove();
      }, 2000);
    },
    handler_animation: function handler_animation() {
      var items = $('.sala-grid').children('.grid-item');
      items.waypoint(function () {
        // Fix for different ver of waypoints plugin.
        // eslint-disable-next-line no-underscore-dangle
        var _self = this.element ? this.element : this;

        var $self = $(_self);
        $self.addClass('animate');
      }, {
        offset: '90%',
        triggerOnce: true
      });
    },
    handler_entrance_queue_animation: function handler_entrance_queue_animation() {
      var animateQueueDelay = 200,
          queueResetDelay;
      $('.sala-entrance-animation-queue').each(function () {
        var itemQueue = [],
            queueTimer,
            queueDelay = $(this).data('animation-delay') ? $(this).data('animation-delay') : animateQueueDelay;
        $(this).children('.item').waypoint(function () {
          // Fix for different ver of waypoints plugin.
          // eslint-disable-next-line no-underscore-dangle
          var _self = this.element ? this.element : $(this); // eslint-disable-next-line no-unused-vars


          queueResetDelay = setTimeout(function () {
            queueDelay = animateQueueDelay;
          }, animateQueueDelay);
          itemQueue.push(_self);
          SALA.element.process_item_queue(itemQueue, queueDelay, queueTimer);
          queueDelay += animateQueueDelay;
        }, {
          offset: '90%',
          triggerOnce: true
        });
      });
    },
    process_item_queue: function process_item_queue(itemQueue, queueDelay, queueTimer, queueResetDelay) {
      clearTimeout(queueResetDelay);
      queueTimer = window.setInterval(function () {
        if (itemQueue !== undefined && itemQueue.length) {
          $(itemQueue.shift()).addClass('animate');
          SALA.element.process_item_queue();
        } else {
          window.clearInterval(queueTimer);
        }
      }, queueDelay);
    },
    swiper_carousel: function swiper_carousel() {
      var product_thumb = '';
      var product_review = '';
      $('.sala-swiper-slider').each(function () {
        var slider_name = $(this).data('name');

        if ($(this).find('.woocommerce-product-gallery__image').length) {
          $(this).find('.woocommerce-product-gallery__image').wrap('<div class="swiper-slide"></div>');
        }

        if ($(this).hasClass('sala-swiper-linked-yes')) {
          var mainSlider = $(this).children('.sala-main-swiper').SalaSwiper();
          var thumbsSlider = $(this).children('.sala-thumbs-swiper').SalaSwiper();
          mainSlider.controller.control = thumbsSlider;
          thumbsSlider.controller.control = mainSlider;
        } else {
          if (slider_name && slider_name == 'sala-product-detail-thumb') {
            product_thumb = $(this).SalaSwiper();
          } else if (slider_name && slider_name == 'sala-product-detail-review') {
            product_review = $(this).SalaSwiper();
          } else {
            $(this).SalaSwiper();
          }
        }
      });

      if (product_thumb != '' && product_review != '') {
        product_thumb.controller.control = product_review;
        product_review.controller.control = product_thumb;
      }

      $('.thumbnail-inner .woocommerce-product-gallery__image').each(function () {
        var img = $(this).find('img').data('src');
        $(this).zoom({
          url: img
        });
      });
    },
    scroll_to_top: function scroll_to_top() {
      if (scroll_top_enable != 1) {
        return;
      }

      var $scrollUp = $('#page-scroll-up');
      var lastScrollTop = 0;
      $window.on('scroll', function () {
        var st = $(this).scrollTop();

        if (st > lastScrollTop) {
          $scrollUp.removeClass('show');
        } else {
          if ($window.scrollTop() > 200) {
            $scrollUp.addClass('show');
          } else {
            $scrollUp.removeClass('show');
          }
        }

        lastScrollTop = st;
      });
      $scrollUp.on('click', function (evt) {
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        evt.preventDefault();
      });
    },
    main_menu: function main_menu() {
      var translate = 0,
          index = 0;
      $('.canvas-menu .menu-item-has-children>a,.canvas-menu .page_item_has_children>a, .canvas-menu .children .elementor-heading-title').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        index++;
        translate = translate - 100;
        var ul_parent = $(this).closest('ul.menu');
        ul_parent.css('transform', 'translate(' + translate + '%, 0px)');
        var parent = $(this).closest('li, .elementor-widget-wrap');
        parent.find('>.sub-menu,>.children, > .sala-list-layout-block').fadeIn(300);
        parent.find('> ul.children, .sala-list').prepend('<a href="#" class="btn-canvas-menu btn-back-menu"><i class="fal fa-arrow-left"></i></a>');
        var height = parent.find('>.sub-menu,>.children, > .sala-list-layout-block').outerHeight();

        if (height > 0) {
          $('ul.menu').css('min-height', height + 'px');
        }
      });
      $('.canvas-menu').on('click', '.btn-back-menu', function (e) {
        e.preventDefault();
        translate = translate + 100;
        index--;
        var ul_parent = $(this).parents('ul.menu');
        ul_parent.css('transform', 'translate(' + translate + '%, 0px)');
        $(this).closest('.sub-menu,.children, .sala-list-layout-block, ul.children').fadeOut(300);
        $(this).closest('.sub-menu,.children, .sala-list-layout-block, ul.children').find('.btn-back-menu').remove();
        $(this).remove();
        $('ul.menu').css('min-height', 'auto');
      }); // Open Canvas Menu

      $('.canvas-menu').on('click', '.icon-menu', function (e) {
        e.preventDefault();
        $(this).parents('.canvas-menu').toggleClass('active');
      }); // Close Canvas Menu

      $('.canvas-menu').on('click', '.btn-close,.bg-overlay', function (e) {
        e.preventDefault();
        $(this).parents('.canvas-menu').removeClass('active');
      }); // Check Sub Menu

      $('.site-menu .sub-menu').each(function () {
        var width = $(this).outerWidth();

        if (width > 0) {
          var offset = $(this).offset();
          var w_body = $('body').outerWidth();
          var left = offset.left;

          if (w_body < left + width) {
            $(this).css('left', '-100%');
          }
        }
      });
    },
    header_sticky: function header_sticky() {
      if (_header_sticky == 'yes') {
        return;
      }

      var offset = 0,
          height = 0;

      if ($('header.site-header').length > 0) {
        offset = $('header.site-header').offset().top;
        height = $('header.site-header').outerHeight();
      }

      var has_wpadminbar = $('#wpadminbar').length;
      var wpadminbar = 0;
      var lastScroll = 0;

      if (has_wpadminbar > 0) {
        wpadminbar = $('#wpadminbar').height();
        $('.header-sticky').addClass('has-wpadminbar');
      }

      $(window).on('scroll', function () {
        var currentScroll = $(window).scrollTop();

        if (currentScroll > offset + wpadminbar + height + 100) {
          $('.header-sticky').addClass('scroll');
        } else {
          $('.header-sticky').removeClass('scroll');
        }

        if (currentScroll > lastScroll) {
          $('.header-sticky').removeClass('on');
        } else {
          if (currentScroll < offset + wpadminbar + height + 100) {
            $('.header-sticky').removeClass('on');
          } else {
            $('.header-sticky').addClass('on');
          }
        }

        lastScroll = currentScroll;
      });
    },
    toggle_popup: function toggle_popup() {
      $('.sala-popup').on('click', '.bg-overlay, .btn-close', function (e) {
        e.preventDefault();
        $('html').css('overflow', 'auto');
        $('html').css('margin-right', '0');
        $(this).closest('.sala-popup').removeClass('open');
        $('iframe').each(function (index) {
          $(this).attr('src', $(this).attr('src'));
          return false;
        });
      });
      $('.btn-sala-popup').on('click', function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        $('html').css('overflow', 'hidden');
        $('html').css('margin-right', '15px');
        $('.sala-popup').removeClass('open');
        $(id).addClass('open');
      });
    },
    content_protected: function content_protected() {
      var $contentProtectedAlert = $('#sala-content-protected-box');
      var delayTime = 3000;
      /**
       * Prevent right click.
       */

      $(document).on('contextmenu', function () {
        $contentProtectedAlert.show().delay(delayTime).fadeOut();
        return false;
      });
      $(window).on('keydown', function (event) {
        /**
         * Prevent open chrome dev tools on Win OS.
         */
        // Prevent F12.
        if (event.keyCode == 123) {
          $contentProtectedAlert.show().delay(delayTime).fadeOut();
          return false;
        }
        /**
         * CTRL + SHIFT + I
         * CTRL + SHIFT + J
         * CTRL + SHIFT + C
         */


        if (event.ctrlKey && event.shiftKey && (event.keyCode == 67 || event.keyCode == 73 || event.keyCode == 74)) {
          $contentProtectedAlert.show().delay(delayTime).fadeOut();
          return false;
        }
        /**
         * Prevent open chrome dev tools on Mac OS.
         */

        /**
         * COMMAND + OPTION + I
         * COMMAND + OPTION + J
         * COMMAND + OPTION + C
         */


        if (event.metaKey && event.altKey && (event.keyCode == 67 || event.keyCode == 73 || event.keyCode == 74)) {
          $contentProtectedAlert.show().delay(delayTime).fadeOut();
          return false;
        } // COMMAND + SHIFT + C


        if (event.metaKey && event.shiftKey && event.keyCode == 67) {
          $contentProtectedAlert.show().delay(delayTime).fadeOut();
          return false;
        }
      });
      $('html').bind('cut copy paste', function (e) {
        e.preventDefault();
      });
    },
    get_smooth_scroll_offset: function get_smooth_scroll_offset() {
      if (smoothScrollOffset) {
        return smoothScrollOffset;
      }

      var windowWidth = window.innerWidth,
          smoothScrollOffset = 0; // Add offset of admin bar when viewport min-width 600.

      if (windowWidth > 600) {
        var adminBarHeight = $('#wpadminbar').height();
        smoothScrollOffset += adminBarHeight;
      }

      if (smoothScrollOffset > 0) {
        smoothScrollOffset = -smoothScrollOffset;
      }

      return smoothScrollOffset;
    },
    is_valid_smoothscroll_target: function is_valid_smoothscroll_target(selector) {
      if (selector.match(/^([.#])(.+)/)) {
        return true;
      }

      return false;
    },
    smooth_scroll: function smooth_scroll(target) {
      var offset = SALA.element.get_smooth_scroll_offset();
      $.smoothScroll({
        offset: 0,
        scrollTarget: $(target),
        speed: 600,
        easing: 'linear'
      });
    },
    grid_layout: function grid_layout() {
      $('.sala-grid-wrapper').SalaGridLayout();
      $('.sala-grid-wrapper').SalaGridQuery();
    },
    validate_form: function validate_form() {
      $('#sala-login').validate({
        rules: {
          email: {
            required: true
          },
          password: {
            required: true,
            minlength: 5,
            maxlength: 30
          }
        },
        submitHandler: function submitHandler(form) {
          $.ajax({
            url: ajax_url,
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
              email: $('#ip_email').val(),
              password: $('#ip_password').val(),
              action: 'get_login_user'
            },
            beforeSend: function beforeSend() {
              $('.form-account p.msg').removeClass('text-error text-success text-warning');
              $('.form-account p.msg').text(theme_vars.send_user_info);
              $('#sala-login p.msg').show();
              $('.form-account .loading-effect').fadeIn();
            },
            success: function success(data) {
              $('.form-account p.msg').text(data.messages);

              if (data.success != true) {
                $('#sala-login p.msg').addClass(data.class);
              }

              $('.form-account .loading-effect').fadeOut();

              if (data.redirect != '') {
                window.location.href = data.redirect;
              }
            }
          });
        }
      });
      $('#sala-register').validate({
        rules: {
          reg_firstname: {
            required: true
          },
          reg_lastname: {
            required: true
          },
          reg_email: {
            required: true,
            email: true
          },
          reg_password: {
            required: true,
            minlength: 5,
            maxlength: 20
          },
          accept_account: {
            required: true
          }
        },
        submitHandler: function submitHandler(form) {
          $.ajax({
            url: ajax_url,
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
              account_type: $('input[name="account_type"]:checked').val(),
              firstname: $('#ip_reg_firstname').val(),
              lastname: $('#ip_reg_lastname').val(),
              email: $('#ip_reg_email').val(),
              password: $('#ip_reg_password').val(),
              action: 'get_register_user'
            },
            beforeSend: function beforeSend() {
              $('.form-account p.msg').removeClass('text-error text-success text-warning');
              $('.form-account p.msg').text(theme_vars.send_user_info);
              $('#sala-register p.msg').show();
              $('.form-account .loading-effect').fadeIn();
            },
            success: function success(data) {
              $('.form-account p.msg').text(data.messages);

              if (data.success != true) {
                $('#sala-register p.msg').addClass(data.class);
              } else {
                if (data.redirect != '') {
                  window.location.href = data.redirect;
                }
              }

              $('.form-account .loading-effect').fadeOut();
            }
          });
        }
      });
      jQuery.extend(jQuery.validator.messages, {
        required: "This field is required",
        remote: "Please fix this field",
        email: "A valid email address is required",
        url: "Please enter a valid URL",
        date: "Please enter a valid date",
        dateISO: "Please enter a valid date (ISO)",
        number: "Please enter a valid number.",
        digits: "Please enter only digits",
        creditcard: "Please enter a valid credit card number",
        equalTo: "Please enter the same value again",
        accept: "Please enter a value with a valid extension",
        maxlength: jQuery.validator.format("Please enter no more than {0} characters"),
        minlength: jQuery.validator.format("Please enter at least {0} characters"),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long"),
        range: jQuery.validator.format("Please enter a value between {0} and {1}"),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}"),
        min: jQuery.validator.format("Please enter a value greater than or equal to {0}")
      });
    },
    forget_password: function forget_password($this) {
      $('#sala_forgetpass').on('click', function (e) {
        e.preventDefault();
        var $form = $(this).parents('form');
        $.ajax({
          type: 'post',
          url: ajax_url,
          dataType: 'json',
          data: $form.serialize(),
          beforeSend: function beforeSend() {
            $('.forgot-form p.msg').removeClass('text-error text-success text-warning');
            $('.forgot-form p.msg').text(theme_vars.forget_password);
            $('.forgot-form p.msg').show();
            $('.forgot-form .loading-effect').fadeIn();
          },
          success: function success(data) {
            $('.forgot-form p.msg').text(data.message);
            $('.forgot-form p.msg').addClass(data.class);
            $('.forgot-form .loading-effect').fadeOut();
          }
        });
      });
      $('.generate-password').on('click', function (e) {
        e.preventDefault();
        var Password = {
          _pattern: /[a-zA-Z0-9_\-\+\.\}\{\?\!\@\#\$\%\&\*\~]/,
          _getRandomByte: function _getRandomByte() {
            // http://caniuse.com/#feat=getrandomvalues
            if (window.crypto && window.crypto.getRandomValues) {
              var result = new Uint8Array(1);
              window.crypto.getRandomValues(result);
              return result[0];
            } else if (window.msCrypto && window.msCrypto.getRandomValues) {
              var result = new Uint8Array(1);
              window.msCrypto.getRandomValues(result);
              return result[0];
            } else {
              return Math.floor(Math.random() * 256);
            }
          },
          generate: function generate(length) {
            return Array.apply(null, {
              'length': length
            }).map(function () {
              var result;

              while (true) {
                result = String.fromCharCode(this._getRandomByte());

                if (this._pattern.test(result)) {
                  return result;
                }
              }
            }, this).join('');
          }
        };
        $('#new-password').val(Password.generate(24));
        $('#new-password-error').fadeOut();
      });
      $('#reset-form').validate({
        rules: {
          new_password: {
            required: true,
            minlength: 8
          }
        },
        submitHandler: function submitHandler(form) {
          var new_password = $(form).find('input[name="new_password"]').val();
          var login = $(form).find('input[name="login"]').val();
          $.ajax({
            type: 'POST',
            url: ajax_url,
            data: {
              new_password: new_password,
              login: login,
              action: 'change_password_ajax'
            },
            beforeSend: function beforeSend() {
              $('.reset-form p.msg').removeClass('text-error text-success text-warning');
              $('.reset-form p.msg').text(theme_vars.change_password);
              $('.reset-form p.msg').show();
              $('.reset-form .loading-effect').fadeIn();
            },
            success: function success(data) {
              var data = $.parseJSON(data);
              $('.reset-form p.msg').text(data.message);
              $('.reset-form p.msg').addClass(data.class);
              $('.reset-form .loading-effect').fadeOut();

              if (data.redirect) {
                window.location.href = data.redirect;
              }
            }
          });
        }
      });
    },
    widget_toggle: function widget_toggle($this) {
      $('.sala-pricing-plan .switch').on('click', function (e) {
        e.preventDefault();

        var _this = $(this),
            item = $(this).parents('.sala-pricing-plan').find('.pricing-plan-item');

        _this.toggleClass('active');

        item.each(function () {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          } else {
            $(this).addClass('active');
          }
        });
      });
    },
    colormode: function colormode($this) {
      $('.sala-mode-switcher').on('click', function (e) {
        e.preventDefault();

        var _this = $(this),
            body = $('body');

        _this.toggleClass('sala-dark-scheme');

        body.toggleClass('sala-dark-scheme');
      });
    },
    salaconvertsvg: function salaconvertsvg() {
      // ==========================================
      // ! (function) => salasvg
      // ==========================================
      (function (window, _ref) {
        var implementation = _ref.implementation;
        var isLocal = window.location.protocol === "file:";
        var hasSvgSupport = implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

        function uniqueClasses(list) {
          list = list.split(" ");
          var hash = {};
          var i = list.length;
          var out = [];

          while (i--) {
            if (!hash.hasOwnProperty(list[i])) {
              hash[list[i]] = 1;
              out.unshift(list[i]);
            }
          }

          return out.join(" ");
        }

        var forEach = Array.prototype.forEach || function (fn, scope) {
          if (this === void 0 || this === null || typeof fn !== "function") {
            throw new TypeError();
          }

          var i;
          var len = this.length >>> 0;

          for (i = 0; i < len; ++i) {
            if (i in this) {
              fn.call(scope, this[i], i, this);
            }
          }
        };

        var svgCache = {};
        var svgCount = 0;
        var svgCountEls = [];
        var requestQueue = [];
        var ranScripts = {};

        var svgClone = function svgClone(sourceSvg) {
          return sourceSvg.cloneNode(true);
        };

        var queueRequest = function queueRequest(url, callback) {
          requestQueue[url] = requestQueue[url] || [];
          requestQueue[url].push(callback);
        };

        var processRequestQueue = function processRequestQueue(url) {
          for (var i = 0, len = requestQueue[url].length; i < len; i++) {
            (function (index) {
              setTimeout(function () {
                requestQueue[url][index](svgClone(svgCache[url]));
              }, 0);
            })(i);
          }
        };

        var svgLoad = function svgLoad(url, callback) {
          if (!window.SVGSVGElement) return;

          if (svgCache[url] !== undefined) {
            if (svgCache[url] instanceof SVGSVGElement) {
              callback(svgClone(svgCache[url]));
            } else {
              queueRequest(url, callback);
            }
          } else {
            if (!window.XMLHttpRequest) {
              callback("Browser does not support XMLHttpRequest");
              return false;
            }

            svgCache[url] = {};
            queueRequest(url, callback);
            var httpRequest = new XMLHttpRequest();

            httpRequest.onreadystatechange = function () {
              if (httpRequest.readyState === 4) {
                if (httpRequest.status === 404 || httpRequest.responseXML === null) {
                  callback("Unable to load SVG file: ".concat(url));
                  if (isLocal) callback("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.");
                  callback();
                  return false;
                }

                if (httpRequest.status === 200 || isLocal && httpRequest.status === 0) {
                  if (httpRequest.responseXML instanceof Document) {
                    svgCache[url] = httpRequest.responseXML.documentElement;
                  } else if (DOMParser && DOMParser instanceof Function) {
                    var xmlDoc;

                    try {
                      var parser = new DOMParser();
                      xmlDoc = parser.parseFromString(httpRequest.responseText, "text/xml");
                    } catch (e) {
                      xmlDoc = undefined;
                    }

                    if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length) {
                      callback("Unable to parse SVG file: ".concat(url));
                      return false;
                    } else {
                      svgCache[url] = xmlDoc.documentElement;
                    }
                  }

                  processRequestQueue(url);
                } else {
                  callback("There was a problem injecting the SVG: ".concat(httpRequest.status, " ").concat(httpRequest.statusText));
                  return false;
                }
              }
            };

            httpRequest.open("GET", url);
            if (httpRequest.overrideMimeType) httpRequest.overrideMimeType("text/xml");
            httpRequest.send();
          }
        };

        var injectElement = function injectElement(el, evalScripts, pngFallback, callback) {
          var imgUrl = el.getAttribute("data-src") || el.getAttribute("src");

          if (!/\.svg/i.test(imgUrl)) {
            callback("Attempted to inject a file with a non-svg extension: ".concat(imgUrl));
            return;
          }

          if (!hasSvgSupport) {
            var perElementFallback = el.getAttribute("data-fallback") || el.getAttribute("data-png");

            if (perElementFallback) {
              el.setAttribute("src", perElementFallback);
              callback(null);
            } else if (pngFallback) {
              el.setAttribute("src", "".concat(pngFallback, "/").concat(imgUrl.split("/").pop().replace(".svg", ".png")));
              callback(null);
            } else {
              callback("This browser does not support SVG and no PNG fallback was defined.");
            }

            return;
          }

          if (svgCountEls.includes(el)) {
            return;
          }

          svgCountEls.push(el);
          el.setAttribute("src", "");
          svgLoad(imgUrl, function (svg) {
            if (typeof svg === "undefined" || typeof svg === "string") {
              callback(svg);
              return false;
            }

            var imgId = el.getAttribute("id");

            if (imgId) {
              svg.setAttribute("id", imgId);
            }

            var imgTitle = el.getAttribute("title");

            if (imgTitle) {
              svg.setAttribute("title", imgTitle);
            }

            var classMerge = [].concat(svg.getAttribute("class") || [], "injected-svg", el.getAttribute("class") || []).join(" ");
            svg.setAttribute("class", uniqueClasses(classMerge));
            var imgStyle = el.getAttribute("style");

            if (imgStyle) {
              svg.setAttribute("style", imgStyle);
            }

            var imgData = [].filter.call(el.attributes, function (_ref2) {
              var name = _ref2.name;
              return /^data-\w[\w\-]*$/.test(name) || "onclick".match(name);
            });
            forEach.call(imgData, function (_ref3) {
              var name = _ref3.name,
                  value = _ref3.value;

              if (name && value) {
                svg.setAttribute(name, value);
              }
            });
            var iriElementsAndProperties = {
              clipPath: ["clip-path"],
              "color-profile": ["color-profile"],
              cursor: ["cursor"],
              filter: ["filter"],
              linearGradient: ["fill", "stroke"],
              marker: ["marker", "marker-start", "marker-mid", "marker-end"],
              mask: ["mask"],
              pattern: ["fill", "stroke"],
              radialGradient: ["fill", "stroke"]
            };
            var element;
            var elementDefs;
            var properties;
            var currentId;
            var newId;
            Object.keys(iriElementsAndProperties).forEach(function (key) {
              element = key;
              properties = iriElementsAndProperties[key];
              elementDefs = svg.querySelectorAll("defs ".concat(element, "[id]"));

              var _loop = function _loop(i, elementsLen) {
                currentId = elementDefs[i].id;
                newId = "".concat(currentId, "-").concat(svgCount);
                var referencingElements = void 0;
                forEach.call(properties, function (property) {
                  referencingElements = svg.querySelectorAll("[".concat(property, "*=\"").concat(currentId, "\"]"));

                  for (var j = 0, referencingElementLen = referencingElements.length; j < referencingElementLen; j++) {
                    referencingElements[j].setAttribute(property, "url(#".concat(newId, ")"));
                  }
                });
                elementDefs[i].id = newId;
              };

              for (var i = 0, elementsLen = elementDefs.length; i < elementsLen; i++) {
                _loop(i, elementsLen);
              }
            });
            svg.removeAttribute("xmlns:a");
            var scripts = svg.querySelectorAll("script");
            var scriptsToEval = [];
            var script;
            var scriptType;

            for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
              scriptType = scripts[k].getAttribute("type");

              if (!scriptType || scriptType === "application/ecmascript" || scriptType === "application/javascript") {
                script = scripts[k].innerText || scripts[k].textContent;
                scriptsToEval.push(script);
                svg.removeChild(scripts[k]);
              }
            }

            if (scriptsToEval.length > 0 && (evalScripts === "always" || evalScripts === "once" && !ranScripts[imgUrl])) {
              for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {
                new Function(scriptsToEval[l])(window);
              }

              ranScripts[imgUrl] = true;
            }

            var styleTags = svg.querySelectorAll("style");
            forEach.call(styleTags, function (styleTag) {
              styleTag.textContent += "";
            });
            el.parentNode.replaceChild(svg, el);
            delete svgCountEls[svgCountEls.indexOf(el)];
            el = null;
            svgCount++;
            callback(svg);
          });
        };

        var salasvg = function salasvg(elements) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var done = arguments.length > 2 ? arguments[2] : undefined;
          var evalScripts = options.evalScripts || "always";
          var pngFallback = options.pngFallback || false;
          var eachCallback = options.each;

          if (elements && elements.length !== undefined) {
            var elementsLoaded = 0;
            forEach.call(elements, function (element) {
              injectElement(element, evalScripts, pngFallback, function (svg) {
                if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
                if (done && elements.length === ++elementsLoaded) done(elementsLoaded);
              });
            });
          } else {
            if (elements) {
              injectElement(elements, evalScripts, pngFallback, function (svg) {
                if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
                if (done) done(1);
                elements = null;
              });
            } else {
              if (done) done(0);
            }
          }
        };

        if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
          module.exports = exports = salasvg;
        } else if (typeof define === "function" && define.amd) {
          define(function () {
            return salasvg;
          });
        } else if (_typeof(window) === "object") {
          window.salasvg = salasvg;
        }
      })(window, document); // ==========================================
      // ! (function) => document ready
      // ==========================================


      var ready = function ready(callback) {
        if (document.readyState !== "loading") {
          callback();
        } else {
          document.addEventListener("DOMContentLoaded", callback);
        }
      }; // ==========================================
      // ! (function) => initialize
      // ==========================================


      ready(function () {
        var el = document.querySelectorAll(".salasvg img");
        salasvg(el);
      });
    },
    motionfx: function motionfx($this) {
      $('.elementor-element').each(function () {
        var _this = $(this);

        var data = $(this).data('settings');
        var array = [];
        $.map(data, function (value, index) {
          return array[index] = value;
        });

        if (array['motion_fx_translateY_effect']) {
          _this.addClass('sala-parallax');

          _this.attr('data-direction', array['motion_fx_translateY_direction']);

          var speed = [];
          $.map(array['motion_fx_translateY_speed'], function (value, index) {
            return speed[index] = value;
          });

          _this.attr('data-size', speed['size']);
        }

        if (array['motion_fx_translateX_effect']) {
          _this.addClass('sala-parallax');

          _this.attr('data-direction', array['motion_fx_translateX_direction']);

          var speed = [];
          $.map(array['motion_fx_translateX_speed'], function (value, index) {
            return speed[index] = value;
          });

          _this.attr('data-size', speed['size']);
        }

        if (array['motion_fx_opacity_effect']) {
          _this.addClass('sala-parallax');

          _this.attr('data-direction', array['motion_fx_opacity_direction']);

          var speed = [];
          $.map(array['motion_fx_opacity_level'], function (value, index) {
            return speed[index] = value;
          });

          _this.attr('data-size', speed['size']);

          _this.attr('data-height', $(this).outerHeight());
        }

        if (array['motion_fx_mouseTrack_effect']) {
          _this.addClass('sala-mousetrack');

          _this.attr('data-direction', array['motion_fx_mouseTrack_direction']);

          var speed = [];
          $.map(array['motion_fx_mouseTrack_speed'], function (value, index) {
            return speed[index] = value;
          });

          _this.attr('data-type', 'mousetrack');

          _this.attr('data-size', speed['size']);
        }

        if (array['motion_fx_tilt_effect']) {
          _this.addClass('sala-mousetrack');

          _this.attr('data-direction', array['motion_fx_tilt_direction']);

          var speed = [];
          $.map(array['motion_fx_tilt_speed'], function (value, index) {
            return speed[index] = value;
          });

          _this.attr('data-type', 'tilt');

          _this.attr('data-size', speed['size']);
        }
      });
    },
    atropos: function atropos($this) {
      $('.atropos').each(function () {
        var shadow = $(this).data('shadow');
        var highlight = $(this).data('highlight');
        var duration = $(this).data('duration');
        var shadow_scale = $(this).data('shadowscale');
        window.atropos = new Atropos({
          el: this,
          shadow: shadow,
          highlight: highlight,
          duration: duration,
          shadowScale: shadow_scale
        });
      });
    },
    scroll_bar: function scroll_bar($this) {
      $('.scroll-bar-wrap').each(function () {
        var height = $('body').outerHeight();
        var current = $(window).scrollTop();
        var top = current / height * 100;
        $(this).find('.scroll-bar-current').css('top', top + '%');
      });
    }
  };
  SALA.woocommerce = {
    init: function init() {
      SALA.woocommerce.quantity();
    },
    quantity: function quantity() {
      $('body').on('click', '.entry-quantity .plus', function (e) {
        var input = $(this).parents('.entry-quantity').find('.input-text.qty'); // eslint-disable-next-line radix

        var val = parseInt(input.val()) + 1;
        input.attr('value', val);
        $('.button[name="update_cart"]').prop('disabled', false);
      });
      $('body').on('click', '.entry-quantity .minus', function (e) {
        var input = $(this).parents('.entry-quantity').find('.input-text.qty'); // eslint-disable-next-line radix

        var val = parseInt(input.val()) - 1;

        if (input.val() > 0) {
          input.attr('value', val);
        }

        $('.button[name="update_cart"]').prop('disabled', false);
      });
    }
  };
  SALA.onReady = {
    init: function init() {
      SALA.element.init();
      SALA.woocommerce.init();
    }
  };
  SALA.onLoad = {
    init: function init() {
      SALA.element.windowLoad();
    }
  };
  SALA.onScroll = {
    init: function init() {
      var scrolled = $(window).scrollTop();
      $('.sala-parallax').each(function (index, element) {
        var initY = $(this).offset().top;
        var height = $(this).height();
        var endY = initY + $(this).height();
        var direction = $(this).data('direction');
        var size = $(this).data('size');
        var targetHeight = $(this).data('height');
        var targetHeightTop = $(this).offset().top; // Check if the element is in the viewport.

        var visible = isInViewport(this);

        if (visible && $(window).width() > 767) {
          var diff = scrolled - initY;
          var ratio = Math.round(diff / height * 100);

          if (direction == 'up') {
            $(this).find('> .elementor-widget-container').css('transform', 'translateY(' + parseInt(-(ratio * size)) + 'px)');
          } else if (direction == 'down') {
            $(this).find('> .elementor-widget-container').css('transform', 'translateY(' + parseInt(ratio * size) + 'px)');
          } else if (direction == 'left') {
            $(this).find('> .elementor-widget-container').css('transform', 'translateX(' + parseInt(-(ratio * size)) + 'px)');
          } else if (direction == 'right') {
            $(this).find('> .elementor-widget-container').css('transform', 'translateX(' + parseInt(ratio * size) + 'px)');
          } else if (direction == 'out-in') {
            if (window.scrollY > targetHeightTop) {
              var scrollPercent = (targetHeight - (window.scrollY - targetHeightTop)) / targetHeight;

              if (scrollPercent >= 0) {
                $(this).css('opacity', scrollPercent);
              }
            }
          }
        }
      });
      $('.elementor-element').each(function () {
        if ($(this).hasClass('elementor-invisible')) {
          var _this = $(this),
              settings = _this.data('settings'),
              animation = settings['_animation'] ? settings['_animation'] : settings['animation'],
              animationDelay = 400;

          if (settings['_animation_delay']) {
            animationDelay = settings['_animation_delay'];
          } else if (settings['animation_delay']) {
            animationDelay = settings['animation_delay'];
          }

          var visible = isInViewport(this);

          if (visible) {
            setTimeout(function () {
              _this.removeClass('elementor-invisible').addClass('animated ' + animation);
            }, animationDelay);
          }
        }
      });
      SALA.element.scroll_bar();
    }
  };
  SALA.onResize = {
    init: function init() {
      SALA.element.salaconvertsvg();
    }
  };
  SALA.onMouseMove = {
    init: function init(e) {
      var w = $(window).width();
      var h = $(window).height();

      if ($(window).width() > 767) {
        $(".sala-mousetrack").each(function (i, el) {
          var offset = parseInt($(el).data('size'));
          var direction = $(this).data('direction');
          var type = $(this).data('type');
          $(el).removeClass('sala-tilt');
          var offsetX = 0.5 - e.pageX / w;
          var offsetY = 0.5 - (e.pageY - $(window).scrollTop()) / h;

          if (type == 'mousetrack') {
            if (direction == 'direct') {
              var offsetX = e.pageX / w;
              var offsetY = (e.pageY - $(window).scrollTop()) / h;
            }

            var translate = "translate3d(" + Math.round(offsetX * offset) + "px," + Math.round(offsetY * offset) + "px, 0px)";
            $(el).css({
              '-webkit-transform': translate,
              'transform': translate,
              'moz-transform': translate
            });
          } else if (type == 'tilt') {
            if (direction == 'opposite') {
              var tiltX = Math.round(offsetY * offset);
              var tiltY = Math.round(offsetX * offset);
            } else if (direction == 'direct') {
              var tiltX = -Math.round(offsetY * offset);
              var tiltY = -Math.round(offsetX * offset);
            }

            var translate = "rotateX(var(--rotateX))rotateY(var(--rotateY))";
            $(el).addClass('sala-tilt');
            $(el).find('> .elementor-widget-container').css({
              '--rotateX': tiltX + 'deg',
              '--rotateY': tiltY + 'deg',
              '-webkit-transform': translate,
              'transform': translate,
              'moz-transform': translate
            });
          }
        });
      }
    }
  };
  $(document).on('ready', SALA.onReady.init);
  $(window).on('scroll', SALA.onScroll.init);
  $(window).on('resize', SALA.onResize.init);
  $(window).on('load', SALA.onLoad.init);
  $(window).on('mousemove', SALA.onMouseMove.init);
})(jQuery);
"use strict";

(function ($) {
  'use strict';

  $.fn.SalaSwiper = function (options) {
    var defaults = {};
    var settings = $.extend({}, defaults, options);
    var $swiper;
    this.each(function () {
      var $slider = $(this);
      var $sliderInner = $slider.children('.swiper-inner').first();
      var sliderSettings = $slider.data();
      var $sliderContainer = $sliderInner.children('.swiper-container').first(),
          lgItems = sliderSettings.lgItems ? sliderSettings.lgItems : 1,
          mdItems = sliderSettings.mdItems ? sliderSettings.mdItems : lgItems,
          smItems = sliderSettings.smItems ? sliderSettings.smItems : mdItems,
          lgGutter = sliderSettings.lgGutter ? sliderSettings.lgGutter : 0,
          mdGutter = sliderSettings.mdGutter ? sliderSettings.mdGutter : lgGutter,
          smGutter = sliderSettings.smGutter ? sliderSettings.smGutter : mdGutter,
          speed = sliderSettings.speed ? sliderSettings.speed : 1000; // Normalize slide per view, reset fake view to exist view.

      lgItems = 'auto-fixed' === lgItems ? 'auto' : lgItems;
      mdItems = 'auto-fixed' === mdItems ? 'auto' : mdItems;
      smItems = 'auto-fixed' === smItems ? 'auto' : smItems;
      var swiperOptions = $.extend({}, {
        init: false,
        watchSlidesVisibility: true,
        slidesPerView: smItems,
        spaceBetween: smGutter,
        breakpoints: {
          // when window width is >=
          720: {
            slidesPerView: mdItems,
            spaceBetween: mdGutter
          },
          1200: {
            slidesPerView: lgItems,
            spaceBetween: lgGutter
          }
        }
      }, settings);

      if (sliderSettings.slidesPerGroup == 'inherit') {
        swiperOptions.slidesPerGroup = smItems;
        swiperOptions.breakpoints[720].slidesPerGroup = mdItems;
        swiperOptions.breakpoints[1200].slidesPerGroup = lgItems;
      }

      swiperOptions.watchOverflow = true;

      if (sliderSettings.slideColumns) {
        swiperOptions.slidesPerColumn = sliderSettings.slideColumns;
      }

      if (sliderSettings.initialSlide) {
        swiperOptions.initialSlide = sliderSettings.initialSlide;
      }

      if (sliderSettings.autoHeight) {
        swiperOptions.autoHeight = true;
      }

      if (typeof sliderSettings.simulatetouch !== 'undefined' && !sliderSettings.simulatetouch) {
        swiperOptions.simulateTouch = false;
      }

      if (sliderSettings.hashnavigation) {
        swiperOptions.hashNavigation = true;
      }

      if (speed) {
        swiperOptions.speed = speed;
      } // Maybe: fade, flip


      if (sliderSettings.effect) {
        swiperOptions.effect = sliderSettings.effect;

        if ('custom' === sliderSettings.fadeEffect) {
          swiperOptions.fadeEffect = {
            crossFade: false
          };
        } else {
          swiperOptions.fadeEffect = {
            crossFade: true
          };
        }
      }

      if (sliderSettings.loop) {
        swiperOptions.loop = true;

        if (sliderSettings.loopedslides) {
          swiperOptions.loopedSlides = sliderSettings.loopedslides;
        }
      }

      if (sliderSettings.centered) {
        swiperOptions.centeredSlides = true;
      }

      if (sliderSettings.autoplay) {
        swiperOptions.autoplay = {
          delay: sliderSettings.autoplay,
          disableOnInteraction: false
        };
      }

      if (sliderSettings.freeMode) {
        swiperOptions.freeMode = true;
      }

      var $wrapControls;

      if (sliderSettings.wrapControls) {
        var $wrapControlsWrap = $('<div class="swiper-controls-wrap"></div>');
        $wrapControls = $('<div class="swiper-controls"></div>');
        $wrapControlsWrap.append($wrapControls);
        $slider.append($wrapControlsWrap);
      }

      if (sliderSettings.nav) {
        if (sliderSettings.customNav && sliderSettings.customNav !== '') {
          var $customBtn = $('#' + sliderSettings.customNav);
          var $swiperPrev = $customBtn.find('.slider-prev-btn');
          var $swiperNext = $customBtn.find('.slider-next-btn');
        } else {
          var $swiperPrev = $('<div class="swiper-nav-button swiper-button-prev"><i class="nav-button-icon"></i><span class="nav-button-text">' + theme_vars.prevText + '</span></div>');
          var $swiperNext = $('<div class="swiper-nav-button swiper-button-next"><i class="nav-button-icon"></i><span class="nav-button-text">' + theme_vars.nextText + '</span></div>');
          var $swiperNavButtons = $('<div class="swiper-nav-buttons"></div>');
          $swiperNavButtons.append($swiperPrev).append($swiperNext);
          var $swiperNavButtonsWrap = $('<div class="swiper-nav-buttons-wrap"></div>');

          if ('grid' == sliderSettings.navAlignedBy) {
            $swiperNavButtonsWrap.append('<div class="container"><div class="row"><div class="col-sm-12"></div></div></div>');
            $swiperNavButtonsWrap.find('.col-sm-12').append($swiperNavButtons);
          } else {
            $swiperNavButtonsWrap.append($swiperNavButtons);
          }

          if ($wrapControls) {
            $wrapControls.append($swiperNavButtonsWrap);
          } else {
            $sliderInner.append($swiperNavButtonsWrap);
          }
        }

        swiperOptions.navigation = {
          nextEl: $swiperNext,
          prevEl: $swiperPrev
        };
      }

      if (sliderSettings.pagination) {
        var $swiperPaginationWrap = $('<div class="swiper-pagination-wrap"><div class="swiper-pagination-inner"></div></div>');
        var $swiperPagination = $('<div class="swiper-pagination"></div>');
        $swiperPaginationWrap.find('.swiper-pagination-inner').append($swiperPagination);
        var $swiperPaginationContainerWrap = $('<div class="swiper-pagination-container"></div>');

        if ('grid' == sliderSettings.paginationAlignedBy) {
          $swiperPaginationContainerWrap.append('<div class="container"><div class="row"><div class="col-sm-12"></div></div></div>');
          $swiperPaginationContainerWrap.find('.col-sm-12').append($swiperPaginationWrap);
        } else {
          $swiperPaginationContainerWrap.append($swiperPaginationWrap);
        }

        if ($wrapControls) {
          $wrapControls.append($swiperPaginationContainerWrap);
        } else {
          $slider.append($swiperPaginationContainerWrap);
        }

        var paginationType = 'bullets';

        if (sliderSettings.paginationType) {
          paginationType = sliderSettings.paginationType;
        }

        swiperOptions.pagination = {
          el: $swiperPagination,
          type: paginationType,
          clickable: true
        };

        if ($slider.hasClass('pagination-style-04')) {
          var $swiperAltArrows = $('<div class="swiper-alt-arrow-button swiper-alt-arrow-prev" data-action="prev"></div><div class="swiper-alt-arrow-button swiper-alt-arrow-next" data-action="next"></div>');
          $swiperPaginationWrap.find('.swiper-pagination-inner').append($swiperAltArrows);

          swiperOptions.pagination.renderCustom = function (swiper, current, total) {
            // Convert to string.
            var currentStr = current.toString();
            var totalStr = total.toString();
            return '<div class="fraction"><div class="current">' + currentStr + '</div><div class="separator">/</div><div class="total">' + totalStr + '</div></div>';
          };
        } else if ($slider.hasClass('pagination-style-03')) {
          swiperOptions.pagination.renderCustom = function (swiper, current, total) {
            // Convert to string.
            var currentStr = current.toString();
            var totalStr = total.toString(); // Add leading 0.

            currentStr = currentStr.padStart(2, '0');
            totalStr = totalStr.padStart(2, '0');
            return '<div class="fraction"><div class="current">' + currentStr + '</div><div class="separator"></div><div class="total">' + totalStr + '</div></div>';
          };
        } else if ($slider.hasClass('pagination-style-06')) {
          swiperOptions.pagination.renderCustom = function (swiper, current, total) {
            // Convert to string.
            var currentStr = current.toString();
            var totalStr = total.toString(); // Add leading 0.

            currentStr = currentStr.padStart(2, '0');
            totalStr = totalStr.padStart(2, '0');
            return '<div class="fraction"><div class="current">' + currentStr + '<div class="separator">/</div></div><div class="total">' + totalStr + '</div></div>';
          };
        }
      }

      if (sliderSettings.scrollbar) {
        var $scrollbar = $('<div class="swiper-scrollbar"></div>');
        $sliderContainer.prepend($scrollbar);
        swiperOptions.scrollbar = {
          el: $scrollbar,
          draggable: true
        };
        swiperOptions.loop = false;
      }

      if (sliderSettings.mousewheel) {
        swiperOptions.mousewheel = {
          enabled: true
        };
      }

      if (sliderSettings.vertical) {
        swiperOptions.direction = 'vertical';
      }

      if (sliderSettings.slidetoclickedslide) {
        swiperOptions.slideToClickedSlide = true;
        swiperOptions.touchRatio = 0.2;
      }

      $swiper = new Swiper($sliderContainer, swiperOptions);

      if (sliderSettings.layerTransition) {
        $swiper.on('init', function () {
          var index = $swiper.activeIndex;
          var slides = $swiper.$wrapperEl.find('.swiper-slide');
          var currentSlide = slides.eq(index);
          currentSlide.addClass('animated');
        });
        $swiper.on('slideChangeTransitionEnd', function () {
          var index = $swiper.activeIndex;
          var slides = $swiper.$wrapperEl.find('.swiper-slide');
          var currentSlide = slides.eq(index);
          currentSlide.addClass('animated');
        });
        $swiper.on('slideChangeTransitionStart', function () {
          var slides = $swiper.$wrapperEl.find('.swiper-slide');
          slides.removeClass('animated');
        });
      }

      $swiper.init();

      if ($slider.hasClass('pagination-style-04')) {
        $slider.on('click', '.swiper-alt-arrow-button', function () {
          var action = $(this).data('action');

          switch (action) {
            case 'prev':
              $swiper.slidePrev();
              break;

            case 'next':
              $swiper.slideNext();
              break;
          }
        });
      } // Disabled auto play when focus.

      /*if ( sliderSettings.autoplay ) {
      	$sliderContainer.hover( function() {
      		$swiper.autoplay.stop();
      	}, function() {
      		$swiper.autoplay.start();
      	} );
      }*/


      $(document).trigger('SalaSwiperInit', [$swiper, $slider, swiperOptions]);
    });
    return $swiper;
  };
})(jQuery);
