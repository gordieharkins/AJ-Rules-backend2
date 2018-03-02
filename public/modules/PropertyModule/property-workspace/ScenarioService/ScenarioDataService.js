'use strict';

_ScenarioDataService.$inject = [];
module.exports = _ScenarioDataService;

//angular.module('AOTC')
//    .service('ScenarioDataService', _ScenarioDataService
//    );
function _ScenarioDataService() {

    var ScenarioValues = {

        marketRentSets: [],
        vacancySets: [],
        expenseSets: [],
        BCRSets: [],
        scenarioSets: [],
        scenarioToShow: '',

        marketRentSetsCount: 0,
        vacancySetsCount: 0,
        expenseSetsCount: 0,
        BCRSetsCount: 0,
        scenarioSetsCount: 0

    };

    function SetValues(marketRentSets, vacancySets, expenseSets, BCRSets, scenarioSets, scenarioToShow,
        marketRentSetsCount,
        vacancySetsCount,
        expenseSetsCount,
        BCRSetsCount,
        scenarioSetsCount) {

        ScenarioValues.marketRentSets = marketRentSets;
        ScenarioValues.vacancySets = vacancySets;
        ScenarioValues.expenseSets = expenseSets;
        ScenarioValues.BCRSets = BCRSets;
        ScenarioValues.scenarioSets = scenarioSets;
        ScenarioValues.scenarioToShow = scenarioToShow;

        ScenarioValues.marketRentSetsCount = marketRentSetsCount;
        ScenarioValues.vacancySetsCount = vacancySetsCount;
        ScenarioValues.expenseSetsCount = expenseSetsCount;
        ScenarioValues.BCRSetsCount = BCRSetsCount;
        ScenarioValues.scenarioSetsCount = scenarioSetsCount;



    }

    function GetValues() {

        return ScenarioValues;
    }


    return {
        SetValues: SetValues,
        GetValues: GetValues
    };

}
