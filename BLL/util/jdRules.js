timeline = {};


// timeline.marylandTimeline = {
// 	ieSurvey:{
// 		main: {
// 			name: "Income and Expense Survey",
// 			type: 1,
// 			obligatory: true,
// 			form: true,
// 			requiredItems: ["IE 2015||2015||IE","IE 2016||2016||IE", "IE 2017||2017||IE", "RR as of January 1, 2017||January 1, 2017||RR", "RR as of January 1, 2018||January 1, 2018||RR"],
// 			formObtain: "AOTC",
// 			signature: "PIN",
// 			tranmitForm: "AOTC",
// 			transmitPackage: "AOTC",
// 			paradigm: "AOTC",
// 			deadline: "6/14/2018",
// 			startDate: "6/1/2018",
// 			status: "Not Started", 
// 			message: "Start date: 6/1/2018",
// 			warning: "",
// 			order: 1
// 		}
//     }
// }

timeline.jurisdictionsNames = ["State of Maryland", "State of Virginia"];
timeline.jurisdictions = [
	{
		ieSurvey:{
			main: {
				name: "Income and Expense Survey",
				type: 1, // do not change
				obligatory: true,
				form: true,
				requiredItems: ["Income Expense Statement of 2015||2015||IE", "Income Expense Statement of 2016||2016||IE", "Income Expense Statement of 2017||2017||IE", "Rent Roll as of January 1, 2017||January 1, 2017||RR", "Rent Roll as of January 1, 2018||January 1, 2018||RR"],
				paradigm: "AOTC",
				formObtain: "AOTC",
				tranmitForm: "AOTC",
				transmitPackage: "AOTC",
				signature: "PIN",
				deadline: "6/20/2018",
				startDate: "5/14/2018",
				status: "Not Started", 
				message: "Start date: 6/1/2018",
				warning: "",
				order: 1
			}
		},
		obtainAJRecord:{
			main: {
				name: "Obtain AJ Valuation Record",
				type: 2,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 2
			}
		},
		appealMerit:{
			main: {
				name: "Determine Appeal Merit/Produce Evidence",
				type: 3,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 3
			}
		},
		appealDecision:{
			main: {
				name: "Decision to Appeal",
				type: 4,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 4
			}
		},
		appealPackage:{
			main: {
				name: "Prepare Appeal Package for Submission",
				type: 5,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 5
			}
		},
		appealSubmission:{
			main: {
				name: "Appeal Submission",
				type: 6,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 6
			}
		}
	},
	{
		ieSurvey:{
			main: {
				name: "Income and Expense Survey",
				type: 1,
				obligatory: true,
				form: true,
				requiredItems: ["Income Expense Statement of 2015||2015||IE", "Income Expense Statement of 2016||2016||IE", "Income Expense Statement of 2017||2017||IE", "Rent Roll as of January 1, 2017||January 1, 2017||RR", "Rent Roll as of January 1, 2018||January 1, 2018||RR"],
				formObtain: "paper",
				signature: "ink",
				tranmitForm: "mail",
				transmitPackage: "mail",
				paradigm: "paper",
				deadline: "6/14/2018",
				startDate: "5/3/2018",
				status: "Not Started", 
				message: "Start date: 5/14/2018",
				warning: "",
				order: 1
			}
		},

		obtainAJRecord:{
			main: {
				name: "Obtain AJ Valuation Record",
				"type": 2,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 2
			}
		},
		appealMerit:{
			main: {
				name: "Determine Appeal Merit/Produce Evidence",
				type: 3,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 3
			}
		},
		appealDecision:{
			main: {
				name: "Decision to Appeal",
				type: 4,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 4
			}
		},
		appealPackage:{
			main: {
				name: "Prepare Appeal Package for Submission",
				type: 5,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 5
			}
		},
		appealSubmission:{
			main: {
				name: "Appeal Submission",
				type: 6,
				status: "Not Started",
				startDate: "06/15/2018",
				deadline: "08/15/2018",
				message: "",
				warning: "",
				order: 6
			}
		}
	}
]


module.exports = timeline;