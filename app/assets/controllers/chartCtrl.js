/*global openLifeTracker, angular */
'use strict';


openLifeTracker.controller('chartCtrl', function ($scope,$filter,offlineStorage, $rootScope) {
	var entries = offlineStorage.get();
  $scope.graphData = [];
  
  $scope.graphOptions = {
	  axes: {
	    x: {key: 'x',  type: 'date', ticksFormat: '%d.%m.%Y', ticksRotate: -60, zoomable:true, hideOverflow:true},
	    y: {type: 'linear', ticks: 5}   
	  },  
	  margin: {	    left: 100, 	    bottom: 100	  },
	  series: [],
	  lineMode: 'linear',
	  tension: 0.7,
	  tooltip: {mode: 'scrubber', formatter: function(x, y, series) {
		    var hashTag = $scope.getHashtag(x, series.y);
				if(hashTag && hashTag.value) {
					return hashTag.value + " ("+$filter('date')(x, 'dd.MM.yyyy HH:mm:ss') + ')';
				} else {
					return "("+$filter('date')(x, 'dd.MM.yyyy HH:mm:ss') + ')';
				}
			}
	  },
	  drawLegend: true,
	  drawDots: true,
	  hideOverflow: false,
	  columnsHGap: 5
	};
  
  
  $scope.getEntry = function(timestamp) {
    return _.first(_.filter(entries, function(e){
      return e.timestamp == timestamp;
    }));
  }
  $scope.getHashtag = function(timestamp, tagKey) {
    var entry = $scope.getEntry(timestamp);
    
    return _.first(_.filter(entry.hashtags, function(h){
      return h.key == tagKey;
	  }));
	}
  
  var getRandomColor = function(seed) {
  return "hsla("+(seed*40%360)+",50%,50%, 0.8)"
  }
  
  var getAllHashtagKeys = function(theEntries) {
    var allHashtagPairs = _.flatten(_.map(theEntries, function(e) { return e.hashtags; }));
    var keyStrings = _.pluck(allHashtagPairs,'key');
    var lowerKeyStrings = _.map(keyStrings, function(k){return k.toLowerCase();});
     return _.uniq(lowerKeyStrings);
  };

  $scope.updateGraphSeries = function() {
    $scope.graphOptions.series = [];
    getAllHashtagKeys(entries).forEach(function (hashtagKey, index) {
      var options = {y: hashtagKey,      
        axis:'y',   
        color: getRandomColor(index), 
        thickness: '2px', 
        type: 'area', 
        striped: false, 
        drawDots: true, 
        dotSize: 10, 
        visible:true,  
        label: hashtagKey
      };
      $scope.graphOptions.series.push( options  ); 
    });
  };

  $scope.updateGraphData = function() {
      $scope.graphData = entries.map(function(entry) { 
        var graphEntry = {};
        graphEntry.x = entry.timestamp;
        entry.hashtags.forEach(function (hashtag) {
          var key = hashtag.key.toLowerCase();
          if (hashtag.value) {
            var number = parseInt(hashtag.value);
          } else {
            var number = 1;          
          }
          graphEntry[key] = number;
        });
        return graphEntry; 
      });
      
  };
  
  $scope.$on('entries-updated', function(event, args) {
    $scope.updateGraphData();
    $scope.updateGraphSeries();
  });
  
  $scope.updateGraphData();
  $scope.updateGraphSeries();
});