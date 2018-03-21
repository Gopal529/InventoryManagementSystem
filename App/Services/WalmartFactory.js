/**
 * Created by daras on 24-Mar-17.
 */
(function(){

    var WalmartFactory = function ($http,$resource) {

        var factory = {};

        factory.getSearchResults = function (Search_Text) {

         var WALMART_API_SEARCH_ENDPOINT= "http://api.walmartlabs.com/v1/search";
         var WALMART_API_KEY = "496ekazt92t67sgq6dhjmegy";
         var SearchService =  $resource(
             WALMART_API_SEARCH_ENDPOINT,
             {
                 query:Search_Text,
                 format: 'json',
                 apiKey: WALMART_API_KEY,
                 callback: 'JSON_CALLBACK'
             },
             {
                 query: {
                     method: 'jsonp',
                     isArray: false,
                     cache: true
                 }
             }
         );
            return SearchService;
        }

        return factory;

    }
    WalmartFactory.$inject =['$http','$resource']
    angular.module('SplitWise').factory("WalmartFactory",WalmartFactory)

}())