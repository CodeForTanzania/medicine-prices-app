angular.module('app.controllers', ['ngAnimate'])
  
.controller('appCtrl', function($scope, $state, $stateParams, Restangular, $location, $anchorScroll, $timeout, anchorSmoothScroll) {
    Restangular.all('medicine').getList().then(function(response){
        $scope.medicines = _.uniq(response, function(o){
         return o.name
        });
        $scope.unfilteredMedicines = response;
    })

    $scope.textChanged = function() {
        $scope.showResults = true;
    }
    
	$scope.scrollTo = function(eID) {
        $scope.showCard = true;
		$location.hash('main');
        anchorSmoothScroll.scrollTo(eID);
	    // $anchorScroll();
	};

    $scope.initTyper = function (nname,price,outcome,form,realPrice,strength) {
        $scope.typing = $(".typing").typed({
            strings: ["<p> ^2000 At <span>TZS "+price+ "</span>,^2000 you are paying "  +outcome+ "% of the global average price.</p>"],
            contentType: 'html',
            typeSpeed: 30,
            backDelay: 750,
            showCursor: false,
            callback: function(){ 
                $scope.shoutOut();
            }
        });
    };

    $scope.shout = false;

    $scope.shoutOut = function() {
        $timeout(function(){$scope.shout = true}, 1000);
        $timeout(function(){$scope.social = true}, 1500);
        $timeout(function(){$scope.goBack = true}, 5000);
        $scope.$apply();
    }

	$scope.select = function(med) {
        console.log(med.plain());
        $scope.credentials.name = med.name;
        $scope.credentials.form = med.form;
        $scope.credentials.realPrice = (med.price * 2230);
        $scope.credentials.strength = med.strength;
        $scope.showResults = false;
    }

    $scope.step1 = function() {
    	$scope.one = true;
        var selectedName = $scope.credentials.name;
        $scope.choosen = _.filter($scope.unfilteredMedicines, function(o){ 
            return o.name == selectedName; 
        });
    }

    $scope.step2 = function(select) {
        $scope.answer =  ($scope.credentials.price / (select.price * 2230)) * 100;
        $scope.outcome = Math.round($scope.answer);
    	$scope.two = true;
        $scope.personNode = true;
        $scope.initTyper($scope.credentials.name, $scope.credentials.price, $scope.outcome, $scope.credentials.form, $scope.credentials.realPrice, $scope.credentials.strength);
        $timeout(function(){$scope.loaded = true}, 1000);
        
    }
    
    $scope.close = function() {
        $scope.personNode = false;
        $state.reload();
    }
})
