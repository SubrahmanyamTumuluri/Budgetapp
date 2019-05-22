//Budget Controller buct

var buct=( function(){
	//Creating function constructirs because we need multiple objects of similar kinds.
	//So income and expense constructors are created with fields id,description and value.
		//Creating expense constructor
		var expense=function(id,description,value) {
		this.id=id;
		this.description=description;
		this.value=value;
	};
		//Income Constructor
		var income=function(id,description,value) {
		this.id=id;
		this.description=description;
		this.value=value;
	};
	//Using arrays to store all the income and expenses.
	var allincome=[];
	var allexpenses=[];
	var totalexpenses=0;
	//creating array 
	
	var totalcalculation=function(type) {
		var sum=0;
		data.allItems[type].forEach(function(cur) {
			sum=sum+cur.value;
			//cur.value=current value (in both income and expenses)
		});
		data.totals[type]=sum;
	}
	var data = {

        allItems: {
            exp: [],//lecture 82 review once again.
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
		},
		budget:0,
		percentage:0
	
	};

	return {
		addItem:function(type,description,value) {
			var ID;
			//writing id function
			if(data.allItems[type].length>0) {
				ID=data.allItems[type][data.allItems[type].length-1].id + 1;
			}else 
			{
				ID=0;
			}
			
			if(type === 'exp') {
				var newItem=new expense(ID,description,value);
			}else if (type === 'inc'){
				var newItem=new income(ID,description,value);
			}
			//'pushing' newItem into array
			console.log(type);
			data.allItems[type].push(newItem);
			return newItem;
		},
		
		deleteItem:function(type,id) {//adding a deleteitem method
			var ids,index;
			
			ids=data.allItems[type].map(function(current){
				return current.id;
			});
			
			index=ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice(index,1);
			}
			
				//we need to find the index of id we want to remove.
				

		},

		

		calculatebudget:function(){	
			//All necessary calculations are done.
			//calc total expenses
			totalcalculation('exp');
			totalcalculation('inc');//total income
		
			//calculate budget:income-expenses
			data.budget=data.totals.inc-data.totals.exp;

			//calc %i of income spent.
			if(data.totals.inc>0){
			//to make sure that denominator is never zero.///////////////////////////////////////////////
			data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
			
			}else {
				data.percentage=-1;
			}
		},

		getBudget:function(){
			return {
				//when I call getBudget,
				//totalincome,totalexpenses,totalpercentage are obtained in o/p.
				//Calculations are returned here.
				budget:data.budget,
				totalincome:data.totals.inc,
				totalexpenses:data.totals.exp,
				totalpercentage:data.percentage,
			
			}
		},
		testing:function() {
			console.log(data);
		},
		
		};
		
	
})();

//UI Controller
var uic=(function() {
	
	var domstr={
		inputType:'.add__type',
		inputDscrp:'.add__description',
		inputValue:'.add__value',
		inputDomStr:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetlabel:'.budget__value',
		incomelabel: '.budget__income--value',
		expenselabel:'.budget__expenses--value',
		percentagelabel:'.budget__expenses--percentage',
		container:'.container'
	};

	return {
		getInput:function() {
			return {
				//properties
			type: document.querySelector(domstr.inputType).value,//will be inc+ or exp-
			description: document.querySelector(domstr.inputDscrp).value,
			value:parseFloat(document.querySelector(domstr.inputValue).value),
				//using parsefloat to convert  string value to numerical value.
		};
		},
		getdomstr:function(){
		return  domstr;
		},
		
		addingListItem:function(obj,type) {

		//Task:To add the element to the UI.

		//Creating HTML string with place holder text
		// for type(income and expenses) and calling using DOM.qSelector 
	
			var element_type=domstr.incomeContainer;
			if (type==='inc') {
			html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else if(type==='exp') {
				var element_type=domstr.expenseContainer;
			html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
		//Replace the placeholder text with some actual datas.
			var replaceplaceholder=html.replace('%id%',obj.id);
			var replaceplaceholder=replaceplaceholder.replace('%description%',obj.description);
			var replaceplaceholder=replaceplaceholder.replace('%value',obj.value);

		//Insert the html into DOM usinf DOM.qS
			document.querySelector(element_type).insertAdjacentHTML('beforeend',replaceplaceholder);

		},

		 displaybudgetvalue:function(obj){//method
			 //The returned names in getbudget() are used here
			document.querySelector(domstr.budgetlabel).textContent=obj.budget;
			document.querySelector(domstr.incomelabel).textContent=obj.totalincome;
			document.querySelector(domstr.expenselabel).textContent=obj.totalexpenses;
			document.querySelector(domstr.percentagelabel).textContent=obj.totalpercentage;			
		 },
		//clearing the fields
		clearingfields:function(){//method

			var fields=document.querySelectorAll(domstr.inputDscrp+' , '+ domstr.inputValue);//A lst is returned
						/////
			var fieldsarray=Array.prototype.slice.call(fields);//Converting a "fields"   list to an array
			fieldsarray.forEach(function(currentvalue,indexnum,array){
				currentvalue.value="";//review lecture 84
			});

			fieldsarray[0].focus();
			//callback fn applied to each fn in array.

			// (domstr.inputValue).value = "";
			// (domstr.inputValue).value = "";
		},

		deletinglistitem:function(removeID){//method
			//we have to remove child.
			var qw=document.getElementById(removeID);	
				qw.parentNode.removeChild(qw);
		}

};

})();

//Global app controller
var appc=(function(bcctrl,uictrl) 
{
	var setupeventlisteners=function(){

		var dom_st=uic.getdomstr();
		document.querySelector(dom_st.inputDomStr).addEventListener('click',ctrlAddItem);
		//Keypress event.
		document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
			}
		 });
		   document.querySelector(dom_st.container).addEventListener('click', ctrlDeleteItem);//Creating ctrlDeleteItem function
		
	   };
	
	   
		var updatebudget=function(){//When I call updatebudget,calculatebudget() funcn is run.
			                        //getBudget() returns output

		//calculate the budget.
		bcctrl.calculatebudget();
	
		//console.log('It works');

	   //returning budget:- updateBudget();
		var budget=bcctrl.getBudget();console.log(budget);//prints out the budget details.
		uictrl.displaybudgetvalue(budget);  //prints out the budget details.
		};

	var ctrlAddItem=function()
	{
		//1.Reading input data.
		//var input, newItem;

		var input=uictrl.getInput();
		/////console.log(input);//////////////////////
			if(input.description!=="" && !isNaN(input.value) && input.value > 0) 
		{	
    		//2.add item to budget controller.
			var newItem=bcctrl.addItem(input.type,input.description,input.value);
	
		////console.log(newItem);///////////////////////
			//3.add item to ui.
			uictrl.addingListItem(newItem,input.type);
			//4.Clear the foelds.
			uictrl.clearingfields();
	
			//5.calculate the budget.
			updatebudget();//written below.
			//console.log('It works');

			
		}	
	};
	var ctrlDeleteItem=function(event){
		//move those many steps(bubbling)to reach to the parent node
		var itemID,splitID,type,ID;
		 itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			 splitID=itemID.split('-');
			 type=splitID[0];
			 ID=parseInt(splitID[1]);
			//1.Deleting the item from the data structure.
			bcctrl.deleteItem(type,ID);


			//2.Delete item from UI.
			uictrl.deletinglistitem(itemID);



			//Update and show the new budget.
			updatebudget();
		}
	}
     //display the budget to ui.	
	

	
	return {
	init:function() {
		console.log('Application started');
		setupeventlisteners();
	}
	
	}
})(buct,uic);

appc.init();