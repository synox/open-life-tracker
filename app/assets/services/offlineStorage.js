/*global openLifeTracker */
'use strict';

/**
 * Services that persists and retrieves entries from localStorage
*/
openLifeTracker.factory('offlineStorage', function () {
	var STORAGE_ID = 'openLifeTracker-entries';
	
	var store = {
			entries: [],
			
			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (entries) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(entries));
			},
	
			get: function () {
				angular.copy(store._getFromLocalStorage(), store.entries);
				return store.entries;
			},

			put: function (currentEntries) {
				store._saveToLocalStorage(currentEntries);
			}
	};
		
	return store;
});
