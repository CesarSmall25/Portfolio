/*
	Alpha by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	var themeKey = 'site-theme',
		fontScaleKey = 'site-font-scale',
		defaultTheme = 'light',
		defaultFontScale = 'normal';

	var updateDisplayMenuState = function() {
		var theme = $body.attr('data-theme') || defaultTheme;
		var fontScale = $body.attr('data-font-scale') || defaultFontScale;

		$('[data-theme], [data-font-scale]').removeClass('is-active');
		$('[data-theme="' + theme + '"]').addClass('is-active');
		$('[data-font-scale="' + fontScale + '"]').addClass('is-active');
	};

	var applyTheme = function(theme) {
		if (!theme)
			return;

		$body.attr('data-theme', theme);
		try {
			localStorage.setItem(themeKey, theme);
		} catch (e) {
			// Local storage might be unavailable; ignore gracefully.
		}
		updateDisplayMenuState();
	};

	var applyFontScale = function(fontScale) {
		if (!fontScale)
			return;

		$body.attr('data-font-scale', fontScale);
		try {
			localStorage.setItem(fontScaleKey, fontScale);
		} catch (e) {
			// Local storage might be unavailable; ignore gracefully.
		}
		updateDisplayMenuState();
	};

	var getSystemTheme = function() {
		if (!window.matchMedia)
			return defaultTheme;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};

	(function() {
		var storedTheme = null;
		var storedFontScale = null;
		try {
			storedTheme = localStorage.getItem(themeKey);
			storedFontScale = localStorage.getItem(fontScaleKey);
		} catch (e) {
			storedTheme = null;
			storedFontScale = null;
		}

		var initialTheme = storedTheme || getSystemTheme();
		$body.attr('data-theme', initialTheme);
		$body.attr('data-font-scale', storedFontScale || defaultFontScale);

		if (!storedTheme && window.matchMedia) {
			var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			var handleChange = function(event) {
				$body.attr('data-theme', event.matches ? 'dark' : 'light');
				updateDisplayMenuState();
			};

			if (mediaQuery.addEventListener)
				mediaQuery.addEventListener('change', handleChange);
			else if (mediaQuery.addListener)
				mediaQuery.addListener(handleChange);
		}
	})();

	// Breakpoints.
		breakpoints({
			wide:      ( '1281px',  '1680px' ),
			normal:    ( '981px',   '1280px' ),
			narrow:    ( '737px',   '980px'  ),
			narrower:  ( '737px',   '840px'  ),
			mobile:    ( '481px',   '736px'  ),
			mobilep:   ( null,      '480px'  )
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Display controls.
		var $navList = $('#nav > ul');
		if ($navList.length > 0) {
			$navList.append(
				'<li class="display-controls">' +
					'<a href="#" class="icon solid fa-adjust">Display</a>' +
					'<ul>' +
						'<li><a href="#" data-theme="light">Light Mode</a></li>' +
						'<li><a href="#" data-theme="dark">Dark Mode</a></li>' +
						'<li><a href="#" data-font-scale="small">Text: Small</a></li>' +
						'<li><a href="#" data-font-scale="normal">Text: Default</a></li>' +
						'<li><a href="#" data-font-scale="large">Text: Large</a></li>' +
					'</ul>' +
				'</li>'
			);
		}

	// Dropdowns.
		$('#nav > ul').dropotron({
			alignment: 'right'
		});

	// NavPanel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

			updateDisplayMenuState();

		var findDisplayTarget = function(target) {
			if (!target)
				return null;
			if (target.closest)
				return target.closest('a[data-theme], a[data-font-scale]');
			return $(target).closest('a[data-theme], a[data-font-scale]')[0];
		};

		document.addEventListener('click', function(event) {
			var link = findDisplayTarget(event.target);
			if (!link)
				return;

			event.preventDefault();
			var theme = link.getAttribute('data-theme');
			var fontScale = link.getAttribute('data-font-scale');

			if (theme)
				applyTheme(theme);
			if (fontScale)
				applyFontScale(fontScale);
		}, true);

	// NavPanel submenu toggles (mobile).
		(function() {
			var $navPanel = $('#navPanel');
			if ($navPanel.length === 0)
				return;

			var $links = $navPanel.find('.link');
			if ($links.length === 0)
				return;

			var getDepth = function($link) {
				var match = /depth-(\d+)/.exec($link.attr('class') || '');
				return match ? parseInt(match[1], 10) : 0;
			};

			var linkData = [];
			$links.each(function(index) {
				var $link = $(this);
				linkData.push({
					$link: $link,
					depth: getDepth($link),
					index: index,
					parentIndex: null,
					hasChildren: false
				});
			});

			for (var i = 0; i < linkData.length; i++) {
				var current = linkData[i];
				for (var j = i - 1; j >= 0; j--) {
					if (linkData[j].depth === current.depth - 1) {
						current.parentIndex = j;
						break;
					}
				}
				if (current.parentIndex !== null)
					linkData[current.parentIndex].hasChildren = true;
			}

			var $genericSuiteLink = $links.filter(function() {
				return $(this).text().trim() === 'Generic Suite';
			}).first();

			if ($genericSuiteLink.length === 0)
				return;

			var genericSuiteIndex = null;
			for (var k = 0; k < linkData.length; k++) {
				if (linkData[k].$link.is($genericSuiteLink)) {
					genericSuiteIndex = k;
					break;
				}
			}

			if (genericSuiteIndex === null)
				return;

			var setExpanded = function($link, expanded) {
				$link
					.toggleClass('is-expanded', expanded)
					.toggleClass('is-collapsed', !expanded)
					.attr('aria-expanded', expanded);

				$link.find('.nav-toggle').text(expanded ? '▾' : '▸');
			};

			var isWithinGenericSuite = function(itemIndex) {
				var parentIndex = linkData[itemIndex].parentIndex;
				while (parentIndex !== null) {
					if (parentIndex === genericSuiteIndex)
						return true;
					parentIndex = linkData[parentIndex].parentIndex;
				}
				return false;
			};

			var refreshVisibility = function() {
				linkData.forEach(function(item, itemIndex) {
					if (itemIndex === genericSuiteIndex || !isWithinGenericSuite(itemIndex)) {
						item.$link.removeClass('is-hidden');
						return;
					}

					var shouldHide = false;
					var parentIndex = item.parentIndex;
					while (parentIndex !== null) {
						var parent = linkData[parentIndex];
						if (parentIndex === genericSuiteIndex && parent.$link.hasClass('is-collapsed')) {
							shouldHide = true;
							break;
						}
						if (parentIndex !== genericSuiteIndex && parent.$link.hasClass('is-collapsed')) {
							shouldHide = true;
							break;
						}
						parentIndex = parent.parentIndex;
					}
					item.$link.toggleClass('is-hidden', shouldHide);
				});
			};

			linkData.forEach(function(item, itemIndex) {
				if (!item.hasChildren)
					return;

				if (itemIndex !== genericSuiteIndex && !isWithinGenericSuite(itemIndex))
					return;

				item.$link
					.addClass('nav-parent is-collapsed')
					.attr('aria-expanded', 'false');

				if (item.$link.find('.nav-toggle').length === 0) {
					item.$link.append('<span class="nav-toggle" role="button" aria-label="Toggle submenu" tabindex="0">▸</span>');
				}
			});

			linkData.forEach(function(item, itemIndex) {
				if (item.hasChildren && (itemIndex === genericSuiteIndex || isWithinGenericSuite(itemIndex)))
					setExpanded(item.$link, false);
			});

			refreshVisibility();

			$navPanel.on('click', '.nav-toggle', function(event) {
				event.preventDefault();
				event.stopPropagation();
				var $parentLink = $(this).closest('.link');
				setExpanded($parentLink, !$parentLink.hasClass('is-expanded'));
				refreshVisibility();
			});

			$navPanel.on('keydown', '.nav-toggle', function(event) {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					$(this).trigger('click');
				}
			});
		})();

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}

})(jQuery);