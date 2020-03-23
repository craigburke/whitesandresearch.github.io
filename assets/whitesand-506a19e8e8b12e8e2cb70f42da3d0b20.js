/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 Jörn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 *
 * Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
 * I've added my name to these methods so you know who to blame if they are broken!
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * An Array of day names starting with Sunday.
 * 
 * @example dayNames[0]
 * @result 'Sunday'
 *
 * @name dayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * An Array of abbreviated day names starting with Sun.
 * 
 * @example abbrDayNames[0]
 * @result 'Sun'
 *
 * @name abbrDayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * An Array of month names starting with Janurary.
 * 
 * @example monthNames[0]
 * @result 'January'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * An Array of abbreviated month names starting with Jan.
 * 
 * @example abbrMonthNames[0]
 * @result 'Jan'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The first day of the week for this locale.
 *
 * @name firstDayOfWeek
 * @type Number
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.firstDayOfWeek = 1;

/**
 * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.format = 'dd/mm/yyyy';
//Date.format = 'mm/dd/yyyy';
//Date.format = 'yyyy-mm-dd';
//Date.format = 'dd mmm yy';

/**
 * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
 * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.fullYearStart = '20';

(function() {

	/**
	 * Adds a given method under the given name 
	 * to the Date prototype if it doesn't
	 * currently exist.
	 *
	 * @private
	 */
	function add(name, method) {
		if( !Date.prototype[name] ) {
			Date.prototype[name] = method;
		}
	};
	
	/**
	 * Checks if the year is a leap year.
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isLeapYear();
	 * @result true
	 *
	 * @name isLeapYear
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isLeapYear", function() {
		var y = this.getFullYear();
		return (y%4==0 && y%100!=0) || y%400==0;
	});
	
	/**
	 * Checks if the day is a weekend day (Sat or Sun).
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekend();
	 * @result false
	 *
	 * @name isWeekend
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekend", function() {
		return this.getDay()==0 || this.getDay()==6;
	});
	
	/**
	 * Check if the day is a day of the week (Mon-Fri)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekDay();
	 * @result false
	 * 
	 * @name isWeekDay
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekDay", function() {
		return !this.isWeekend();
	});
	
	/**
	 * Gets the number of days in the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDaysInMonth();
	 * @result 31
	 * 
	 * @name getDaysInMonth
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDaysInMonth", function() {
		return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];
	});
	
	/**
	 * Gets the name of the day.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName();
	 * @result 'Saturday'
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName(true);
	 * @result 'Sat'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getDayName", function(abbreviated) {
		return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
	});

	/**
	 * Gets the name of the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName();
	 * @result 'Janurary'
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName(true);
	 * @result 'Jan'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getMonthName", function(abbreviated) {
		return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
	});

	/**
	 * Get the number of the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayOfYear();
	 * @result 11
	 * 
	 * @name getDayOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDayOfYear", function() {
		var tmpdtm = new Date("1/1/" + this.getFullYear());
		return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
	});
	
	/**
	 * Get the number of the week of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getWeekOfYear();
	 * @result 2
	 * 
	 * @name getWeekOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getWeekOfYear", function() {
		return Math.ceil(this.getDayOfYear() / 7);
	});

	/**
	 * Set the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.setDayOfYear(1);
	 * dtm.toString();
	 * @result 'Tue Jan 01 2008 00:00:00'
	 * 
	 * @name setDayOfYear
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("setDayOfYear", function(day) {
		this.setMonth(0);
		this.setDate(day);
		return this;
	});
	
	/**
	 * Add a number of years to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addYears(1);
	 * dtm.toString();
	 * @result 'Mon Jan 12 2009 00:00:00'
	 * 
	 * @name addYears
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addYears", function(num) {
		this.setFullYear(this.getFullYear() + num);
		return this;
	});
	
	/**
	 * Add a number of months to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMonths(1);
	 * dtm.toString();
	 * @result 'Tue Feb 12 2008 00:00:00'
	 * 
	 * @name addMonths
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMonths", function(num) {
		var tmpdtm = this.getDate();
		
		this.setMonth(this.getMonth() + num);
		
		if (tmpdtm > this.getDate())
			this.addDays(-this.getDate());
		
		return this;
	});
	
	/**
	 * Add a number of days to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addDays(1);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addDays
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addDays", function(num) {
		//this.setDate(this.getDate() + num);
		this.setTime(this.getTime() + (num*86400000) );
		return this;
	});
	
	/**
	 * Add a number of hours to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addHours(24);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addHours
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addHours", function(num) {
		this.setHours(this.getHours() + num);
		return this;
	});

	/**
	 * Add a number of minutes to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMinutes(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 01:00:00'
	 * 
	 * @name addMinutes
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMinutes", function(num) {
		this.setMinutes(this.getMinutes() + num);
		return this;
	});
	
	/**
	 * Add a number of seconds to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addSeconds(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name addSeconds
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addSeconds", function(num) {
		this.setSeconds(this.getSeconds() + num);
		return this;
	});
	
	/**
	 * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
	 * 
	 * @example var dtm = new Date();
	 * dtm.zeroTime();
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name zeroTime
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("zeroTime", function() {
		this.setMilliseconds(0);
		this.setSeconds(0);
		this.setMinutes(0);
		this.setHours(0);
		return this;
	});
	
	/**
	 * Returns a string representation of the date object according to Date.format.
	 * (Date.toString may be used in other places so I purposefully didn't overwrite it)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.asString();
	 * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name asString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("asString", function(format) {
		var r = format || Date.format;
		return r
			.split('yyyy').join(this.getFullYear())
			.split('yy').join((this.getFullYear() + '').substring(2))
			.split('mmmm').join(this.getMonthName(false))
			.split('mmm').join(this.getMonthName(true))
			.split('mm').join(_zeroPad(this.getMonth()+1))
			.split('dd').join(_zeroPad(this.getDate()))
			.split('hh').join(_zeroPad(this.getHours()))
			.split('min').join(_zeroPad(this.getMinutes()))
			.split('ss').join(_zeroPad(this.getSeconds()));
	});
	
	/**
	 * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
	 * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
	 *
	 * @example var dtm = Date.fromString("12/01/2008");
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name fromString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	Date.fromString = function(s, format)
	{
		var f = format || Date.format;
		var d = new Date('01/01/1977');
		
		var mLength = 0;

		var iM = f.indexOf('mmmm');
		if (iM > -1) {
			for (var i=0; i<Date.monthNames.length; i++) {
				var mStr = s.substr(iM, Date.monthNames[i].length);
				if (Date.monthNames[i] == mStr) {
					mLength = Date.monthNames[i].length - 4;
					break;
				}
			}
			d.setMonth(i);
		} else {
			iM = f.indexOf('mmm');
			if (iM > -1) {
				var mStr = s.substr(iM, 3);
				for (var i=0; i<Date.abbrMonthNames.length; i++) {
					if (Date.abbrMonthNames[i] == mStr) break;
				}
				d.setMonth(i);
			} else {
				d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
			}
		}
		
		var iY = f.indexOf('yyyy');

		if (iY > -1) {
			if (iM < iY)
			{
				iY += mLength;
			}
			d.setFullYear(Number(s.substr(iY, 4)));
		} else {
			if (iM < iY)
			{
				iY += mLength;
			}
			// TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
			d.setFullYear(Number(Date.fullYearStart + s.substr(f.indexOf('yy'), 2)));
		}
		var iD = f.indexOf('dd');
		if (iM < iD)
		{
			iD += mLength;
		}
		d.setDate(Number(s.substr(iD, 2)));
		if (isNaN(d.getTime())) {
			return false;
		}
		return d;
	};
	
	// utility method
	var _zeroPad = function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
		//return ('0'+num).substring(-2); // doesn't work on IE :(
	};
	
})();
/**
 * Copyright (c) 2008 Kelvin Luck (http://www.kelvinluck.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * .
 * $Id: jquery.datePicker.js 102 2010-09-13 14:00:54Z kelvin.luck $
 **/

