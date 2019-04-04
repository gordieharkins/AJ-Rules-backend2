var moment = require('moment-timezone');
var path = require('path');
var InvalidFileFormat = require('../BLL/errors/invalidFileFormat');
var db = require(path.resolve(__dirname, './graphConnection'));
var execute_query = require(path.resolve(__dirname, './execute_sql'));
var SQL = require('mssql');


module.exports = DAL;

// Class Constructor
function DAL() {

}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.getContracts = function(userId, cb) {
    var params = {
        userId: parseInt(userId)
    }

    //console.log(userId);
    var query = `MATCH (user:user) where id(user) = {userId}
        MATCH (user)-[rl:contractsRel]->(contracts:contracts)
        MATCH (contracts)-[rl2:contract]->(contract:contract)
        RETURN collect(properties(contract)) AS contracts`;

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.uploadContracts = function(contracts, userId, cb) {

    var params = {
        userId: parseInt(userId)
    };
    var query = `MATCH (user:user) where id(user) = {userId}
        MERGE (user)-[rl:contractsRel]->(contracts:contracts)`;

    for(var i = 0;i < contracts.length; i++){
        contracts[i].createdBy = userId;
        contracts[i].createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        contracts[i].modifiedBy = userId;
        contracts[i].modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
        contracts[i].name = contracts[i].fileName;
        delete contracts[i].fileName;

        params['contract' + i] = contracts[i];

        query += `\nCREATE (contract` + i + `:contract{contract` + i + `})
        CREATE (contracts)-[rel` + i + `:contract]->(contract` + i + `)`;

        // query += `INSERT INTO contracts (name, body, createdBy, createdDate, modifiedBy, modifiedDate)
        //            VALUES (@contractName`+i+` , @contractBody`+i+` , @createdBy, @createdDate,@modifiedBy, @modifiedDate);`;

        // sqlRequest = sqlRequest.input("contractName"+i, SQL.VarChar, contracts[i].fileName);
        // sqlRequest = sqlRequest.input("contractBody"+i, SQL.Text, contracts[i].body);
    }

    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.addContractTerms = function(data, cb) {
    var params = {
        contractTerms: data
    };
    var query = `MERGE (CTN:contractTermsNode)
        CREATE (CTN)-[rel:contractTermsRel]->(CT:contractTerms{contractTerms})`;

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.getContractTerms = function(cb) {

    var query = `MATCH (CTN:contractTermsNode)-[rel]->(CT:contractTerms)
        RETURN collect(properties(CT)) AS contractTerms`;

     db.cypher({
        query: query,
    }, function(err, results) {
        cb(err, results);
    });
}

//--------------------------------------------------------
//      Neo4j EPs
//--------------------------------------------------------
DAL.prototype.updateContractTerms = function(data, cb) {

    var params = {
        contractId: data.id
    };
    delete data.id;
    params.contractTerms = data;

    var query = `MATCH (CT:contractTerms) WHERE id(CT) = {contractId}
        SET CT = {contractTerms}`;

     db.cypher({
        query: query,
        params:params
    }, function(err, results) {
        cb(err, results);
    });
}

// DAL.prototype.addContracts = function(data, cb) {
//     var query = "";

//     if(data.contractId == null){

//         query += `BEGIN
//                    DECLARE @contractId INTEGER
//                    INSERT INTO contracts (userId) Values (${data.userId}); SELECT @contractId = SCOPE_IDENTITY()`;

//         for(var i = 0; i < data.sections.length; i++){
//             query += `INSERT INTO contract_sections(contractId, title, label, type, data)
//             VALUES(@contractId,'${data.sections[i].title}',
//             '${data.sections[i].label}','${data.sections[i].type}','${data.sections[i].data}')`
//         }

//         query += `SELECT c.id as contractId,cs.id as sectionId, cs.title, cs.label, cs.type, cs.data
//             FROM contracts c INNER JOIN contract_sections cs ON cs.contractId = c.id
//             Where c.id = @contractId
//             END`;
//     } else {
//         for(var i = 0;i < data.sections.length; i++){
//             if(data.sections[i].sectionId == null){

//                 query += `INSERT INTO contract_sections(contractId, title, label, type, data)
//                 VALUES(${data.contractId},'${data.sections[i].title}',
//                 '${data.sections[i].label}','${data.sections[i].type}','${data.sections[i].data}')`;
//             }
//             else if(data.sections[i].editable){

//                 query +=`UPDATE contract_sections SET title = '${data.sections[i].title}',
//                         label = '${data.sections[i].label}', type = '${data.sections[i].type}', data = '${data.sections[i].data}'
//                         WHERE id = ${data.sections[i].sectionId}`;
//             }
//         }
//         query += `SELECT c.id as contractId,cs.id as sectionId,  cs.title, cs.label, cs.type, cs.data
//             FROM contracts c INNER JOIN contract_sections cs ON cs.contractId = c.id Where c.id = ${data.contractId}`;
//     }

//     execute_query(query, function(error, result) {

//         cb(error, result)
//     });
// }

// DAL.prototype.addSectionTemplate = function(data, cb) {
//     var query = `INSERT into contract_section_tempates(userId, title, label, type, data) VALUES(${data.userId},'${data.title}'
//                     ,'${data.label}','${data.type}','${data.text}')`;
//     execute_query(query, function(error, result) {
//         cb(error, result)
//     });
// }

// DAL.prototype.getSectionTemplate = function(data, cb) {
//     var query = `SELECT * from contract_section_tempates WHERE userId = ${data.userId}`;
//     execute_query(query, function(error, result) {
//         cb(error, result)
//     });
// }

// DAL.prototype.getContracts = function(data, cb) {
//     var query = `SELECT id, name, body from contracts where createdBy = @userId`;
//     var sqlRequest = new SQL.Request();
//     sqlRequest = sqlRequest.input("userId", SQL.Int(), data);

//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

// DAL.prototype.getParticularContract = function(data, cb) {
//     var query = `SELECT c.id as contractId, cs.id as sectionId,  cs.title, cs.label, cs.type, cs.data
//             FROM contracts c INNER JOIN contract_sections cs ON cs.contractId = c.id Where c.id = ${data.contractId}`;
//     execute_query(query, function(error, result) {
//         cb(error, result)
//     });
// }

// DAL.prototype.deleteContractSection = function(data, cb) {
//     var query = `DELETE FROM contract_sections where id = ${data.sectionId}`;
//     execute_query(query, function(error, result) {
//         cb(error, result)
//     });
// }

// DAL.prototype.deleteSectionTemplate = function(data, cb) {
//     var query = `DELETE FROM contract_section_tempates where id = ${data.sectionId}`;
//     execute_query(query, function(error, result) {
//         cb(error, result)
//     });
// }

// DAL.prototype.uploadContracts = function(contracts, userId, cb) {
//     var createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
//     var modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
//     var createdBy = userId;
//     var modifiedBy = userId;
//     var query = "";
//     var sqlRequest = new SQL.Request();

//     for(var i = 0;i < contracts.length; i++){
//         query += `INSERT INTO contracts (name, body, createdBy, createdDate, modifiedBy, modifiedDate)
//                    VALUES (@contractName`+i+` , @contractBody`+i+` , @createdBy, @createdDate,@modifiedBy, @modifiedDate);`;

//         sqlRequest = sqlRequest.input("contractName"+i, SQL.VarChar, contracts[i].fileName);
//         sqlRequest = sqlRequest.input("contractBody"+i, SQL.Text, contracts[i].body);

//     }

//     sqlRequest = sqlRequest.input("createdDate", SQL.DateTime2(), createdDate);
//     sqlRequest = sqlRequest.input("modifiedDate", SQL.DateTime2(), modifiedDate);
//     sqlRequest = sqlRequest.input("createdBy", SQL.Int(), createdBy);
//     sqlRequest = sqlRequest.input("modifiedBy", SQL.Int(), modifiedBy);

//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

DAL.prototype.addContractTemplate = function(data, userId, cb) {
    //console.log(data);
    var contract = data.contract;
    // //console.log(contract);
    var fct = data.fct;
    // //console.log(fct);

    var nfct = data.nfct;
    // //console.log(nfct);

    var createdDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    var modifiedDate = moment.tz(Date.now(), config.timezone_str).format('YYYY-MM-DD HH:mm:ss');
    // var createdBy = contract.userId;
    // var modifiedBy = contract.userId;
    // var sqlRequest = new SQL.Request();
    // var query = `INSERT INTO contracts (name, body, createdBy, createdDate, modifiedBy, modifiedDate)
    //                VALUES (@contractName , @contractBody , @createdBy, @createdDate,@modifiedBy, @modifiedDate);`;
    //
    // sqlRequest = sqlRequest.input("contractName", SQL.VarChar, contract.name);
    // sqlRequest = sqlRequest.input("contractBody", SQL.Text, contract.content);
    // sqlRequest = sqlRequest.input("createdDate", SQL.DateTime2(), createdDate);
    // sqlRequest = sqlRequest.input("modifiedDate", SQL.DateTime2(), modifiedDate);
    // sqlRequest = sqlRequest.input("createdBy", SQL.Int(), createdBy);
    // sqlRequest = sqlRequest.input("modifiedBy", SQL.Int(), modifiedBy);
    //
    // sqlRequest.query(query).then(function(result) {
    //     //console.log("result : "+result);
    //     cb(null, result);
    // }).catch(function(err) {
    //     //console.log("Error : "+err);
    //     cb(err, null);
    // });

    var contractTemp = {
        contractName: contract.name,
        body: contract.content,
        propertyIds: contract.propId,
        agentName: contract.agenttName,
        status: contract.status,
        createdDate : createdDate,
        modifiedDate : modifiedDate,
        createdBy : contract.userId,
        modifiedBy : contract.userId
    }

    // //console.log(contractTemp);
    var params = {
        contract: contractTemp,
        userId: userId
    }

    // //console.log(params);
    var query = `MATCH (user) where id(user) = {userId}
                CREATE (contract:contract {contract})
                CREATE (user)-[rel:Has]->(contract)\n`;

    for(var i = 0; i < fct.length; i++){
        for(var j = 0; j < fct[i].length;j++){
            var count = i+""+j;

            params['financial'+count] = fct[i][j];
            query += `CREATE(financialTerm`+count+`: financialTerm{financial`+count+`})
                      CREATE(contract)-[fct`+count+`:fct]->(financialTerm`+count+`)\n`;
            // //console.log(query);
        }
    }

    for(var i = 0;i < nfct.length;i++){
        params['nonFinancial'+i] = nfct[i];

        query += `CREATE(nonFinancialTerm`+i+`:nonFinancialTerm{nonFinancial`+i+`})
                   CREATE(contract)-[nfct`+i+`:nfct]->(nonFinancialTerm`+i+`)\n`;
    }

    //console.log(query);
    // cb(query, null);
    db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        //console.log(err);
        //console.log(results);
        cb(err, results);
    });
}

// DAL.prototype.getContractTerms = function(cb) {
//     var sqlRequest = new SQL.Request();
//     var query = `SELECT * FROM contract_terms;`;
//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

// DAL.prototype.addContractTerms = function(data, cb) {
//     var sqlRequest = new SQL.Request();
//     var query = `INSERT INTO contract_terms(label, value, type, columns, hasLevels) VALUES(@label, @value, @type, @columns, @levels);`;

//     sqlRequest = sqlRequest.input("label", SQL.VarChar(255), data.label);
//     sqlRequest = sqlRequest.input("value", SQL.VarChar(255), data.value);
//     sqlRequest = sqlRequest.input("type", SQL.VarChar(255), data.type);
//     sqlRequest = sqlRequest.input("columns", SQL.Text, data.columns);
//     sqlRequest = sqlRequest.input("levels", SQL.Bit(), data.hasLevels);

//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

// DAL.prototype.updateContractTerms = function(data, cb) {
//     var sqlRequest = new SQL.Request();
//     var query = `UPDATE contract_terms SET label = @label, value = @value, type = @type, columns = @columns, hasLevels = @levels WHERE id = @id;`;

//     sqlRequest = sqlRequest.input("label", SQL.VarChar(255), data.label);
//     sqlRequest = sqlRequest.input("value", SQL.VarChar(255), data.value);
//     sqlRequest = sqlRequest.input("type", SQL.VarChar(255), data.type);
//     sqlRequest = sqlRequest.input("columns", SQL.Text, data.columns);
//     sqlRequest = sqlRequest.input("levels", SQL.Bit(), data.hasLevels);
//     sqlRequest = sqlRequest.input("id", SQL.Int, data.id);

//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

DAL.prototype.addContract = function(data, userId, cb) {

    // //console.log(data);
    var sqlRequest = new SQL.Request();
    var query = `DECLARE @contractId INTEGER
                INSERT INTO PO_contracts(name, body, propertyId, userId) VALUES (@contractName, @body, @propertyId, @userId)
                SELECT @contractId = SCOPE_IDENTITY(); `;

    for(var i = 0; i < data.terms.length;i++){

        query += `INSERT INTO PO_contract_terms(contractId, termId, term_value) VALUES (@contractId, @termId`+i+`, @value`+i+`);`;

        sqlRequest = sqlRequest.input("termId"+i, SQL.Int, data.terms[i].id);
        sqlRequest = sqlRequest.input("value"+i, SQL.VarChar(255), data.terms[i].value);

    }

    sqlRequest = sqlRequest.input("contractName", SQL.VarChar(255), data.contractName);
    sqlRequest = sqlRequest.input("body", SQL.Text, data.body);
    sqlRequest = sqlRequest.input("propertyId", SQL.VarChar(255), data.propertyId);
    sqlRequest = sqlRequest.input("userId", SQL.Int, userId);

    sqlRequest.query(query).then(function(result) {
        //console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        //console.log("Error : "+err);
        cb(err, null);
    });
}

DAL.prototype.getContractsByUserId = function(data, userId, cb) {
    var params = {
        userId: userId
    }

    // var query = `MATCH (user:user) where id(user) = {userId}
    //     MATCH (user)-[rl:contractsRel]->(contracts:contracts)
    //     MATCH (contracts)-[rl2:contract]->(contract:contract)
    //     RETURN collect(properties(contract))`;

    var query = `MATCH (user:user)-[rel:Has]->(contracts)
                where id(user) = {userId} return properties(contracts) as contracts, id(contracts) as id`

     db.cypher({
        query: query,
        params: params
    }, function(err, results) {
        cb(err, results);
    });
}

// DAL.prototype.getContractsByUserId = function(data, cb) {
//     var sqlRequest = new SQL.Request();
//     var query = `SELECT * FROM PO_contracts where userId = @userId;`;
//
//     sqlRequest = sqlRequest.input("userId", SQL.Int, data.userId);
//     sqlRequest.query(query).then(function(result) {
//         //console.log("result : "+result);
//         cb(null, result);
//     }).catch(function(err) {
//         //console.log("Error : "+err);
//         cb(err, null);
//     });
// }

DAL.prototype.getContractsById = function(data, cb) {
    // var sqlRequest = new SQL.Request();
    // var query = `SELECT
    //         dbo.PO_contracts.name,
    //         dbo.PO_contract_terms.term_value,
    //         dbo.PO_contracts.body,
    //         dbo.PO_contracts.propertyId,
    //         dbo.PO_contracts.userId,
    //         dbo.PO_contract_terms.contractId,
    //         dbo.PO_contract_terms.termId,
    //         dbo.contract_terms.label,
    //         dbo.contract_terms.hasLevels,
    //         dbo.contract_terms.columns,
    //         dbo.contract_terms.type
    //
    //         FROM
    //         dbo.PO_contracts
    //         INNER JOIN dbo.PO_contract_terms ON dbo.PO_contract_terms.contractId = dbo.PO_contracts.id
    //         INNER JOIN dbo.contract_terms ON dbo.PO_contract_terms.termId = dbo.contract_terms.id
    //         WHERE
    //         dbo.PO_contracts.id = @contractId`;
    //
    // sqlRequest = sqlRequest.input("contractId", SQL.Int, data.contractId);
    // sqlRequest.query(query).then(function(result) {
    //     //console.log("result : "+result);
    //     cb(null, result);
    // }).catch(function(err) {
    //     //console.log("Error : "+err);
    //     cb(err, null);
    // });


    var query = `MATCH(contract: contract) WHERE id(contract) = {contractId}
                 OPTIONAL MATCH (contract)-[fct: fct]->(financialTerms: financialTerm)
                 OPTIONAL MATCH (contract)-[nfct: nfct]->(nonFinancialTerms: nonFinancialTerm)
                 return contract, collect(properties(financialTerms)) as financialTerms, collect(properties(nonFinancialTerms)) as nonFinancialTerms`

    db.cypher({
        query: query,
        params:{
            contractId: data.contractId
        }
    }, function(err, results) {
        //console.log(results);
        cb(err, results);
    });
}

DAL.prototype.saveInvoice = function(data, cb) {
    var sqlRequest = new SQL.Request();
    var query = `INSERT INTO contract_invoice(original_value, preappeal_value, assessor_value, board_value, market_pre_appeal,
                market_level1, market_level2, tax_rate, taxowed_pre_appeal, taxowed_assessor, taxowed_board, tax_savings_level1, tax_savings_level2,
                fee_percentage, fee_owed, tax_due_date, tax_bill, less_solid_waste, water_quality, net_bill, contractId) VALUES (@original_value, @preappeal_value,
                @assessor_value, @board_value, @market_pre_appeal,
                @market_level1, @market_level2, @tax_rate, @taxowed_pre_appeal, @taxowed_assessor, @taxowed_board, @tax_savings_level1, @tax_savings_level2,
                @fee_percentage, @fee_owed, @tax_due_date, @tax_bill, @less_solid_waste, @water_quality, @net_bill, @contractId)`;

    sqlRequest = sqlRequest.input("original_value", SQL.VarChar, data.original_value);
    sqlRequest = sqlRequest.input("preappeal_value", SQL.VarChar, data.preappeal_value);
    sqlRequest = sqlRequest.input("assessor_value", SQL.VarChar, data.assessor_value);
    sqlRequest = sqlRequest.input("board_value", SQL.VarChar, data.board_value);
    sqlRequest = sqlRequest.input("market_pre_appeal", SQL.VarChar, data.market_pre_appeal);
    sqlRequest = sqlRequest.input("market_level1", SQL.VarChar, data.market_level1);
    sqlRequest = sqlRequest.input("market_level2", SQL.VarChar, data.market_level2);
    sqlRequest = sqlRequest.input("tax_rate", SQL.VarChar, data.tax_rate);
    sqlRequest = sqlRequest.input("taxowed_pre_appeal", SQL.VarChar, data.taxowed_pre_appeal);
    sqlRequest = sqlRequest.input("taxowed_assessor", SQL.VarChar, data.taxowed_assessor);
    sqlRequest = sqlRequest.input("taxowed_board", SQL.VarChar, data.taxowed_board);
    sqlRequest = sqlRequest.input("tax_savings_level1", SQL.VarChar, data.tax_savings_level1);
    sqlRequest = sqlRequest.input("tax_savings_level2", SQL.VarChar, data.tax_savings_level2);
    sqlRequest = sqlRequest.input("fee_percentage", SQL.VarChar, data.fee_percentage);
    sqlRequest = sqlRequest.input("fee_owed", SQL.VarChar, data.fee_owed);
    sqlRequest = sqlRequest.input("tax_due_date", SQL.DateTime2(), data.tax_due_date);
    sqlRequest = sqlRequest.input("tax_bill", SQL.VarChar, data.tax_bill);
    sqlRequest = sqlRequest.input("less_solid_waste", SQL.VarChar, data.less_solid_waste);
    sqlRequest = sqlRequest.input("water_quality", SQL.VarChar, data.water_quality);
    sqlRequest = sqlRequest.input("net_bill", SQL.VarChar, data.net_bill);
    sqlRequest = sqlRequest.input("contractId", SQL.Int, data.contractId);
    sqlRequest.query(query).then(function(result) {
        //console.log("result : "+result);
        cb(null, result);
    }).catch(function(err) {
        //console.log("Error : "+err);
        cb(err, null);
    });
}

DAL.prototype.getInvoiceByContractId = function(data, cb) {
    // var sqlRequest = new SQL.Request();
    //console.log(data.propertyIds)

    var query = `Match (prop:property)<-[year:OF_Year]-(assessment:Assessment) where id(prop) IN {propertyIds} AND year.year = {year}
                Match(contract:contract)-[:Fee]->(fee) where id(contract) = {contractId}
                return assessment, fee, id(prop) as propertyId`;
    // //console.log(query);
    db.cypher({
        query: query,
        params:{
            propertyIds:data.propIds,
            year: parseInt(data.year),
            contractId: data.contractId
        }
    }, function(err, results) {
        //console.log(results);
        cb(err, results);
    });
}

DAL.prototype.getDataforSampleCalculations = function(data, cb) {
    // var sqlRequest = new SQL.Request();
    // //console.log(data.propertyIds)

    var query = `Match (prop:property)<-[year:OF_Year]-(assessment:Assessment) where id(prop) IN {propertyIds} AND year.year = {year}
                return properties(assessment) as assessment, id(prop) as propertyId, prop.propertyName as propertyName, year.year as year`;
    // //console.log(query);
    db.cypher({
        query: query,
        params:{
            propertyIds: data.propIds,
            year: parseInt(data.year),
            contractId: data.contractId
        }
    }, function(err, results) {
        // //console.log(results);
        cb(err, results);
    });
}
