jQuery(document).ready(function($){
	// Progress Bar js
	
	$(".progress-bar").each(function(){
		if ($(this).attr('data-percent') === '0'){
			$(this).addClass('zero')
		}
	})
		$(".progress-bar").loading();
		$(".progress-bar.zero").each(function(){
				$(this).find('span').empty()
				$(this).find('div span').text('0%')
		})
});
