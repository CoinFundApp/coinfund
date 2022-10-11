(
	function( $ ) {
		'use strict';

		var SalaListHandler = function( $scope, $ ) {
			var $element = $scope.find( '.sala-list' );

			var id_control = $element.data( 'id' );

			if( id_control ){

			$( '.sala-list[data-id="' + id_control + '"] .item:nth-child(1)' ).addClass( 'active' );

				$element.on( 'click', '.item', function( e ) {
					e = e || window.event;
					e.preventDefault();
					e.stopPropagation();

					var index = $( this ).index();
					const imageCarousel = $( '#' + id_control + ' .swiper-container' );
					var swiperInstance = imageCarousel[0]['swiper'];
					swiperInstance.slideTo( index );
					$( this ).addClass( 'active' );
					$( '.sala-list .item' ).not( this ).removeClass( 'active' );

				});

			}
		};

		$( window ).on( 'elementor/frontend/init', function() {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/sala-list.default', SalaListHandler );
		} );
	}
)( jQuery );

/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */