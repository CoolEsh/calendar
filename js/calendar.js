$( function() {
    
    var timeout;
    $( window ).resize( function() {
        clearTimeout( timeout );
        timeout = setTimeout( function() {
            $( ".booking-calendar-month-selector" ).trigger( "change" );
        }, 500 );
    } );
    
    $( ".booking-calendar" ).each( function() {
        var $el = $( this );
        var $calendarSelectorContainer = $el.find( ".booking-calendar-selector" );
        var $calendarBodyContainer = $el.find( ".booking-calendar-body" );

        $calendarSelectorContainer.css( { 'margin-bottom': '10px' } );
        $calendarBodyContainer.width( '100%' );

        buildSelector( getSelectorValues( moment().year(), moment().month() ) );
        buildMonthCalendar( getMonthDays( moment().year(), moment().month() ) );

        function calendarSelectorContainerEvents() {
            $calendarSelectorContainer.delegate( ".booking-calendar-month-selector", "change", function() {
                var yearMonth = $( this ).val().split( '-' );
                buildMonthCalendar( getMonthDays( parseInt( yearMonth[ 0 ], 10 ), ( parseInt( yearMonth[ 1 ], 10 ) ) - 1 ) );
            } );
            
            $calendarSelectorContainer.delegate( ".booking-calendar-prev-month", "click", function() {
                var $select = $calendarSelectorContainer.find( ".booking-calendar-month-selector" );
                var $curMonth = $select.find( "option:selected" );
                if ( $curMonth.prev().size() > 0 ) {
                    $curMonth.prev().prop( "selected", "selected" );
                    
                    $select.trigger( "change" );
                }
            } );
            
            $calendarSelectorContainer.delegate( ".booking-calendar-next-month", "click", function() {
                var $select = $calendarSelectorContainer.find( ".booking-calendar-month-selector" );
                var $curMonth = $select.find( "option:selected" );
                if ( $curMonth.next().size() > 0 ) {
                    $curMonth.next().prop( "selected", "selected" );
                    
                    $select.trigger( "change" );
                }
            } );
        }
        calendarSelectorContainerEvents();

        function getSelectorValues( year, month ) {
            var valuesArr = [];
            var current;

            var date = moment( { year: year, month: month } ).subtract( 'years', 1 ).add( 'months', 1 ).format( 'M-YYYY' );
            for ( var i = 0; i < 23; i++ ) {
                current = false;
                if ( moment( date, 'M-YYYY' ).year() === year && moment( date, 'M-YYYY' ).month() === month ) {
                    current = true;
                }
                valuesArr.push( { value: moment( date, 'M-YYYY' ).format( 'YYYY-MM' ), title: moment( date, 'M-YYYY' ).format( 'MMMM YYYY' ), current: current } );
                date = moment( date, 'M-YYYY' ).add( 'months', 1 ).format( 'M-YYYY' );
            }

            return valuesArr;
        }

        function getMonthDays( year, month ) {
            var i;

            var prevYear = moment( { year: year, month: month } ).subtract( 'months', 1 ).format( 'YYYY' );
            var prevMonth = ( ( ( month + 1 ) - 1 ) === 0 ) ? 12 : ( ( month + 1 ) - 1 );
            
            var nextYear = moment( { year: year, month: month } ).add( 'months', 1 ).format( 'YYYY' );
            var nextMonth = ( ( ( month + 1 ) + 1 ) === 13 ) ? 1 : ( ( month + 1 ) + 1 );
            
            var firstDayOfMonthDayOfWeek = moment( { year: year, month: month } ).day();
            firstDayOfMonthDayOfWeek = ( firstDayOfMonthDayOfWeek === 0 ) ? 7 : firstDayOfMonthDayOfWeek;

            var curDayOfMonth = moment().date();

            var daysInMonth = moment( { year: year, month: month } ).daysInMonth();
            var daysInPrevMonth = moment( { year: year, month: month } ).subtract( 'months', 1 ).daysInMonth();

            var daysArr = [];
            if ( firstDayOfMonthDayOfWeek !== 1 ) {
                for ( i = ( daysInPrevMonth - firstDayOfMonthDayOfWeek + 2 ); i <= daysInPrevMonth; i++ ) {
                    daysArr.push( {
                        year: prevYear,
                        month: ( ( prevMonth < 10 ) ? ( '0' + prevMonth ) : prevMonth ),
                        day: ( ( i < 10 ) ? ( '0' + i ) : i ),
                        currentDay: false,
                        currentMonth: false
                    } );
                }
            }

            for ( i = 1; i <= daysInMonth; i++ ) {
                daysArr.push( {
                    year: year,
                    month: ( ( ( month + 1 ) < 10 ) ? ( '0' + ( month + 1 ) ) : ( month + 1 ) ),
                    day: ( ( i < 10 ) ? ( '0' + i ) : i ),
                    currentDay: ( ( i === curDayOfMonth && month === moment().month() ) ? true : false ),
                    currentMonth: true
                } );
            }

            i = 1;
            while ( daysArr.length % 7 !== 0 ) {
                daysArr.push( {
                    year: nextYear,
                    month: ( ( nextMonth < 10 ) ? ( '0' + nextMonth ) : nextMonth ),
                    day: ( ( i < 10 ) ? ( '0' + i ) : i ),
                    currentDay: false,
                    currentMonth: false
                } );
                
                i++;
            }

            return daysArr;
        }

        function buildSelector( valuesArr ) {
            $calendarSelectorContainer.children().remove();

            var $prevMonth = $( '<div class="btn btn-default glyphicon glyphicon-chevron-left booking-calendar-prev-month"></div>' );
            $calendarSelectorContainer.append( $prevMonth );

            var $selectContainer = $( '<div class="booking-calendar-month-selector-cont"></div>' );
            var $select = $( '<select class="form-control booking-calendar-month-selector"></select>' );
            for ( var i = 0; i < valuesArr.length; i++ ) {
                $select.append( '<option value="' + valuesArr[ i ]['value'] + '"' + ( valuesArr[ i ]['current'] ? ' selected="selected"' : '' ) + '>' + valuesArr[ i ]['title'] + '</option>' );
            }
            $selectContainer.append( $select );
            
            $calendarSelectorContainer.append( $selectContainer );
            
            var $nextMonth = $( '<div class="btn btn-default glyphicon glyphicon-chevron-right booking-calendar-next-month"></div>' );
            $calendarSelectorContainer.append( $nextMonth );
            
            $calendarSelectorContainer.append( '<div class="clearfix"></div>' );
            
            fixSelectorWidth();
            $calendarSelectorContainer.height( $calendarSelectorContainer.height() );
        }
        
        function fixSelectorWidth() {
            $calendarSelectorContainer.find( ".booking-calendar-month-selector-cont" ).outerWidth( $calendarSelectorContainer.width() - ( $calendarSelectorContainer.find( ".booking-calendar-prev-month" ).outerWidth() + $calendarSelectorContainer.find( ".booking-calendar-next-month" ).outerWidth() ) - ( parseInt( $calendarSelectorContainer.find( ".booking-calendar-month-selector-cont" ).css( 'margin-left' ), 10 ) * 2 ) );
        }

        function buildMonthCalendar( daysArr ) {
            $calendarBodyContainer.children().remove();

            fixSelectorWidth();

            var containerWidth = $calendarBodyContainer.width();
            var daySize = ( containerWidth / 7 ) - 6;
            
            var weekdays = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
            for ( var i = 0; i < weekdays.length; i++ ) {
                $calendarBodyContainer.append( '<div class="booking-calendar-header" style="width:' + daySize + 'px;">' + weekdays[ i ] + '</div>' );
            }
            
            for ( var i = 0; i < daysArr.length; i++ ) {
                $calendarBodyContainer.append( '<div class="booking-calendar-day' + ( daysArr[ i ]['currentMonth'] ? ' current-month' : '' ) + ( daysArr[ i ]['currentDay'] ? ' current-day' : '' ) + '" style="width:' + daySize + 'px; height:' + daySize + 'px;" data-year="' + daysArr[ i ]['year'] + '"  data-month="' + daysArr[ i ]['month'] + '" data-day="' + daysArr[ i ]['day'] + '" data-date="' + daysArr[ i ]['year'] + '-' + daysArr[ i ]['month'] + '-' + daysArr[ i ]['day'] + '" data-datevisual="' + daysArr[ i ]['day'] + '-' + daysArr[ i ]['month'] + '-' + daysArr[ i ]['year'] + '">' +
    '<div class="booking-calendar-day-number">' + daysArr[ i ]['day'] + '</div>' +
'</div>' );
            }
            $calendarBodyContainer.append( '<div class="clearfix"></div>' );
            
            $calendarBodyContainer.height( $calendarBodyContainer.height() );
        }
    } );

    $( ".booking-calendar-month-selector" ).trigger( "change" );
} );