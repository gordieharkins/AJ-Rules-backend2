'use strict';

_TaskManagerCtrl.$inject = ["$stateParams", "$state", "$location", "$scope", "$interval", "taskService", "$http", "__env", "$log", "AOTCService", "$timeout"];
module.exports = _TaskManagerCtrl;

//angular.module('AOTC').controller('TaskManagerCtrl', _TaskManagerCtrl
//    );

function _TaskManagerCtrl($stateParams, $state, $location, $scope, $interval, taskService, $http, __env, $log, AOTCService, $timeout) {
    //////console.log('task manager controller', $stateParams);
    $timeout(function() {
        if ($stateParams.messageFrom) {
            $scope.$emit('success', $stateParams.message)
        }
    }, 500);
    var flag = true;
    // I contain the list of friends to be rendered.
    $("#preloader").css('display', 'block');

    var loadRemoteData = function() {
        // The friendService returns a promise.
        taskService.getTasks().then(
            function(tasks) {
                //////console.log(tasks);
                applyRemoteData(tasks);
            });
    }

    loadRemoteData();
    var dataLoader = $interval(loadRemoteData, 5000);
    $scope.$on('$destroy', function() {
        $interval.cancel(dataLoader);
    });

    $scope.getDayDifference = function(task) {
        var date1 = new Date(task.uploadTime);
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var old = false;

        if (diffDays > 1) {
            old = true;
        }
        return old;
    }

    // I apply the remote data to the local scope.

    $scope.gotoProperties = function(task) {
        //////console.log('i clicked')
        $("#preloader").css('display', 'block');
        
        localStorage.setItem('propertyId', task.propertyId);

        var propertyId = localStorage.getItem("propertyId");
        taskService.getPropertyDetails().then(
            function(props) {
                //////console.log('----->'+props)

                $("#preloader").css('display', 'none');

                if (task.type == "IE" && task.propertyId !== "-1") {
                    localStorage.setItem('propertyDetails', angular.toJson(props.result[0].n.properties));

                    $state.go('viewIERR.income_expense');
                } else if (task.type == "RR" && task.propertyId !== "-1") {
                    localStorage.setItem('propertyDetails', angular.toJson(props.result[0].n.properties));

                    $state.go('viewIERR.rent_role');
                } else {
                    $state.go('PropertyList.private_property_list');
                }
            });
    }

    $scope.gotoPrivateProps = function(task) {
        $state.go('PropertyList.private_property_list');
    }



    function applyRemoteData(newTasks) {
        if (newTasks.success) {
            $scope.tasks = [];
            $scope.tasks = newTasks.result;
        }
        $("#preloader").css('display', 'none');

    }

}
/**
 * Created by MW Team 3 on 4/21/2017.
 */
