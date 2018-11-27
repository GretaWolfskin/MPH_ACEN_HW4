/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope Public
 */
define(['N/email', 'N/record', 'N/ui/serverWidget', 'N/runtime'],
/**
 * @param {email} email
 * @param {record} record
 * @param {serverWidget} serverWidget
 * @param {runtime} runtime
 */
function(email, record, serverWidget, runtime) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {
    	
      	var recNewRecord = scriptContext.newRecord;
    	var objForm = scriptContext.form;
      	
      	var objFieldToHide = objForm.getField({
    		id : 'class'
    	});
        
      	// Set field display type to disabled
    	objFieldToHide.updateDisplayType({
    	    displayType: serverWidget.FieldDisplayType.DISABLED
    	});
        
      	recNewRecord.setValue({
	   		fieldId : 'memo',
    		value : 'This memo was set by 415144'
    	});      
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    	
    	var recNewRecord = scriptContext.newRecord;
    	
		// Get value of customer industry type field
		var stValue = recNewRecord.getValue({
			fieldId : 'custbody_acen_sec_cust_it'
		});
      
      	var stOtherRefNumValue = '';
      	
      	if (stValue == '')
          	stOtherRefNumValue = '415144';
        else
          	stOtherRefNumValue = 'Not Available';
        
        recNewRecord.setValue({
        	fieldId : 'otherrefnum',
        	value : stOtherRefNumValue
       	});
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	
      	var recNewRecord = scriptContext.newRecord;
		
		var stDepartmentValue = recNewRecord.getValue({
			fieldId : 'department'
		});
      	var objCurrentUser = runtime.getCurrentUser();
		
	    var stMessage = '';
		if(stDepartmentValue == '')
		{
			stMessage = 'Invoice was created with empty department.';
		}
		else
		{
			stMessage = 'Invoice was created with department id: ' + stDepartmentValue;
		}
		
		email.send({
			author : objCurrentUser.id,
			recipients : objCurrentUser.id,
			subject : 'Invoice created',
			body : stMessage
		});
      
	    var total = recNewRecord.getValue({
			fieldId : 'total'
		});
		
		if(total >= 1000000)
		{
			email.send({
				author : objCurrentUser.id,
				recipients : 'nadrizeny@elenka.cz',
              	cc : 'financniurad@elenka.cz', //to alert authorities of suspicious activity
              	bcc : 'policie@elenka.cz',
              	subject : 'Invoice created',
				body :  'Total amount is ' + total
			});
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
