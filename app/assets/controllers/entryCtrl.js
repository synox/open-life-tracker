/*global openLifeTracker, angular */
'use strict';


openLifeTracker.controller('entryCtrl', function ($scope, $rootScope, $http, $filter, focus, offlineStorage) {
	var entries = $scope.entries = offlineStorage.get();
	var draft  = $scope.draft = {text: '', hashtags:[]};
	
	$scope.saveEntry = function () {
		var newText = $scope.removeHashtagsFromText($scope.draft.text.trim());
		var hashtags = draft.hashtags.filter(function(hashtag){
			return hashtag.active;
		});
		hashtags = hashtags.concat( $scope.extractHashtags($scope.draft.text));
		
		if ($scope.editedEntry) {
			$scope.editedEntry.text = newText;
			$scope.editedEntry.hashtags = hashtags;
			$scope.editedEntry = null;
		} else {
			entries.push({
				text: newText,
				hashtags: hashtags,
				timestamp: new Date().getTime()
			});
		}
		offlineStorage.put(entries);
		$rootScope.$broadcast('entries-updated');
		
		$scope.newDraft();
	};
	
	$scope.editEntry = function (entry) {
		var copy = angular.copy(entry);
		$scope.editedEntry = entry;
		draft.text = copy.text;
		draft.hashtags = copy.hashtags;
		
		// enable all tags
		draft.hashtags.forEach(function (hashtag) {
			hashtag.active = true;
		});
		
		focus('draft-text');
	};
	
	
  $scope.removeEntry = function(entry) {
    var index = entries.indexOf(entry);
    entries.splice(index,1);
		offlineStorage.put(entries);
		$rootScope.$broadcast('entries-updated');
  };
	
	// TODO: unduplicate with chartCtrl
	var getAllHashtagKeys = function(theEntries) {
    var allHashtagPairs = _.flatten(_.map(theEntries, function(e) { return e.hashtags; }));
    var keyStrings = _.pluck(allHashtagPairs,'key');
    var lowerKeyStrings = _.map(keyStrings, function(k){return k.toLowerCase();});
     return _.uniq(lowerKeyStrings);
  };
	
	$scope.resetAllData = function() {
		entries.length = 0;
		offlineStorage.put(entries);
		$rootScope.$broadcast('entries-updated');
		$scope.newDraft();
	}
	
	// ------ draft --- 
	$scope.newDraft = function() {
		$scope.editedEntry = null;
		
		draft.text = '';
		draft.hashtags = [];
    
		getAllHashtagKeys(entries).forEach(function (key) {
			draft.hashtags.push({'key':key, 'value':'', 'active': false});
		});
		
    focus('draft-text');
  }
	
  $scope.addDraftTag = function(key) {
    draft.hashtags.push({key: key, value:'', active:true});
    $scope.focusDraftTag(key);
  }
	$scope.focusDraftTag = function(key) {
		focus('tag-'+key);
	}
	
	// ------ hashtag utils ------
	var hashtagRegex = /(?=^|\W)(#[\S]+ ?)/gi;
	$scope.extractHashtags = function(text) {
    var result = [];
    var tags= text.match(hashtagRegex);
    if(!tags) {
      return result;
    }
    tags.forEach(function(tag){
      var keyValueMatch = tag.match(/#([^\s:=]+)([:=])?([\S]+)?/i);
      if(keyValueMatch){
        var value = keyValueMatch[3];
        if (! angular.isDefined(value)) {
          value = null;
        }
        result.push({'key':keyValueMatch[1], 'value': value});
      }
    });
    return result;
  }
  
	
  $scope.removeHashtagsFromText = function(text) {
    return text.replace(hashtagRegex, "").trim();
  }
    
  // ----- import / export ------
	
  $scope.exportJson = function() {
    return JSON.stringify(entries);
  }
  $scope.exportBase64Mail = function() {
    var base64String = window.btoa($scope.exportJson());
    window.location = 'mailto:?subject=open life tracker - backup&body=base64-encoded data\n: ' + base64String;
  }
  $scope.importBase64 = function() {
    var base64String = prompt("Please paste data:", "");
		if(base64String) {
	    var jsonString = window.atob(base64String);
			$scope.importJson(jsonString);
		}
  }
  $scope.importJson = function(jsonString) {
		if(!angular.isDefined(jsonString)) {
				var jsonString = prompt("Please paste data:", "");
		}
    
		if(jsonString) {
			var json = JSON.parse(jsonString);
			json.forEach(function(entry){
				entries.push(entry);
			})
	    
	    $scope.newDraft();
			offlineStorage.put(entries);
			$rootScope.$broadcast('entries-updated');
		}
  }
 
	 $scope.newDraft();
});