(function($){
    
	$.fn.extend({
/**
 * Render a calendar table into any matched elements.
 * 
 * @param Object s (optional) Customize your calendars.
 * @option Number month The month to render (NOTE that months are zero based). Default is today's month.
 * @option Number year The year to render. Default is today's year.
 * @option Function renderCallback A reference to a function that is called as each cell is rendered and which can add classes and event listeners to the created nodes. Default is no callback.
 * @option Number showHeader Whether or not to show the header row, possible values are: $.dpConst.SHOW_HEADER_NONE (no header), $.dpConst.SHOW_HEADER_SHORT (first letter of each day) and $.dpConst.SHOW_HEADER_LONG (full name of each day). Default is $.dpConst.SHOW_HEADER_SHORT.
 * @option String hoverClass The class to attach to each cell when you hover over it (to allow you to use hover effects in IE6 which doesn't support the :hover pseudo-class on elements other than links). Default is dp-hover. Pass false if you don't want a hover class.
 * @type jQuery
 * @name renderCalendar
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#calendar-me').renderCalendar({month:0, year:2007});
 * @desc Renders a calendar displaying January 2007 into the element with an id of calendar-me.
 *
 * @example
 * var testCallback = function($td, thisDate, month, year)
 * {
 * if ($td.is('.current-month') && thisDate.getDay() == 4) {
 *		var d = thisDate.getDate();
 *		$td.bind(
 *			'click',
 *			function()
 *			{
 *				alert('You clicked on ' + d + '/' + (Number(month)+1) + '/' + year);
 *			}
 *		).addClass('thursday');
 *	} else if (thisDate.getDay() == 5) {
 *		$td.html('Friday the ' + $td.html() + 'th');
 *	}
 * }
 * $('#calendar-me').renderCalendar({month:0, year:2007, renderCallback:testCallback});
 * 
 * @desc Renders a calendar displaying January 2007 into the element with an id of calendar-me. Every Thursday in the current month has a class of "thursday" applied to it, is clickable and shows an alert when clicked. Every Friday on the calendar has the number inside replaced with text.
 **/
		renderCalendar  :   function(s)
		{
			var dc = function(a)
			{
				return document.createElement(a);
			};

			s = $.extend({}, $.fn.datePicker.defaults, s);
			
			if (s.showHeader != $.dpConst.SHOW_HEADER_NONE) {
				var headRow = $(dc('tr'));
				for (var i=Date.firstDayOfWeek; i<Date.firstDayOfWeek+7; i++) {
					var weekday = i%7;
					var day = Date.dayNames[weekday];
					headRow.append(
						jQuery(dc('th')).attr({'scope':'col', 'abbr':day, 'title':day, 'class':(weekday == 0 || weekday == 6 ? 'weekend' : 'weekday')}).html(s.showHeader == $.dpConst.SHOW_HEADER_SHORT ? day.substr(0, 1) : day)
					);
				}
			};
			
			var calendarTable = $(dc('table'))
									.attr(
										{
											'cellspacing':2
										}
									)
									.addClass('jCalendar')
									.append(
										(s.showHeader != $.dpConst.SHOW_HEADER_NONE ? 
											$(dc('thead'))
												.append(headRow)
											:
											dc('thead')
										)
									);
			var tbody = $(dc('tbody'));
			
			var today = (new Date()).zeroTime();
			today.setHours(12);
			
			var month = s.month == undefined ? today.getMonth() : s.month;
			var year = s.year || today.getFullYear();
			
			var currentDate = (new Date(year, month, 1, 12, 0, 0));
			
			
			var firstDayOffset = Date.firstDayOfWeek - currentDate.getDay() + 1;
			if (firstDayOffset > 1) firstDayOffset -= 7;
			var weeksToDraw = Math.ceil(( (-1*firstDayOffset+1) + currentDate.getDaysInMonth() ) /7);
			currentDate.addDays(firstDayOffset-1);
			
			var doHover = function(firstDayInBounds)
			{
				return function()
				{
					if (s.hoverClass) {
						var $this = $(this);
						if (!s.selectWeek) {
							$this.addClass(s.hoverClass);
						} else if (firstDayInBounds && !$this.is('.disabled')) {
							$this.parent().addClass('activeWeekHover');
						}
					}
				}
			};
			var unHover = function()
			{
				if (s.hoverClass) {
					var $this = $(this);
					$this.removeClass(s.hoverClass);
					$this.parent().removeClass('activeWeekHover');
				}
			};

			var w = 0;
			while (w++<weeksToDraw) {
				var r = jQuery(dc('tr'));
				var firstDayInBounds = s.dpController ? currentDate > s.dpController.startDate : false;
				for (var i=0; i<7; i++) {
					var thisMonth = currentDate.getMonth() == month;
					var d = $(dc('td'))
								.text(currentDate.getDate() + '')
								.addClass((thisMonth ? 'current-month ' : 'other-month ') +
													(currentDate.isWeekend() ? 'weekend ' : 'weekday ') +
													(thisMonth && currentDate.getTime() == today.getTime() ? 'today ' : '')
								)
								.data('datePickerDate', currentDate.asString())
								.hover(doHover(firstDayInBounds), unHover)
							;
					r.append(d);
					if (s.renderCallback) {
						s.renderCallback(d, currentDate, month, year);
					}
					// addDays(1) fails in some locales due to daylight savings. See issue 39.
					//currentDate.addDays(1);
					// set the time to midday to avoid any weird timezone issues??
					currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1, 12, 0, 0);
				}
				tbody.append(r);
			}
			calendarTable.append(tbody);
			
			return this.each(
				function()
				{
					$(this).empty().append(calendarTable);
				}
			);
		},
/**
 * Create a datePicker associated with each of the matched elements.
 *
 * The matched element will receive a few custom events with the following signatures:
 *
 * dateSelected(event, date, $td, status)
 * Triggered when a date is selected. event is a reference to the event, date is the Date selected, $td is a jquery object wrapped around the TD that was clicked on and status is whether the date was selected (true) or deselected (false)
 * 
 * dpClosed(event, selected)
 * Triggered when the date picker is closed. event is a reference to the event and selected is an Array containing Date objects.
 *
 * dpMonthChanged(event, displayedMonth, displayedYear)
 * Triggered when the month of the popped up calendar is changed. event is a reference to the event, displayedMonth is the number of the month now displayed (zero based) and displayedYear is the year of the month.
 *
 * dpDisplayed(event, $datePickerDiv)
 * Triggered when the date picker is created. $datePickerDiv is the div containing the date picker. Use this event to add custom content/ listeners to the popped up date picker.
 *
 * @param Object s (optional) Customize your date pickers.
 * @option Number month The month to render when the date picker is opened (NOTE that months are zero based). Default is today's month.
 * @option Number year The year to render when the date picker is opened. Default is today's year.
 * @option String startDate The first date date can be selected.
 * @option String endDate The last date that can be selected.
 * @option Boolean inline Whether to create the datePicker as inline (e.g. always on the page) or as a model popup. Default is false (== modal popup)
 * @option Boolean createButton Whether to create a .dp-choose-date anchor directly after the matched element which when clicked will trigger the showing of the date picker. Default is true.
 * @option Boolean showYearNavigation Whether to display buttons which allow the user to navigate through the months a year at a time. Default is true.
 * @option Boolean closeOnSelect Whether to close the date picker when a date is selected. Default is true.
 * @option Boolean displayClose Whether to create a "Close" button within the date picker popup. Default is false.
 * @option Boolean selectMultiple Whether a user should be able to select multiple dates with this date picker. Default is false.
 * @option Number numSelectable The maximum number of dates that can be selected where selectMultiple is true. Default is a very high number.
 * @option Boolean clickInput If the matched element is an input type="text" and this option is true then clicking on the input will cause the date picker to appear.
 * @option Boolean rememberViewedMonth Whether the datePicker should remember the last viewed month and open on it. If false then the date picker will always open with the month for the first selected date visible.
 * @option Boolean selectWeek Whether to select a complete week at a time...
 * @option Number verticalPosition The vertical alignment of the popped up date picker to the matched element. One of $.dpConst.POS_TOP and $.dpConst.POS_BOTTOM. Default is $.dpConst.POS_TOP.
 * @option Number horizontalPosition The horizontal alignment of the popped up date picker to the matched element. One of $.dpConst.POS_LEFT and $.dpConst.POS_RIGHT.
 * @option Number verticalOffset The number of pixels offset from the defined verticalPosition of this date picker that it should pop up in. Default in 0.
 * @option Number horizontalOffset The number of pixels offset from the defined horizontalPosition of this date picker that it should pop up in. Default in 0.
 * @option (Function|Array) renderCallback A reference to a function (or an array of separate functions) that is called as each cell is rendered and which can add classes and event listeners to the created nodes. Each callback function will receive four arguments; a jquery object wrapping the created TD, a Date object containing the date this TD represents, a number giving the currently rendered month and a number giving the currently rendered year. Default is no callback.
 * @option String hoverClass The class to attach to each cell when you hover over it (to allow you to use hover effects in IE6 which doesn't support the :hover pseudo-class on elements other than links). Default is dp-hover. Pass false if you don't want a hover class.
 * @option String autoFocusNextInput Whether focus should be passed onto the next input in the form (true) or remain on this input (false) when a date is selected and the calendar closes
 * @type jQuery
 * @name datePicker
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('input.date-picker').datePicker();
 * @desc Creates a date picker button next to all matched input elements. When the button is clicked on the value of the selected date will be placed in the corresponding input (formatted according to Date.format).
 *
 * @example demo/index.html
 * @desc See the projects homepage for many more complex examples...
 **/
		datePicker : function(s)
		{			
			if (!$.event._dpCache) $.event._dpCache = [];
			
			// initialise the date picker controller with the relevant settings...
			s = $.extend({}, $.fn.datePicker.defaults, s);
			
			return this.each(
				function()
				{
					var $this = $(this);
					var alreadyExists = true;
					
					if (!this._dpId) {
						this._dpId = $.event.guid++;
						$.event._dpCache[this._dpId] = new DatePicker(this);
						alreadyExists = false;
					}
					
					if (s.inline) {
						s.createButton = false;
						s.displayClose = false;
						s.closeOnSelect = false;
						$this.empty();
					}
					
					var controller = $.event._dpCache[this._dpId];
					
					controller.init(s);
					
					if (!alreadyExists && s.createButton) {
						// create it!
						controller.button = $('<a href="#" class="dp-choose-date" title="' + $.dpText.TEXT_CHOOSE_DATE + '">' + $.dpText.TEXT_CHOOSE_DATE + '</a>')
								.bind(
									'click',
									function()
									{
										$this.dpDisplay(this);
										this.blur();
										return false;
									}
								);
						$this.after(controller.button);
					}
					
					if (!alreadyExists && $this.is(':text')) {
						$this
							.bind(
								'dateSelected',
								function(e, selectedDate, $td)
								{
									this.value = selectedDate.asString();
								}
							).bind(
								'change',
								function()
								{
									if (this.value == '') {
										controller.clearSelected();
									} else {
										var d = Date.fromString(this.value);
										if (d) {
											controller.setSelected(d, true, true);
										}
									}
								}
							);
						if (s.clickInput) {
							$this.bind(
								'click',
								function()
								{
									// The change event doesn't happen until the input loses focus so we need to manually trigger it...
									$this.trigger('change');
									$this.dpDisplay();
								}
							);
						}
						var d = Date.fromString(this.value);
						if (this.value != '' && d) {
							controller.setSelected(d, true, true);
						}
					}
					
					$this.addClass('dp-applied');
					
				}
			)
		},
/**
 * Disables or enables this date picker
 *
 * @param Boolean s Whether to disable (true) or enable (false) this datePicker
 * @type jQuery
 * @name dpSetDisabled
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetDisabled(true);
 * @desc Prevents this date picker from displaying and adds a class of dp-disabled to it (and it's associated button if it has one) for styling purposes. If the matched element is an input field then it will also set the disabled attribute to stop people directly editing the field.
 **/
		dpSetDisabled : function(s)
		{
			return _w.call(this, 'setDisabled', s);
		},
/**
 * Updates the first selectable date for any date pickers on any matched elements.
 *
 * @param String d A string representing the first selectable date (formatted according to Date.format).
 * @type jQuery
 * @name dpSetStartDate
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetStartDate('01/01/2000');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the first selectable date for each of these to the first day of the millenium.
 **/
		dpSetStartDate : function(d)
		{
			return _w.call(this, 'setStartDate', d);
		},
/**
 * Updates the last selectable date for any date pickers on any matched elements.
 *
 * @param String d A string representing the last selectable date (formatted according to Date.format).
 * @type jQuery
 * @name dpSetEndDate
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetEndDate('01/01/2010');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the last selectable date for each of these to the first Janurary 2010.
 **/
		dpSetEndDate : function(d)
		{
			return _w.call(this, 'setEndDate', d);
		},
/**
 * Gets a list of Dates currently selected by this datePicker. This will be an empty array if no dates are currently selected or NULL if there is no datePicker associated with the matched element.
 *
 * @type Array
 * @name dpGetSelected
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * alert($('.date-picker').dpGetSelected());
 * @desc Will alert an empty array (as nothing is selected yet)
 **/
		dpGetSelected : function()
		{
			var c = _getController(this[0]);
			if (c) {
				return c.getSelected();
			}
			return null;
		},
/**
 * Selects or deselects a date on any matched element's date pickers. Deselcting is only useful on date pickers where selectMultiple==true. Selecting will only work if the passed date is within the startDate and endDate boundries for a given date picker.
 *
 * @param String d A string representing the date you want to select (formatted according to Date.format).
 * @param Boolean v Whether you want to select (true) or deselect (false) this date. Optional - default = true.
 * @param Boolean m Whether you want the date picker to open up on the month of this date when it is next opened. Optional - default = true.
 * @param Boolean e Whether you want the date picker to dispatch events related to this change of selection. Optional - default = true.
 * @type jQuery
 * @name dpSetSelected
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetSelected('01/01/2010');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the selected date on these date pickers to the first Janurary 2010. When the date picker is next opened it will display Janurary 2010.
 **/
		dpSetSelected : function(d, v, m, e)
		{
			if (v == undefined) v=true;
			if (m == undefined) m=true;
			if (e == undefined) e=true;
			return _w.call(this, 'setSelected', Date.fromString(d), v, m, e);
		},
/**
 * Sets the month that will be displayed when the date picker is next opened. If the passed month is before startDate then the month containing startDate will be displayed instead. If the passed month is after endDate then the month containing the endDate will be displayed instead.
 *
 * @param Number m The month you want the date picker to display. Optional - defaults to the currently displayed month.
 * @param Number y The year you want the date picker to display. Optional - defaults to the currently displayed year.
 * @type jQuery
 * @name dpSetDisplayedMonth
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetDisplayedMonth(10, 2008);
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the selected date on these date pickers to the first Janurary 2010. When the date picker is next opened it will display Janurary 2010.
 **/
		dpSetDisplayedMonth : function(m, y)
		{
			return _w.call(this, 'setDisplayedMonth', Number(m), Number(y), true);
		},
/**
 * Displays the date picker associated with the matched elements. Since only one date picker can be displayed at once then the date picker associated with the last matched element will be the one that is displayed.
 *
 * @param HTMLElement e An element that you want the date picker to pop up relative in position to. Optional - default behaviour is to pop up next to the element associated with this date picker.
 * @type jQuery
 * @name dpDisplay
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpDisplay();
 * @desc Creates a date picker associated with the element with an id of date-picker and then causes it to pop up.
 **/
		dpDisplay : function(e)
		{
			return _w.call(this, 'display', e);
		},
/**
 * Sets a function or array of functions that is called when each TD of the date picker popup is rendered to the page
 *
 * @param (Function|Array) a A function or an array of functions that are called when each td is rendered. Each function will receive four arguments; a jquery object wrapping the created TD, a Date object containing the date this TD represents, a number giving the currently rendered month and a number giving the currently rendered year.
 * @type jQuery
 * @name dpSetRenderCallback
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetRenderCallback(function($td, thisDate, month, year)
 * {
 * 	// do stuff as each td is rendered dependant on the date in the td and the displayed month and year
 * });
 * @desc Creates a date picker associated with the element with an id of date-picker and then creates a function which is called as each td is rendered when this date picker is displayed.
 **/
		dpSetRenderCallback : function(a)
		{
			return _w.call(this, 'setRenderCallback', a);
		},
/**
 * Sets the position that the datePicker will pop up (relative to it's associated element)
 *
 * @param Number v The vertical alignment of the created date picker to it's associated element. Possible values are $.dpConst.POS_TOP and $.dpConst.POS_BOTTOM
 * @param Number h The horizontal alignment of the created date picker to it's associated element. Possible values are $.dpConst.POS_LEFT and $.dpConst.POS_RIGHT
 * @type jQuery
 * @name dpSetPosition
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetPosition($.dpConst.POS_BOTTOM, $.dpConst.POS_RIGHT);
 * @desc Creates a date picker associated with the element with an id of date-picker and makes it so that when this date picker pops up it will be bottom and right aligned to the #date-picker element.
 **/
		dpSetPosition : function(v, h)
		{
			return _w.call(this, 'setPosition', v, h);
		},
/**
 * Sets the offset that the popped up date picker will have from it's default position relative to it's associated element (as set by dpSetPosition)
 *
 * @param Number v The vertical offset of the created date picker.
 * @param Number h The horizontal offset of the created date picker.
 * @type jQuery
 * @name dpSetOffset
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetOffset(-20, 200);
 * @desc Creates a date picker associated with the element with an id of date-picker and makes it so that when this date picker pops up it will be 20 pixels above and 200 pixels to the right of it's default position.
 **/
		dpSetOffset : function(v, h)
		{
			return _w.call(this, 'setOffset', v, h);
		},
/**
 * Closes the open date picker associated with this element.
 *
 * @type jQuery
 * @name dpClose
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-pick')
 *		.datePicker()
 *		.bind(
 *			'focus',
 *			function()
 *			{
 *				$(this).dpDisplay();
 *			}
 *		).bind(
 *			'blur',
 *			function()
 *			{
 *				$(this).dpClose();
 *			}
 *		);
 **/
		dpClose : function()
		{
			return _w.call(this, '_closeCalendar', false, this[0]);
		},
/**
 * Rerenders the date picker's current month (for use with inline calendars and renderCallbacks).
 *
 * @type jQuery
 * @name dpRerenderCalendar
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 **/
		dpRerenderCalendar : function()
		{
			return _w.call(this, '_rerenderCalendar');
		},
		// private function called on unload to clean up any expandos etc and prevent memory links...
		_dpDestroy : function()
		{
			// TODO - implement this?
		}
	});
	
	// private internal function to cut down on the amount of code needed where we forward
	// dp* methods on the jQuery object on to the relevant DatePicker controllers...
	var _w = function(f, a1, a2, a3, a4)
	{
		return this.each(
			function()
			{
				var c = _getController(this);
				if (c) {
					c[f](a1, a2, a3, a4);
				}
			}
		);
	};
	
	function DatePicker(ele)
	{
		this.ele = ele;
		
		// initial values...
		this.displayedMonth		=	null;
		this.displayedYear		=	null;
		this.startDate			=	null;
		this.endDate			=	null;
		this.showYearNavigation	=	null;
		this.closeOnSelect		=	null;
		this.displayClose		=	null;
		this.rememberViewedMonth=	null;
		this.selectMultiple		=	null;
		this.numSelectable		=	null;
		this.numSelected		=	null;
		this.verticalPosition	=	null;
		this.horizontalPosition	=	null;
		this.verticalOffset		=	null;
		this.horizontalOffset	=	null;
		this.button				=	null;
		this.renderCallback		=	[];
		this.selectedDates		=	{};
		this.inline				=	null;
		this.context			=	'#dp-popup';
		this.settings			=	{};
	};
	$.extend(
		DatePicker.prototype,
		{	
			init : function(s)
			{
				this.setStartDate(s.startDate);
				this.setEndDate(s.endDate);
				this.setDisplayedMonth(Number(s.month), Number(s.year));
				this.setRenderCallback(s.renderCallback);
				this.showYearNavigation = s.showYearNavigation;
				this.closeOnSelect = s.closeOnSelect;
				this.displayClose = s.displayClose;
				this.rememberViewedMonth =	s.rememberViewedMonth;
				this.selectMultiple = s.selectMultiple;
				this.numSelectable = s.selectMultiple ? s.numSelectable : 1;
				this.numSelected = 0;
				this.verticalPosition = s.verticalPosition;
				this.horizontalPosition = s.horizontalPosition;
				this.hoverClass = s.hoverClass;
				this.setOffset(s.verticalOffset, s.horizontalOffset);
				this.inline = s.inline;
				this.settings = s;
				if (this.inline) {
					this.context = this.ele;
					this.display();
				}
			},
			setStartDate : function(d)
			{
				if (d) {
					this.startDate = Date.fromString(d);
				}
				if (!this.startDate) {
					this.startDate = (new Date()).zeroTime();
				}
				this.setDisplayedMonth(this.displayedMonth, this.displayedYear);
			},
			setEndDate : function(d)
			{
				if (d) {
					this.endDate = Date.fromString(d);
				}
				if (!this.endDate) {
					this.endDate = (new Date('12/31/2999')); // using the JS Date.parse function which expects mm/dd/yyyy
				}
				if (this.endDate.getTime() < this.startDate.getTime()) {
					this.endDate = this.startDate;
				}
				this.setDisplayedMonth(this.displayedMonth, this.displayedYear);
			},
			setPosition : function(v, h)
			{
				this.verticalPosition = v;
				this.horizontalPosition = h;
			},
			setOffset : function(v, h)
			{
				this.verticalOffset = parseInt(v) || 0;
				this.horizontalOffset = parseInt(h) || 0;
			},
			setDisabled : function(s)
			{
				$e = $(this.ele);
				$e[s ? 'addClass' : 'removeClass']('dp-disabled');
				if (this.button) {
					$but = $(this.button);
					$but[s ? 'addClass' : 'removeClass']('dp-disabled');
					$but.attr('title', s ? '' : $.dpText.TEXT_CHOOSE_DATE);
				}
				if ($e.is(':text')) {
					$e.attr('disabled', s ? 'disabled' : '');
				}
			},
			setDisplayedMonth : function(m, y, rerender)
			{
				if (this.startDate == undefined || this.endDate == undefined) {
					return;
				}
				var s = new Date(this.startDate.getTime());
				s.setDate(1);
				var e = new Date(this.endDate.getTime());
				e.setDate(1);
				
				var t;
				if ((!m && !y) || (isNaN(m) && isNaN(y))) {
					// no month or year passed - default to current month
					t = new Date().zeroTime();
					t.setDate(1);
				} else if (isNaN(m)) {
					// just year passed in - presume we want the displayedMonth
					t = new Date(y, this.displayedMonth, 1);
				} else if (isNaN(y)) {
					// just month passed in - presume we want the displayedYear
					t = new Date(this.displayedYear, m, 1);
				} else {
					// year and month passed in - that's the date we want!
					t = new Date(y, m, 1)
				}
				// check if the desired date is within the range of our defined startDate and endDate
				if (t.getTime() < s.getTime()) {
					t = s;
				} else if (t.getTime() > e.getTime()) {
					t = e;
				}
				var oldMonth = this.displayedMonth;
				var oldYear = this.displayedYear;
				this.displayedMonth = t.getMonth();
				this.displayedYear = t.getFullYear();

				if (rerender && (this.displayedMonth != oldMonth || this.displayedYear != oldYear))
				{
					this._rerenderCalendar();
					$(this.ele).trigger('dpMonthChanged', [this.displayedMonth, this.displayedYear]);
				}
			},
			setSelected : function(d, v, moveToMonth, dispatchEvents)
			{
				if (d < this.startDate || d.zeroTime() > this.endDate.zeroTime()) {
					// Don't allow people to select dates outside range...
					return;
				}
				var s = this.settings;
				if (s.selectWeek)
				{
					d = d.addDays(- (d.getDay() - Date.firstDayOfWeek + 7) % 7);
					if (d < this.startDate) // The first day of this week is before the start date so is unselectable...
					{
						return;
					}
				}
				if (v == this.isSelected(d)) // this date is already un/selected
				{
					return;
				}
				if (this.selectMultiple == false) {
					this.clearSelected();
				} else if (v && this.numSelected == this.numSelectable) {
					// can't select any more dates...
					return;
				}
				if (moveToMonth && (this.displayedMonth != d.getMonth() || this.displayedYear != d.getFullYear())) {
					this.setDisplayedMonth(d.getMonth(), d.getFullYear(), true);
				}
				this.selectedDates[d.asString()] = v;
				this.numSelected += v ? 1 : -1;
				var selectorString = 'td.' + (d.getMonth() == this.displayedMonth ? 'current-month' : 'other-month');
				var $td;
				$(selectorString, this.context).each(
					function()
					{
						if ($(this).data('datePickerDate') == d.asString()) {
							$td = $(this);
							if (s.selectWeek)
							{
								$td.parent()[v ? 'addClass' : 'removeClass']('selectedWeek');
							}
							$td[v ? 'addClass' : 'removeClass']('selected'); 
						}
					}
				);
				$('td', this.context).not('.selected')[this.selectMultiple &&  this.numSelected == this.numSelectable ? 'addClass' : 'removeClass']('unselectable');
				
				if (dispatchEvents)
				{
					var s = this.isSelected(d);
					$e = $(this.ele);
					var dClone = Date.fromString(d.asString());
					$e.trigger('dateSelected', [dClone, $td, s]);
					$e.trigger('change');
				}
			},
			isSelected : function(d)
			{
				return this.selectedDates[d.asString()];
			},
			getSelected : function()
			{
				var r = [];
				for(var s in this.selectedDates) {
					if (this.selectedDates[s] == true) {
						r.push(Date.fromString(s));
					}
				}
				return r;
			},
			clearSelected : function()
			{
				this.selectedDates = {};
				this.numSelected = 0;
				$('td.selected', this.context).removeClass('selected').parent().removeClass('selectedWeek');
			},
			display : function(eleAlignTo)
			{
				if ($(this.ele).is('.dp-disabled')) return;
				
				eleAlignTo = eleAlignTo || this.ele;
				var c = this;
				var $ele = $(eleAlignTo);
				var eleOffset = $ele.offset();
				
				var $createIn;
				var attrs;
				var attrsCalendarHolder;
				var cssRules;
				
				if (c.inline) {
					$createIn = $(this.ele);
					attrs = {
						'id'		:	'calendar-' + this.ele._dpId,
						'class'	:	'dp-popup dp-popup-inline'
					};

					$('.dp-popup', $createIn).remove();
					cssRules = {
					};
				} else {
					$createIn = $('body');
					attrs = {
						'id'		:	'dp-popup',
						'class'	:	'dp-popup'
					};
					cssRules = {
						'top'	:	eleOffset.top + c.verticalOffset,
						'left'	:	eleOffset.left + c.horizontalOffset
					};
					
					var _checkMouse = function(e)
					{
						var el = e.target;
						var cal = $('#dp-popup')[0];
						
						while (true){
							if (el == cal) {
								return true;
							} else if (el == document) {
								c._closeCalendar();
								return false;
							} else {
								el = $(el).parent()[0];
							}
						}
					};
					this._checkMouse = _checkMouse;
					
					c._closeCalendar(true);
					$(document).bind(
						'keydown.datepicker', 
						function(event)
						{
							if (event.keyCode == 27) {
								c._closeCalendar();
							}
						}
					);
				}
				
				if (!c.rememberViewedMonth)
				{
					var selectedDate = this.getSelected()[0];
					if (selectedDate) {
						selectedDate = new Date(selectedDate);
						this.setDisplayedMonth(selectedDate.getMonth(), selectedDate.getFullYear(), false);
					}
				}
				
				$createIn
					.append(
						$('<div></div>')
							.attr(attrs)
							.css(cssRules)
							.append(
//								$('<a href="#" class="selecteee">aaa</a>'),
								$('<h2></h2>'),
								$('<div class="dp-nav-prev"></div>')
									.append(
										$('<a class="dp-nav-prev-year" href="#" title="' + $.dpText.TEXT_PREV_YEAR + '">&lt;&lt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 0, -1);
												}
											),
										$('<a class="dp-nav-prev-month" href="#" title="' + $.dpText.TEXT_PREV_MONTH + '">&lt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, -1, 0);
												}
											)
									),
								$('<div class="dp-nav-next"></div>')
									.append(
										$('<a class="dp-nav-next-year" href="#" title="' + $.dpText.TEXT_NEXT_YEAR + '">&gt;&gt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 0, 1);
												}
											),
										$('<a class="dp-nav-next-month" href="#" title="' + $.dpText.TEXT_NEXT_MONTH + '">&gt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 1, 0);
												}
											)
									),
								$('<div class="dp-calendar"></div>')
							)
							.bgIframe()
						);
					
				var $pop = this.inline ? $('.dp-popup', this.context) : $('#dp-popup');
				
				if (this.showYearNavigation == false) {
					$('.dp-nav-prev-year, .dp-nav-next-year', c.context).css('display', 'none');
				}
				if (this.displayClose) {
					$pop.append(
						$('<a href="#" id="dp-close">' + $.dpText.TEXT_CLOSE + '</a>')
							.bind(
								'click',
								function()
								{
									c._closeCalendar();
									return false;
								}
							)
					);
				}
				c._renderCalendar();

				$(this.ele).trigger('dpDisplayed', $pop);
				
				if (!c.inline) {
					if (this.verticalPosition == $.dpConst.POS_BOTTOM) {
						$pop.css('top', eleOffset.top + $ele.height() - $pop.height() + c.verticalOffset);
					}
					if (this.horizontalPosition == $.dpConst.POS_RIGHT) {
						$pop.css('left', eleOffset.left + $ele.width() - $pop.width() + c.horizontalOffset);
					}
//					$('.selectee', this.context).focus();
					$(document).bind('mousedown.datepicker', this._checkMouse);
				}
				
			},
			setRenderCallback : function(a)
			{
				if (a == null) return;
				if (a && typeof(a) == 'function') {
					a = [a];
				}
				this.renderCallback = this.renderCallback.concat(a);
			},
			cellRender : function ($td, thisDate, month, year) {
				var c = this.dpController;
				var d = new Date(thisDate.getTime());
				
				// add our click handlers to deal with it when the days are clicked...
				
				$td.bind(
					'click',
					function()
					{
						var $this = $(this);
						if (!$this.is('.disabled')) {
							c.setSelected(d, !$this.is('.selected') || !c.selectMultiple, false, true);
							if (c.closeOnSelect) {
								// Focus the next input in the form…
								if (c.settings.autoFocusNextInput) {
									var ele = c.ele;
									var found = false;
									$(':input', ele.form).each(
										function()
										{
											if (found) {
												$(this).focus();
												return false;
											}
											if (this == ele) {
												found = true;
											}
										}
									);
								} else {
									c.ele.focus();
								}
								c._closeCalendar();
							}
						}
					}
				);
				if (c.isSelected(d)) {
					$td.addClass('selected');
					if (c.settings.selectWeek)
					{
						$td.parent().addClass('selectedWeek');
					}
				} else  if (c.selectMultiple && c.numSelected == c.numSelectable) {
					$td.addClass('unselectable');
				}
				
			},
			_applyRenderCallbacks : function()
			{
				var c = this;
				$('td', this.context).each(
					function()
					{
						for (var i=0; i<c.renderCallback.length; i++) {
							$td = $(this);
							c.renderCallback[i].apply(this, [$td, Date.fromString($td.data('datePickerDate')), c.displayedMonth, c.displayedYear]);
						}
					}
				);
				return;
			},
			// ele is the clicked button - only proceed if it doesn't have the class disabled...
			// m and y are -1, 0 or 1 depending which direction we want to go in...
			_displayNewMonth : function(ele, m, y) 
			{
				if (!$(ele).is('.disabled')) {
					this.setDisplayedMonth(this.displayedMonth + m, this.displayedYear + y, true);
				}
				ele.blur();
				return false;
			},
			_rerenderCalendar : function()
			{
				this._clearCalendar();
				this._renderCalendar();
			},
			_renderCalendar : function()
			{
				// set the title...
				$('h2', this.context).html((new Date(this.displayedYear, this.displayedMonth, 1)).asString($.dpText.HEADER_FORMAT));
				
				// render the calendar...
				$('.dp-calendar', this.context).renderCalendar(
					$.extend(
						{},
						this.settings, 
						{
							month			: this.displayedMonth,
							year			: this.displayedYear,
							renderCallback	: this.cellRender,
							dpController	: this,
							hoverClass		: this.hoverClass
						})
				);
				
				// update the status of the control buttons and disable dates before startDate or after endDate...
				// TODO: When should the year buttons be disabled? When you can't go forward a whole year from where you are or is that annoying?
				if (this.displayedYear == this.startDate.getFullYear() && this.displayedMonth == this.startDate.getMonth()) {
					$('.dp-nav-prev-year', this.context).addClass('disabled');
					$('.dp-nav-prev-month', this.context).addClass('disabled');
					$('.dp-calendar td.other-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) > 20) {
								$this.addClass('disabled');
							}
						}
					);
					var d = this.startDate.getDate();
					$('.dp-calendar td.current-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) < d) {
								$this.addClass('disabled');
							}
						}
					);
				} else {
					$('.dp-nav-prev-year', this.context).removeClass('disabled');
					$('.dp-nav-prev-month', this.context).removeClass('disabled');
					var d = this.startDate.getDate();
					if (d > 20) {
						// check if the startDate is last month as we might need to add some disabled classes...
						var st = this.startDate.getTime();
						var sd = new Date(st);
						sd.addMonths(1);
						if (this.displayedYear == sd.getFullYear() && this.displayedMonth == sd.getMonth()) {
							$('.dp-calendar td.other-month', this.context).each(
								function()
								{
									var $this = $(this);
									if (Date.fromString($this.data('datePickerDate')).getTime() < st) {
										$this.addClass('disabled');
									}
								}
							);
						}
					}
				}
				if (this.displayedYear == this.endDate.getFullYear() && this.displayedMonth == this.endDate.getMonth()) {
					$('.dp-nav-next-year', this.context).addClass('disabled');
					$('.dp-nav-next-month', this.context).addClass('disabled');
					$('.dp-calendar td.other-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) < 14) {
								$this.addClass('disabled');
							}
						}
					);
					var d = this.endDate.getDate();
					$('.dp-calendar td.current-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) > d) {
								$this.addClass('disabled');
							}
						}
					);
				} else {
					$('.dp-nav-next-year', this.context).removeClass('disabled');
					$('.dp-nav-next-month', this.context).removeClass('disabled');
					var d = this.endDate.getDate();
					if (d < 13) {
						// check if the endDate is next month as we might need to add some disabled classes...
						var ed = new Date(this.endDate.getTime());
						ed.addMonths(-1);
						if (this.displayedYear == ed.getFullYear() && this.displayedMonth == ed.getMonth()) {
							$('.dp-calendar td.other-month', this.context).each(
								function()
								{
									var $this = $(this);
									var cellDay = Number($this.text());
									if (cellDay < 13 && cellDay > d) {
										$this.addClass('disabled');
									}
								}
							);
						}
					}
				}
				this._applyRenderCallbacks();
			},
			_closeCalendar : function(programatic, ele)
			{
				if (!ele || ele == this.ele)
				{
					$(document).unbind('mousedown.datepicker');
					$(document).unbind('keydown.datepicker');
					this._clearCalendar();
					$('#dp-popup a').unbind();
					$('#dp-popup').empty().remove();
					if (!programatic) {
						$(this.ele).trigger('dpClosed', [this.getSelected()]);
					}
				}
			},
			// empties the current dp-calendar div and makes sure that all events are unbound
			// and expandos removed to avoid memory leaks...
			_clearCalendar : function()
			{
				// TODO.
				$('.dp-calendar td', this.context).unbind();
				$('.dp-calendar', this.context).empty();
			}
		}
	);
	
	// static constants
	$.dpConst = {
		SHOW_HEADER_NONE	:	0,
		SHOW_HEADER_SHORT	:	1,
		SHOW_HEADER_LONG	:	2,
		POS_TOP				:	0,
		POS_BOTTOM			:	1,
		POS_LEFT			:	0,
		POS_RIGHT			:	1,
		DP_INTERNAL_FOCUS	:	'dpInternalFocusTrigger'
	};
	// localisable text
	$.dpText = {
		TEXT_PREV_YEAR		:	'Previous year',
		TEXT_PREV_MONTH		:	'Previous month',
		TEXT_NEXT_YEAR		:	'Next year',
		TEXT_NEXT_MONTH		:	'Next month',
		TEXT_CLOSE			:	'Close',
		TEXT_CHOOSE_DATE	:	'Choose date',
		HEADER_FORMAT		:	'mmmm yyyy'
	};
	// version
	$.dpVersion = '$Id: jquery.datePicker.js 102 2010-09-13 14:00:54Z kelvin.luck $';

	$.fn.datePicker.defaults = {
		month				: undefined,
		year				: undefined,
		showHeader			: $.dpConst.SHOW_HEADER_SHORT,
		startDate			: undefined,
		endDate				: undefined,
		inline				: false,
		renderCallback		: null,
		createButton		: true,
		showYearNavigation	: true,
		closeOnSelect		: true,
		displayClose		: false,
		selectMultiple		: false,
		numSelectable		: Number.MAX_VALUE,
		clickInput			: false,
		rememberViewedMonth	: true,
		selectWeek			: false,
		verticalPosition	: $.dpConst.POS_TOP,
		horizontalPosition	: $.dpConst.POS_LEFT,
		verticalOffset		: 0,
		horizontalOffset	: 0,
		hoverClass			: 'dp-hover',
		autoFocusNextInput  : false
	};

	function _getController(ele)
	{
		if (ele._dpId) return $.event._dpCache[ele._dpId];
		return false;
	};
	
	// make it so that no error is thrown if bgIframe plugin isn't included (allows you to use conditional
	// comments to only include bgIframe where it is needed in IE without breaking this plugin).
	if ($.fn.bgIframe == undefined) {
		$.fn.bgIframe = function() {return this; };
	};


	// clean-up
	$(window)
		.bind('unload', function() {
			var els = $.event._dpCache || [];
			for (var i in els) {
				$(els[i].ele)._dpDestroy();
			}
		});
		
	
})(jQuery);

