/*global describe, it, beforeEach, inject, expect*/
(function () {
	'use strict';

	describe('openLifeTracker Controller', function () {
		var ctrl, scope, store;

		// Load the module containing the app, only 'ng' is loaded by default.
		beforeEach(module('openLifeTracker'));

		beforeEach(inject(function ($controller, $rootScope, offlineStorage) {
			scope = $rootScope.$new();

			store = offlineStorage;

			offlineStorage.entries = [];
			offlineStorage._getFromLocalStorage = function () {
				return [];
			};
			offlineStorage._saveToLocalStorage = function (entries) {
				offlineStorage.entries = entries;
			};

			ctrl = $controller('entryCtrl', {
				$scope: scope,
				store: store
			});
		}));

		it('should not have an edited Entry on start', function () {
			expect(scope.editedEntry).toBeNull();
		});

		it('should not have any Entries on start', function () {
			expect(scope.entries.length).toBe(0);
		});
		
		it('should handle without hashtag', function () {
			expect(scope.removeHashtagsFromText('no hash in text')).toBe('no hash in text');
			
			var result = scope.extractHashtags('no hash in text');
			expect(result.length).toBe(0);
		});
		it('should handle empty string', function () {
			expect(scope.removeHashtagsFromText('')).toBe('');
			
			var result = scope.extractHashtags('');
			expect(result.length).toBe(0);
		});
		it('should handle invalid hashtag', function () {
			var text = 'invalid # and on end #';
			expect(scope.removeHashtagsFromText(text)).toBe('invalid # and on end #');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(0);
		});
		it('should handle hashtags with colon value', function () {
			var text = 'Hash #AsdfASDF:4 with value';
			expect(scope.removeHashtagsFromText(text)).toBe('Hash with value');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("AsdfASDF");
			expect(result[0].value).toBe('4');
		});
		it('should handle hashtags with colon value (2)', function () {
			var text = '#Rating:5 Awesome one';
			expect(scope.removeHashtagsFromText(text)).toBe('Awesome one');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("Rating");
			expect(result[0].value).toBe('5');
		});
		
		it('should handle hashtags with tag with equal value', function () {
			var text = 'my #coolness=10 today';
			expect(scope.removeHashtagsFromText(text)).toBe('my today');

			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("coolness");
			expect(result[0].value).toBe('10');
		});
		
		it('should handle hashtags without value and fix spacing where hashtags are removed', function () {
			var text = 'Awesome #test this is';
			expect(scope.removeHashtagsFromText(text)).toBe('Awesome this is');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("test");
			expect(result[0].value).toBe(null);
		});
		it('should handle hashtags in the end', function () {
			var text = 'Awesome #score=5';
			expect(scope.removeHashtagsFromText(text)).toBe('Awesome');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("score");
			expect(result[0].value).toBe('5');
		});
		it('should handle hashtags in the end and beginning', function () {
			var text = '#this Awesome #test:4';
			expect(scope.removeHashtagsFromText(text)).toBe('Awesome');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(2);
			expect(result[0].key).toBe("this");
			expect(result[0].value).toBe(null);
			expect(result[1].key).toBe("test");
			expect(result[1].value).toBe('4');
		});

		it('should handle multiple hashtags', function () {
			var text = 'my #coolness=10 today #fun:1';
			expect(scope.removeHashtagsFromText(text)).toBe('my today');
			
			var result = scope.extractHashtags(text);
			expect(result.length).toBe(2);
			expect(result[0].key).toBe("coolness");
			expect(result[0].value).toBe('10');
			expect(result[1].key).toBe("fun");
			expect(result[1].value).toBe('1');
		});
		it('should handle duplicate hashtags', function () {
			var text = 'my #coolness=10 today #coolness:5';
			expect(scope.removeHashtagsFromText(text)).toBe('my today');

			// TODO: is this what we want?
			var result = scope.extractHashtags('my #coolness=10 today #coolness:5');
			expect(result.length).toBe(2);
			expect(result[0].key).toBe("coolness");
			expect(result[0].value).toBe('10');
			expect(result[1].key).toBe("coolness");
			expect(result[1].value).toBe('5');
		});
	
		it('should handle hashtags with alphanumeric values (-)', function () {
			var text = 'got #score=5-fun';
			expect(scope.removeHashtagsFromText(text)).toBe('got');

			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("score");
			expect(result[0].value).toBe('5-fun');
		});
		it('should handle hashtags with alphanumeric values (wild)', function () {
			var text = 'yeah #score!=5.5km/h';
			expect(scope.removeHashtagsFromText(text)).toBe('yeah');

			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("score!");
			expect(result[0].value).toBe('5.5km/h');
		});
		it('should handle umlaut hashtags keys', function () {
			var text = 'meine #Gebühr:10usd';
			expect(scope.removeHashtagsFromText(text)).toBe('meine');

			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("Gebühr");
			expect(result[0].value).toBe('10usd');
		});
		it('should handle umlaut hashtags values', function () {
			var text = 'meine #Farbe:Grün';
			expect(scope.removeHashtagsFromText(text)).toBe('meine');

			var result = scope.extractHashtags(text);
			expect(result.length).toBe(1);
			expect(result[0].key).toBe("Farbe");
			expect(result[0].value).toBe('Grün');
		});
		
		// TODO: test more
		// see https://github.com/angular/angular-phonecat/blob/master/test/unit/controllersSpec.js
	});
}());
