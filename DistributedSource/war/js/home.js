$(document).ready(function(){
	
	$('#lead_add_company').click(function(event){
		$('#lead_add_company').toggle();
		$("#lead_add_company_input").removeAttr("style");
		event.preventDefault();
	});
	$('#delete_lead_Company').click( function(){
		$('#lead_add_company_input').css("display","none");
		$("#lead_add_company").removeAttr("style");
	});
	$('#import-document-button').click(function(){
		$('#idImportGoogleContacts').css("display","");
	});
	
	$('#import-contact-button').click(function(){
		$('#idImportGoogleContacts').css("display","");
	});
	$('#import-leads-button').click(function(){
		$('#idImportGoogleContacts').css("display","none");
	});
	$('#export-all-button').click(function(){
		$('#deleteAll-alert').css("display","none");
		$('#reportDownload-alert').css("display","none");
		$('#exportAll-alert').css("display","");
	});
	$('#delete-all-button').click(function(){
		$('#exportAll-alert').css("display","none");
		$('#reportDownload-alert').css("display","none");
		$('#deleteAll-alert').css("display","");
	});
	$('#report-download-link').click(function(){
		$('#exportAll-alert').css("display","none");
		$('#deleteAll-alert').css("display","none");
		$('#reportDownload-alert').css("display","");
	});
	
	function format(value) {
	    var originalOption = value.element;
	    return "<span class='"  + $(originalOption).data('value') + "'></span>" + value.text;
	}
	$('#tasks-bulk-selector').select2({
	    allowClear: true,
	    formatResult: format,
	    formatSelection: format,
	    escapeMarkup: function(m) { return m; }
	});
	
	$('#deals-bulk-selector').select2({
	    allowClear: true,
	    formatResult: format,
	    formatSelection: format,
	    escapeMarkup: function(m) { return m; }
	});
	
	$('#deals-selector').select2({
	    allowClear: true,
	});
	$('#accounts-selector').select2({
	    allowClear: true,
	});
	$('#accounts-bulk-selector').select2({
	    allowClear: true,
	    formatResult: format,
	    formatSelection: format,
	    escapeMarkup: function(m) { return m; }
	});
	$('.slider_holder').click(function(e){
		if($('.sliderVal').val()=='yes')
		{
			$('.sliderVal').val('no');
			$('.slider_switch').css({left: "5px"});
			$('.slider_on').css({display:"none",});
			$('.slider_off').css({left: "3px", "padding-right": "12px"});
		}
		else
		{
			$('.sliderVal').val('yes');
			$('.slider_switch').css({left: ""});
			$('.slider_on').css({display:"",});
			$('.slider_off').css({left: ""});
		}
	});
});