/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version 1.09i
 */
var Cufon=(function(){var m=function(){return m.replace.apply(null,arguments)};var x=m.DOM={ready:(function(){var C=false,E={loaded:1,complete:1};var B=[],D=function(){if(C){return}C=true;for(var F;F=B.shift();F()){}};if(document.addEventListener){document.addEventListener("DOMContentLoaded",D,false);window.addEventListener("pageshow",D,false)}if(!window.opera&&document.readyState){(function(){E[document.readyState]?D():setTimeout(arguments.callee,10)})()}if(document.readyState&&document.createStyleSheet){(function(){try{document.body.doScroll("left");D()}catch(F){setTimeout(arguments.callee,1)}})()}q(window,"load",D);return function(F){if(!arguments.length){D()}else{C?F():B.push(F)}}})(),root:function(){return document.documentElement||document.body}};var n=m.CSS={Size:function(C,B){this.value=parseFloat(C);this.unit=String(C).match(/[a-z%]*$/)[0]||"px";this.convert=function(D){return D/B*this.value};this.convertFrom=function(D){return D/this.value*B};this.toString=function(){return this.value+this.unit}},addClass:function(C,B){var D=C.className;C.className=D+(D&&" ")+B;return C},color:j(function(C){var B={};B.color=C.replace(/^rgba\((.*?),\s*([\d.]+)\)/,function(E,D,F){B.opacity=parseFloat(F);return"rgb("+D+")"});return B}),fontStretch:j(function(B){if(typeof B=="number"){return B}if(/%$/.test(B)){return parseFloat(B)/100}return{"ultra-condensed":0.5,"extra-condensed":0.625,condensed:0.75,"semi-condensed":0.875,"semi-expanded":1.125,expanded:1.25,"extra-expanded":1.5,"ultra-expanded":2}[B]||1}),getStyle:function(C){var B=document.defaultView;if(B&&B.getComputedStyle){return new a(B.getComputedStyle(C,null))}if(C.currentStyle){return new a(C.currentStyle)}return new a(C.style)},gradient:j(function(F){var G={id:F,type:F.match(/^-([a-z]+)-gradient\(/)[1],stops:[]},C=F.substr(F.indexOf("(")).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);for(var E=0,B=C.length,D;E<B;++E){D=C[E].split("=",2).reverse();G.stops.push([D[1]||E/(B-1),D[0]])}return G}),quotedList:j(function(E){var D=[],C=/\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g,B;while(B=C.exec(E)){D.push(B[3]||B[1])}return D}),recognizesMedia:j(function(G){var E=document.createElement("style"),D,C,B;E.type="text/css";E.media=G;try{E.appendChild(document.createTextNode("/**/"))}catch(F){}C=g("head")[0];C.insertBefore(E,C.firstChild);D=(E.sheet||E.styleSheet);B=D&&!D.disabled;C.removeChild(E);return B}),removeClass:function(D,C){var B=RegExp("(?:^|\\s+)"+C+"(?=\\s|$)","g");D.className=D.className.replace(B,"");return D},supports:function(D,C){var B=document.createElement("span").style;if(B[D]===undefined){return false}B[D]=C;return B[D]===C},textAlign:function(E,D,B,C){if(D.get("textAlign")=="right"){if(B>0){E=" "+E}}else{if(B<C-1){E+=" "}}return E},textShadow:j(function(F){if(F=="none"){return null}var E=[],G={},B,C=0;var D=/(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;while(B=D.exec(F)){if(B[0]==","){E.push(G);G={};C=0}else{if(B[1]){G.color=B[1]}else{G[["offX","offY","blur"][C++]]=B[2]}}}E.push(G);return E}),textTransform:(function(){var B={uppercase:function(C){return C.toUpperCase()},lowercase:function(C){return C.toLowerCase()},capitalize:function(C){return C.replace(/\b./g,function(D){return D.toUpperCase()})}};return function(E,D){var C=B[D.get("textTransform")];return C?C(E):E}})(),whiteSpace:(function(){var D={inline:1,"inline-block":1,"run-in":1};var C=/^\s+/,B=/\s+$/;return function(H,F,G,E){if(E){if(E.nodeName.toLowerCase()=="br"){H=H.replace(C,"")}}if(D[F.get("display")]){return H}if(!G.previousSibling){H=H.replace(C,"")}if(!G.nextSibling){H=H.replace(B,"")}return H}})()};n.ready=(function(){var B=!n.recognizesMedia("all"),E=false;var D=[],H=function(){B=true;for(var K;K=D.shift();K()){}};var I=g("link"),J=g("style");function C(K){return K.disabled||G(K.sheet,K.media||"screen")}function G(M,P){if(!n.recognizesMedia(P||"all")){return true}if(!M||M.disabled){return false}try{var Q=M.cssRules,O;if(Q){search:for(var L=0,K=Q.length;O=Q[L],L<K;++L){switch(O.type){case 2:break;case 3:if(!G(O.styleSheet,O.media.mediaText)){return false}break;default:break search}}}}catch(N){}return true}function F(){if(document.createStyleSheet){return true}var L,K;for(K=0;L=I[K];++K){if(L.rel.toLowerCase()=="stylesheet"&&!C(L)){return false}}for(K=0;L=J[K];++K){if(!C(L)){return false}}return true}x.ready(function(){if(!E){E=n.getStyle(document.body).isUsable()}if(B||(E&&F())){H()}else{setTimeout(arguments.callee,10)}});return function(K){if(B){K()}else{D.push(K)}}})();function s(D){var C=this.face=D.face,B={"\u0020":1,"\u00a0":1,"\u3000":1};this.glyphs=D.glyphs;this.w=D.w;this.baseSize=parseInt(C["units-per-em"],10);this.family=C["font-family"].toLowerCase();this.weight=C["font-weight"];this.style=C["font-style"]||"normal";this.viewBox=(function(){var F=C.bbox.split(/\s+/);var E={minX:parseInt(F[0],10),minY:parseInt(F[1],10),maxX:parseInt(F[2],10),maxY:parseInt(F[3],10)};E.width=E.maxX-E.minX;E.height=E.maxY-E.minY;E.toString=function(){return[this.minX,this.minY,this.width,this.height].join(" ")};return E})();this.ascent=-parseInt(C.ascent,10);this.descent=-parseInt(C.descent,10);this.height=-this.ascent+this.descent;this.spacing=function(L,N,E){var O=this.glyphs,M,K,G,P=[],F=0,J=-1,I=-1,H;while(H=L[++J]){M=O[H]||this.missingGlyph;if(!M){continue}if(K){F-=G=K[H]||0;P[I]-=G}F+=P[++I]=~~(M.w||this.w)+N+(B[H]?E:0);K=M.k}P.total=F;return P}}function f(){var C={},B={oblique:"italic",italic:"oblique"};this.add=function(D){(C[D.style]||(C[D.style]={}))[D.weight]=D};this.get=function(H,I){var G=C[H]||C[B[H]]||C.normal||C.italic||C.oblique;if(!G){return null}I={normal:400,bold:700}[I]||parseInt(I,10);if(G[I]){return G[I]}var E={1:1,99:0}[I%100],K=[],F,D;if(E===undefined){E=I>400}if(I==500){I=400}for(var J in G){if(!k(G,J)){continue}J=parseInt(J,10);if(!F||J<F){F=J}if(!D||J>D){D=J}K.push(J)}if(I<F){I=F}if(I>D){I=D}K.sort(function(M,L){return(E?(M>=I&&L>=I)?M<L:M>L:(M<=I&&L<=I)?M>L:M<L)?-1:1});return G[K[0]]}}function r(){function D(F,G){if(F.contains){return F.contains(G)}return F.compareDocumentPosition(G)&16}function B(G){var F=G.relatedTarget;if(!F||D(this,F)){return}C(this,G.type=="mouseover")}function E(F){C(this,F.type=="mouseenter")}function C(F,G){setTimeout(function(){var H=d.get(F).options;m.replace(F,G?h(H,H.hover):H,true)},10)}this.attach=function(F){if(F.onmouseenter===undefined){q(F,"mouseover",B);q(F,"mouseout",B)}else{q(F,"mouseenter",E);q(F,"mouseleave",E)}}}function u(){var C=[],D={};function B(H){var E=[],G;for(var F=0;G=H[F];++F){E[F]=C[D[G]]}return E}this.add=function(F,E){D[F]=C.push(E)-1};this.repeat=function(){var E=arguments.length?B(arguments):C,F;for(var G=0;F=E[G++];){m.replace(F[0],F[1],true)}}}function A(){var D={},B=0;function C(E){return E.cufid||(E.cufid=++B)}this.get=function(E){var F=C(E);return D[F]||(D[F]={})}}function a(B){var D={},C={};this.extend=function(E){for(var F in E){if(k(E,F)){D[F]=E[F]}}return this};this.get=function(E){return D[E]!=undefined?D[E]:B[E]};this.getSize=function(F,E){return C[F]||(C[F]=new n.Size(this.get(F),E))};this.isUsable=function(){return !!B}}function q(C,B,D){if(C.addEventListener){C.addEventListener(B,D,false)}else{if(C.attachEvent){C.attachEvent("on"+B,function(){return D.call(C,window.event)})}}}function v(C,B){var D=d.get(C);if(D.options){return C}if(B.hover&&B.hoverables[C.nodeName.toLowerCase()]){b.attach(C)}D.options=B;return C}function j(B){var C={};return function(D){if(!k(C,D)){C[D]=B.apply(null,arguments)}return C[D]}}function c(F,E){var B=n.quotedList(E.get("fontFamily").toLowerCase()),D;for(var C=0;D=B[C];++C){if(i[D]){return i[D].get(E.get("fontStyle"),E.get("fontWeight"))}}return null}function g(B){return document.getElementsByTagName(B)}function k(C,B){return C.hasOwnProperty(B)}function h(){var C={},B,F;for(var E=0,D=arguments.length;B=arguments[E],E<D;++E){for(F in B){if(k(B,F)){C[F]=B[F]}}}return C}function o(E,M,C,N,F,D){var K=document.createDocumentFragment(),H;if(M===""){return K}var L=N.separate;var I=M.split(p[L]),B=(L=="words");if(B&&t){if(/^\s/.test(M)){I.unshift("")}if(/\s$/.test(M)){I.push("")}}for(var J=0,G=I.length;J<G;++J){H=z[N.engine](E,B?n.textAlign(I[J],C,J,G):I[J],C,N,F,D,J<G-1);if(H){K.appendChild(H)}}return K}function l(D,M){var C=D.nodeName.toLowerCase();if(M.ignore[C]){return}var E=!M.textless[C];var B=n.getStyle(v(D,M)).extend(M);var F=c(D,B),G,K,I,H,L,J;if(!F){return}for(G=D.firstChild;G;G=I){K=G.nodeType;I=G.nextSibling;if(E&&K==3){if(H){H.appendData(G.data);D.removeChild(G)}else{H=G}if(I){continue}}if(H){D.replaceChild(o(F,n.whiteSpace(H.data,B,H,J),B,M,G,D),H);H=null}if(K==1){if(G.firstChild){if(G.nodeName.toLowerCase()=="cufon"){z[M.engine](F,null,B,M,G,D)}else{arguments.callee(G,M)}}J=G}}}var t=" ".split(/\s+/).length==0;var d=new A();var b=new r();var y=new u();var e=false;var z={},i={},w={autoDetect:false,engine:null,forceHitArea:false,hover:false,hoverables:{a:true},ignore:{applet:1,canvas:1,col:1,colgroup:1,head:1,iframe:1,map:1,optgroup:1,option:1,script:1,select:1,style:1,textarea:1,title:1,pre:1},printable:true,selector:(window.Sizzle||(window.jQuery&&function(B){return jQuery(B)})||(window.dojo&&dojo.query)||(window.Ext&&Ext.query)||(window.YAHOO&&YAHOO.util&&YAHOO.util.Selector&&YAHOO.util.Selector.query)||(window.$$&&function(B){return $$(B)})||(window.$&&function(B){return $(B)})||(document.querySelectorAll&&function(B){return document.querySelectorAll(B)})||g),separate:"words",textless:{dl:1,html:1,ol:1,table:1,tbody:1,thead:1,tfoot:1,tr:1,ul:1},textShadow:"none"};var p={words:/\s/.test("\u00a0")?/[^\S\u00a0]+/:/\s+/,characters:"",none:/^/};m.now=function(){x.ready();return m};m.refresh=function(){y.repeat.apply(y,arguments);return m};m.registerEngine=function(C,B){if(!B){return m}z[C]=B;return m.set("engine",C)};m.registerFont=function(D){if(!D){return m}var B=new s(D),C=B.family;if(!i[C]){i[C]=new f()}i[C].add(B);return m.set("fontFamily",'"'+C+'"')};m.replace=function(D,C,B){C=h(w,C);if(!C.engine){return m}if(!e){n.addClass(x.root(),"cufon-active cufon-loading");n.ready(function(){n.addClass(n.removeClass(x.root(),"cufon-loading"),"cufon-ready")});e=true}if(C.hover){C.forceHitArea=true}if(C.autoDetect){delete C.fontFamily}if(typeof C.textShadow=="string"){C.textShadow=n.textShadow(C.textShadow)}if(typeof C.color=="string"&&/^-/.test(C.color)){C.textGradient=n.gradient(C.color)}else{delete C.textGradient}if(!B){y.add(D,arguments)}if(D.nodeType||typeof D=="string"){D=[D]}n.ready(function(){for(var F=0,E=D.length;F<E;++F){var G=D[F];if(typeof G=="string"){m.replace(C.selector(G),C,true)}else{l(G,C)}}});return m};m.set=function(B,C){w[B]=C;return m};return m})();Cufon.registerEngine("vml",(function(){var e=document.namespaces;if(!e){return}e.add("cvml","urn:schemas-microsoft-com:vml");e=null;var b=document.createElement("cvml:shape");b.style.behavior="url(#default#VML)";if(!b.coordsize){return}b=null;var h=(document.documentMode||0)<8;document.write(('<style type="text/css">cufoncanvas{text-indent:0;}@media screen{cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}cufoncanvas{position:absolute;text-align:left;}cufon{display:inline-block;position:relative;vertical-align:'+(h?"middle":"text-bottom")+";}cufon cufontext{position:absolute;left:-10000in;font-size:1px;}a cufon{cursor:pointer}}@media print{cufon cufoncanvas{display:none;}}</style>").replace(/;/g,"!important;"));function c(i,j){return a(i,/(?:em|ex|%)$|^[a-z-]+$/i.test(j)?"1em":j)}function a(l,m){if(m==="0"){return 0}if(/px$/i.test(m)){return parseFloat(m)}var k=l.style.left,j=l.runtimeStyle.left;l.runtimeStyle.left=l.currentStyle.left;l.style.left=m.replace("%","em");var i=l.style.pixelLeft;l.style.left=k;l.runtimeStyle.left=j;return i}function f(l,k,j,n){var i="computed"+n,m=k[i];if(isNaN(m)){m=k.get(n);k[i]=m=(m=="normal")?0:~~j.convertFrom(a(l,m))}return m}var g={};function d(p){var q=p.id;if(!g[q]){var n=p.stops,o=document.createElement("cvml:fill"),i=[];o.type="gradient";o.angle=180;o.focus="0";o.method="sigma";o.color=n[0][1];for(var m=1,l=n.length-1;m<l;++m){i.push(n[m][0]*100+"% "+n[m][1])}o.colors=i.join(",");o.color2=n[l][1];g[q]=o}return g[q]}return function(ac,G,Y,C,K,ad,W){var n=(G===null);if(n){G=K.alt}var I=ac.viewBox;var p=Y.computedFontSize||(Y.computedFontSize=new Cufon.CSS.Size(c(ad,Y.get("fontSize"))+"px",ac.baseSize));var y,q;if(n){y=K;q=K.firstChild}else{y=document.createElement("cufon");y.className="cufon cufon-vml";y.alt=G;q=document.createElement("cufoncanvas");y.appendChild(q);if(C.printable){var Z=document.createElement("cufontext");Z.appendChild(document.createTextNode(G));y.appendChild(Z)}if(!W){y.appendChild(document.createElement("cvml:shape"))}}var ai=y.style;var R=q.style;var l=p.convert(I.height),af=Math.ceil(l);var V=af/l;var P=V*Cufon.CSS.fontStretch(Y.get("fontStretch"));var U=I.minX,T=I.minY;R.height=af;R.top=Math.round(p.convert(T-ac.ascent));R.left=Math.round(p.convert(U));ai.height=p.convert(ac.height)+"px";var F=Y.get("color");var ag=Cufon.CSS.textTransform(G,Y).split("");var L=ac.spacing(ag,f(ad,Y,p,"letterSpacing"),f(ad,Y,p,"wordSpacing"));if(!L.length){return null}var k=L.total;var x=-U+k+(I.width-L[L.length-1]);var ah=p.convert(x*P),X=Math.round(ah);var O=x+","+I.height,m;var J="r"+O+"ns";var u=C.textGradient&&d(C.textGradient);var o=ac.glyphs,S=0;var H=C.textShadow;var ab=-1,aa=0,w;while(w=ag[++ab]){var D=o[ag[ab]]||ac.missingGlyph,v;if(!D){continue}if(n){v=q.childNodes[aa];while(v.firstChild){v.removeChild(v.firstChild)}}else{v=document.createElement("cvml:shape");q.appendChild(v)}v.stroked="f";v.coordsize=O;v.coordorigin=m=(U-S)+","+T;v.path=(D.d?"m"+D.d+"xe":"")+"m"+m+J;v.fillcolor=F;if(u){v.appendChild(u.cloneNode(false))}var ae=v.style;ae.width=X;ae.height=af;if(H){var s=H[0],r=H[1];var B=Cufon.CSS.color(s.color),z;var N=document.createElement("cvml:shadow");N.on="t";N.color=B.color;N.offset=s.offX+","+s.offY;if(r){z=Cufon.CSS.color(r.color);N.type="double";N.color2=z.color;N.offset2=r.offX+","+r.offY}N.opacity=B.opacity||(z&&z.opacity)||1;v.appendChild(N)}S+=L[aa++]}var M=v.nextSibling,t,A;if(C.forceHitArea){if(!M){M=document.createElement("cvml:rect");M.stroked="f";M.className="cufon-vml-cover";t=document.createElement("cvml:fill");t.opacity=0;M.appendChild(t);q.appendChild(M)}A=M.style;A.width=X;A.height=af}else{if(M){q.removeChild(M)}}ai.width=Math.max(Math.ceil(p.convert(k*P)),0);if(h){var Q=Y.computedYAdjust;if(Q===undefined){var E=Y.get("lineHeight");if(E=="normal"){E="1em"}else{if(!isNaN(E)){E+="em"}}Y.computedYAdjust=Q=0.5*(a(ad,E)-parseFloat(ai.height))}if(Q){ai.marginTop=Math.ceil(Q)+"px";ai.marginBottom=Q+"px"}}return y}})());Cufon.registerEngine("canvas",(function(){var b=document.createElement("canvas");if(!b||!b.getContext||!b.getContext.apply){return}b=null;var a=Cufon.CSS.supports("display","inline-block");var e=!a&&(document.compatMode=="BackCompat"||/frameset|transitional/i.test(document.doctype.publicId));var f=document.createElement("style");f.type="text/css";f.appendChild(document.createTextNode(("cufon{text-indent:0;}@media screen,projection{cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;"+(e?"":"font-size:1px;line-height:1px;")+"}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;overflow:hidden;text-indent:-10000in;}"+(a?"cufon canvas{position:relative;}":"cufon canvas{position:absolute;}")+"}@media print{cufon{padding:0;}cufon canvas{display:none;}}").replace(/;/g,"!important;")));document.getElementsByTagName("head")[0].appendChild(f);function d(p,h){var n=0,m=0;var g=[],o=/([mrvxe])([^a-z]*)/g,k;generate:for(var j=0;k=o.exec(p);++j){var l=k[2].split(",");switch(k[1]){case"v":g[j]={m:"bezierCurveTo",a:[n+~~l[0],m+~~l[1],n+~~l[2],m+~~l[3],n+=~~l[4],m+=~~l[5]]};break;case"r":g[j]={m:"lineTo",a:[n+=~~l[0],m+=~~l[1]]};break;case"m":g[j]={m:"moveTo",a:[n=~~l[0],m=~~l[1]]};break;case"x":g[j]={m:"closePath"};break;case"e":break generate}h[g[j].m].apply(h,g[j].a)}return g}function c(m,k){for(var j=0,h=m.length;j<h;++j){var g=m[j];k[g.m].apply(k,g.a)}}return function(V,w,P,t,C,W){var k=(w===null);if(k){w=C.getAttribute("alt")}var A=V.viewBox;var m=P.getSize("fontSize",V.baseSize);var B=0,O=0,N=0,u=0;var z=t.textShadow,L=[];if(z){for(var U=z.length;U--;){var F=z[U];var K=m.convertFrom(parseFloat(F.offX));var I=m.convertFrom(parseFloat(F.offY));L[U]=[K,I];if(I<B){B=I}if(K>O){O=K}if(I>N){N=I}if(K<u){u=K}}}var Z=Cufon.CSS.textTransform(w,P).split("");var E=V.spacing(Z,~~m.convertFrom(parseFloat(P.get("letterSpacing"))||0),~~m.convertFrom(parseFloat(P.get("wordSpacing"))||0));if(!E.length){return null}var h=E.total;O+=A.width-E[E.length-1];u+=A.minX;var s,n;if(k){s=C;n=C.firstChild}else{s=document.createElement("cufon");s.className="cufon cufon-canvas";s.setAttribute("alt",w);n=document.createElement("canvas");s.appendChild(n);if(t.printable){var S=document.createElement("cufontext");S.appendChild(document.createTextNode(w));s.appendChild(S)}}var aa=s.style;var H=n.style;var j=m.convert(A.height);var Y=Math.ceil(j);var M=Y/j;var G=M*Cufon.CSS.fontStretch(P.get("fontStretch"));var J=h*G;var Q=Math.ceil(m.convert(J+O-u));var o=Math.ceil(m.convert(A.height-B+N));n.width=Q;n.height=o;H.width=Q+"px";H.height=o+"px";B+=A.minY;H.top=Math.round(m.convert(B-V.ascent))+"px";H.left=Math.round(m.convert(u))+"px";var r=Math.max(Math.ceil(m.convert(J)),0)+"px";if(a){aa.width=r;aa.height=m.convert(V.height)+"px"}else{aa.paddingLeft=r;aa.paddingBottom=(m.convert(V.height)-1)+"px"}var X=n.getContext("2d"),D=j/A.height;X.scale(D,D*M);X.translate(-u,-B);X.save();function T(){var x=V.glyphs,ab,l=-1,g=-1,y;X.scale(G,1);while(y=Z[++l]){var ab=x[Z[l]]||V.missingGlyph;if(!ab){continue}if(ab.d){X.beginPath();if(ab.code){c(ab.code,X)}else{ab.code=d("m"+ab.d,X)}X.fill()}X.translate(E[++g],0)}X.restore()}if(z){for(var U=z.length;U--;){var F=z[U];X.save();X.fillStyle=F.color;X.translate.apply(X,L[U]);T()}}var q=t.textGradient;if(q){var v=q.stops,p=X.createLinearGradient(0,A.minY,0,A.maxY);for(var U=0,R=v.length;U<R;++U){p.addColorStop.apply(p,v[U])}X.fillStyle=p}else{X.fillStyle=P.get("color")}T();return s}})());
/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Copyright   c   1993 - Roger White -  All Rights Reserved - see .txt file for
 * terms for distribution and use.
 * 
 * Trademark:
 * Created by Type-Designer 3.0
 */
Cufon.registerFont({"w":200,"face":{"font-family":"Swansea","font-weight":400,"font-stretch":"normal","units-per-em":"360","panose-1":"2 11 5 0 0 0 0 0 0 0","ascent":"288","descent":"-72","x-height":"6","bbox":"-6 -279 334 82","underline-thickness":"18","underline-position":"-18","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":99,"k":{" ":54}},"\u00a0":{"w":99},"!":{"d":"32,0r35,0r0,-37r-35,0r0,37xm32,-259v-2,71,3,135,9,198r17,0r9,-111r0,-87r-35,0","w":99},"\"":{"d":"51,-167r0,-92r-27,0r0,92r27,0xm76,-259r0,92r27,0r0,-92r-27,0","w":127},"#":{"d":"47,-75r-10,75r23,0r10,-75r46,0r-11,75r24,0r11,-75r36,0r4,-23r-37,0r7,-51r37,0r3,-23r-37,0r11,-76r-25,0r-10,76r-45,0r11,-76r-24,0r-11,76r-37,0r-3,23r37,0r-7,51r-37,0r-3,23r37,0xm81,-149r45,0r-7,51r-45,0"},"$":{"d":"108,-230v27,5,37,17,42,42r31,0v2,-47,-35,-63,-73,-68r0,-23r-17,0r0,23v-42,1,-75,28,-75,70v0,48,34,62,75,72r0,95v-34,-5,-49,-20,-48,-58r-32,0v0,55,28,81,80,84r0,34r17,0r0,-34v45,-1,80,-28,79,-77v0,-34,-26,-58,-79,-73r0,-87xm91,-147v-42,1,-58,-56,-23,-77v6,-4,14,-6,23,-6r0,83xm108,-111v56,4,65,91,0,92r0,-92"},"%":{"d":"79,7r19,0r143,-260r-20,0xm137,-188v0,-35,-27,-62,-62,-62v-35,0,-61,27,-61,62v0,35,28,61,61,61v34,0,62,-26,62,-61xm39,-189v0,-19,15,-36,36,-36v23,0,36,15,36,36v0,21,-16,36,-36,36v-22,0,-36,-14,-36,-36xm305,-57v0,-37,-25,-61,-62,-61v-35,0,-61,26,-61,61v0,35,26,62,61,62v36,0,62,-26,62,-62xm207,-57v0,-20,15,-36,36,-36v22,0,36,15,36,36v0,21,-14,36,-36,36v-21,0,-36,-16,-36,-36","w":320},"&":{"d":"15,-65v-6,86,121,87,152,35r24,30r41,0r-46,-55v10,-20,20,-41,21,-67r-30,0v-3,17,-6,31,-10,41r-47,-56v23,-16,46,-32,46,-68v0,-34,-23,-53,-58,-54v-51,-2,-77,53,-51,94r17,22v-38,24,-56,32,-59,78xm150,-51v-21,40,-103,39,-103,-14v0,-33,24,-42,44,-57xm108,-231v46,5,25,60,-5,73v-9,-10,-26,-29,-26,-45v0,-16,10,-30,31,-28","w":240},"'":{"d":"19,-167v38,-6,39,-47,37,-92r-37,0r0,39r19,0v0,22,-7,34,-19,36r0,17","w":80,"k":{" ":13}},"(":{"d":"84,28v-44,-89,-23,-227,23,-292r-22,0v-35,47,-72,123,-57,210v10,59,31,85,59,129r21,0v-9,-14,-16,-31,-24,-47","w":119,"k":{"z":13,"u":22,"s":29,"r":26,"q":38,"o":39,"n":22,"m":22,"e":39,"d":38,"c":35,"a":28,"S":13,"Q":24,"O":24,"J":26,"G":27,"C":23,":":30,".":30,"-":40,"(":34}},")":{"d":"12,-264v60,102,69,229,0,339r23,0v49,-57,81,-192,34,-277v-14,-25,-22,-41,-36,-62r-21,0","w":119},"*":{"d":"53,-201r-24,34r17,11r23,-33r25,34r17,-12r-25,-34r40,-12r-8,-20r-38,14r0,-40r-21,0r0,40r-38,-14r-7,20","w":140},"+":{"d":"92,-104r-78,0r0,27r78,0r0,77r26,0r0,-77r78,0r0,-27r-78,0r0,-77r-26,0r0,77","w":210},",":{"d":"31,0r20,0v0,24,-7,37,-20,37r0,16v38,-5,39,-46,37,-91r-37,0r0,38","w":99,"k":{",":27}},"-":{"d":"104,-116r-89,0r0,32r89,0r0,-32","w":119},".":{"d":"31,0r40,0r0,-39r-40,0r0,39","w":99,"k":{".":24}},"\/":{"d":"106,-265r-24,0r-88,272r24,0","w":99},"0":{"d":"186,-118v0,-73,-18,-135,-86,-135v-70,0,-87,63,-87,135v0,65,23,125,87,125v64,0,86,-56,86,-125xm99,-21v-45,0,-52,-57,-52,-109v0,-45,9,-94,52,-94v46,0,54,49,54,102v0,49,-7,101,-54,101"},"1":{"d":"95,0r34,0r0,-253r-25,0v-4,37,-30,47,-68,49r0,25r59,0r0,179","k":{"1":27}},"2":{"d":"100,-224v45,0,64,58,35,83v-41,35,-133,56,-126,141r173,0r0,-30r-137,0v18,-70,137,-56,137,-145v0,-90,-131,-102,-158,-33v-6,13,-9,29,-9,46r32,0v0,-41,18,-62,53,-62"},"3":{"d":"80,-117v45,-1,78,9,73,59v-4,37,-81,53,-100,14v-5,-10,-8,-19,-8,-33r-33,0v0,56,32,83,84,84v50,1,91,-28,91,-72v0,-34,-14,-63,-42,-69v22,-7,33,-26,33,-58v1,-72,-129,-80,-151,-20v-5,13,-9,26,-9,42r31,0v1,-32,16,-54,49,-54v28,-1,47,15,47,42v0,30,-29,41,-65,39r0,26"},"4":{"d":"8,-92r0,31r112,0r0,61r31,0r0,-61r37,0r0,-28r-37,0r0,-164r-26,0xm38,-89r82,-115r0,115r-82,0"},"5":{"d":"151,-73v-3,31,-24,51,-52,52v-33,0,-51,-14,-55,-42r-33,0v3,45,38,70,85,70v59,0,87,-34,89,-91v3,-66,-80,-99,-132,-63r10,-70r108,0r0,-31r-132,0r-18,136r27,1v25,-42,110,-24,103,38"},"6":{"d":"108,-253v-77,0,-95,69,-95,147v0,67,30,113,95,113v50,0,76,-38,79,-87v5,-77,-108,-110,-141,-48v2,-49,14,-93,59,-96v26,-2,42,14,45,38r31,0v-2,-42,-30,-67,-73,-67xm105,-21v-30,0,-54,-21,-54,-52v0,-36,17,-60,52,-60v30,1,50,21,50,56v0,32,-21,56,-48,56"},"7":{"d":"84,0v18,-92,54,-160,104,-220r0,-28r-175,0r0,31r140,0v-44,53,-90,130,-104,217r35,0"},"8":{"d":"145,-134v20,-10,32,-25,32,-54v0,-42,-33,-61,-78,-65v-73,-6,-107,93,-43,119v-29,12,-43,33,-43,62v-1,53,37,80,88,80v50,0,85,-30,85,-81v0,-29,-15,-52,-41,-61xm47,-72v0,-30,22,-47,53,-47v30,0,53,18,52,50v0,32,-17,48,-51,48v-35,0,-54,-20,-54,-51xm144,-187v1,25,-20,41,-45,41v-22,0,-45,-15,-44,-39v0,-23,15,-39,42,-39v30,0,46,13,47,37"},"9":{"d":"94,-253v-52,4,-79,36,-79,92v0,75,102,101,138,48v-6,47,-16,94,-60,94v-26,0,-41,-13,-44,-41r-31,0v-3,77,111,87,142,30v36,-66,45,-231,-66,-223xm148,-179v3,42,-17,67,-53,67v-31,0,-47,-20,-47,-60v1,-29,19,-53,50,-53v26,0,47,18,50,46"},":":{"d":"69,-38r-38,0r0,38r38,0r0,-38xm69,-186r-38,0r0,38r38,0r0,-38","w":99},";":{"d":"31,53v34,-3,42,-45,38,-91r-38,0r0,38r19,0v0,24,-6,36,-19,37r0,16xm69,-148r0,-38r-38,0r0,38r38,0","w":99},"<":{"d":"17,-78r176,74r0,-28r-141,-59r141,-58r0,-29r-176,75r0,25","w":210},"=":{"d":"196,-141r-182,0r0,27r182,0r0,-27xm196,-68r-182,0r0,27r182,0r0,-27","w":210},">":{"d":"17,-149r141,58r-141,59r0,28r176,-74r0,-25r-176,-75r0,29","w":210},"?":{"d":"80,0r34,0r0,-37r-34,0r0,37xm148,-138v48,-37,28,-128,-45,-124v-54,3,-82,31,-83,85r31,0v0,-37,14,-55,50,-57v41,-2,50,51,28,75v-23,25,-51,40,-49,93r32,0v-2,-39,20,-50,36,-72"},"@":{"d":"289,-150v0,37,-21,71,-51,78v-19,-15,5,-57,11,-78r14,-51r-25,0r-7,23v-9,-19,-22,-28,-41,-28v-53,0,-82,45,-84,100v-2,55,63,76,97,34v-1,13,11,24,23,23v51,-6,87,-47,87,-104v0,-71,-53,-112,-125,-112v-78,0,-131,57,-135,135v-5,112,135,178,220,107v11,-9,21,-20,30,-33r-25,0v-17,22,-51,41,-87,41v-65,0,-112,-47,-112,-113v0,-66,42,-115,109,-115v59,0,101,34,101,93xm221,-151v-2,33,-21,75,-55,76v-21,0,-32,-9,-32,-28v0,-38,18,-77,56,-77v20,0,31,10,31,29","w":365},"A":{"d":"5,0r36,0r27,-75r104,0r25,75r38,0r-93,-259r-40,0xm79,-106r41,-115r39,115r-80,0","w":240,"k":{"w":23,"v":30,"Y":54,"W":37,"V":54,"U":14,"T":44,"'":27," ":20}},"B":{"d":"179,-139v56,-21,35,-120,-36,-120r-117,0r0,259r119,0v49,-2,78,-33,80,-82v1,-30,-22,-49,-46,-57xm190,-73v-3,55,-73,42,-129,43r0,-90v57,2,132,-14,129,47xm178,-186v-2,47,-68,36,-117,37r0,-80v52,2,119,-13,117,43","w":240,"k":{";":15,":":15,".":15,",":15,")":13}},"C":{"d":"134,-266v-80,0,-119,56,-119,139v0,97,81,165,174,120v31,-15,53,-47,57,-88r-35,0v-5,44,-36,70,-81,72v-88,2,-98,-145,-46,-192v37,-33,121,-21,125,34r34,0v-8,-55,-50,-85,-109,-85","w":260,"k":{";":13,":":13,".":19,",":19,")":15}},"D":{"d":"243,-139v0,-69,-40,-120,-106,-120r-108,0r0,259r110,0v72,-2,104,-69,104,-139xm207,-136v0,53,-19,106,-71,106r-72,0r0,-199r68,0v52,1,75,40,75,93","w":260,"k":{"Y":14,"X":16,"V":16,"R":13,"P":13,"I":14,"F":13,"E":13,"A":18,";":13,":":13,".":27,",":30,")":26}},"E":{"d":"221,-31r-155,0r0,-86r141,0r0,-31r-141,0r0,-79r153,0r0,-32r-188,0r0,259r190,0r0,-31","w":240,"k":{"U":13,"R":15,"P":14,"I":15,"G":14,"F":14,"E":14,";":14,":":14,".":14,"-":13,",":14,"(":14}},"F":{"d":"66,-117r127,0r0,-31r-127,0r0,-79r144,0r0,-32r-179,0r0,259r35,0r0,-117","w":219,"k":{"a":13,"A":28,".":54,",":54,"(":16}},"G":{"d":"137,7v37,-1,70,-16,85,-40r9,33r22,0r0,-138r-113,0r0,30r81,0v3,55,-35,87,-83,87v-61,0,-85,-43,-85,-108v1,-62,27,-105,85,-105v40,0,69,18,77,54r34,0v-7,-54,-53,-85,-110,-85v-78,0,-121,58,-122,134v-1,84,36,138,120,138","w":279,"k":{"u":16,"r":18,"n":14,"m":14,"l":14,"k":14,"j":14,"i":14,"h":14,"Y":15,"W":17,"V":21,"U":19,"R":22,"P":22,"N":18,"M":17,"L":18,"K":18,"I":23,"H":18,"F":22,"E":22,"D":19,"B":17,";":22,":":22,".":22,",":22,")":26,"(":15}},"H":{"d":"198,-151r-135,0r0,-108r-36,0r0,259r36,0r0,-120r135,0r0,120r35,0r0,-259r-35,0r0,108","w":260,"k":{"u":17,"r":19,"n":15,"m":15,"l":15,"k":15,"j":15,"i":15,"h":15,"U":20,"R":23,"P":23,"N":19,"M":18,"L":19,"K":19,"I":24,"H":19,"F":23,"E":23,"D":21,"B":18,";":23,":":23,".":23,",":23,"(":16}},"I":{"d":"68,-259r-36,0r0,259r36,0r0,-259","w":99,"k":{"u":21,"r":23,"p":17,"n":19,"m":19,"l":20,"k":20,"i":19,"h":19,"b":17,"U":24,"S":14,"R":28,"P":27,"N":23,"M":22,"L":23,"K":23,"I":28,"H":23,"G":13,"F":27,"E":27,"D":25,"B":22,";":27,":":27,".":27,",":27,"(":21}},"J":{"d":"77,-23v-32,0,-41,-24,-38,-60r-33,0v-5,58,19,90,74,90v46,-1,75,-27,74,-76r0,-190r-35,0r0,191v-1,28,-12,45,-42,45","w":180,"k":{"u":15,"r":17,"n":13,"m":13,"l":14,"k":14,"j":14,"i":13,"h":13,"U":18,"R":22,"P":21,"N":17,"M":16,"L":17,"K":17,"I":22,"H":17,"F":21,"E":21,"D":19,"B":16,";":21,":":21,".":22,",":23,"(":14}},"K":{"d":"62,-91r41,-38r90,129r45,0r-110,-154r107,-105r-47,0r-126,126r0,-126r-35,0r0,259r35,0r0,-91","w":240,"k":{"G":14,"-":14}},"L":{"d":"62,-259r-35,0r0,259r166,0r0,-31r-131,0r0,-228","k":{"w":19,"v":26,"Y":54,"W":32,"V":51,"T":54,"'":20," ":13}},"M":{"d":"274,0r0,-259r-50,0r-74,220r-74,-220r-50,0r0,259r33,0r0,-217r74,217r34,0r73,-217r0,217r34,0","w":299,"k":{"u":14,"r":17,"l":13,"k":13,"j":13,"U":17,"R":21,"P":20,"N":17,"M":15,"L":17,"K":17,"I":22,"H":17,"F":20,"E":20,"D":18,"B":15,";":20,":":20,".":20,",":20,"(":14}},"N":{"d":"199,-49r-130,-210r-42,0r0,259r34,0r0,-209r132,209r40,0r0,-259r-34,0r0,210","w":260,"k":{"u":17,"r":19,"n":15,"m":15,"l":15,"k":15,"j":15,"i":15,"h":15,"U":20,"R":23,"P":23,"N":19,"M":18,"L":19,"K":19,"I":24,"H":19,"F":23,"E":23,"D":21,"B":18,";":23,":":23,".":23,",":23,"(":16}},"O":{"d":"140,7v85,0,126,-57,126,-136v0,-79,-42,-136,-126,-136v-83,0,-126,57,-126,136v0,78,42,136,126,136xm140,-234v61,0,90,45,90,105v0,60,-29,105,-90,105v-61,0,-90,-45,-90,-105v0,-60,29,-105,90,-105","w":279,"k":{"X":15,"V":14,".":22,",":24,")":24}},"P":{"d":"224,-186v0,-44,-31,-73,-77,-73r-116,0r0,259r35,0r0,-109r81,0v47,-1,77,-30,77,-77xm66,-229v52,1,122,-11,122,43v0,57,-67,47,-122,47r0,-90","w":240,"k":{"R":13,"I":13,"A":39,".":54,",":54,"(":14}},"Q":{"d":"14,-129v0,78,42,136,126,136v27,0,49,-5,67,-17r39,31r18,-22r-35,-27v23,-23,37,-59,37,-101v0,-79,-42,-136,-126,-136v-83,0,-126,57,-126,136xm140,-234v93,-4,114,131,62,185r-33,-26r-18,22r27,21v-70,29,-132,-24,-128,-97v3,-60,29,-102,90,-105","w":279,"k":{"V":14,")":18}},"R":{"d":"201,-127v64,-31,33,-132,-46,-132r-123,0r0,259r34,0r0,-111r88,0v60,-6,37,70,49,111r43,0r0,-6v-14,-6,-14,-22,-14,-43v0,-41,-2,-68,-31,-78xm201,-184v-2,58,-78,40,-135,43r0,-88v57,3,137,-17,135,45","w":260,"k":{"U":16,")":16,"(":14}},"S":{"d":"119,-235v34,0,63,17,65,52r32,0v-4,-58,-36,-82,-101,-82v-82,0,-122,97,-53,133v42,22,124,6,127,66v2,34,-35,43,-67,43v-41,0,-73,-18,-72,-61r-32,0v0,64,39,91,104,91v55,0,99,-23,101,-78v3,-67,-76,-74,-132,-87v-21,-4,-31,-15,-31,-32v-2,-35,28,-45,59,-45","w":240,"k":{"R":13,"P":13,"I":14,"F":13,"E":13,";":17,":":17,".":14,",":17}},"T":{"d":"5,-227r87,0r0,227r35,0r0,-227r88,0r0,-32r-210,0r0,32","w":219,"k":{"o":13,"e":14,"J":54,"A":46,".":54,"-":54,",":54,"(":17}},"U":{"d":"129,-24v-101,2,-57,-144,-66,-235r-35,0r0,175v1,56,42,91,98,91v61,0,106,-32,106,-92r0,-174r-35,0r0,170v1,40,-27,65,-68,65","w":260,"k":{"u":17,"r":19,"p":13,"n":15,"m":15,"l":16,"k":16,"j":16,"i":15,"h":15,"b":13,"U":20,"R":24,"P":23,"N":19,"M":18,"L":19,"K":19,"I":24,"H":19,"F":23,"E":23,"D":21,"B":18,"A":14,";":23,":":23,".":27,",":29,"(":17}},"V":{"d":"120,-38r-74,-221r-39,0r94,259r38,0r94,-259r-40,0","w":240,"k":{"u":16,"s":23,"r":18,"q":27,"o":29,"n":14,"m":14,"g":28,"e":28,"d":27,"c":27,"a":29,"Q":15,"O":15,"J":33,"G":18,"C":14,"A":54,";":24,":":24,".":54,"-":31,",":54,"(":31}},"W":{"d":"110,0r60,-215r59,215r37,0r68,-259r-39,0r-47,211r-60,-211r-38,0r-59,211r-47,-211r-38,0r67,259r37,0","w":339,"k":{"s":14,"q":16,"o":18,"g":17,"e":19,"d":16,"c":15,"a":19,"J":19,"A":38,";":18,":":18,".":53,"-":20,",":53,"(":25}},"X":{"d":"6,0r43,0r71,-106r70,106r43,0r-90,-132r86,-127r-41,0r-66,100r-66,-100r-44,0r87,126","w":240,"k":{"Q":17,"O":17,"G":14,"C":15,"-":18}},"Y":{"d":"103,0r34,0r0,-103r98,-156r-41,0r-74,125r-74,-125r-41,0r98,156r0,103","w":240,"k":{"z":14,"u":19,"s":29,"r":21,"q":35,"p":14,"o":34,"n":17,"m":17,"g":32,"e":36,"d":35,"c":36,"a":36,"J":54,"G":15,"A":54,";":25,":":25,".":54,"-":43,",":54,"(":27}},"Z":{"d":"8,0r204,0r0,-31r-160,0r160,-198r0,-30r-192,0r0,32r147,0r-159,198r0,29","w":219},"[":{"d":"23,71r67,0r0,-26r-39,0r0,-279r39,0r0,-26r-67,0r0,331","w":99},"\\":{"d":"82,7r24,0r-88,-272r-24,0","w":99},"]":{"d":"10,71r67,0r0,-331r-67,0r0,26r39,0r0,279r-39,0r0,26","w":99},"^":{"d":"174,-95r-77,-153r-25,0r-78,153r29,0r61,-124r62,124r28,0","w":168},"_":{"d":"201,45r0,-18r-201,0r0,18r201,0"},"`":{"d":"51,-214r25,0r-32,-50r-39,0","w":119},"a":{"d":"95,-167v50,0,59,56,14,56v-54,2,-97,12,-97,64v0,63,101,65,128,23v-4,27,31,33,50,24r0,-23v-11,3,-20,2,-20,-14r0,-107v1,-63,-120,-62,-140,-17v-5,11,-8,19,-8,30r29,0v0,-25,17,-36,44,-36xm138,-63v1,42,-92,65,-92,15v0,-42,62,-33,92,-48r0,33"},"b":{"d":"108,-193v-29,0,-43,10,-56,28r0,-94r-31,0r0,259r30,0r0,-23v11,19,29,29,52,29v59,-2,83,-46,83,-106v-1,-53,-26,-92,-78,-93xm51,-85v2,-41,9,-80,51,-80v34,0,51,24,51,71v0,38,-14,72,-50,72v-30,0,-54,-24,-52,-63","k":{";":13,":":13,".":17,",":17,")":39}},"c":{"d":"172,-125v4,-80,-116,-87,-146,-29v-32,61,-12,163,68,160v47,-2,72,-29,78,-72r-31,0v-3,25,-22,43,-47,44v-33,0,-51,-28,-50,-65v1,-44,12,-78,51,-78v27,0,42,15,46,40r31,0","w":180,"k":{")":27}},"d":{"d":"13,-100v-7,84,86,144,137,74r0,26r29,0r0,-259r-32,0r0,97v-13,-18,-25,-31,-56,-31v-52,1,-73,41,-78,93xm96,-22v-36,0,-51,-34,-51,-72v1,-38,10,-71,51,-71v34,0,52,26,52,80v0,38,-22,63,-52,63","k":{"r":13,";":16,":":16,".":16,",":16}},"e":{"d":"14,-89v-9,91,119,130,160,55v5,-10,9,-19,10,-25r-33,0v-3,36,-67,50,-89,21v-9,-11,-14,-26,-14,-46r138,0v-1,-62,-22,-112,-83,-112v-60,0,-83,46,-89,107xm48,-109v-5,-57,86,-78,101,-22v2,7,4,14,4,22r-105,0","k":{";":14,":":14,".":14,",":14,")":39}},"f":{"d":"94,-262v-49,-11,-70,19,-63,74r-26,0r0,26r26,0r0,162r32,0r0,-162r31,0r0,-26r-31,0v-1,-27,-3,-52,31,-45r0,-29","w":99,"k":{".":32,",":32}},"g":{"d":"96,-195v-61,0,-81,50,-85,107v-5,78,80,129,133,71v4,44,-17,70,-55,70v-22,1,-40,-13,-41,-30r-31,0v0,41,35,59,74,59v54,0,85,-29,85,-90r0,-182r-32,0r0,23v-10,-14,-25,-28,-48,-28xm98,-18v-42,3,-53,-35,-53,-78v0,-34,16,-62,46,-64v73,-5,66,138,7,142","k":{"u":14,"r":16,"l":13,"k":13,";":20,":":20,".":20,",":20,")":13,"(":13}},"h":{"d":"108,-165v28,0,36,14,37,42r0,123r31,0v-3,-90,26,-221,-91,-190v-15,4,-20,17,-30,27r0,-96r-32,0r0,259r32,0v3,-69,-18,-165,53,-165","k":{"u":13,"r":15,";":19,":":19,".":19,",":19,")":23,"(":13}},"i":{"d":"23,-258r0,36r32,0r0,-36r-32,0xm23,-188r0,188r32,0r0,-188r-32,0","w":80,"k":{"u":14,"r":16,"l":13,"k":13,"j":13,";":20,":":20,".":20,",":20,"(":13}},"j":{"d":"-6,75v40,6,61,-11,61,-47r0,-216r-31,0r0,212v1,20,-8,25,-30,23r0,28xm55,-259r-31,0r0,37r31,0r0,-37","w":80,"k":{"u":14,"r":16,"l":13,"k":13,";":20,":":20,".":20,",":20,"(":13}},"k":{"d":"55,0r0,-71r26,-24r58,95r41,0r-76,-118r72,-70r-41,0r-80,80r0,-151r-31,0r0,259r31,0","w":180},"l":{"d":"55,-259r-31,0r0,259r31,0r0,-259","w":80,"k":{"u":14,"r":16,"l":13,"k":13,"j":13,";":20,":":20,".":20,",":20,"(":13}},"m":{"d":"161,-163v-16,-40,-84,-40,-108,1r0,-26r-30,0r0,188r32,0v3,-67,-18,-165,50,-165v21,-1,29,16,29,35r0,130r32,0v5,-65,-21,-165,44,-165v24,0,36,14,36,43r0,122r31,0v-5,-78,24,-194,-58,-193v-32,0,-40,11,-58,30","w":299,"k":{"r":14,";":17,":":17,".":17,",":17,")":22}},"n":{"d":"176,-128v10,-76,-100,-80,-123,-33r0,-27r-30,0r0,188r32,0v4,-69,-20,-166,53,-165v29,0,36,20,37,48r0,117r31,0r0,-128","k":{"u":13,"r":15,";":19,":":19,".":19,",":19,")":23,"(":13}},"o":{"d":"100,-193v-57,0,-87,42,-87,99v1,55,30,100,87,100v57,0,88,-45,88,-100v0,-56,-30,-99,-88,-99xm100,-22v-39,0,-55,-34,-55,-72v0,-35,15,-72,55,-72v41,0,55,34,55,72v0,38,-15,72,-55,72","k":{";":14,":":14,".":15,",":15,")":37}},"p":{"d":"108,-195v-28,0,-47,16,-57,34r0,-27r-30,0r0,263r32,0r0,-96v14,18,25,27,52,27v54,0,80,-48,81,-101v1,-54,-26,-100,-78,-100xm104,-22v-34,0,-54,-26,-53,-64v1,-41,11,-79,50,-79v37,0,53,25,52,66v0,40,-12,77,-49,77","k":{";":14,":":14,".":17,",":18,")":39}},"q":{"d":"13,-100v0,58,24,106,82,106v25,0,42,-9,51,-26r0,95r32,0r0,-263r-30,0r-1,26v-13,-18,-25,-31,-56,-31v-52,1,-78,41,-78,93xm45,-94v1,-38,10,-71,51,-71v34,0,52,26,52,80v0,38,-22,63,-52,63v-36,0,-51,-34,-51,-72","k":{"r":14,";":18,":":18,".":18,",":18}},"r":{"d":"120,-193v-35,0,-48,14,-62,37r0,-32r-31,0r0,188r32,0r0,-113v0,-31,28,-47,61,-46r0,-34","w":119,"k":{".":54,",":54,"'":-13}},"s":{"d":"51,-127v-12,-23,13,-39,35,-39v30,0,44,11,44,32r31,0v-2,-37,-28,-61,-72,-59v-61,-10,-98,69,-44,99v28,15,90,6,90,43v0,21,-22,28,-43,29v-35,2,-47,-13,-50,-38r-31,0v3,44,29,66,81,66v43,-1,75,-21,75,-63v0,-58,-81,-45,-116,-70","w":180,"k":{")":32}},"t":{"d":"91,-23v-16,3,-31,3,-31,-16r0,-120r31,0r0,-31r-31,0r0,-51r-32,0r0,51r-25,0r0,31r25,0r0,136v1,29,32,33,63,29r0,-29","w":99},"u":{"d":"144,-76v7,52,-88,86,-88,23r0,-137r-31,0v6,78,-27,197,54,198v27,0,52,-12,65,-28r0,20r32,0r0,-190r-32,0r0,114","k":{"u":14,"r":16,"l":13,"k":13,"j":13,";":20,":":20,".":20,",":20,")":27,"(":13}},"v":{"d":"72,0r33,0r72,-188r-34,0r-54,154r-50,-154r-36,0","w":180,"k":{".":45,",":45}},"w":{"d":"92,0r37,-145r38,145r34,0r54,-188r-31,0r-38,148r-38,-148r-35,0r-38,148r-36,-148r-34,0r54,188r33,0","w":260,"k":{".":37,",":40}},"x":{"d":"70,-97r-67,97r41,0r45,-71r47,71r40,0r-66,-96r64,-92r-39,0r-44,66r-43,-66r-41,0","w":180,"k":{"-":14}},"y":{"d":"91,-35r-52,-153r-35,0r70,194v-8,22,-18,54,-53,40r0,29v84,17,84,-70,106,-129r49,-134r-35,0","w":180,"k":{".":43,",":46}},"z":{"d":"165,-162r0,-26r-145,0r-1,26r106,0r-114,138r0,24r158,0r0,-26r-116,0","w":180,"k":{")":13}},"{":{"d":"15,-84v69,9,-24,172,90,155r0,-24v-47,10,-33,-49,-33,-88v0,-25,-13,-47,-32,-54v37,-11,33,-66,32,-115v0,-18,11,-31,33,-26r0,-24v-37,-3,-61,8,-61,43v0,44,11,106,-29,111r0,22","w":120},"|":{"d":"34,7r26,0r0,-272r-26,0r0,272","w":93},"}":{"d":"15,71v112,16,22,-143,90,-155r0,-21v-69,-9,24,-173,-90,-155r0,24v47,-12,32,54,32,91v0,26,18,43,32,51v-35,10,-33,64,-32,112v1,28,-9,31,-32,29r0,24","w":120},"~":{"d":"35,-65v19,-52,72,-1,108,-1v17,0,32,-10,45,-31r-13,-20v-20,50,-71,1,-108,1v-19,0,-34,10,-45,31","w":210}}});

