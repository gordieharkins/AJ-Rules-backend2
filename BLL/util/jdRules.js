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
				jurisdictionsName: "State of Maryland",
				name: "Income and Expense Survey",
				type: 1, // do not change
				obligatory: true,
				paradigm: "machine",
				form: true,
				formObtain: "machine",
				requiredItems: true,
				requiredItemsForm: "machine",
				requiredItemsList: ["Income Expense Statement of 2015||2015||IE", "Income Expense Statement of 2016||2016||IE", "Income Expense Statement of 2017||2017||IE", "Rent Roll as of January 1, 2017||January 1, 2017||RR", "Rent Roll as of January 1, 2018||January 1, 2018||RR"],
				signature: true,
				signatureType: "PIN",
				submission: true,
				submissionType: "machine",
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
				type: 1, // do not change
				obligatory: true,
				paradigm: "paper",
				form: true,
				formObtain: "mail",
				requiredItems: true,
				requiredItemsForm: "paper",
				requiredItemsList: ["Income Expense Statement of 2015||2015||IE", "Income Expense Statement of 2016||2016||IE", "Income Expense Statement of 2017||2017||IE", "Rent Roll as of January 1, 2017||January 1, 2017||RR", "Rent Roll as of January 1, 2018||January 1, 2018||RR"],
				signature: true,
				signatureType: "PIN",
				submission: true,
				submissionType: "mail",
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

timeline.paradigms = {
	paper: {
		form: {
				name: "Complete IE Survey Form",
				status: "Not Started",
				message: "Have you received the income expense survey form?",
				flag: true,
				mandatory: true,
				warning: false,
				toggle: true,
				toggleValue: false,
				dropdown: true,
				dropdownValues: ["Mark all as Yes", "Mark all as No"],
				type: "00",
				order: 1
		},

		requiredItems: {
			name: "Complete Required Items",
			status: "Not Started",
			type: "01",			
			message: "",
			warning: "",
			flag: true,
			mandatory: true,
			buttonText: "View Checklist",
			button: true,
			order: 2,
			field2: ["field","Total Expenses 2015", "false"],
			field3: ["field","Net Operating Income 2015", "false"],
			field4: ["field","Total Expenses 2016", "false"],
			field5: ["field","Net Operating Income 2016", "false"],
			field6: ["field","Total Expenses 2017", "false"],
			field7: ["field","Net Operating Income 2017", "false"],
		}, 

		review: {
			name: "Review IE Survey Draft",
			status: "Not Started",
			message: "",
			type: "02",			
			flag: false,
			mandatory: false,
			toggleValue: "false",
			toggle: false,
			reviewResult:true,
			order: 3
		},

		signature: {
			name: "Execute Signature",
			status: "Not Started",
			message: "",
			type: "03",
			flag: false,
			toggleValue: "false",
			button: false,
			mandatory: true,
			dropdown: true,
			dropdownValues: ["Mark all as Yes", "Mark all as No"],
			// state: "", 
			order: 4
		}, 

		submission: {
			name: "Submit IE Survey Data",
			status: "Not Started",
			message: "",
			type: "04",			
			flag: false,
			toggleValue: "false",
			button: false,
			mandatory: true,
			dropdown: true,
			dropdownValues: ["Mark all as Yes", "Mark all as No"],
			// state: "", 
			order: 5
		}
	},

	machine: {
		requiredItems: {
			name: "Complete Required Information",
			status: "Not Started",
			type: "10",
			message: "",
			warning: "",
			flag: false,
			mandatory: true,
			buttonText: "Details",
			button: true,
			deadline: "",
			order: 1,
			field1: ["field","Total Expenses", "$32,000", "Income Expense Statement 2015||2015||IE"],
			field2: ["field","Net Operating Income", "$65,000", "Income Expense Statement 2015||2015||IE"],
			field3: ["field","Total Expenses", "$12,000", "Income Expense Statement 2016||2016||IE"],
			field4: ["field","Net Operating Income", "$33,000", "Income Expense Statement 2016||2016||IE"],
			field5: ["field","Total Expenses", "$18,000", "Income Expense Statement 2017||2017||IE"],
			field6: ["field","Net Operating Income", "$41,000", "Income Expense Statement 2017||2017||IE"]
		},

		review: {
			name: "Review IE Survey Draft",
			status: "Not Started",
			type: "11",
			message: "",
			flag: false,
			mandatory: false,
			buttonText: "Schedule Review",
			button: true,
			reviewResult:true,
			deadline: "",
			order: 2
		},

		signature: {
			name: "Execute Signature",
			status: "Not Started",
			type: "12",
			message: "",
			flag: false,
			buttonText: "Execute Signature",
			button: true,
			mandatory: true,
			dropdown: true,
			dropdownValues: ["Execute Signature on All"],
			deadline: "",
			// state: "", 
			order: 3
		},

		submission: {
			name: "Submit IE Survey Data",
			status: "Not Started",
			type: "13",
			message: "",
			flag: false,
			// buttonText: "Execute Signature",
			// button: true,
			mandatory: true,
			deadline: "",
			// dropdown: true,
			// dropdownValues: ["Execute Signature"],
			// state: "", 
			order: 4
		}
	}
}

module.exports = timeline;