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

timeline.marylandTimeline = {
	ieSurvey:{
		main: {
			name: "Income and Expense Survey",
			type: 1,
			obligatory: true,
			form: true,
			requiredItems: ["IE 2015||2015||IE", "IE 2016||2016||IE", "IE 2017||2017||IE", "RR as of January 1, 2017||January 1, 2017||RR", "RR as of January 1, 2018||January 1, 2018||RR"],
// requiredItems: ["IE 2015||2015||IE","IE 2016||IE", "IE 2017||2015||IE", "RR as of January 1, 2017||RR", "RR as of January 1, 2018||RR"],
			formObtain: "AOTC",
			signature: "PIN",
			tranmitForm: "AOTC",
			transmitPackage: "AOTC",
			paradigm: "AOTC",
			deadline: "6/14/2018",
			startDate: "6/1/2018",
			status: "Not Started", 
			message: "Start date: 6/1/2018",
			warning: "",
			order: 1
		},
		event1:{
			name: "Complete Required Information",
			status: "Not Started",
			message: "",
			warning: "",
			flag: true,
			mandatory: true,
			buttonText: "Details",
			button: true,
			order: 1,
			f: ["field","A", "0", "IE 2015"],
			g: ["field","B", "1", "IE 2015"],
			h: ["field","C", "2", "IE 2016"],
			i: ["field","D", "3", "IE 2017"],
			j: ["field","E", "4", "RR as of January 1, 2017"],
			k: ["field","F", "5", "RR as of January 1, 2018"]
		},

		event3: {
			name: "Review IE Survey Draft",
			status: "Not Started",
			message: "",
			flag: false,
			mandatory: false,
			buttonText: "Schedule Review",
			button: true,
			reviewResult:true,
			order: 2
		},

		event4: {
			name: "Submit IE Survey Data",
			status: "Not Started",
			message: "",
			flag: false,
			buttonText: "Execute Signature",
			button: true,
			mandatory: true,
			dropdown: true,
			dropdownValues: ["Execute Signature"],
			// state: "", 
			order: 3
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
}



timeline.floridaTimeline = {
	ieSurvey:{
		main: {
			name: "Income and Expense Survey",
			type: 1,
			obligatory: true,
			form: true,
			requiredItems: ["IE 2015||2015||IE", "IE 2016||2016||IE", "IE 2017||2017||IE", "RR as of January 1, 2017||January 1, 2017||RR", "RR as of January 1, 2018||January 1, 2018||RR"],			
			formObtain: "mail",
			signature: "ink",
			tranmitForm: "mail",
			transmitPackage: "mail",
			paradigm: "paper",
			deadline: "6/14/2018",
			startDate: "5/14/2018",
			order: 1
		}
    },
	event2: {
		name: "Complete IE Survey Form",
		status: "Not Started",
		message: "Have you received the income expense survey form?",
		flag: true,
		mandatory: true,
		warning: false,
		toggle: true,
		toggleValue: false,
		dropdown: true,
		dropdownValues: ["Mark as Yes", "Mark as No"],
		order: 1
	},
	event1:{
		name: "Complete Required Items",
		status: "Not Started",
		message: "",
		warning: "",
		flag: true,
		mandatory: true,
		buttonText: "View Checklist",
		button: true,
		order: 2,
		f: ["field","A","false"],
		g: ["field","B","false"],
		h: ["field","C","false"],
		i: ["field","D","false"],
		j: ["field","E","false"],
		k: ["field","F","false"]
	},
	
	event3: {
		name: "Review IE Survey Draft",
		status: "Not Started",
		message: "",
		flag: false,
		mandatory: false,
		toggleValue: "false",
		toggle: false,
		reviewResult:true,
		order: 3
	},

	event4: {
		name: "Submit IE Survey Data",
		status: "Not Started",
		message: "",
		flag: false,
		toggleValue: "false",
		button: false,
		mandatory: true,
		// state: "", 
		order: 4
	}


,
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


module.exports = timeline;