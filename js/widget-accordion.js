(
	function( $ ) {
		'use strict';

		var SalaAccordionHandler = function( $scope, $ ) {
			var $element = $scope.find( '.sala-accordion' );
			var settings = $scope.data( 'settings' );

			// Do it only on front-end.
			if ( settings && '1' === settings.active_first_item ) {
				$element.children( '.accordion-section:first-child' ).children( '.accordion-content' ).css( 'display', 'block' );
			}

			$element.on( 'click', '.accordion-header', function( e ) {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();

				var section = $( this ).parent( '.accordion-section' );
				var section_content = section.children( '.accordion-content' );
				var id_control = $( this ).parents( '.sala-accordion' ).data( 'id' );

				if ( section.hasClass( 'active' ) ) {
					section.removeClass( 'active' );
					if( ! section_content.hasClass( 'show' ) ){
						section_content.slideUp( 300 );
					}

				} else {
					var parent = $( this ).parents( '.sala-accordion' ).first();
					if ( ! parent.data( 'multi-open' ) ) {

						if( section_content.hasClass( 'show' ) ){
							parent.children( '.active' )
						      	.removeClass( 'active' );
						} else {
							parent.children( '.active' )
								.removeClass( 'active' )
						  		.children( '.accordion-content' )
								.slideUp( 300 );
						}

					}
					section.addClass( 'active' );
					if( ! section_content.hasClass( 'show' ) ){
						section_content.slideDown( 300 );
					}

				}

				if( id_control ){
					var index = $('.accordion-header').index(this);
					const imageCarousel = $( '#' + id_control + ' .swiper-container' );
					var swiperInstance = imageCarousel[0]['swiper'];
					swiperInstance.slideTo( index + 1 );
				}

			} );
		};

		$( window ).on( 'elementor/frontend/init', function() {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/sala-accordion.default', SalaAccordionHandler );
		} );
	}
)( jQuery );

