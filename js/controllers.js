app.controller('ldcontroller', ['$scope', '$http', 'ngDialog', function($scope, $http, ngDialog) {
	  $scope.entity = []
	  $scope.entity.id = '82671871';
	  $scope.entity.type = 'bib';
	  
	  
	  $scope.submit = function() {
		  var SCHEMA = $rdf.Namespace("http://schema.org/")
		  
	      kb = $rdf.graph();
	      uri = 'http://www.worldcat.org/oclc/' + $scope.entity.id;
	      request_url = 'http://experiment.worldcat.org/oclc/' + $scope.entity.id + '.rdf'
	
	      $http({
	    	  method: 'GET',
	    	  url: request_url,
	    	  headers: {
	    		   'Accept': 'application/rdf+xml'
	    		 },
	    	}).then(function successCallback(response) {
	    		$rdf.parse(response.data, kb, uri, 'application/rdf+xml');   
	            $scope.name = kb.the($rdf.sym(uri), SCHEMA('name')).value;
	            $scope.author_name= kb.the(kb.the($rdf.sym(uri), SCHEMA('creator')), $rdf.sym('http://schema.org/name')).value;
	            $scope.author_id = kb.the($rdf.sym(uri), SCHEMA('creator')).uri;
	            subjectNodes = kb.each($rdf.sym(uri), SCHEMA('about'));
	            subjects = [];
	            for (i = 0; i < subjectNodes.length; i++) {
	                if (kb.the(subjectNodes[i], SCHEMA('name'))) {
	                 subjects.push(kb.the(subjectNodes[i], SCHEMA('name')));
	                }
	            }
	            $scope.subjects = subjects;
	            
	            descriptionNodes = kb.each($rdf.sym(uri), SCHEMA('description'));
	            descriptions = [];
	            for (i = 0; i < descriptionNodes.length; i++) {
	                if (descriptionNodes[i].value) {
	                	descriptions.push(descriptionNodes[i].value);
	                }
	            }
	            $scope.descriptions = descriptions;
	            
	    	  }, function errorCallback(response) {
	    		alert('Failed');
	    		console.log(response);
	    	  });
	  };
	    
	    function parse_data (request_url, uri, store){
	    	$http({
	    	  	  method: 'GET',
	    	  	  url: request_url,
	    	  	  headers: {
	    	  		   'Accept': 'application/rdf+xml'
	    	  		 },
	    	  	}).then(function successCallback(response) {   
	    	  		$rdf.parse(response.data, store, uri, 'application/rdf+xml')  
	    	  	  }, function errorCallback(response) {
	    	  		alert('Failed to get bib -' + uri);
	    	  		console.log(response);
	    	});
	  			
	    }
    }]);