//= require date
//= require jquery.datePicker
//= require cufon-yui
//= require Swansea_400.font.js

$(document).ready(function() {
    setupGridAjax();
    setupDatePickers();
});

function setupGridAjax() {

    $(".grid .pagination a, .grid th.sortable a").live('click', function(event) {
    	event.preventDefault();
    	var grid = $(this).parents(".grid");
    	
        $(grid).html($("#spinner").html());

        var url = $(this).attr('href');

        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                $(grid).fadeOut('fast', function() {$(this).html(data).fadeIn('slow');});
            }
        })
    });

    $('.filters .filter').click(function() {
        var form = $(this).parents("form");

        var data = $(form).serialize();
        var url = $(form).attr("action");
        var grid = $(".grid");

        reloadGrid(grid, url, data);
    })
    $(".filters :input").change(function() 
        {
            var form = $(this).parents("form");

            var data = $(form).serialize();
            var url = $(form).attr("action");
            var grid = $(".grid");
            
            reloadGrid(grid, url, data);
        }
    );
}

function reloadGrid(grid, url, data) {
    $(grid).html($("#spinner").html());

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(data) {
            $(grid).fadeOut('fast', function() {$(this).html(data).fadeIn('slow');});
        }
    });
}

function setupDatePickers() {
    Date.format = 'mm/dd/yyyy hh:mm:ss';
    $("input.date").datePicker({startDate:'01/01/2000'});
}
