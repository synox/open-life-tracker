/*global openLifeTracker */
'use strict';

/* focus element when the event is received */
 openLifeTracker.directive('focusOn', function() {
    return function(scope, elem, attr) {
       scope.$on('focusOn', function(e, name) {
         if(name === attr.focusOn) {
           elem[0].focus();
         }
       });
    };
 });
