function travelPlanner($scope){
    $scope.plans = [
        "方案一",
        "方案二",
        "方案三"
    ];

	$scope.selectedPlan = $scope.plans[0];

	$scope.planClass = function(plan){
		return plan === $scope.selectedPlan ? "list-group-item active" : "list-group-item";
	}

	$scope.changePlan = function(plan){
		$scope.selectedPlan = plan;
	}

	$scope.travelLine = function(travelLine){

	}

	$scope.planDetails = [
		{
			travelLine : ["上海","兰州","敦煌","张掖","西安","上海"],//行程线
			travels : [//行程列表
				{//行程
					travelLine : ["上海","兰州"],
					trafficWay : []
				},
				{
					travelLine : ["兰州","敦煌"],
					trafficWay : []
				},
				{
					travelLine : ["敦煌","张掖"],
					trafficWay : []
				},
				{
					travelLine : ["张掖","西安"],
					trafficWay : []
				},
				{
					travelLine : ["西安","上海"],
					trafficWay : []
				}
			]
		},
		{
			travelLine : ["上海","兰州","张掖","敦煌","西安","上海"],//行程线
			travels : [
				{
					travelLine : ["上海","兰州"],
					trafficWay : []
				},
				{
					travelLine : ["兰州","张掖"],
					trafficWay : []
				},
				{
					travelLine : ["张掖","敦煌"],
					trafficWay : []
				},
				{
					travelLine : ["敦煌","西安"],
					trafficWay : []
				},
				{
					travelLine : ["西安","上海"],
					trafficWay : []
				}
			]
		}
	];
}
