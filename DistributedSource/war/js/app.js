$.fn.serializeObject=function(){
	var o={};
	var a=this.serializeArray();
	$.each(a, function(){
		if(o[this.name]!== undefined){
			if(!o[this.name].push){
				o[this.name]=[o[this.name]];
			}
			o[this.name].push(this.value||'');
		}
		else{
			o[this.name]=this.value||'';
		}
	});
	return o;
};
	
	var Person=Backbone.Model.extend({
		urlRoot:'/person',
	});
	var DriveItem=Backbone.Model.extend({
		urlRoot:'/getDriveData',
	});
	var EmailData=Backbone.Model.extend({
		urlRoot:'/sendEmail',
	});
	var PersonsList=Backbone.Collection.extend({
	   	url:"/person"
	});
	var DriveItemsList=Backbone.Collection.extend({
	   	url:"/getDriveData"
	});
	var EmailDataList=Backbone.Model.extend({
		url:'/sendEmail',
	}); 	
	   	
   	var personsList=new PersonsList();
   	var driveItemsList=new DriveItemsList();
   	
   	var PageView=Backbone.View.extend({
   		el: '#page-container',
   		events:{
   			'click #add-new-person': 'addPersonView',
   			'click #cancel-contact-button': 'hidePersonView',
   		},
   		render: function(temp){
   			var that=this;
			var template=_.template($(temp).html(),{});
			that.$el.html(template);
   		},
   		addPersonView: function(ev){
   			ev.preventDefault();
   			$('#customer_info').unbind();
	   		personForm= new PersonFormView();
	   		personForm.render();
   		},
   		hidePersonView: function(ev){
   			$('#customer_info').html('<img style="position:absolute;top:50%;right:25%;display:block;" src="img/empty_contact.png">');
   			$("#cancel-contact").css("display","none");
   		},
   		
   	});
   	
   	var PersonsView= Backbone.View.extend({
   		model:personsList,
   		el:'#person-listContainer',
   		events:{
   			'click .delete-person': 'deletePerson',
   			'click .show-person': 'showPerson'
   		},
   		initialize:function(){
   			this.model.on('add', this.render, this);
   			this.model.on('remove', this.render, this);
   			personsList.fetch({
   				success: function(persons){
   					personsList=persons;
   				},
   				error: function(data){
   					console.log('no person yet');
   				}
   			});
   		},
   		render: function(){
   			var that=this;
			var template=_.template($('#person-list-template').html(),{personsList: personsList.models});
			that.$el.html(template);
   		},
   		deletePerson: function(ev){
   			ev.preventDefault();
   			var modelID=ev.currentTarget.id;
   			var person=personsList.get(modelID);
   			if(person!==undefined)
   			{
   				person.destroy({success: function(data)
   				 {
   	   				console.log(data);
   		   			personsList.remove(person);
   	   			 }
   	   			});
   			}
   			else
   			{
		   		personsList.remove(person);
   			}
   			
   		},
   		showPerson: function(ev)
   		{
   			ev.preventDefault();
   			var id=ev.currentTarget.id;
   			var person=personsList.get(id);
   			$("#person_col3_holder").unbind();
   			$("#customer_info").unbind();
   			var personDetailView=new PersonDetailView(person);
   			personDetailView.render();
   			console.log(person.get('docsList'));
   			var personCol3View=new PersonCol3View(person);
   			personCol3View.render();
   		}
   	});
   	
   	var PersonCol3View=Backbone.View.extend({
   		model: new Person(),
   		el:'#person_col3_holder',
   		initialize:function(person){
   			this.model=person;
   			this.model.on('change', this.render, this);
   		},
   		events:{
   			'click #documents-holder': 'showDocumentHolder',
   			'click #tasks-holder': 'showTasksHolder',
   			'click #history-holder': 'showHistoryHolder',
   			'click #deals-holder': 'showDealsHolder',
   			'click #accounts-holder': 'showAccountsHolder',
   			'click #custom-holder': 'showCustomHolder',
   			'click #import-document': 'openImportModal',
   			'click .delete-doc': 'deleteDoc'
   		},
   		render: function(){
   			console.log(this.model);
   			this.el;
   			var that=this;
   			console.log(this.model.get('docsList'));
   			var template=_.template($('#person-col3-template').html(),{docsList: this.model.get('docsList')});
				that.$el.html(template);
   		},
   		showDocumentHolder: function(){
   			$('#import-document').removeAttr("style");
   		},
   		showTasksHolder:function(){
   			$('#import-document').css("display","none");
   		},
   		showHistoryHolder: function(){
   			$('#import-document').css("display","none");
   		},
   		showDealsHolder: function(){
   			$('#import-document').css("display","none");
   		},
   		showAccountsHolder: function(){
   			$('#import-document').css("display","none");
   		},
   		showCustomHolder: function(){
   			$('#import-document').css("display","none");
   		},
   		openImportModal: function(){
   			var importModalView=new ImportModalView(this.model);
   			importModalView.render();
   		},
   		deleteDoc:function(ev){
   			id=ev.currentTarget.id
   			docs=this.model.get('docsList');
   			docs.splice(id,1);
   			this.model.set({docsList: docs});
   			this.model.save({},{success: function(data){
   				personsList.add(this.model);
   			}
   			});
   			this.render();
   		}
   	});
   	var PersonDetailView=Backbone.View.extend({
   			model: new Person(),
	   		el: '#customer_info',
	   		render: function(){
	   			var that=this;
	   			var template=_.template($('#person-detail-template').html(),{person: this.model});
					that.$el.html(template);
	   		},
	   		initialize:function(person){
	   			this.model=person;
	   			this.model.on('change', this.render, this);
	   		},
	   		events: {
	   			'click .edit-person-btn': 'editPerson',
	   			'click .save-person-btn': 'savePerson',
	   			'click .delete-person-btn': 'deletePerson',
	   			'click .send-email': 'composeMail'
	   		},
	   		editPerson: function(ev){
	   			ev.preventDefault();
	   			this.$('.form-info-field').attr('contenteditable', true).css('border-color','aqua');
	   			
	   		},
	   		savePerson: function(ev){
	   			ev.preventDefault();
	   			var modelID=ev.currentTarget.id;
	   			var person=personsList.get(modelID);
	   			person.set({
	   				id: modelID,
	   				name: $('#static-name').text().trim(), 
	   				jobTitle: $('#static-jobTitle').text().trim(),
	   	   			company: $('#static-company').text().trim(),
	   	   			source: $('#static-source').text().trim(),
	   	   			phone: $('#static-phone').text().trim(),
	   	   			email: $('#static-email').text().trim(),
	   	   			social: $('#static-social').text().trim(),
	   	   			website: $('#static-website').text().trim(),
	   	   			street: $('#static-street').text().trim(),
	   	   			city: $('#static-city').text().trim(),
	   	   			state: $('#static-state').text().trim(),
	   	   			country: $('#static-country').text().trim(),
	   	   			zip: $('#static-zip').text().trim()
	   			});
	   			this.undelegateEvents();
	   			this.$el.removeData().unbind();
	   			person.save({},{success: function(data){
	   				console.log(data);
	   				personsList.add(person);
	   				var personDetailView=new PersonDetailView(person);
	   	   			personDetailView.render();
	   				}
	   			});
	   		},
	   		deletePerson: function(ev){
	   			ev.preventDefault();
	   			var modelID=ev.currentTarget.id;
	   			var person=personsList.get(modelID);
	   			if(person!==undefined)
   				{
	   				this.undelegateEvents();
	   	   			this.$el.removeData().unbind();
	   				person.destroy({success: function(data){
	   					personsList.remove(person);
	   				}
	   				});
	   				this.$el.html('');
   				}
	   			
	   		},
	   		composeMail: function(ev){
	   			var person=personsList.get(ev.currentTarget.id);
	   			$.ajax("loggedInData", {
	   		       type: "GET",
	   		       dataType: "json",
	   		       success: function(loginData) {
	   		    	   var email=loginData.email;
	   		    	   person.set({from: email})
	   		    	console.log(person);
		   			var sendMailView= new SendMailView();
		   			sendMailView.render(person, '#compose-mail-template');
		   			$('#send-email-modal-header').html('Compose Email');
		   			$('#send-email-modal').modal('show');
	   		       },
	   		       error: function() {
	   		         console.log('plaese login');
	   		       }
	   		     });
	   		}
	   	});
   			
	var DriveItemView=Backbone.View.extend({
		model:new Person(),
		el:'#send-email-modal-content',
		events:{
			'click .drive-doc-check':'checkBoxSelection',
			'click .docs-import-btn':'importDocs'
		},
		initialize: function(person){
			this.model=person;
		},
		render: function(){
   			var that=this;
   			driveItemsList=new DriveItemsList();
   			driveItemsList.fetch({
   				success: function(driveItems){
   					driveItemsList=driveItems;
   					console.log(driveItemsList);
					this.template=_.template($('#drive-items-template').html(),{driveItemsList: driveItemsList.models});
					that.$el.html(template);
					$('#send-email-modal').modal('show');
   				},
   				error: function(data){
   					if(confirm("You are not logged in please login using google")){
   						window.location.assign("https://accounts.google.com/o/oauth2/auth?redirect_uri=http://distributed-source.appspot.com/oauth2call&response_type=code&client_id=267273999336-2qvi53a7ql3jndnsupo15htbmncfme3m.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/drive+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&approval_prompt=auto&access_type=online");
   					}
   				}
   			});
   		},
   		checkBoxSelection: function(ev){
   			$checkbox = $('.drive-doc-check');
   			    var chkArray = [];
   			    chkArray = $.map($checkbox, function(el){
   			        if(el.checked) { return el.id };
   			    });
   			    console.log(chkArray);
   			 return chkArray;
   		},
   		importDocs:function(ev){
   			this.undelegateEvents();
   			this.$el.removeData().unbind();
   			$checkbox = $('.drive-doc-check');
			    var chkArray = [];
			    chkArray = $.map($checkbox, function(el){
			        if(el.checked) { 
			        	return driveItemsList.get(el.id).toJSON();
			        };
			    });
			    this.model.set({docsList: chkArray});
			    this.model.save({},{success:function(data){
			    	personsList.add(this.model);
			    	$('#send-email-modal').modal('hide');
			    },
			    error: function(data){
			    	$('#send-email-modal').modal('hide');
			    }
			    });
   		}
	});
	var ImportModalView=Backbone.View.extend({
		el:'#send-email-modal-content',
		model:new Person(),
		initialize:function(person){
			this.model=person;
		},
		events:{
			'click #idImportGoogle-docs': 'importGoogleFiles'
		},
		render: function(){
   			var that=this;
   			var template=_.template($('#import-Modal').html(),{});
				that.$el.html(template);
				$('#send-email-modal').modal('show');
   		},
   		importGoogleFiles: function(){
   			this.undelegateEvents();
   			this.$el.removeData().unbind();
   			$('#send-email-modal').modal('hide');
   			var driveItemView=new DriveItemView(this.model);
   			driveItemView.render();
   		}
	});
	
	   	var PersonFormView=Backbone.View.extend({
	   		el: '#customer_info',
	   		initialize: function(){
	   			$("#cancel-contact").removeAttr("style");
	   		},
	   		render: function(){
	   			var that=this;
	   			var template=_.template($('#person-detailForm-template').html(),{});
					that.$el.html(template);
	   		},
	   		events:{
	   			'submit #person-form': 'savePerson',
	   			'click #cancel-contact-button': 'cancelContact'
	   		},
	   		savePerson: function(ev){
	   			ev.preventDefault();
	   			var personDetails=$(ev.currentTarget).serializeObject();
	   			personDetails['docsList']=[];
	   			var person=new Person();
	   			this.undelegateEvents();
				this.$el.removeData().unbind();
	   			person.save(personDetails, {
	   				success:function(data){
	   					console.log(data);
	   					personsList.add(person);
	   					var personFormView=new PersonFormView();
	   					personFormView.render();
	   				},
	   				error: function(){
	   					alert('not saved');
	   					var personFormView=new PersonFormView();
	   					personFormView.render();
	   				}
	   			});
	   			this.$el.unbind();
	   			this.render();
	   		}
	   	});
	   	
	   	
	   	var SendMailView=Backbone.View.extend({
	   		model:new Person(),
	   		el: '#send-email-modal',
	   		events:{
	   			'submit form':'sendEmail'
	   		},
	   		render: function(person, temp){
	   			var that=this;
	   			console.log(this.model);
	   			var template=_.template($(temp).html(),{person: this.model});
	   			that.$el.html(template);
	   		},
	   		sendEmail: function(ev){
	   			ev.preventDefault();
	   			var sendData={
	   				from:$('#email-sender').val(),
	   				to:$('#email-recipient').val(),
	   				subject:$('#email-subject').val(),
	   				category:$('#email-category').val(),
	   				content:$('#email-content').html()
	   			};
	   			var emailData=new EmailData();
	   			var that=this;
	   			emailData.save(sendData, {success: function(reponse){
	   				that.undelegateEvents();
	   				$('#send-email-modal').modal('hide');
	   				emailData.destroy();
	   			}
	   			});
	   		}
	   	});	
	   	
		var Router=Backbone.Router.extend({
			initialize: function(){
				
			},
		    routes: {
		        ""			: "home",
		        "inbox"		: "inbox",
		        "contacts"	: "contacts",
		        "tasks"		: "tasks",
		        "deals"		: "deals",
		        "accounts"	: "accounts",
		        "templates"	: "templates",
		        "reports"	: "reports"
		    },
		    home: function(){
		    	$.ajax("loggedInData", {
		   		       type: "GET",
		   		       dataType: "json",
		   		       success: function(loginData) {
		   		    	   if(loginData.email!=null){
		   		    		window.location.assign("/#/inbox");
		   		    	   }
		   		    	   else{
		   		    		var sendMailView= new SendMailView();
				   			$('#signIn').modal('show');
			   		         console.log('plaese login');
		   		    	   }
		   		    	
		   		       },
		   		       error: function() {
		   		    	var sendMailView= new SendMailView();
			   			$('#signIn').modal('show');
		   		         console.log('plaese login');
		   		       }
		   		     });
	   			
		    },
		    inbox: function(){
		    	var pageView=new PageView();
		    	pageView.render('#inbox-template');
		    	$('#navgationList').children().removeClass('active');
	 			$('#inbox_tab').addClass('active');
 				$('#joyRideTipContent').joyride({
 					autoStart : true,
 					
 					modal:true,
 					expose: true
 				});
		    },
		    contacts: function(){
		    	var pageView=new PageView();
		    		  pageView.render('#contacts-template');
		 			 $('#navgationList').children().removeClass('active');
		 			 $('#contacts_tab').addClass('active');
			 		 var personView=new PersonsView();
					 personView.render();
		 			 $("#cancel-contact").css("display","none");
		    },
		    deals: function(){
		    	var pageView=new PageView();
		    	pageView.render('#deals-template');
		    },
		    tasks: function(){
		    	var pageView=new PageView();
		    	pageView.render('#tasks-template');
	 			$('#navgationList').children().removeClass('active');
	 			$('#tasks_tab').addClass('active');
		    },
		    accounts: function(){
		    	var pageView=new PageView();
		    	pageView.render('#accounts-template');
		    	$('#navgationList').children().removeClass('active');
		    	$('#accounts_tab').addClass('active');
		 		$("#cancel-contact").css("display","none");
		    },
		    templates: function(){
		    	var pageView=new PageView();
		    	pageView.render('#templates-template');
		    	$('#navgationList').children().removeClass('active');
		    	$('#templates_tab').addClass('active');
		    },
		    reports: function(){
		    	var pageView=new PageView();
		    	pageView.render('#reports-template');
		    	$('#navgationList').children().removeClass('active');
		    	$('#reports_tab').addClass('active');
		    }
		});
	   	$(document).ready(function(){
	   		
	   		var router=new Router();
		   	Backbone.history.start();
   });