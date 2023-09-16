jQuery(document).ready(function($){
//  cropper source https://medium.com/geekculture/implement-cropping-feature-on-your-website-in-under-10-min-cropper-js-46b90d860748
var cropper = null
try {
		const imagebox = document.getElementById('recom_survey_logo') // crop image container
		const crop_btn = document.getElementById('crop-btn') // button which actually crop image
		const input = document.getElementById('uploadlogo') // input which takes image

		input.addEventListener('change', ()=>{
			jQuery('.upload_logo_popup').fadeOut(); // where we click to select image
			modalShow(false);
			const img_data = input.files[0] // uploaded image
			const url = URL.createObjectURL(img_data) 
			imagebox.innerHTML = `<img src="${url}" id="image">` //uploaded image shown in cropper container
			const image = document.getElementById('image') // after crop image

			document.getElementById('customheight').style.display = 'block'
			document.getElementById('crop-btn').style.display = 'inline-block'
			document.getElementById('confirm-btn').style.display = 'none'

			cropper = new Cropper(image, {		
				autoCropArea: 1,
				viewMode: 1,
				scalable: false,
				zoomable: false,
				minCropBoxWidth: 100,
				minCropBoxHeight: 100,
				})

		crop_btn.addEventListener('click', ()=>{

			
			cropper.getCroppedCanvas().toBlob((blob)=>{
				
				let fileInputElement = document.getElementById('uploadlogo');
				let file = new File([blob], img_data.name,{type:"image/*", lastModified:new Date().getTime()});
				let container = new DataTransfer();
				container.items.add(file);
				fileInputElement.files = container.files;
	
				$('#recom_survey_logo').addClass('img-cropped')
			
				document.getElementById('crop-btn').style.display = 'none'
				document.getElementById('confirm-btn').style.display = 'inline-block'
				imagebox.innerHTML = `<img class="result_img" src="${URL.createObjectURL($('#uploadlogo')[0].files[0])}">`
				});
						});
		});	
	}
	catch(err) {}

	// $('#uploadlogo').change(function() {
		// 	var file = $(this)[0].files[0].name;
		// 	var filesrc = $(this).closest('form').prev('.upload_logo_wrp').find('.uploadimg img');
		// 	readURL(this,filesrc);
		// 	readURL(this,'#recom_survey_logo img');
		// 	$(this).closest('form').prev('.upload_logo_wrp').find('.uploadimgname').html('<p>'+jQuery('.uploadlogoimgs').attr('src')+'</p>');
		// 	jQuery('.upload_logo_popup').fadeOut();
		// 	jQuery('.recomm_survey_color_popup').fadeIn();
		// });

	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		// 	$(".speech").hide()
		// 	console.log("iOS");
		// }
		// else{
		// 	console.log("not ios")
		// }
		
		// if(/(Mac|iPhone|iPod|iPad)/i.test(userAgent) && !window.MSStream) {
		// 	console.log("mac")
	// }

	    $(document).on('click','#confirm-btn',function() {
        cropper.reset()
        cropper.clear()
       
    });
	
	if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
		console.log("speech recognition API supported");
	} 
	else{
		$("#speech").prop('disabled',true);
		console.log("speech recognition API not supported")
	}

	$('.main_response .myans p').each(function(){
		if ($(this).text() == ''){
			$(this).closest('.lable-wrap').hide()
		}
	})

	$('.myans li').each(function(){
		if ($(this).text() == ''){
			$(this).closest('.myans').hide()
		}
	})

	jQuery('#shwfiles div img').each(function(i){
		if($(this).attr("src").substr(-4).toLowerCase().match(/\.(xls|xlsx)/g)){
			$(this).attr('src',window.location.origin+'/static/images/theme/excel-img.png')
		}
		else if($(this).attr("src").substr(-4).toLowerCase().match(/\.(pdf)/g)){
			$(this).attr('src',window.location.origin+'/static/images/theme/pdf-img.png')
		}
		else if($(this).attr("src").substr(-4).toLowerCase().match(/\.(zip|rar)/g)){
			$(this).attr('src',window.location.origin+'/static/images/theme/zip_img.jpg')
		}
		else if($(this).attr("src").substr(-4).toLowerCase().match(/\.(txt|odt|html|rtf)/g)){
			$(this).attr('src',window.location.origin+'/static/images/theme/txt_img.jpg')
		}
		else if($(this).attr("src").substr(-4).toLowerCase().match(/\.(jpg|png|gif|jpeg|svg)/g)){
			
		}
		else{
			$(this).attr('src',window.location.origin+'/static/images/theme/doc_img.png')
		}
	})

	$(".answer_block").each(function(){
		if($(this).children().length == 1){
			$(this).hide()
			$(this).prev('h5').hide()
		}
	})

	$(".grp-name").each(function(){
		if($(this).next().children().length == 0){
			$(this).hide()
			
		}
	})
	
	$('form input').keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});

	jQuery('.frmsucc_popup .closepoup').on('click',function(){
		jQuery('.frmsucc_popup').fadeOut();
		modalShow(false);
	});

	$(document).on('click', '.titlle p', function(){
		jQuery(this).replaceWith('');
	});

	$(document).on('click', '.company p', function(){
		jQuery(this).replaceWith('');
	});

	$(document).on('focusout', '.titlle', function(){
		if (jQuery(this).text() == ""){
			if (jQuery(this).hasClass("note_heading_new")){
				jQuery(this).append('<p class="placeholder_text_title">Enter note heading here</p>');
			}
			else if (jQuery(this).hasClass("note_comments_new")){
				jQuery(this).append('<p class="placeholder_text_title">Enter note comment here</p>');
			}
			else{
				jQuery(this).append('<p class="placeholder_text_title">Enter Title here</p>');
			}
		}		
	});

	$(document).on('focusout', '.company', function(){
			if (jQuery(this).text() == ""){
			jQuery(this).append('<p class="placeholder_text_comp">Company Name</p>');
		}
	});

	
	// note js
	$(document).on("focusout",".note_heading_new", function(){
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		id = $('#reportid').val();
		url = window.location.origin + "/survey/rpt-head/"
		var data = new FormData();     
		data.append('reportid', id);

		if (jQuery(this).find('p').length){
			h = ""
		}
		else{
			h = jQuery(this).html()
		}
		
		data.append('heading', h);
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});	
	});

	$(document).on("focusout",".note_comments_new", function(){
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		id = $('#reportid').val();
		url = window.location.origin + "/survey/rpt-head/"
		var data = new FormData();     
		data.append('reportid', id);
		
		if (jQuery(this).find('p').length){
			c = ""
		}
		else{
			c = jQuery(this).html()
			console.log(c)
		}

			data.append('comment', c);
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});	
	});

	$(document).on('click', '.note_heading p', function(){	
		jQuery(this).replaceWith(' ');
	});

	$(document).on('click', '.note_comments p', function(){
		jQuery(this).replaceWith('');
	});

	jQuery('.survey_whtnxt_popup .closepoup').on('click',function(){
		jQuery('.survey_whtnxt_popup').fadeOut();
		modalShow(false);
	});


	// jQuery for mcustomscrollbar
		jQuery('.cmn_sitepopup').each(function(){
			// get hidden element actual innerHeight
			var surveypopupheight = jQuery(this).find('.cmn_site_inn_popup').actual('height');
				// surveypopupheight = surveypopupheight/2;
			jQuery(this).find('.cmn_sitepopup_scroll').mCustomScrollbar({
				setHeight: surveypopupheight,

			});
		});

	// Create Survey jQuery
		function getCookie(c_name)
		{
				if (document.cookie.length > 0)
				{
					c_start = document.cookie.indexOf(c_name + "=");
					if (c_start != -1)
					{
						c_start = c_start + c_name.length + 1;
						c_end = document.cookie.indexOf(";", c_start);
						if (c_end == -1) c_end = document.cookie.length;
						return unescape(document.cookie.substring(c_start,c_end));
					}
				}
			return "";
		}

	// Create Survey jQuery
		jQuery('.createsurvey_dashbox .scratch_survey').on('click',function(){
				jQuery('.create_survay_popup').fadeIn();
		});

		jQuery('.create_survay_popup .closepoup').on('click',function(){
			jQuery('.create_survay_popup').fadeOut();
		});

		jQuery('.createsurvey_dashbox .default_survey').on('click',function(){			
				jQuery('.default_survey_templ_popup').fadeIn();		
		});

		jQuery('.copy_survey').on('click',function(){
			jQuery('#copypopup').fadeIn();			
		});

		jQuery('#copypopup .closepoup').on('click',function(){
			jQuery('#copypopup').fadeOut();
		});

		jQuery('.addHeadings').on('click',function(){	
			if($(this).parent().parent().find('i').hasClass('confstar')){
				id = jQuery(this).parent().attr('data')				
				jQuery('#que_id').val(id)
				jQuery('#que_no').val('confquestion')
				jQuery('#addHeadings').find('input').attr('placeholder', 'Heading')
				$('#addHeadings').find('input').val($('h3.conf_heaing').text())
			}
			else{
				heading = jQuery(this).parent().parent().parent().find('.logo').text()
				if (!heading){
					heading = jQuery(this).parent().parent().parent().prev().find('.main_heaing').text()
				}
				id = jQuery(this).parent().attr('data')
				jQuery('#que_id').val(id)				
				try {
					num = jQuery(this).closest('.questionare_block').attr('id').replace('questionare_block','')
					jQuery('#que_no').val(num)
				}
				catch(err) {
					num = jQuery(this).closest('.head_part').attr('id').replace('heading', '')	  
					jQuery('#que_no').val(num)
				}
				if (num != 1){
				jQuery('#addHeadings').find('input').attr('placeholder', 'Heading')
				}
				else{
					jQuery('#addHeadings').find('input').attr('placeholder', 'Eg: Strengths')
				}

				$('#addHeadings').find('input').val(heading)
			}

		});

		jQuery('.addComments').on('click',function(){	
			if($(this).parent().parent().find('i').hasClass('confstar')){
				id = jQuery(this).parent().attr('data')
				jQuery('#que_id').val(id)
				jQuery('#que_no').val('confquestion')

				$('#sumarytext').find('textarea').val($('.conf-comment:first-child').text())
			}
			else{
			comment = jQuery(this).parent().parent().parent().next().find('h6').text()
			if (!comment){
				comment = jQuery(this).parent().parent().parent().prev().find('.main-comment').text()
			}
			id = jQuery(this).parent().attr('id')
			jQuery('#que_id').val(id)
			try {
				num = jQuery(this).closest('.questionare_block').attr('id').replace('questionare_block','')
				jQuery('#que_no').val(num)
			}
			catch(err) {
				num = jQuery(this).closest('.head_part').attr('id').replace('heading', '')	  
				jQuery('#que_no').val(num)
			}	
			$('#sumarytext').find('textarea').val(comment)
			}
		});

		jQuery('#save_comment').on('click',function(){		
			user = $('#user_type').val()	
			que_comment = jQuery(this).parent().siblings().find('textarea').val();
			console.log(que_comment)
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			que_id = jQuery('#que_id').val()
			que_no = jQuery('#que_no').val()
			url = window.location.origin + "/survey/add-head/"+user
			var data = new FormData();     
			data.append('comment', que_comment);
			data.append('id', que_id);
			if(que_no == 'confquestion'){
				data.append('type', 'confque');
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url:  url,	
					data: data,				
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						jQuery('.conf-comment').text(que_comment);
						jQuery('#sumarytext').modal('hide');
						modalShow(false);
					}, 
					error: function(data) {
						console.log('comment not added')
					}
				});
			}	
			else{
				jQuery(this).parent().siblings().find('textarea').val('')
					
					$.ajax({
						method: "post",
						headers: {'X-CSRFToken': token},
						url:  url,	
						data: data,				
						processData: false,
						contentType: false,
						dataType: "json",
						success:function(data) {
							jQuery('.comment'+que_no).text(que_comment);
							jQuery('#sumarytext').modal('hide');
							modalShow(false);
						}, 
						error: function(data) {
							console.log('comment not added')
						}
					});
				}
		});

		jQuery('#heading').on('click',function(){	
			user = $('#user_type').val()		
			que_heading = jQuery(this).parent().siblings().find('input').val();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			que_id = jQuery('#que_id').val()
			que_no = jQuery('#que_no').val()
			url = window.location.origin + "/survey/add-head/"+user
			var data = new FormData();     
			data.append('head', que_heading);
			data.append('id', que_id);
			if(que_no == 'confquestion'){
				data.append('type', 'confque');
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url:  url,	
					data: data,				
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						jQuery('.conf_heaing').text(que_heading);
						jQuery('#addHeadings').modal('hide');
						modalShow(false);
					}, 
					error: function(data) {
						console.log('heading not added')
					}
				});
			}	
			else{
				jQuery(this).parent().siblings().find('input').val('')					
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url:  url,	
					data: data,				
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						jQuery('.que_heading'+que_no).text(que_heading);
						jQuery('#addHeadings').modal('hide');
						modalShow(false);
					}, 
					error: function(data) {
						console.log('heading not added')
					}
				});
			}
		});

		$('#savehead').on("click",(function(){
			sur_heading = jQuery(this).parent().siblings().find('input').val();
			sur_comment = jQuery(this).parent().siblings().find('textarea').val();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('head', sur_heading);
			data.append('reportid', id);
			data.append('comment', sur_comment);
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('#sur_head').modal('hide');
					$('#2 .surttl').html(sur_heading);
					$('#2 .surcomment').html(sur_comment);
				}, 
				error: function(data) {
					console.log('fail')
				}
			});
		}));

		$('#savesummaryhead').on("click",(function(){
			sur_heading = jQuery(this).parent().siblings().find('input').val();
			sur_comment = jQuery(this).parent().siblings().find('textarea').val();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('summhead', sur_heading);
			data.append('reportid', id);
			data.append('summcomment', sur_comment);
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('#summary_head').modal('hide');
					$('#2 .summary').html(sur_heading);
					$('#2 .summary-text').html(sur_comment);
				}, 
				error: function(data) {
					console.log('fail')
				}
			});
		}));

		$(document).on('click', '.inlineRadio3', function(){ 	
			$('.surveypreviewfrm').removeClass('all-responses')			 
			jQuery(this).closest('.dropdown-menu').removeClass('show');
			jQuery(this).closest('.dropdown-menu').css('display', 'none');
			jQuery('.individual_pop_up').show();
			modalShow(true);
			jQuery(this).closest('.dropdown-menu').stop();
		});

		$(document).on('click', '.inlineRadio4', function(){ 			
			jQuery(this).closest('.dropdown-menu').removeClass('show');
			jQuery(this).closest('.dropdown-menu').css('display', 'none');
			jQuery(this).closest('.dropdown-menu').stop();
			jQuery('.questionreviewfrm').empty();
			jQuery('#que_sum').val(1);
			jQuery('.question_summary_pop_up').show();
			modalShow(true);

			var options = ''
			$('#que_sum option').each(function(index, value) {
				if ($(this).hasClass('cq')){
					shortenque = ($(this).text().length > 80) ? $(this).text().substr(0, 80) + '...': shortenque = $(this).text();
					options= options+('<option class="cq" value="'+$(this).val()+'">'+shortenque+'</option>')
				}
				else{
				shortenque = ($(this).text().length > 80) ? $(this).text().substr(0, 80) + '...': shortenque = $(this).text();
				options= options+('<option value="'+$(this).val()+'">'+shortenque+'</option>')
				}
			});
			$('#que_sum ').empty()
			$('#que_sum').append(options)
		});


		$(document).on('change', '#indi_rel', function(){ 
			$('#indi_relerr').hide()
			reltype = jQuery(this).val()
			id1 = $('#curr_survey_id').val();
			id2 = $('#survey_id').val();
			if (id1){
				id = id1
			}
			else if (id2){
				id = id2
			}
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			url = window.location.origin + "/survey/filter_response/"
			$.ajax({
				url:  url,	
				data: {'rel':reltype,'id':id},				
				dataType: "json",
				success:function(data) {
					$('#individual').empty()
					if(reltype == 0){
						$('#individual').append('<option value="1">Select participant</option><option value="0">All participants</option>')
					}
					else{
						$('#individual').append('<option value="1">Select participant</option>')
					}
					for (i in data['part']){	
					$('#individual').append('<option value="'+data["part"][i][0]+'">'+data["part"][i][7]+' '+data["part"][i][8]+'</option>')
					}
				}, 
				error: function(data) {
					console.log('something wrong')
				}
			});		
		
		});

		$(document).on('change', '#que_sum', function(){ 
			id1 = $('#curr_survey_id').val();
			id2 = $('#survey_id').val();
			if (id1){
				id = id1
			}
			else if (id2){
				id = id2
			}		
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			url = window.location.origin + "/survey/filter_response/";
			que_id = jQuery('#que_sum').val()
				if(que_id == '' || que_id == 1 ){
					$('#que_sumerr').show()	
				}		
				else{
					if(que_id == 0 ){
						data={'id':id, 'que':'allquestion'}
						$.ajax({
							url:  url,	
							data: data,	
							dataType: "json",			
							success:function(data) {						
								jQuery('.questionreviewfrm').empty();
									Object.keys(data).forEach(function(key,value) {
										var val = data[key];
										// jQuery('.questionreviewfrm').append('<div class="que_head_nd_com"> <div class="d-flex"> <h3 class="que_heading main_heaing">'+$("#"+que_id).closest(".questionare_block").find("h3").text()+'</h3> </div><div class="d-flex"> <h6 class="comment main-comment">'+$("#"+que_id).closest(".questionare_block").find("h6").text()+'</h6> </div></div><div class="custom_made_question mb-3"><div id="ques_block1" class=" mb-3"> <textarea class="form-control border border-dark" type="text" readonly="">'+key+'</textarea></div></div><div class="answer_block block'+value+'"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div></div></div>')
										jQuery('.questionreviewfrm').append('<div class="que_head_nd_com"> <div class="d-flex"></div><div class="d-flex"> </div></div><div class="custom_made_question mb-3"><div id="ques_block1" class=" mb-3"> <textarea class="form-control border border-dark" type="text" readonly="">'+key+'</textarea></div></div><div class="answer_block block'+value+'"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div></div></div>')
								
									for (i in val){
										numb = parseInt(i)+1
										ansobj = val[i]	
										participant = $(".myans[data*="+ansobj[0]+"]").next().eq(0).text()
										relation = $(".myans[data*="+ansobj[0]+"]").next().next().eq(0).text()								
										
										if(ansobj[7] != ""){
											if(participant == ''){
												part = $("#"+ansobj[6])
												if(part.length === 0){
													participant = (jQuery('[name="'+ansobj[6]+'"]:first').text().trim())
													relation = (jQuery('[name="'+ansobj[6]+'"]:first').next().text().trim())
													}
												else{
													relation = (part.find('.relation').text().trim())
													participant = (part.find('.fName').text().trim()+' '+part.find('.lName').text().trim())	
												}
												if(participant == ''){
													participant = $('.particular[data-id="'+ansobj[6]+'"]').first().text()
													relation = $('.particular[data-id="'+ansobj[6]+'"]').first().next().text()
												}
												jQuery('.questionreviewfrm .block'+value).append(' <div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"><div class="response myans" data="291"><p  type="text" >'+ansobj[7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label> </div>');
												console.log(jQuery('.questionreviewfrm .block'+value))
											}
											
											if($(".myans[data*="+ansobj[0]+"]").next().eq(0).text() != ''){				
											jQuery('.questionreviewfrm .block'+value).append(' <div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"><div class="response myans" data="291"><p  type="text" >'+ansobj[7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label> </div>');
											}
										}
									}

									if($('.response').text() === ''){
										alert('This Question has no responses.')
									}
								});
							}, 
							error: function(data) {
								alert('this Question has no responses.')						
							}
						});
					}
					else{
						$('#que_sumerr').hide()
						if(jQuery('#que_sum option:selected').hasClass('cq')) {
							data = {'cque':que_id,'id':id, }
						}
						else{
							data={'que':que_id,'id':id}
						}
						$.ajax({
							url:  url,	
							data: data,				
							dataType: "json",
							success:function(data) {						
								jQuery('.questionreviewfrm').empty();
								jQuery('.questionreviewfrm').append('<div class="que_head_nd_com"> <div class="d-flex"> </div><div class="d-flex"> </div></div><div class="custom_made_question mb-3"><div id="ques_block1" class=" mb-3"> <textarea class="form-control border border-dark" type="text" readonly="">'+jQuery('#que_sum').find(":selected").text()+'</textarea></div></div><div class="answer_block"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div></div></div>')
								for (i in data['res']){
									numb = parseInt(i)+1
									ansobj = data['res'][i]		
									participant = $(".myans[data*="+ansobj[0]+"]").next().eq(0).text()
									relation = $(".myans[data*="+ansobj[0]+"]").next().next().eq(0).text()								
									if(ansobj[7] != ""){
										if(participant == ''){
											part = $("#"+ansobj[6])
											if(part.length === 0){
												participant = (jQuery('[name="'+ansobj[6]+'"]:first').text().trim())
												relation = (jQuery('[name="'+ansobj[6]+'"]:first').next().text().trim())
												}
											else{
												relation = (part.find('.relation').text().trim())
												participant = (part.find('.fName').text().trim()+' '+part.find('.lName').text().trim())	
											}
											if(participant == ''){
												participant = $('.particular[data-id="'+ansobj[6]+'"]').first().text()
												relation = $('.particular[data-id="'+ansobj[6]+'"]').first().next().text()
											}
											jQuery('.questionreviewfrm .answer_block').append(' <div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"><div class="response myans" data="291"><p  type="text" >'+ansobj[7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label> </div>');

										}
										
										if($(".myans[data*="+ansobj[0]+"]").next().eq(0).text() != ''){				
										jQuery('.questionreviewfrm .answer_block').append(' <div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"><div class="response myans" data="291"><p  type="text" >'+ansobj[7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label> </div>');
										}
									}
								}

									if($('.response').text() === ''){
										alert('This Question has no responses.')
									}
							}, 
							error: function(data) {
								alert('this Question has no responses.')						
							}
						});
					}
				}	
		});

		$(document).on('click', '#show_resp', function(){ 	
			id1 = $('#curr_survey_id').val();
			id2 = $('#survey_id').val();
			if (id1){
				id = id1
			}
			else if (id2){
				id = id2
			}	
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			url = window.location.origin + "/survey/filter_response/";
				parti = jQuery('#individual').val()
				rel = jQuery('#indi_rel').val()	
				if(parti == '' || parti == 1 ){
					$('.indiv_err').show()
					if(rel == '' || rel == 1 ){
						$('#indi_relerr').show()
					}
				}		
				else{
					$('.indiv_err').hide()
					$.ajax({
						url:  url,	
						data: {'par':parti,'id':id},				
						dataType: "json",
						success:function(data) {
							jQuery('.questionreviewfrm').empty();
							jQuery('.surveypreviewfrm').empty();
							if(jQuery('#indi_rel').find(":selected").text() == 'All Relationships'){
								relasn = data['rel']
							}
							else{
								relasn = jQuery('#indi_rel').find(":selected").text()
							}
							if (!relasn){
								relasn = 'All Relationships'
							}
							jQuery('.surveypreviewfrm').append('<div class="indi-wrap"><ul class="basic-info"><li><span>'+jQuery('#individual').find(":selected").text()+'</span></li><li><span>'+relasn+'</span></li></ul></div>')
							if(data['cres']){	
								$('.surveypreviewfrm').addClass('all-responses')						
								for (i in data['allque']){
									answ = ''
									numb = parseInt(i)+1
									for (res in data['res']){
										if(data['res'][res][5] == data['allque'][i][0]){
											for (part in data['part']){												
												if(data['res'][res][6] == data['part'][part][0]){
													participant = data['part'][part][7] +' '+ data['part'][part][8]//data['part'][part][4]
													rel = data['part'][part][9]
													relation = $('#indi_rel option[value='+rel+']').text()
													if(relation==''){
														relation = $('#'+rel)
													}



													
																																				
												}}	
											if(data['res'][res][7] != ''){											
												answ = answ+'<div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"> <div class="response myans" data="988"><p  type="text" >'+data['res'][res][7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label></div>'
											}
										}
									}
									if(data['allque'][i][14] == '' || data['allque'][i][14] == 'null' || data['allque'][i][14] == undefined){
										jQuery('.surveypreviewfrm').append('<div class= "questionare_block" id="questionare_block'+numb+'"> <div class="que_head_nd_com"> <h3 class="que_heading1 main_heaing"></h3> </div><div class="d-flex align-items-center justify-content-between"> <h4>'+data['allque'][i][6]+'</h4> </div></div><div class="answer_block"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div><div class="actions"> <div class="action">Actions</div></div></div>'+
									answ+'</div>');
									}
									else{
									jQuery('.surveypreviewfrm').append('<div class= "questionare_block" id="questionare_block'+numb+'"> <div class="que_head_nd_com"></div><div class="d-flex align-items-center justify-content-between"> <h4>'+data['allque'][i][6]+'</h4> </div></div><div class="answer_block"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div><div class="actions"> <div class="action">Actions</div></div></div>'+
									answ+'</div>');
									}
								}
								if(data['cres'] == 'null'){
									cansw = ''
									n =parseInt(data['allque'].length)+1
									try{
										head = data['cque'][0][7]|| ""
									comm = data['cque'][0][8] || ""
									jQuery('.surveypreviewfrm').append('<div class="questionare_block" id="questionare_block'+n+'"> <div class="que_head_nd_com"> </div><div class="d-flex align-items-center justify-content-between"> <h4>'+data['cque'][0][5]+'</h4><span style="color:#ff0000;"><i class="mdi mdi-star confstar"></i></span> </div></div><div class="answer_block"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div><div class="actions"> <div class="action">Actions</div></div></div>'+
										cansw+'</div>');
									}
									catch{
										console.log('no response')
									}	
								}
								else{
									cansw = ''
									for (i in data['cres']){										
										numb = parseInt(i)+1										
												for (part in data['part']){												
													if(data['cres'][i][6] == data['part'][part][0]){
														participant = data['part'][part][7] +' '+ data['part'][part][8]//data['part'][part][4]
														rel = data['part'][part][9]
														relation = $('#indi_rel option[value='+rel+']').text()
														if(relation==''){
															relation = $('#'+rel)
														}
																																							
												}}
												if(data['cres'][i][7] != ''){
													cansw = cansw+'<div class="lable-wrap"> <label class="main_response"> <input type="radio" name="a"> <div class="response myans" data="988"><p  type="text" >'+data['cres'][i][7]+'</p></div><div class="particular">'+participant+'</div><div class="relationship">'+relation+'</div></label></div>'
												}
										}
										n =parseInt(data['allque'].length)+1
								head = data['cque'][0][7] || ""
								comm = data['cque'][0][8] || ""
								jQuery('.surveypreviewfrm').append('<div class="questionare_block" id="questionare_block'+n+'"> <div class="que_head_nd_com"> </div><div class="d-flex align-items-center justify-content-between"> <h4>'+data['cque'][0][5]+'</h4><span style="color:#ff0000;"><i class="mdi mdi-star confstar"></i></span> </div></div><div class="answer_block"> <div class="wrap_cstm_head"> <div class="main _options"> <div class="response">Response</div><div class="particular">Participant Name</div><div class="relationship">Relationship</div></div><div class="actions"> <div class="action">Actions</div></div></div>'+
								cansw+'</div>');
								}								
								
							}
							else{								
								for (i in data['res']){
									numb = parseInt(i)+1
									ansobj = data['res'][i]	
									try {
										$('.individual_response'+ansobj[5]).empty()
										$('.individual_response'+ansobj[5]).append(ansobj[7])
										$('.individual_response'+ansobj[5]).parent().parent().find('.edit').attr('data', ansobj[0])
										$('.individual_response'+ansobj[5]).parent().parent().find('.delete').attr('data', ansobj[0])
										heading = $(".myans[data*="+ansobj[0]+"]").closest('.questionare_block').find('h3').text()
										comment = $(".myans[data*="+ansobj[0]+"]").closest('.questionare_block').find('h6').text()
										question = $(".myans[data*="+ansobj[0]+"]").closest('.questionare_block').find('h2').text()
										if (question == ''){
											question = data['allque'][i][6]	
											heading = data['allque'][i][14]	
											comment = data['allque'][i][15]	
											if (heading == null){
												heading = ''
											}
											if (comment == null){
												comment = ''
											}										
										}
										if(ansobj[7] != ""){
											jQuery('.surveypreviewfrm').append('<div class="que_head_nd_com"> <div class="d-flex"> <span class="custom_number_width"></span> </div><div class="d-flex"> <span class="custom_number_width"></span> </div></div><div class="custom_made_question mb-3"><div id="ques_block1" class=" mb-3"><span class="custom_number_width">Q'+numb+'</span><textarea class="form-control border border-dark" type="text" readonly="">'+question+'</textarea></div></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2">'+ansobj[7]+'</div></div>');
										}
									} catch (e) {
										$('.response').empty()
										console.log('err')
										alert('This participant has no responses.')
										return false;
									}
										}
										conf = $('#questionare_block0').find('h2').text()	
										heading =  $('#questionare_block0').find('h3').text()	
										comment =  $('#questionare_block0').find('h6').text()	
										if (conf == ''){
											try {
											conf = data['cque'][0][5]	
											heading = data['cque'][0][7]	
											comment = data['cque'][0][8]
											if (heading == null){
												heading = ''
											}
											if (comment == null){
												comment = ''
											}		
										}
										catch (e) {
											console.log('err')
										}									
										}									
										try {
											n =parseInt(data['res'].length)+1
											
											if(data['cans'] != 'null'){	
												if(data['cans'] != ""){
												jQuery('.surveypreviewfrm').append('<div class="que_head_nd_com"> <div class="d-flex"> <span class="custom_number_width"></span> </div><div class="d-flex"> <span class="custom_number_width"></span> </div></div><div class="custom_made_question mb-3"><div id="ques_block1" class=" mb-3"><span class="custom_number_width">Q'+n+'</span><div class="textarea_cstm_wrap"><textarea class="form-control border border-dark" type="text" readonly="">'+conf+'</textarea><span class="conf-icon"><i class="mdi mdi-star"></i></span></div></div></div>')
															
												jQuery('.surveypreviewfrm').append('<div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2">'+data['cans']+'</div></div>')
													}
												}
										}
										catch (e) {
											console.log('err')
										}
									}

									if($('.surveypreviewfrm .que_head_nd_com').text() === ''){
								alert('This participant has no responses.')
								jQuery('#indi_rel').val('1')
								jQuery('#individual').empty()
								$('#individual').append('<option value="">Select participant</option>')
								return false;
							}
							else{
							$('.individual_pop_up').hide();
							modalShow(false);
							jQuery('#indi_rel').val('1')
							jQuery('#individual').empty()
							$('#individual').append('<option value="">Select participant</option>')
							$('.individual_response_popup').modal('show');}								
							}, 
						error: function(data) {
							alert('This participant has no responses.')
							return false;

						}
					});	
			}
		// }				
		});


		jQuery('.default_survey_templ_popup .closepoup').on('click',function(){
			jQuery('.default_survey_templ_popup').fadeOut();
		});

		jQuery('.survey_format_wrp input').on('change',function(){
			var data = new FormData();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/add-paging/"
			id = $('#survay_id').val()
			data.append('surid', id);
			if(jQuery('#onequestattimecheck').is(':checked')) {
				jQuery('.checkbox_cmnwrp').addClass('checked');				
				data.append('val', 'onequeperpage');	
			} else {
				jQuery('.checkbox_cmnwrp').removeClass('checked');
				data.append('val', 'onepageallque');
			}
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url: url,	
				data: data,	
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {

					console.log('data')
				}, 
				error: function(data) {
					console.log('data')
				}
			});		
		});

		jQuery('.cmn_survey_radio_box label:first-child').addClass('checkedradio');
		jQuery('.cmn_survey_radio_box label:first-child input').attr('checked','checked');
		jQuery('.cmn_survey_radio_box input[type="radio"]').on('click',function(){
			jQuery(this).closest('.cmn_survey_radio_box').find('label').removeClass('checkedradio');
			jQuery(this).closest('label').addClass('checkedradio');
			jQuery(this).closest('.cmn_survey_radio_box').find('input').removeAttr('checked');
			jQuery(this).attr('checked','checked');
		});

		jQuery('.reminder_wrp a.sitebtn').on('click',function(e){
			jQuery('.reminder_details').fadeIn();
		});

		jQuery('.survery_markcompl_wrp a.sitebtn').on('click',function(e){
			jQuery('.survey_mark_comp_detail').fadeIn();
		});

		$(document).mouseup(function (e) {
		    var popup = $(".reminder_details");
		    if (!$('.reminder_wrp a.sitebtn').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
		        popup.fadeOut();
		    }
		    var popup1 = $(".survey_mark_comp_detail");
		    if (!$('.survery_markcompl_wrp a.sitebtn').is(e.target) && !popup1.is(e.target) && popup1.has(e.target).length == 0) {
		        popup1.fadeOut();
		    }
		});

		jQuery('#surveyname').focus(function () {
			jQuery('#sureynameerr').text('');
		});
			
		jQuery('#surveyname').focusout(function () {
	   		var surveyname = jQuery(this).val();
			if(surveyname == "" || surveyname == null) {
				jQuery('#sureynameerr').text('Please enter survey name');
			} else {
			 	jQuery('#sureynameerr').text('');
			}
         });

		jQuery('#surveycat').focusout(function () {
	   		var surveycat = jQuery(this).val();
			if(surveycat == "" || surveycat == null) {
				jQuery('#surveycaterr').text('Please select the Client');
			} else {
			 	jQuery('#surveycaterr').text('');
			}
         });

	// Create Survey Form Validation
		jQuery('#createsurveysub').on('click',function(){
	
			setTimeout(function(){
				if (jQuery('#ques_block_main > div > textarea').attr('data-type') == 'undefined'|| jQuery('#ques_block_main > div > textarea').attr('data-type') == null) {
					alert('Please add your questions')
				}
				else {
					jQuery('.createsuv_instr_popup').fadeIn();		  
					modalShow(true);		
				}
			}, 1000);
			
						
		});

// added by shivani
		jQuery('#sendsurvey').click(function(){
			jQuery('.confirmation').show();
		});

		jQuery('.stop').click(function(){
			jQuery('.showerror').show();
			jQuery('.modal-backdrop').hide();
		});
			

		jQuery('#showprog').click(function(){
			jQuery('#progbar').attr('checked', 'checked');
			jQuery(this).addClass('checked_div');
			jQuery('#hideprog').removeClass('checked_div');
		});

		jQuery('#hideprog').click(function(){
			jQuery('#progbar').removeAttr('checked');
			jQuery(this).addClass('checked_div');
			jQuery('#showprog').removeClass('checked_div');
		});

		
		$('#instructions').click(function(){
			$('#instruction').fadeIn();
		});

		$('#reminder').click(function(){
			$('.reminder_pop').fadeIn();
		});

		$('#donebtn').click(function(){
			if ($(".reminder_pop ul label input:checked")) {
				$('.reminder_pop').fadeOut();
			  }
			else {
				console.log('jjj')
			}
		});

		$('#submit_survey').click(function(){			
				var data = new FormData($('#responsesform').get(0));
				data.append('submit', true);
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value
				url = window.location.origin + "/survey/add-responses/"
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,	
					data: data,	
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						if (data['Psuccess']){
							alert(data['Psuccess'])
						}
						location.reload()
					}, 
					error: function(data) {
						console.log('data')
					}
				});
			// }
		});


		// $('textarea.ans').on("change keyup",function() {	
			$(document).on('keyup ', 'textarea.answr', function(){
		// $('textarea.ans').on('keyup', function () {	
				var data = new FormData($('#responsesform').get(0));
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value
				url = window.location.origin + "/survey/add-responses/"
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,	
					data: data,	
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						console.log('response added')
					}, 
					error: function(data) {
						console.log('data')
					}
				});
		});

		$('#submit_intake_response').click(function(){			
			var data = new FormData($('#responsesform').get(0));
			data.append('submit', true);
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/intake-responses/"
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url: url,	
				data: data,	
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					if (data['Psuccess']){
						alert(data['Psuccess'])
					}
					location.reload()
				}, 
				error: function(data) {
					console.log('data')
				}
			});
		// }
	});

		$('textarea.res').keyup(function () {	
			var data = new FormData($('#responsesform').get(0));
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/intake-responses/"
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url: url,	
				data: data,	
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('response added')
				}, 
				error: function(data) {
					console.log('data')
				}
			});
	});

		var que_count = jQuery('#ques_block_main > div > textarea').length;

		$(document).ready(function(){
			num = parseInt(que_count)+1
			if (que_count < 1){
				jQuery('#ques_block_main').append('<div id="ques_block'+num+'" class=" mb-3 "><span class="custom_number_width">Q'+num+'</span><textarea class="form-control border border-dark" type="text" placeholder="Enter question"></textarea><button class="sitebtn" ><i class="fa fa-trash"></i></button></div><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""></div><button class="sitebtn hide-btn"><i class="fa fa-trash"></i></button> </div>');
						que_count +=1
			}
			else {
				
				jQuery('#ques_block_main > div > textarea').attr('queid')
			}
		});

		$('input[name="client"]').change(function() {

		});

		$('.step-1 .skip').click(function(){
			$('.questionare_block').hide();
			jQuery('.loader-wrap').show();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			url = window.location.origin + "/survey/add-group/"
			$.ajax({
				method: "delete",
				headers: {'X-CSRFToken': token},
				url: url,
				data: $('#reportid').val(),
				dataType: "json",
				success:function(data) {					
					window.location.href = '#step-2';
					location.reload();
				},
				error: function(data) {
					console.log('error')
				}
			});
			
		})

		function save_stage(id, stage){
			var endpoint = window.location.origin + "/survey/report-stage/";
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: id+','+stage,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						console.log('updated')
					}, 
					error: function(data) {
						console.log(data)
					}
				});
			}

		jQuery('#msform #step1').click(function(){
			$('.f-set').css('display', 'none');
			$('.step-1').css({"display":"block","opacity":"",});
			$("#progressbar li").removeClass("active");
			$(this).addClass("active")
			window.location.href = '#step-1';
			save_stage($('#reportid').val(), '#step-1')
		});

		jQuery('#step2').click(function(){
			$('.f-set').css('display', 'none');
			$('.step-2').css({"display":"block","opacity":"",});
			$("#progressbar li").removeClass("active");
			$(this).addClass("active").prevAll().addClass('active');
			window.location.href = '#step-2';
			save_stage($('#reportid').val(), '#step-2')
		});

		jQuery('#step3').click(function(){
			$('.f-set').css('display', 'none');
			$('.step-3').css({"display":"block","opacity":"",});
			$("#progressbar li").removeClass("active");
			$(this).addClass("active").prevAll().addClass('active');
			window.location.href = '#step-3';
			save_stage($('#reportid').val(), '#step-3')
		});

		jQuery('#step4').click(function(){
			$('.f-set').css('display', 'none');
			$('.step-4').css({"display":"block","opacity":"",});
			$("#progressbar li").removeClass("active");
			$(this).addClass("active").prevAll().addClass('active');
			window.location.href = '#step-4';
			save_stage($('#reportid').val(), '#step-4')
			
		});

		jQuery('#step5').click(function(){	
			thisli = $(this)		
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
			id = $('#reportid').val();
			url = window.location.origin + "/survey/draft-status/"
			$.ajax({
					method: "get",
					headers: {'X-CSRFToken': token},
					data: {'id':id},
					url: url,					
					dataType: "json",
					success:function(data) {	
						if (data['stts'] == 'Partially Completed') {
							$('.select_option_popup').modal('show')
						}	
						else {
							$('.f-set').css('display', 'none');
							$('.step-5').css({"display":"block","opacity":"",});
							$("#progressbar li").removeClass("active");
							thisli.addClass("active").prevAll().addClass('active');
							window.location.href = '#step-5';
							save_stage($('#reportid').val(), '#step-5')
							
							// location.reload()
						}
					}, 
					error:function(data) {
						console.log(data)
					}
				});			
		});

		jQuery('#add_ques').click(function(){
			if ($('#conf_que_block').is(":visible")){
				count=que_count+1
				// alert("You can't add more questions as confidential question will be the last question of the survey.")
				// jQuery('#ques_block_main').append('<div id="ques_block'+que_count+'" class=" mb-3 "><span class="custom_number_width">Q'+que_count+'</span><textarea class="form-control border border-dark" type="text" placeholder="Enter question"></textarea><button class="sitebtn" > <i class="fa fa-trash"></i></button></div><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""> </div><button class="sitebtn hide-btn"><i class="fa fa-trash"></i></button></div>');
				$('#conf_que_block span:first-child').text('Q'+count)
				$('<div id="ques_block'+que_count+'" class=" mb-3 "><span class="custom_number_width">Q'+que_count+'</span><textarea class="form-control border border-dark" type="text" placeholder="Enter question"></textarea><button class="sitebtn" > <i class="fa fa-trash"></i></button></div><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""> </div><button class="sitebtn hide-btn"><i class="fa fa-trash"></i></button></div>').insertBefore($('#conf_que_block'));
				que_count += 1;
			}
			else{
				que_count += 1;
				if($(this).parent().hasClass('inner-cont-wrap')){
					jQuery('#ques_block_main').append('<div id="ques_block'+que_count+'" class=" mb-3 "><span class="custom_number_width">Q'+que_count+'</span><textarea class="form-control border border-dark" type="text" placeholder="Enter question"></textarea><button class="sitebtn" > <i class="fa fa-trash"></i></button></div><div class="answer_wrap mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""> </div><button class="sitebtn hide-btn"><i class="fa fa-trash"></i></button></div>');
				}
				else{
					jQuery('#ques_block_main').append('<div id="ques_block'+que_count+'" class=" mb-3 "><span class="custom_number_width">Q'+que_count+'</span><textarea class="form-control border border-dark" type="text" placeholder="Enter question"></textarea><button class="sitebtn" > <i class="fa fa-trash"></i></button></div><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""> </div><button class="sitebtn hide-btn"><i class="fa fa-trash"></i></button></div>');
				}			
			}
		});

		jQuery('#conf_que').click(function(){
			if(jQuery('.confidentional-input').val() == null){
				que_count += 1;
				// jQuery('#ques_block_main').append('<div id="ques_block'+que_count+'" class=" mb-3 "><span class="custom_number_width">Q'+que_count+'</span><div class="conf-wrap"><textarea class="form-control confidentional-input border border-dark" type="text" placeholder="Enter question "></textarea><span class="conf-icon"><i class="mdi mdi-star"></i></span></div><button class="sitebtn" > <i class="fa fa-trash"></i></button></div><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""></div></div>');	
				jQuery('#ques_block_main').append('<div id="conf_que_block" class="input_custom_wrap mb-3"><span class="custom_number_width">Q'+que_count+'</span><textarea class="form-control confidentional-input border border-dark" type="text" placeholder="Enter confidential question" ></textarea><span class="conf-icon"><i class="mdi mdi-star"></i></span><button class="sitebtn"><i class="fa fa-trash"></i></button></div></span><div class="ans_block mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""></div><button class="sitebtn ans-dlt-btn" ><i class="fa fa-trash"></i></button></div>');	
			}
			else{
				alert('Already added confidential question')
			}
			});

		
		var questionCheck;
		jQuery('#showparam_popup').click(function(){
			jQuery('#instpopup').hide();
			modalShow(false);
			jQuery('#surv_format').show();
			questionCheck = $("input[name=surveyformat]:checked").val();
			console.log(questionCheck)
			
			
		});

		$(document).on('click', '#shw_ins', function(){
		// jQuery('#shw_ins').click(function(){
			jQuery('.survey_preview_popup').hide();
			modalShow(false);
			jQuery('#instpopup').show();
			modalShow(true);
		});


		jQuery('.relatypesel_wrp input').click(function(){
			console.log(jQuery('span .low-angle'))
			 jQuery('span.low-angle').css('display', 'none');
			
		});

		$(document).on('click', '#add_part', function(){ 			
			url = jQuery(this).attr('url')+'#step-2'
			id = jQuery(this).attr('data')
			

		
			window.location.href = url;
		});

		jQuery('.survey_whtnxt_inn #clifile').click(function(){
			url = jQuery(this).attr('url')
			window.location.href = url;
		});
		
		
		$('.save_as_draft').on("click",(function(){
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
			id = $('#reportid').val();
			url = window.location.origin + "/survey/draft-status/"
			var data = new FormData();     
			data.append('status', 'Partially Completed');
			data.append('reportid', id);
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {						
						$('.select_option_popup').modal('hide')
						$('#saveasdraft').modal('show')			
					}, 
					error:function(data) {
						console.log(data)
					}
				});
		}))

		$('.save_report').on("click",(function(){
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
			id = $('#reportid').val();
			url = window.location.origin + "/survey/draft-status/"
			var data = new FormData();     
			data.append('status', 'Completed');
			data.append('reportid', id);
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						$('.select_option_popup').modal('hide');
						$('.f-set').css('display', 'none');
						$('.step-5').css({"display":"block","opacity":"",});
						$("#progressbar li").removeClass("active");
						jQuery('#step5').addClass("active").prevAll().addClass('active');
						window.location.href = '#step-5';
					}, 
					error:function(data) {
						console.log(data)
					}
				});
		}))

		$('.redirecttoclient').on("click",(function(){
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			id = $('#cliid').val();
			url = window.location.origin + "/client-detail/"+ id;
			window.location.href = url;
		}))

		// $('#btnpens1').on("click",(function(){
		// 	$('#edittitle').modal('show');
		// }));
		
		$('#addsurhead').on("click",(function(){
			title = $('.surttl').html().trim()
			coment = $('.surcomment').html().trim()			
			$('#sur_head').find('input').val(title)
			$('#sur_head').find('textarea').val(coment)
			$('#sur_head').modal('show');
		}));

		$('#summary').on("click",(function(){
			title = $('.summary').text()
			coment = $('.summary-text').html().trim()			
			$('#summary_head').find('input').val(title)
			$('#summary_head').find('textarea').val(coment)
			$('#summary_head').modal('show');
		}));

		$('#savetitle').on("click",(function(){
			
		}));

		
		$('#saveresp').on("click",(function(){	
			user = $('#user_type').val()		
			q_id = jQuery('#que_id').val()
			var endpoint = window.location.origin + "/survey/delete-responses/"+jQuery('#que_id').val()+"/"+user;
			// var data = new FormData()				
			input = $(this)
			que = input.parent().parent().find('input').val()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
				// data.append('que', que);
			if (jQuery('#que_id').attr('mode') == 'confquest'){
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: que+','+'conf',
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						alert(data['success'])				
						jQuery('#editresponse').modal('hide');
						jQuery('#editresponse').find('input').val('');
						jQuery('.myans[data*='+q_id+']').html(que)
						jQuery('.confedit[data*='+q_id+']').parent().find('.response').html(que)
					}, 
					error: function(data) {
						console.log(data)
					}
				});
			}
			else{	
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: que,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						alert(data['success'])					
						jQuery('#editresponse').modal('hide');
						jQuery('#editresponse').find('input').val('');
						jQuery('.myans[data*='+q_id+']').html(que)
						jQuery('.edit[data*='+q_id+']').parent().find('.response').html(que)
					}, 
					error: function(data) {
						console.log(data)
					}
				});
			}
		}));

		$('#savefooter').on("click",(function(){			
			r_id = jQuery('#reportid').val();
			text = jQuery('.footertext').val();
			color = jQuery('#favcolor').val();
			data = new FormData();
			var endpoint = window.location.origin + "/survey/savefooter/";	
			data.append('id', r_id);		
			data.append('text', text);		
			data.append('color', color);		
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value				
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						$('.color-styling').css('background',color)
						$('.color-styling').attr('fill',color)
						$('.footer_text').text(text)
						$('#editfooter').modal('hide');
					}, 
					error: function(data) {
						console.log(data)
					}
				});
		}));

		$('#savebackfooter').on("click",(function(){			
			r_id = jQuery('#reportid').val();
			color = jQuery('#bccolor').val();
			data = new FormData();
			var endpoint = window.location.origin + "/survey/savefooter/";	
			data.append('id', r_id);		
			data.append('color', color);		
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value				
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						$('.bc-color-styling').css('background',color)
						$('.bc-color-styling').attr('fill',color)
						$('#editbackfootercolor').modal('hide');
					}, 
					error: function(data) {
						console.log(data)
					}
				});
		}));

		$('body').on('click','#ques_block_main > div  button', function() {
			if (typeof $(this).attr('data-type') == 'undefined') {
				if($(this).parent().next().hasClass('answer_wrap')){
					que_count -=1
					$(this).parent().next().remove();
					$(this).parent().remove();

					$( "#ques_block_main div" ).not('.answer_wrap').not('.border').each(function( index ) {
						currntspan = $( this ).find('.custom_number_width')
						if (parseInt(currntspan.text().replace('Q','')) != index+1){
							num = index+1
							currntspan.text('Q'+num)	
							$( this ).attr('id', 'ques_block'+num)	
						}					
					});	
				}
				else{
					que_count -=1
					$(this).parent().next().remove();
					$(this).parent().remove();

					$( "#ques_block_main div" ).not('.ans_block').not('.border').each(function( index ) {
						currntspan = $( this ).find('.custom_number_width')
						if (parseInt(currntspan.text().replace('Q','')) != index+1){
							num = index+1
							currntspan.text('Q'+num) 
							if($(this).hasClass('input_custom_wrap') == false){	
								$( this ).attr('id', 'ques_block'+num)
							}	
						}					
					});	
				}			
			}
			else{
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value
				curr_button = $(this)
				var x = $(this).attr('data-type')
				if($(this).parent().next().hasClass('answer_wrap')){
					url = window.location.href
					$.ajax({
						method: "delete",
						headers: {'X-CSRFToken': token},
						url:  url,
						data: x,					
						processData: false,
						contentType: false,
						dataType: "json",
						success:function(data) {	
							if(data['status']){
								window.location.reload()
							}						
							alert('Successfully Deleted')
							location.reload();
						}, 
						error: function(data) {
							console.log('data')
						}
					});
				}
				else{
					url = window.location.origin + "/survey/delete_que/"+ x
					$.ajax({
						method: "delete",
						headers: {'X-CSRFToken': token},
						url:  url,					
						processData: false,
						contentType: false,
						dataType: "json",
						success:function(data) {
							// curr_button.parent('div[id*="ques_block"]').next('div').remove();
							// curr_button.parent('div[id*="ques_block"]').remove();
							alert('Successfully Deleted')
							location.reload();
						}, 
						error: function(data) {
							console.log('data')
						}
					});
				}
				
			}
		}),



		$('body').on('focusout','#ques_block_main textarea', delay(function (e) {		
		data = new FormData();
		if ($(this).parent().parent().parent().hasClass('survey_questions_block') || $(this).parent().parent().parent().hasClass('survey_quest_wrp') || $(this).parent().parent().parent().hasClass('content-wrapper')){
			var endpoint = document.getElementById("surveyqsurl").value;
		} 
		else{
			var endpoint = document.location.href;
		}
		input = $(this)
		que = $(this).val()
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value
				if(input.attr('data-type') == "" || input.attr('data-type') == null || input.attr('data-type') == "undefined"|| input.attr('data-type') == undefined) {
					if (input.hasClass('confidentional-input'))	{
						data.append('confque', que);
							$.ajax({
								method: "POST",
								headers: {'X-CSRFToken': token},
								url: endpoint,
								data: data,
								processData: false,
								contentType: false,
								dataType: "json",
								success:function(data) {
									input.attr("data-type",data['questions'])
									input.next().next().attr("data-type",data['questions'])
									jQuery('.surveypreviewfrm').append('<div class="custom_made_question mb-3"><div class=" mb-3"><span class="custom_number_width"></span><textarea class="form-control border border-dark" type="text" readonly>'+que+'</textarea><span class="conf-icon"><i class="mdi mdi-star"></i></span></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div></div>');
								}, 
								error: function(data) {
									console.log('here')
								}
							});
					}
					else{
					data.append('que', que);
					$.ajax({
						method: "POST",
						headers: {'X-CSRFToken': token},
						url: endpoint,
						data: data,
						processData: false,
						contentType: false,
						dataType: "json",
						success:function(data) {
							qerror = input.parent().children('span.ques_error').length
							if ((data['success'] != undefined) && ( qerror == 1)){
									input.parent().children('span.ques_error').remove()
							}
							else if((data['error'] != undefined) && (qerror == 0)){
									input.parent().append('<span class="ques_error" style="color:red;">'+data['error'] +'</span>')
							}
							
							if(data['status']){
								window.location.reload()
							}
							input.attr("data-type",data['questions'])
							input.next().attr("data-type",data['questions'])
						}, 
						error: function(data) {
							console.log(data)
							console.log(input)
						}					
					});
					}
				} else {
					id = input.attr('data-type')
					if (input.hasClass('confidentional-input'))	{
						$.ajax({
							method: "PUT",
							headers: {'X-CSRFToken': token},
							url: endpoint,
							data: id+',:'+que+',:'+'conf',
							processData: false,
							contentType: false,
							dataType: "json",
							success:function(data) {
								input.attr("data-type",data['questions'])
								input.next().attr("data-type",data['questions'])
							}, 
							error: function(data) {
								console.log(data)
							}
						});
					}
					else{						
						$.ajax({
							method: "PUT",
							headers: {'X-CSRFToken': token},
							url: endpoint,
							data: id+',:'+que,
							processData: false,
							contentType: false,
							dataType: "json",
							success:function(data) {
								qerror = input.parent().children('span.ques_error').length
								if ((data['error'] != undefined) && (qerror == 0)){
									input.parent().append('<span class="ques_error" style="color:red;">'+data['error'] +'</span>');
								}
								else if ((data['success'] == 'data updated') && ( qerror == 1)){
									input.parent().children('span.ques_error').remove();
									
								}
								if(data['status']){
									window.location.reload()
								}
								input.attr("data-type",data['questions'])
								input.next().attr("data-type",data['questions'])
							}, 
							error: function(data) {
								console.log(data)
							}
						});
					}
					}
		// });
	}, 500));

	function delay(callback, ms) {
		var timer = 0;
		return function() {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			callback.apply(context, args);
		}, ms || 0);
		};
	}
		// quantion check on change 
		$(document).ready(function(){			 
			$("input[name=surveyformat]").on("change", function(){
				questionCheck = $(this).val();
				console.log(questionCheck)
			});
		});

		
		var quetionNum;
		// checktestfunctionOther(quetionNum);
		jQuery('#shw_preview').on('click', function(){
			var instruction = '';
			steps = jQuery('#ques_block_main > div > textarea').length;	
			currentStep = 1
			$progressText.text(`${currentStep}/${steps}`)
			$progressData.animate({
				width: (currentStep / steps) * 100 + '%'
			}, 1000, () => {
				
			})
			// img = $('.showuploadlogoimgwrp img').attr('src')
			img = $('.intake-logo img').attr('src')
			jQuery('#surv_format').hide();			
			modalShow(false);
			instruction = jQuery('#instr').html().trim();
			if ($('.intake-logo img').attr('src') != null) {
				
			}
			// jQuery('.surveypreviewfrm').append('<div>'+ins.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,"<br>")+'<br></div>');
			// instruction += '<div style="font-size: .875rem;" class="cont-wrap">'+ins+'<ul class="bullets mt-2">';			
			// jQuery('#instr ul li').each(function(i){
			// 	instruction += '<li>'+$(this).text()+'</li>';
			// })                 
			// instruction += ('</ul>')					
			if(questionCheck == 'allquestion'){
				if ($('.intake-logo img').attr('src') != null) {
					jQuery('.surveypreviewfrm').empty().append('<img src="'+ img+'"></img><br>'+ instruction)
				} else {
					jQuery('.surveypreviewfrm').empty().append(instruction)
				}
				jQuery('.progress').hide();
				jQuery('#ques_block_main textarea').each(function(i){
					if ($(this).val() == null  || $(this).val() == '') {
						console.log($(this).val())
					} else {
					num = parseInt(i)+1
						if ($(this).hasClass('confidentional-input')) {
							jQuery('.surveypreviewfrm').append('<div class="custom_made_question mb-3"><div id="ques_block'+num+'" class=" input_custom_wrap mb-3"><span class="custom_number_width">Q'+num+'</span><textarea class="form-control border border-dark" type="text" readonly>'+$(this).val()+'</textarea><span class="conf-icon"><i class="mdi mdi-star"></i></span></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div></div>');

						} else {
							jQuery('.surveypreviewfrm').append('<div class="custom_made_question mb-3"><div id="ques_block'+num+'" class=" mb-3"><span class="custom_number_width">Q'+num+'</span><textarea class="form-control border border-dark" type="text" readonly>'+$(this).val()+'</textarea></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div></div>');
						
						}
					}
				})
				jQuery('.surveypreviewfrm').append('<div class="d-flex justify-content-center expand-btn"><div class="btn-wrap p-1"><a class="sitebtn" >Submit</a></div><div class="btn-wrap p-1"><a class="sitebtn" >Save and Finish Later</a></div></div>');
			}else if(questionCheck ==  'onequestion'){
				// checktestfunction(quetionNum)
				// jQuery('.hidebtn').hide();
				quetionNum=0;
				checktestfunction(quetionNum);
				jQuery('.progress').show();
								
			}else{
				return false;
			}			
			jQuery('.survey_preview_popup').show();
			modalShow(true);
		});
		
		function checktestfunction(quetionNum){
			var instruction = '';
			instruction = jQuery('#instr').html().trim();
			// instruction += '<div style="font-size: .875rem;" class="cont-wrap">'+ins+'<ul class="bullets mt-2">';
			// jQuery('#instr ul li').each(function(i){
			// 	instruction += '<li>'+$(this).text()+'</li>';
			// })                 
			// instruction += ('</ul>')		
			
			var quetionValuesAll = $("#ques_block_main textarea");
			var numbb = quetionNum+1;
			var prev = quetionNum;

			if(numbb == que_count){
				jQuery('.surveypreviewfrm').empty().append('<div class="custom_made_question mb-3"><div id="ques_block'+numbb+'" class=" mb-3"><span class="custom_number_width">Q'+numbb+'</span><textarea class="form-control border border-dark" type="text" readonly>'+quetionValuesAll[quetionNum].value+'</textarea></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div><div></div> <button class="prevBtn" id="prev_btn_'+quetionNum+'"  value="'+prev+'"> <i class="fa fa-arrow-left" aria-hidden="true"></i> </button><button  data-direction="next" class="nextBtn" style="display:none" id="next_btn_'+quetionNum+'"  value="'+quetionNum+'"> <i class="fa fa-arrow-right" aria-hidden="true"></i> </button> </div></div>');
			}else if(numbb == 1){
				img = $('.intake-logo img').attr('src')
				ins = jQuery('#instr').html()
				if ($('.intake-logo img').attr('src') != null) {
					jQuery('.surveypreviewfrm').empty().append('<img src="'+ img+'"></img><br><div>'+instruction+'<br></div><div class="custom_made_question mb-3"><div id="ques_block'+numbb+'" class=" mb-3"><span class="custom_number_width">Q'+numbb+'</span><textarea class="form-control border border-dark" type="text" readonly>'+quetionValuesAll[quetionNum].value+'</textarea></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div><div class="row justify-content-end mr-2"> <button class="nextBtn"  data-direction="next" id="next_btn_'+quetionNum+'"  value="'+quetionNum+'"> <i class="fa fa-arrow-right" aria-hidden="true"></i> </button> </div></div>');
				} else {
					jQuery('.surveypreviewfrm').empty().append('<div >'+instruction+'<br></div><div class="custom_made_question mb-3"><div id="ques_block'+numbb+'" class=" mb-3"><span class="custom_number_width">Q'+numbb+'</span><textarea class="form-control border border-dark" type="text" readonly>'+quetionValuesAll[quetionNum].value+'</textarea></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div><div class="row justify-content-end mr-2"> <button class="nextBtn"  data-direction="next" id="next_btn_'+quetionNum+'"  value="'+quetionNum+'"> <i class="fa fa-arrow-right" aria-hidden="true"></i> </button> </div></div>');
				}
			}else {
				jQuery('.surveypreviewfrm').empty().append('<div class="custom_made_question mb-3"><div id="ques_block'+numbb+'" class=" mb-3"><span class="custom_number_width">Q'+numbb+'</span><textarea class="form-control border border-dark" type="text" readonly>'+quetionValuesAll[quetionNum].value+'</textarea></div><div class="ans_block_preview mb-3"><span class="custom_number_width"></span><div class="form-control border border-dark ml-2" readonly=""><i class="fa fa-microphone " aria-hidden="true" style="float: right"></i></div></div><div class="d-flex justify-content-between"> <button class="prevBtn" id="prev_btn_'+quetionNum+'"  value="'+prev+'"> <i class="fa fa-arrow-left" aria-hidden="true"></i> </button><button  data-direction="next" class="nextBtn" id="next_btn_'+quetionNum+'"  value="'+quetionNum+'"> <i class="fa fa-arrow-right" aria-hidden="true"></i> </button> </div></div>');
			}
			jQuery('.surveypreviewfrm').append('<div class="d-flex justify-content-center expand-btn"><div class="btn-wrap p-1"><a class="sitebtn" >Submit</a></div><div class="btn-wrap p-1"><a class="sitebtn" >Save and Finish Later</a></div></div>');

		}

		var steps = que_count
		let currentStep = 1
		const $progressText = $('.progress-text')
		const $progressData = $('[data-progress]')
		numItems = $('.custom_made_question').length
		if (!$('.cont-wrap').length ){
			$progressText.text(`${currentStep}/${steps}`)
			$progressData.animate({
				width: (currentStep / steps) * 100 + '%'
			}, 1000, () => {
				$progressText.text(`${currentStep}/${steps}`).addClass('is-active')
			})
			}

		$('body').on("click",".nextBtn", function(){
			quetionNum = $(this).val();
			const $button = $(this)
			currentStep++
			console.log(currentStep)
			$progressData.animate({
				width: (currentStep / steps) * 100 + '%'
			   }, 1000, () => {
				   $progressText.text(`${currentStep}/${steps}`).addClass('is-active')

			   })

			if(quetionNum == 'instruction'){
				quetionNum = 0;
				checktestfunction(quetionNum);
			}else{
				quetionNum++;
				checktestfunction(quetionNum);
			}
		});

		$(document).on("click",".prevBtn", function(){
			quetionNum = $(this).val();
			const $button = $(this)
			currentStep--
			$progressData.animate({
				width: (currentStep / steps) * 100 + '%'
			   }, 1000, () => {
				   $progressText.text(`${currentStep}/${steps}`).removeClass('is-active')

			    })

			quetionNum--;
			checktestfunction(quetionNum);
		});

		$('.delete').on("click", function(){
			$('.delete_cnfm_popup').modal('show');
			id =  $(this).attr('data')
			$('#delete_response').attr('data', id)
		});

		$('#delete_response').on("click", function(){
				user = $('#user_type').val()
				url = window.location.origin + "/survey/delete-responses/"
				id =  $(this).attr('data')
				var endpoint = url + id	+"/"+user			
				input = $('.delete[data*='+id+']')
				
				// que = $(this).attr('data')
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
					// data.append('que', que);
					$.ajax({
						method: "delete",
						headers: {'X-CSRFToken': token},
						url: endpoint,
						success:function(data) {
							$(input).parent().css('display','none')
							$('.delete_cnfm_popup').modal('hide');
							// $('li[data*='+id+']').css('display','none')
							$('.myans[data*='+id+']').css('display','none')
							alert('Successfully deleted response')
						}, 
						error: function(data) {
							console.log(data)
						}
					});
			});

			$('.confdelete').on("click", function(){	
				url = window.location.origin + "/survey/delete-conf-responses/"
				id =  $(this).attr('data')
				var endpoint = url + id				
				input = $(this)
				// que = $(this).attr('data')
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
					// data.append('que', que);
					$.ajax({
						method: "delete",
						headers: {'X-CSRFToken': token},
						url: endpoint,
						success:function(data) {
							input.parent().css('display','none')
							// $('li[data*='+id+']').css('display','none')
							$('.myans[data*='+id+']').css('display','none')
							alert('Successfully deleted response')
						}, 
						error: function(data) {
							console.log(data)
						}
					});
			});

			function placeCaretAtEnd(el) {
				el.focus();
				if (typeof window.getSelection != "undefined"
						&& typeof document.createRange != "undefined") {
					var range = document.createRange();
					console.log(el)
					range.selectNodeContents(el);
					range.collapse(false);
					var sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				} else if (typeof document.body.createTextRange != "undefined") {
					var textRange = document.body.createTextRange();
					textRange.moveToElementText(el);
					textRange.collapse(false);
					textRange.select();
				}
			}

		$('body').on("click",".edit", function(){
   
			if(jQuery(this).hasClass('myans')){
				txt = jQuery(this).text().trim()
				jQuery(this).replaceWith("<textarea class='cstm-textarea'>" + txt + "</textarea>")
			}
			else{
				txt = jQuery(this).parent().find('.myans p').text().trim()
				jQuery(this).parent().find('.myans p').replaceWith("<div contenteditable class='cstm-textarea'>" + txt + "</div>")
			}

			jQuery(this).parent().find('.myans .cstm-textarea').focus();
			placeCaretAtEnd(jQuery(this).parent().find('.myans .cstm-textarea')[0]);

		});

		$(document).on("focusout",".surttl", function(){
			txt = jQuery(this).html().trim()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('rpthead', txt);
			data.append('reportid', id);
			data.append('type', 'head');
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});			
		});

		$(document).on("focusout",".surcomment", function(){
			txt = jQuery(this).html().trim()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('reportid', id);
			data.append('rptcomment', txt);
			data.append('type', 'head');
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});					
		});

		$(document).on("focusout",".summary", function(){
			txt = jQuery(this).text().trim()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('reportid', id);
			data.append('summmhead', txt);
			data.append('type', 'summ');
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});						
		});

		$(document).on("focusout",".summary-text", function(){
			txt = jQuery(this).html().trim()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			id = $('#reportid').val();
			url = window.location.origin + "/survey/sur-head/"
			var data = new FormData();     
			data.append('reportid', id);
			data.append('summcomment', txt);
			data.append('type', 'summ');
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});						
		});

		$(document).on("focusout",".myans div", function(){
			user = $('#user_type').val()
			q_id = jQuery(this).closest('.myans').attr('data')
			var endpoint = window.location.origin + "/survey/delete-responses/"+q_id+"/"+user;
			input = $(this)			
			que = input.html().trim()
			console.log(q_id, que)
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
			if (jQuery('#que_id').attr('mode') == 'confquest'){
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: que+','+'conf',
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						console.log(data['success'])						
						console.log(jQuery(input).closest('ol'))
							jQuery('.bulletpoint .myans[data*='+q_id+']').html('<li><div class="cstm-textarea" contenteditable>'+que+'</div></li>')
							jQuery('.main_response .myans[data*='+q_id+']').html('<p>'+que+'</p>')
							}, 
					error: function(data) {
						console.log(data)
					}
				});
			}
			else{	
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: endpoint,
					data: que,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {	
						console.log(data['success'])
						jQuery('.bulletpoint .myans[data*='+q_id+']').html('<li><div class="cstm-textarea" contenteditable>'+que+'</div></li>')
						jQuery('.main_response .myans[data*='+q_id+']').html('<p>'+que+'</p>')
						}, 
					error: function(data) {
						console.log(data)
					}
				});
			}
		})


		$(document).on("click",".confedit", function(){	
			jQuery('#que_id').val($(this).attr('data'));
			jQuery('#que_id').attr('mode', 'confquest')
			// jQuery('#editresponse').modal('show');
			txt = jQuery(this).parent().find('.myans p').text().trim()
			jQuery(this).parent().find('.myans p').replaceWith("<div contenteditable class='cstm-textarea'>" + txt + "</div>")
			jQuery(this).parent().find('.myans .cstm-textarea').focus();
		});
		
		$('.editgrpname i').on("click", function(){			
			jQuery('#que_id').val($(this).attr('data'));
			jQuery(this).closest('.editgrpname').addClass('updategrpname');			
			jQuery('#editgrpnm').modal('show');
		});

		jQuery('#editgrpnm button').on("click", function(){	 
			newnm = jQuery('#editgrpnm').find('input')
			data = $('#que_id').val()+','+newnm.val();
			console.log()
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/survey/add-group/"
				$.ajax({
					method: "put",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,			
					dataType: "json",
					success:function(data) {
						$('#editgrpnm').modal('hide');
						$('.updategrpname b').text(newnm.val()),
						$('.editgrpname').removeClass('updategrpname'),
						$('.g'+$('#que_id').val()+' b').text(newnm.val())
						newnm.val('');
					},
					error: function(data) {
						alert('data')
					}
				});
		});
		
		$('.speech').on("click", function(){	
			this_input_text = $(this).parent().find('textarea').val()
			var action = document.getElementById("action");
			// var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
			// var recognition = new SpeechRecognition();
			var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
			recognition.lang = 'en-US';
			recognition.interimResults = false;
			this_input = $(this).parent().find('textarea')
			recognition.onstart = function() {				
				alert('start recording ')
			};
			
			recognition.onspeechend = function() {
				recognition.stop();
				alert('recording stopped')
			}

			// This runs when the speech recognition service returns result
			recognition.onresult = function(event) {
				var transcript = event.results[0][0].transcript;
				var confidence = event.results[0][0].confidence;
				this_input.val(this_input_text+' '+transcript);
				// output.innerHTML = "<b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence*100+"%";
				// output.classList.remove("hide");
			};
			

			recognition.onerror = function(e) {
				console.log('Speech recognition error detected: ' + e.error);
			}
			 // start recognition
			 recognition.start();

				var data = new FormData();     
				inp = jQuery(this).siblings('textarea')        
                data.append('record', this_input.val());
				url = document.location.origin+'/survey/speech';
				var csrftoken = getCookie('csrftoken');
            	$.ajax({
                type: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",


                success:function(data) {
					if (data['data']){
						alert(data['data'])
						inp.val(data['data']) 
						que = inp.val()
						id = inp.attr('data-type')
						var endpoint = document.getElementById("surveyqsurl").value;
						$.ajax({
							method: "PUT",
							headers: {'X-CSRFToken': csrftoken},
							url: endpoint,
							data: id+','+que,
							processData: false,
							contentType: false,
							dataType: "json",
							success:function(data) {
								inp.attr("data-type",data['questions'])
							}, 
							error: function(data) {
								alert(data)
							}
						});
					}
					else{alert(data['error'])}
					
					}
				})
		});

		$('#proceed').on("click", function(){			
			var surveyname = jQuery('#copysurveyname').val();
			var client = jQuery('#copysurveycat').val();
			
			if(surveyname == "" || surveyname == null) {
				jQuery('#copysureynameerr').text('Please enter survey name');
				valid = false;				
			} else{
				jQuery('#copysureynameerr').text()
				valid = true;
			}

			if(client == "" || client == null || client == 'demo') {
				jQuery('#copysurveycaterr').text('Please select client');
				valid = false;
			} else{
				jQuery('#copysurveycaterr').text()
				valid = true;
			}

			if(surveyname == "" || surveyname == null|| client == 'demo') {
				valid = false;
			}
			if(valid){
				var data = new FormData();                
                data.append('surveyname', jQuery('#copysurveyname').val());
                data.append('surveycat', jQuery('#copysurveycat').val());
                data.append('copy', true);
				url = document.location.origin+'/survey/create-survey/';
				var csrftoken = getCookie('csrftoken');
            	$.ajax({
                type: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
					if(data['fail']){
						alert(data['fail'])
						$('.copy_survay_popup').hide()
						modalShow(false);
					}else{
					window.location.href = document.location.origin+'/survey/copy-prev-survey/'+data['cid']+'/'+data['id']
					}
					}
				})
			}
		
		});



// ended by shivani

		jQuery('#createdefinstsub').on('click',function(e){

			var survyinstvalid = true
			var insttext = jQuery('#createsuvinstr').val();
			var survey = jQuery('#surveyname').val();
			var client = jQuery('#surveycat').val();
			if(insttext == "" || insttext == null) {
				jQuery('#createsuvinstrerr').text('Please enter instructions.');
				survyinstvalid = false;
			} else {
				jQuery('#createsuvinstrerr').text('');
			}
			if(client == "" || client == null || client == 'demo') {
				jQuery('#surveycaterr').text('Please select the client.');
				survyinstvalid = false;
			} else {
				jQuery('#surveycaterr').text('');
			}

			if(survey == "" || survey == null) {
				jQuery('#sureynameerr').text('Please enter survey name.');
				survyinstvalid = false;
			} else {
				jQuery('#sureynameerr').text('');	
			}
							
			if(survey == "" || survey == null || client == 'demo' || insttext == "" || insttext == null){
				survyinstvalid = false;
			}
			else {
				survyinstvalid = true;
			}
				
				var reminderval = jQuery('input[name=reminderval]:checked').val();
				var	whentoreminderval = jQuery('input[name=whentoreminderval]:checked').val();
				var surveymarkcomplet = jQuery('input[name=surveymarkcomplet]:checked').val();
				if(survyinstvalid) {
					jQuery('#hiddeninstfield').val(insttext);
					// jQuery('.creating_survey_process_popup').fadeIn();
					// var data = jQuery('#createsurveyfrm').serialize() + "&" + "reminderval=" + reminderval + "&" + "whentoreminderval=" + whentoreminderval + "&" + "surveymarkcomplet=" + surveymarkcomplet
					var data = new FormData($('#createsurveyfrm').get(0));
					data.append('reminderval', reminderval);
					data.append('whentoreminderval', whentoreminderval);
					data.append('surveymarkcomplet', surveymarkcomplet);
					var endpoint = $("#hiddensurveyurl").attr("action");
					var csrftoken = getCookie('csrftoken');		
					// alert(endpoint)		
					$.ajax({
						method: "POST",
						headers: {'X-CSRFToken': csrftoken},
						url: endpoint,
						data: data,
						processData: false,
						contentType: false,
						dataType: "json",
						success:function(data) {

							
						if(data['id']){
							urls = "/survey/create/question/" + data['id']
							final = window.location.origin + urls
							setTimeout(function(){ window.location.href = final; }, 3);
						}else{
							alert(data['fail'])
						}
						}, 
						error: function(data) {
							alert('data')
							
						}
					});
				
			}
			return survyinstvalid
		});

		jQuery('.createsuv_instr_popup .closepoup').on('click',function(){
			jQuery('.createsuv_instr_popup').fadeOut();
			modalShow(false);
		});

		jQuery('#whtnxt').on('click',function(){
			jQuery('.custom_preview_popup').fadeOut();
			jQuery('.survey_preview_popup ').fadeOut();
			modalShow(false);
			jQuery('.survey_whtnxt_popup').show();
			modalShow(true);
		});

		// jQuery('#createsuvinstrfrm textarea').richText({
		// 	leftAlign: false,
		// 	centerAlign: false,
		// 	rightAlilgn: false,
		// 	justify:false,
		// 	ol:false,
		// 	ul:false,
		// 	fontList:false,
		// 	table:false,
		// 	toggleCode:false,
		// 	focus:true
		// });

	jQuery('#defsurveyclierr').focusout(function () {
		var surcat= jQuery('#surveycat').val();
		if (surcat == "" || surcat == null || surcat == 'demo'){
			jQuery('#defsurveycaterr').text('Please select the Client');
		}
		else {
			jQuery('#defsurveycaterr').text('');
		}
	  });

	  jQuery('#surveycatg').focusout(function () {
		var surcat= jQuery(this).val();
		if (surcat == "" || surcat == null || surcat == 'demo'){
			jQuery('#defsurveyclierr').text('Please select the Client');
		}
		else {
			jQuery('#defsurveyclierr').text('');
		}
	  });

	  jQuery('#defsurveycat').focusout(function () {
		var surcat= jQuery(this).val();
	if (surcat == "" || surcat == null || surcat == 'demo'){
			jQuery('#defsurveycaterr').text('Please select the Template');
		}
		else {
			jQuery('#defsurveycaterr').text('');
		}
	  });
	  
	/// Default Survey Template Form Validation
	jQuery('#createdefsurveyfrm #createdefsurveysub').on('click',function(e){
		var surcat= jQuery('#surveycatg').val();
		var surveyname = jQuery('#defsurveyname').val();
		var surveycat = jQuery('#defsurveycat').val();
		
		if(surveyname == "" || surveyname == null) {
			jQuery('#defsureynameerr').text('Please enter survey name');
		} else {
			 jQuery('#defsureynameerr').text('');	
			 surveyvalid = true;		 
		}

		if(surveycat == "" || surveycat == null) {
			jQuery('#defsurveycaterr').text('Please select template');
		} else {
			 jQuery('#defsurveycaterr').text('');	
			 surveyvalid = true;		
		}

		if (surcat == "" || surcat == null || surcat == 'demo'){
			jQuery('#defsurveyclierr').text('Please select the Client');
		} else {
				jQuery('#defsurveyclierr').text('');	
				surveyvalid = true;							
		}
			
		if (surveyname == "" || surveyname == null || surveycat == "" || surveycat == null || surcat == 'demo'){
			surveyvalid = false;
		}
		
	
		if(surveyvalid) {
				var data = new FormData();                
                data.append('surveycat', jQuery('#surveycatg').val());
                data.append('defsurveyname', jQuery('#defsurveyname').val());
                data.append('defsurveycat', jQuery('#defsurveycat').val());
				url = document.location.origin+'/survey/create/';
				token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
            	$.ajax({
                type: "POST",
                headers: {'X-CSRFToken': token},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
					if(data['fail']){
						alert(data['fail'])
					}else{
						window.location.href = document.location.origin+'/survey/create/template/question/'+data['survey_id']+'/'+data['template']
					}
					},
					error: function(data) {
								alert('Survey with same name already exists. Please try with other name.')
							}
				})

			// jQuery('.default_survey_templ_popup').fadeOut();
			// jQuery('#creatingsurvey').fadeIn()
			// if(surveycat == "360") {
			// 	setTimeout(function(){ window.location.replace("survey_360.html"); }, 3000);
			// } else {
			// 	setTimeout(function(){ window.location.replace("survey_360_repeat.html"); }, 3000);
			// }
		}
	

		return surveyvalid;
	});

	jQuery('#defsurveyname').on('click',function(){

			 jQuery('#defsureynameerr').text('');
		
	});

	jQuery('.creating_survey_process_popup .closepoup').on('click',function(){
		jQuery('.creating_survey_process_popup').fadeOut();
	});


	// Survey Question Validation
		jQuery('#surveyquestfrm input').focusout(function () {
		   	var questval = jQuery(this).val();
			if(questval == "" || questval == null){
				jQuery(this).next('.questerr').text('Please write your question');
			} else {
				jQuery(this).next('.questerr').text('');
			}
		});

	// Empty Mulifield Function
		function emptyMultifieldFunct(thiselement){
			thiselement.find('.multichoice_field').html('');
			for (i = 1; i <= 3; i++){
				addDiv(thiselement);
			}
			if (thiselement.find('#multichoiceerr').length === 0) {
				thiselement.find('.multichoiceinn_row:first-child .answer-wrp').append(multichoiceerrvar);
			}
		}


	//  (New Surve Js)
	
	var ansarr = [];
	// var optionArr = [];

	jQuery(document).on('click','input[name=your_selection]',function(){
		
		$('input[name=your_selection]').removeAttr('checked')
		$(this).attr("checked", "checked");
		element = $(this).closest('div')
		ans = $(element).children('div').eq(0).children('div').eq(0).find('.richText-editor').html()
		no = $('.quest_field_clone_wrp .savequestbtn').closest('.quest_field_wrp').attr('questnumb')
		ansarr[no] = ans
	});


	jQuery(document).on('click','.rating_scale_options select',function(){		
		no = $('.quest_field_clone_wrp .savequestbtn').closest('.quest_field_wrp').attr('questnumb')
		ansarr[no] = $(this).val()
	});


	jQuery(document).on('click','.quest_field_clone_wrp .savequestbtn',function(){
			

			if ($('.savequestbtn').attr('data-type') === 'edit') {
				var mainQuestnotclonewrp = jQuery('.quest_field_clone_wrp');
				var form = jQuery(this).closest('.quest_field_wrp');
				var num = parseInt(form.attr('ansnumb'));
				var num1 = parseInt(form.attr('questnumb'));
				var questvalid = true;

				var storeviseleID;
				form.find('.oneofanstypeoptwrp').each(function(){
					if($(this).is(":visible")) {
						storeviseleID = $(this).attr('id');
					}
				});
				jQuery('.quest_field_wrp').hide();

				var els = form.find('#'+storeviseleID+' .multichoiceinn_row textarea').filter(function() {
					return this.value !== "" && this.value !== "0";
				});

				//console.log(els.length);


				var questval = form.find('.quest_field .mainquestfield').val();
				if(questval == "" || questval == null){
					form.find('.questerr').text('Please write your question');
					questvalid = false;
				} else {
					form.find('.questerr').text('');
				}

				if(storeviseleID != "StarRatingQuestion" && storeviseleID != "SingleTextboxQuestion") {
					if (els.length == 0) {
						form.find('#'+storeviseleID+' #multichoiceerr').text('You are required to have at least one choice.');
						questvalid = false;
					} else {
						form.find('#'+storeviseleID+' #multichoiceerr').text('');
					}
				}


				if(questvalid) {
					form.find('.quest_field label span').text(num1 +1);
					form.closest('form').find('.all_enter_quest_wrp').append('<div class="quest_ans_wrp" id='+num+'><div class="clearfix survey_prevquest_block"><div class="left"><h3>Q<span class="questno">'+num+'</span> <span>'+questval+'</span></h3><input type="hidden" class="hiddensurveyquest" name="surveyquestno_'+num+'" value="'+questval+'"></div><div class="right alignright"><a href="javascript:;" class="sitebtn editbtn">Edit</a><a href="javascript:;" class="sitebtn deletebtn">Delete</a></div></div><div class="survey_prevansw_block"></div></div>');

					var AnswerWrapper = form.closest('form').find('.all_enter_quest_wrp .quest_ans_wrp:last-child .survey_prevansw_block');

					surveyQuestAnsAddUpdateFun(AnswerWrapper,mainQuestnotclonewrp,storeviseleID);
					// form.find('.quest_field_wrp:last').hide();
					jQuery('.add_new_quest_block').slideDown();
					mainQuestnotclonewrp.find('.quest_field_wrp').hide();
					mainQuestnotclonewrp.find('.quest_field .mainquestfield').val('');
					mainQuestnotclonewrp.find("textarea").val("");
					mainQuestnotclonewrp.find('.richText-editor div').empty();
					form.attr('ansnumb',num);
					form.attr('questnumb',num1);
					jQuery('.next_questbtn_wrp .sitebtn').removeClass('disablebtn');
					jQuery('.add_new_quest_block .addnewquestbtn').removeClass('disablebtn');
					mainQuestnotclonewrp.find('.ansbankcatselectoptwrp').hide();
					emptyMultifieldFunct(form);
					$('.savequestbtn').attr('data-type','save');
				}
			}
			if ($('.savequestbtn').attr('data-type') === 'save') {

				var mainQuestnotclonewrp = jQuery('.quest_field_clone_wrp');
				var form = jQuery(this).closest('.quest_field_wrp');
				var num = parseInt(form.attr('ansnumb')) + 1;
				var num1 = parseInt(form.attr('questnumb')) + 1;
				var questvalid = true;

				var storeviseleID;
				form.find('.oneofanstypeoptwrp').each(function(){
					if($(this).is(":visible")) {
						storeviseleID = $(this).attr('id');
					}
				});

				var els = form.find('#'+storeviseleID+' .multichoiceinn_row textarea').filter(function() {
					return this.value !== "" && this.value !== "0";
				});

				//console.log(els.length);


				var questval = form.find('.quest_field .mainquestfield').val();
				if(questval == "" || questval == null){
					form.find('.questerr').text('Please write your question');
					questvalid = false;
				} else {
					form.find('.questerr').text('');
				}

				if(storeviseleID != "StarRatingQuestion" && storeviseleID != "SingleTextboxQuestion") {
					if (els.length == 0) {
						form.find('#'+storeviseleID+' #multichoiceerr').text('You are required to have at least one choice.');
						questvalid = false;
					} else {
						form.find('#'+storeviseleID+' #multichoiceerr').text('');
					}
				}

				if(questvalid) {
					form.find('.quest_field label span').text(num1);
					form.closest('form').find('.all_enter_quest_wrp').append('<div class="quest_ans_wrp" id='+num+'><div class="clearfix survey_prevquest_block"><div class="left"><h3>Q<span class="questno">'+num+'</span> <span>'+questval+'</span></h3><input type="hidden" class="hiddensurveyquest" name="surveyquestno_'+num+'" value="'+questval+'"></div><div class="right alignright"><a href="javascript:;" class="sitebtn editbtn">Edit</a><a href="javascript:;" class="sitebtn deletebtn">Delete</a></div></div><div class="survey_prevansw_block"></div></div>');

					var AnswerWrapper = form.closest('form').find('.all_enter_quest_wrp .quest_ans_wrp:last-child .survey_prevansw_block');

					surveyQuestAnsAddUpdateFun(AnswerWrapper,mainQuestnotclonewrp,storeviseleID);

					// form.find('.quest_field_wrp:last').hide();
					jQuery('.add_new_quest_block').slideDown();
					mainQuestnotclonewrp.find('.quest_field_wrp').hide();
					mainQuestnotclonewrp.find('.quest_field .mainquestfield').val('');
					mainQuestnotclonewrp.find("textarea").val("");
					mainQuestnotclonewrp.find('.richText-editor div').empty();
					form.attr('ansnumb',num);
					form.attr('questnumb',num1);
					jQuery('.next_questbtn_wrp .sitebtn').removeClass('disablebtn');
					jQuery('.add_new_quest_block .addnewquestbtn').removeClass('disablebtn');
					mainQuestnotclonewrp.find('.ansbankcatselectoptwrp').hide();
					emptyMultifieldFunct(form);
				}
		
			}
		});

		function addDiv(multiwrp) {
			multiwrp.find('.multichoice_field').append(multichoicevar);
		}

		$(document).on("input",".quest_field input",function(){
			var parntQuestField = jQuery(this).closest('.quest_field_wrp');
			// var checkemptyquest = this.value;
			if(!parntQuestField.find('.oneofanstypeoptwrp').is(":visible")) {
				parntQuestField.find('#MultipleChoiceQuestion').slideDown();
				parntQuestField.find('.ansbankcatselectoptwrp').show();
				parntQuestField.find('.savecanquestbtnwrp').show();
			}
		});

		// End (New Surve Js)

	// Delete survey question jquery (New Surve Js)
		jQuery(document).on('click','.deletebtn',function(){
			var countanswrpafterdel = jQuery('.all_enter_quest_wrp .quest_ans_wrp').length;
			// console.log(countanswrpafterdel);
			var row = $(this).closest('.quest_ans_wrp');
			var id = row.attr("id");
			// alert("Deleting id #" + id);
			var siblings = row.siblings();
			row.remove();
			if(!$.trim( $('.all_enter_quest_wrp').html()).length ) {
					jQuery('.quest_field_clone_wrp .quest_field label').find('span').text(1);
					jQuery('.quest_field_clone_wrp .quest_field_wrp').attr('ansnumb',0);
					jQuery('.quest_field_clone_wrp .quest_field_wrp').attr('questnumb',1);
				jQuery('.quest_field_clone_wrp .add_new_quest_block').hide();
				jQuery('.next_questbtn_wrp .nextbtn').addClass('disablebtn');
			} else {
				siblings.each(function(index) {
					$(this).children().first('h3').find('.questno').text(index+1);
					$(this).attr('id',index+1);
					jQuery('.quest_field_clone_wrp .quest_field label').find('span').text(index+2);
					jQuery('.quest_field_clone_wrp .quest_field_wrp').attr('ansnumb',index+1);
					jQuery('.quest_field_clone_wrp .quest_field_wrp').attr('questnumb',index+2);
				});
			}

			jQuery('.all_enter_quest_wrp .quest_ans_wrp').each(function(){
				var currquestansID = jQuery(this).attr('id');
				var currquestanscount = parseInt(currquestansID)+1;
				var currqestanswrp = jQuery(this);
				currqestanswrp.find('.quest_field_wrp').attr('ansnumb',currquestansID);
				currqestanswrp.find('.quest_field_wrp').attr('questnumb',currquestanscount);
				currqestanswrp.find('.quest_field label').find('span').text(currquestansID);
				currqestanswrp.find('.hiddensurveyquest').attr('name','surveyquestno_'+currquestansID+'');
				currqestanswrp.find('.hiddensurveyans').attr('name','surveyansno_'+currquestansID+'');
				currqestanswrp.find('.hiddensurveyanstype').attr('name','surveyanstype_'+currquestansID+'');
				currqestanswrp.find('.hiddensurveyratingcolr').attr('name','surveyansratingcolr_'+currquestansID+'');
			});

			if (countanswrpafterdel == 1) {
				jQuery('.quest_field_clone_wrp .quest_field_wrp').show();
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').hide();
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').find("textarea").val("");
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').find('.richText-editor div').empty();
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').find('#multichoice .qType').attr('value','MultipleChoiceQuestion');
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').find('.add-q-menu-container ul li a').removeClass('selected');
				jQuery('.quest_field_clone_wrp .oneofanstypeoptwrp').find('.add-q-menu-container ul li:first-child a').addClass('selected');
			}
		});


	 jQuery('.next_questbtn_wrp .sitebtn').on('click',function(){
		 jQuery('.survey_preview_popup').fadeIn();
		 modalShow(true);
		 jQuery('.surveypreviewfrm').html('');
		 jQuery('.all_enter_quest_wrp').find('.quest_ans_wrp').each(function(){
			 var prevseltype = jQuery(this).find('.survey_prevansw_block').attr('id');
			 jQuery('.surveypreviewfrm').append('<div class="sur_preview_wrp" id="preview_'+prevseltype+'"></div>');
			 var prequest = jQuery(this).find('.survey_prevquest_block .left h3 span:nth-child(2)').text();
			 var preans = jQuery(this).find('.survey_prevansw_block').html();
			 jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append('<label>'+prequest+'</label>');
			 jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append(preans);
		 });
	 });

	 jQuery('.survey_preview_popup .closepoup').on('click',function(){
		 jQuery('.survey_preview_popup').fadeOut();
		 modalShow(false);
	 });

	jQuery(document).on('click','.survey_upload_inst_btn a.upload_logo,.editupdatedlogo',function(){
		if($(this).hasClass('hidedisbtn')){
			jQuery('.recomsurvybtn_wrp a').addClass("multiple_docs")
		}
		jQuery('.upload_logo_popup').fadeIn();
		 jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img src="'+jQuery('.uploadlogoimgs').attr('src')+'"></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
		jQuery('.recomsurvybtn_wrp a').removeClass("coach_img")
		jQuery('.recomsurvybtn_wrp a').removeClass("intake_logo")
		modalShow(true);
		});

	 jQuery(document).on('click','.upload-doc-here',function(){
		jQuery('.upload_logo_popup').fadeIn();
		 modalShow(false);
		 jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img src="'+jQuery('.uploadlogoimgs').attr('src')+'"></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
		 jQuery('.recomsurvybtn_wrp a').addClass("coach_img")
		 jQuery('.recomsurvybtn_wrp a').removeClass("multiple_docs")
		 jQuery('.recomsurvybtn_wrp a').removeClass("intake_logo")
		 $('.upload_logo_popup h2').text("Upload your profile")
		 $('.recomm_survey_color_popup h2').text("Your profile")
	 });

	 jQuery(document).on('click','.main_box a.upload_logo ',function(){
		jQuery('.upload_logo_popup').fadeIn();
		modalShow(true);
		 jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img src="'+jQuery('.uploadlogoimgs').attr('src')+'"></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
		 jQuery('.recomsurvybtn_wrp a').removeClass("coach_img")
		 jQuery('.recomsurvybtn_wrp a').removeClass("multiple_docs")
		 jQuery('.recomsurvybtn_wrp a').addClass("intake_logo")

	 });

	 jQuery('.upload_logo_popup .closepoup,.upload_logo_popup_inn a.canceluploadlogo').on('click',function(){
		 jQuery('.upload_logo_popup').fadeOut();
		 modalShow(false);
	 });

	//  jQuery('.upload_logo_popup_ci .closepoup,.upload_logo_popup_inn a.canceluploadlogo').on('click',function(){
	// 	jQuery('.upload_logo_popup_ci').fadeOut();
	// });
	
	 jQuery(document).on('click','.upload_logo_wrp',function(){
		 var triguploadlogo = jQuery('.upload_logo_popup_inn').find('#uploadlogo');
		 jQuery(triguploadlogo).trigger('click');
	 });

	
		 jQuery('.next_questbtn_wrp .sitebtn').on('click',function(){
			 jQuery('.survey_preview_popup').fadeIn();
			 modalShow(true);
			 jQuery('.surveypreviewfrm').html('');
			 jQuery('.all_enter_quest_wrp').find('.quest_ans_wrp').each(function(){
				 var prevseltype = jQuery(this).find('.survey_prevansw_block').attr('id');
				 jQuery('.surveypreviewfrm').append('<div class="sur_preview_wrp" id="preview_'+prevseltype+'"></div>');
				 var prequest = jQuery(this).find('.survey_prevquest_block .left h3 span:nth-child(2)').text();
				 var preans = jQuery(this).find('.survey_prevansw_block').html();
				 jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append('<label>'+prequest+'</label>');
				 jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append(preans);
			 });
		 });

		 jQuery('.survey_preview_popup .closepoup').on('click',function(){
			 jQuery('.survey_preview_popup').fadeOut();
			 modalShow(false);
		 });


		

		 jQuery('.recomm_survey_color_popup .closepoup,.recomm_survey_color_popup .skip_recom_color').on('click',function(){
			 jQuery('.recomm_survey_color_popup').fadeOut();
		 });


		jQuery('.next_questbtn_wrp .sitebtn').on('click',function(){
			jQuery('.survey_preview_popup').fadeIn();
			modalShow(true);
			jQuery('.surveypreviewfrm').html('');
			jQuery('.all_enter_quest_wrp').find('.quest_ans_wrp').each(function(){
				var prevseltype = jQuery(this).find('.survey_prevansw_block').attr('id');
				jQuery('.surveypreviewfrm').append('<div class="sur_preview_wrp" id="preview_'+prevseltype+'"></div>');
				var prequest = jQuery(this).find('.survey_prevquest_block .left h3 span:nth-child(2)').text();
				var preans = jQuery(this).find('.survey_prevansw_block').html();
				jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append('<label>'+prequest+'</label>');
				jQuery('.surveypreviewfrm').find('.sur_preview_wrp:last-child').append(preans);
			});
		});

		jQuery('.survey_preview_popup .closepoup').on('click',function(){
			jQuery('.survey_preview_popup').fadeOut();
			modalShow(false);
		});

		var imgsrc = jQuery("#hiddendefuplimg").attr('imgsrc');


		

		// jQuery(document).on('click','.deleteupdatedlogo',function(){
		// 	chk = $(this).parent().parent().parent().parent().parent().attr('class')
		// 	if ('lrc_content_step'.indexOf(chk)) {
		// 	   jQuery('.showuploadlogo').hide();
		// 	   jQuery('.to_complete').hide();
		// 	   jQuery('.survey_upload_inst_btn .alignright').html('<div class="alignright customleft"> <a href="javascript:;" class="upload_logo to_upload"><i class="fa fa-upload"></i> Upload Logo</a> </div>');
		//    }
		// 	else{
		// 	jQuery('.showuploadlogo').hide();
		// 	jQuery('.upload_logo').show();
		// 	jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img src="Images/uploadimg.svg"></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
		// 	jQuery('.survey_upload_inst_btn .alignright').html('<a href="javascript:;" class="upload_logo sitebtn">Update Logo</a>');
		// 	}
		// });	

		jQuery(document).on('click','#deleterptlogo',function(){
			alert($(this).attr('data'))
		});

		// jQuery('.deleteupdatedlogo').on('click',function(){
		// 	jQuery('.recomm_survey_color_popup').fadeOut();
		// });
		
		jQuery(document).on('click','.deleteupdatedlogo',function(){
		chk = $(this).closest('.lrc_content_step')
		 if (chk.hasClass('upload_complete')) {
			jQuery('.showuploadlogo').hide();
			jQuery('.to_complete').hide();
			jQuery('.logo-parent').html('<div class="survey_upload_inst_btn upload_logo_cta"> <div class="alignright"> <div class="alignright customleft"> <a href="javascript:;" class="upload_logo to_upload"><i class="fa fa-upload"></i> Upload Logo</a> </div></div></div>');
			tp = "delete"
			var endpoint = document.getElementById("deleterptlogo").value;
		}
		 else{
			tp = "POST"
			var endpoint = document.getElementById("deletelogo").value;
			}
			var csrftoken = getCookie('csrftoken');
			var data = {}
			$.ajax({
				type: tp,
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
				if (data['image_url']){
					jQuery('.showuploadlogo').hide();
					jQuery('.upload_logo').show();
					if(tp=="delete"){
					jQuery('.lrc_content_step .logo-parent').html('<div class="survey_upload_inst_btn upload_logo_cta"> <div class="alignright"> <div class="alignright customleft"> <a href="javascript:;" class="upload_logo to_upload"><i class="fa fa-upload"></i> Upload Logo</a> </div></div></div>')
					jQuery('.rptimg').empty();
				}
					else{
					jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img  src='+jQuery('.uploadlogoimgs').attr('src')+'></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
					jQuery('.survey_upload_inst_btn .alignright').html('<a href="javascript:;" class="upload_logo sitebtn">Update Logo</a>');
					}
				  }
				  else{
					  alert(data['fail'])
				  }				
				}
			});
					});



		
 
	  jQuery('.recomm_survey_color_popup .closepoup,.recomm_survey_color_popup .skip_recom_color').on('click',function(){
		  jQuery('.recomm_survey_color_popup').fadeOut();
	  });


	$(document).on("focusout","#inst", function(){
		var data = new FormData();
		data.append('inst', $('#inst').html());
		var csrftoken = getCookie('csrftoken');
		endpoint = window.location.href
		$.ajax({
			type: "POST",
			headers: {'X-CSRFToken': csrftoken},
			url: endpoint,
			data: data,
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {
				console.log('instructions updated')	
			}
		
 		});
	})
	
	jQuery('.show_intake_form_preview').on('click',function(){
		$('.submited_form_popup').modal('hide');
		logo = $('.showuploadlogoimgwrp img').attr('src')	
		$('.intake_preview_popup').modal('show');
		$('.coach_img img').attr('src', logo)
		console.log(logo)
	})


	jQuery('.submit_intake_form').on('click',function(){
		var email = jQuery('#emailerr').text()
   		if(email == "" || email == null) {	
			var data = new FormData($('#client_intake_form').get(0));
			data.append('logo', $('.edit-brand-logo img').attr('src'));
			data.append('inst', $('#inst').html());
			var csrftoken = getCookie('csrftoken');
			endpoint = window.location.href
			$('.submit_intake_form').css('pointer-events','none')	
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('.submit_intake_form').css('pointer-events','auto')
					if (data['failmessage']){
						alert(data['failmessage']);
						$('#emailerr').text(data['failmessage']);
					}
					else{
						email = $('#email').val()
						$('#previewemail').val(email)							
							if($('.intake_preview_popup').is(':visible')){
								console.log('data saved')					
							}	
							else{
								alert('Data saved')	
								if(data['status']){
									window.location.reload()
								}							
						}	}					
				},
				error: function(data) {
					$('.submit_intake_form').css('pointer-events','auto')
					alert('Invalid file, upload another file')

				}
			});
		}
		else{
			location.href = "#email";
		}		
	})

	$(document).on('click','#shwfiles button',function() {
		ele = $(this).parent()
		if($(this).attr('id') == 'notuploadedyet'){
			ele.hide()
		}
		else{
			ele = $(this).parent()
			id = $(this).attr('id')
			var csrftoken = getCookie('csrftoken');
			endpoint = window.location.href+'?id='+id
			$.ajax({
				type: "DELETE",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: id,
				dataType: "json",
				processData: false,
				contentType: false,
				success:function(data) {
					ele.hide()
					alert('Successfully deleted image');	
				}
			
			});
		}
	})

	$(".multiplefileinput input[name=file]").change(function() {
		var names = [];
		for (var i = 0; i < $(this).get(0).files.length; ++i) {
			names.push($(this).get(0).files[i].name);
			path=(window.URL || window.webkitURL).createObjectURL($("input[name=file]").get(0).files[i])
			if($(this).get(0).files[i].name.substr(-4).toLowerCase().match(/\.(jpg|png|gif|jpeg|svg)/g)){
				$('#shwfiles').append('<div class="multiple-file-wrap"><img src="'+path+'" style="height: 100px; width: 100px;"><button type="button" class="sitebtn add_question" id="notuploadedyet">Remove file</button></div>')
			}
			else{
			$('#shwfiles').append('<div class="multiple-file-wrap"><span>'+$(this).get(0).files[i].name+'</span><button type="button" class="sitebtn add_question" id="notuploadedyet">Remove file</button></div>')
			}
		}

		var data = new FormData($('#submit_files').get(0));
		jQuery('.loader-wrap').show();
		data.append('qwe','ef')
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/intake-responses/"
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': token},
				url: url,	
				data: data,	
				enctype: 'multipart/form-data',
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType
			dataType: "json",
				success:function(data) {
					console.log('files added')
					location.reload()
				}, 
				error: function(data) {
					console.log('data')
				}
			});

	});

	jQuery('.remove_image_btn').on('click',function(){
		$(this).hide();
		// $(this).parent().find('.showuploadlogo').hide();
		$('.showuploadlogoimgwrp').parent().hide()
		jQuery('.survey_upload_inst_btn .upload-doc-here').show();
		var data = new FormData();			
			var csrftoken = getCookie('csrftoken');
			endpoint = window.location.href
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('#profileDropdown img').attr('src', data['image_url'] );	
				}
			
			});
	})
 
	  jQuery('.recomsurvybtn_wrp a').on('click',function(){
		src = $('.showuploadlogoimgwrp img').attr("src")
		  if($(this).hasClass('coach_img')){
			$('.upload_logo_popup h2').text("Upload your logo")	
			$('.recomm_survey_color_popup h2').text("Your logo")
			$('.showuploadlogo img').attr('src', $('#recom_survey_logo img').attr('src'));
			$('.showuploadlogo').show();
			$('.recomm_survey_color_popup').hide();
			$('.survey_upload_inst_btn a.upload-doc-here').hide();
			$('.remove_image_btn').show();
			// $('.upload-doc-here').empty()
			// $('.upload-doc-here').addClass('remove_image_btn')
			// $('.remove_image_btn').removeClass('upload-doc-here')
			// $('.upload-doc-here').append('<i class="fa fa-trash" aria-hidden="true"></i>')

			var data = new FormData();
			data.append('image', $('#uploadlogo')[0].files[0]);
			var csrftoken = getCookie('csrftoken');
			endpoint = window.location.href
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('#profileDropdown img').attr('src', data['image_url']);	
				},
				error: function(data) {
					// alert('Image size should be less than 1 MB.')
					alert('Invalid file, upload another file')
				}
			
			});
		  }
		  else if($(this).hasClass('multiple_docs')){
			$('.recomm_survey_color_popup').hide();
			$('.to_upload').hide();
			$('.to_complete').show();
		  }
		  else if($(this).hasClass('intake_logo')){
			$('.recomm_survey_color_popup').hide();			
			var data = new FormData();
			data.append('logo', $('#uploadlogo')[0].files[0]);
			var csrftoken = getCookie('csrftoken');
			endpoint = window.location.origin+'/profile/'
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					$('.main_box .upload_logo').hide();
					$('.logo_container').empty()
					$('.logo_container').append(' <div class=" intake-logo"> <img class="main_intake_image"src="'+$('#recom_survey_logo img').attr('src')+'"> <a href="javascript:;" class="remove_intake_img"><i class="fa fa-trash" aria-hidden="true"></i></a> </div>')			
					
				},
				error: function(data) {
					// alert('Image size should be less than 1 MB.')
					alert('Invalid file, upload another file')
				}
			
			});
			}
		  else{			
			$('.recomm_survey_color_popup').hide();
			modalShow(false);
			$('.to_upload').hide();
			$('.to_complete').show();
			$('.rptimg').empty();
			$('.rptimg').append('<img src='+src+'>');
			var endpoint = $("#uploadlogofrm").attr("action");
			var csrftoken = getCookie('csrftoken');
			id = $('#reportid').val();
			//  if (id !== 'undefined' || id !== '' || id !== undefined || id !== null){
			// 	var data = new FormData();
			// 	data.append('src',src);
			// 	data.append('id',id);
			// 	alert('id')
			//  }
			// else{
				var data = new FormData($('#uploadlogofrm').get(0));
				data.append('file', $('#uploadlogo')[0].files);
				//  data.append('id', $('#uploadlogo')[0].files);

			// }
				$.ajax({
					type: "POST",
					headers: {'X-CSRFToken': csrftoken},
					url: endpoint,
					data: data,

					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
					if (data['image_url']){
						jQuery('#recom_survey_logo img').attr('src',data['image_url'])
						jQuery('.showuploadlogoimgwrp img').attr('src', data['image_url']);
						chk = $('.lrc_content_step')
						if (chk.hasClass('upload_complete')) {
							jQuery('.survey_upload_inst_btn .alignright').html('<div class="showuploadlogo"><div class="showuploadlogoimgwrp"><img src='+ data['image_url']+' alt=""></div><div class="edit_delet_logo_wrp"><a href="javascript:;" class="editupdatedlogo sitebtn">Edit</a><a href="javascript:;" class="deleteupdatedlogo sitebtn">Delete</a></div><a href="javascript:;" class="upload_logo to_complete" ><i class="fa fa-check"></i> Completed</a></div>');
							jQuery('.head_part .logo img').attr('src',data['image_url'])
						}
						else{
						jQuery('.survey_upload_inst_btn .alignright').html('<div class="showuploadlogo"><div class="showuploadlogoimgwrp"><img src='+ data['image_url']+' alt=""></div><div class="edit_delet_logo_wrp"><a href="javascript:;" class="editupdatedlogo sitebtn">Edit</a><a href="javascript:;" class="deleteupdatedlogo sitebtn">Delete</a></div></div>');
						} 
						jQuery('.upload_logo_popup').fadeOut();
						modalShow(false);
						//   jQuery('.recomm_survey_color_popup').fadeIn();
	
					}
					else{
						alert(data['fail'])
					}
	
					}
				
	//  });
 
	 //  jQuery('#shw_rep_gen_pop').on('click',function(){		
		 // url = ($(this).attr('url'));		
		 // // $('#logo_updated').fadeIn();
		 // token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
		 // $.ajax({
		 // 	method: "POST",
		 // 	headers: {'X-CSRFToken': token},
		 // 	url: url,
		 // 	data: data,
		 // 	processData: false,
		 // 	contentType: false,
		 // 	dataType: "json",
		 // 	success:function(data) {
		 // 		console.log('here done')				
		 // 	}, 
		 // 	error: function(data) {
		 // 	}
		  // })
	 });

	}

		  	// var file = $(this)[0].files[0].name;
		  	// var filesrc = $(this).closest('form').prev('.upload_logo_wrp').find('.uploadimg img');
		  	// readURL(this,filesrc);
		  	// readURL(this,'#recom_survey_logo img');
		  	// readURL(this,'.showuploadlogo img');
		  	// jQuery('.survey_upload_inst_btn a.upload_logo').hide();
		  	// jQuery('.showuploadlogo').show();
		  	// $(this).closest('form').prev('.upload_logo_wrp').find('.uploadimgname').html('<p>'+file+'</p>');
		  	// jQuery('.upload_logo_popup').fadeOut();
			// jQuery('.recomm_survey_color_popup').fadeIn();


		});

		// $(document).on('change','#uploadlogo',function() {
		//   	var file = $(this)[0].files[0].name;
		//   	var filesrc = $(this).closest('form').prev('.upload_logo_wrp').find('.uploadimg img');
		//   	readURL(this,filesrc);
		//   	readURL(this,'#recom_survey_logo img');
		//   	readURL(this,'.showuploadlogo img');
		//   	jQuery('.survey_upload_inst_btn a.upload_logo').hide();
		//   	jQuery('.showuploadlogo').show();
		//   	$(this).closest('form').prev('.upload_logo_wrp').find('.uploadimgname').html('<p>'+file+'</p>');
		//   	jQuery('.upload_logo_popup').fadeOut();
		//   	jQuery('.recomm_survey_color_popup').fadeIn();
		//   	jQuery('.survey_upload_inst_btn .alignright').html('<div class="showuploadlogo"><div class="showuploadlogoimgwrp"><img src="" alt=""></div><div class="edit_delet_logo_wrp"><a href="javascript:;" class="editupdatedlogo sitebtn">Edit</a><a href="javascript:;" class="deleteupdatedlogo sitebtn">Delete</a></div></div>');
		// });

		jQuery('.recomm_survey_color_popup .closepoup,.recomm_survey_color_popup .skip_recom_color').on('click',function(){
			jQuery('.recomm_survey_color_popup').fadeOut();
		});

	// jQuery for multiple choice dropdown (New Surve Js)
		jQuery(document).on('click','div#multichoice',function(){
			if($(this).next().is(":visible")) {
				jQuery(this).next().slideUp();
			} else {
				jQuery(this).next().slideDown()
			}

		});	
		var multichoicevar = '<div class="multichoiceinn_row"> <div class="q-ans-input"> <label><input type="radio" name="your_selection"> </label> <div class="answer-wrp"> <textarea placeholder="Enter an answer choice"></textarea> <span class="error" id="multichoiceerr"></span> </div><div class="add_remove_ansrow_icon_wrp"> <a href="javascript:;" class="addansrow">+</a> <a href="javascript:;" class="removeansrow">-</a> </div></div></div>';
		var multichoiceerrvar = '<span class="error" id="multichoiceerr"></span>';

		jQuery(document).on('click','.add_remove_ansrow_icon_wrp .addansrow',function(){

			var curQuestfieldele = jQuery(this).closest('.oneofanstypeoptwrp');
			var checkremans = jQuery(this).closest('.multichoiceinn_row').find('.removeansrow');
			if(!checkremans.length){
				jQuery(this).closest('.multichoiceinn_row').find('.add_remove_ansrow_icon_wrp').append('<a href="javascript:;" class="removeansrow">-</a>');
			}
			jQuery(multichoicevar).insertAfter(jQuery(this).closest('.multichoiceinn_row'));
			if (curQuestfieldele.find('#multichoiceerr').length === 0) {
				curQuestfieldele.find('.multichoiceinn_row:first-child .answer-wrp').append(multichoiceerrvar);
			}
		});

		jQuery(document).on('click','.add_remove_ansrow_icon_wrp .removeansrow',function(){
			var curQuestfield = jQuery(this).closest('.oneofanstypeoptwrp');
			curQuestfield.prev('.switch input').prop('checked',false);
			jQuery(this).closest('.multichoiceinn_row').remove();
			if(curQuestfield.find('.multichoiceinn_row').length == 1) {
				curQuestfield.find('.multichoiceinn_row .removeansrow').remove();
			}
			if(curQuestfield.find('#multichoiceerr').length === 0) {
				curQuestfield.find('.multichoiceinn_row:first-child .answer-wrp').append(multichoiceerrvar);
			}
			curQuestfield.prev('.anschoice_title .right').addClass('disableansCatchange');
		});

		function richTextFunct(thistextarea){
			jQuery(thistextarea).richText({
							leftAlign: false,
							centerAlign: false,
							rightAlilgn: false,
							justify:false,
							ol:false,
							ul:false,
							fontList:false,
							table:false,
							toggleCode:false,
							autoFocus:true
						});
					setTimeout(()=>{
					
						jQuery(thistextarea).find('.richText').addClass('chal')
					},1000)
						// editor1.focus();   
		}

		jQuery(document).on("focus",".q-ans-input textarea",function() {
			richTextFunct(jQuery(this));
		});


		// jQuery(document).ready(function() {
		// 	$('.q-ans-input textarea').trigger('focus');
		// })

		jQuery(document).on("click",".richText-editor",function(){
			$('.richText-editor').not(this).each(function(){
				$(this).closest('.richText').find('.richText-toolbar').hide();
				var checkeditorempty = $(this).closest('.richText').find(".richText-editor");
				var $notEmptySpans1 = checkeditorempty.filter(function() {
				    if($(this).text().trim().match(/\S/) == null) {
				    	$(this).closest('.multichoiceinn_row').addClass('remove_multieditor');
				        $('.remove_multieditor').find('.richText-toolbar').hide();
			        	$('.remove_multieditor').find('.richText div').remove();
			        	$('.remove_multieditor').find('textarea').unwrap('.richText');
			        	$('.remove_multieditor').find('textarea').show();
			        	$('.remove_multieditor').find('textarea').removeAttr('class');
			        	$('.remove_multieditor').find('textarea').val('');
			        } else {
			        	$(this).closest('.multichoiceinn_row').removeClass('remove_multieditor');
			        }
				});
		    });
		    $(this).closest('.richText').find('.richText-toolbar').show();
		});

		$(document).mouseup(function(e){
		    var container = $(".multichoiceinn_row");
		    // if the target of the click isn't the container nor a descendant of the container
		    if (!container.is(e.target) && container.has(e.target).length === 0) {
		        $('.multichoiceinn_row').find('.richText-toolbar').hide();
		        var $notEmptySpans = $(".richText-editor").filter(function() {
				    if($(this).text().trim().match(/\S/) == null) {
				    	$(this).closest('.multichoiceinn_row').addClass('remove_multieditor');
				        $('.remove_multieditor').find('.richText-toolbar').hide();
			        	$('.remove_multieditor').find('.richText div').remove();
			        	$('.remove_multieditor').find('textarea').unwrap('.richText');
			        	$('.remove_multieditor').find('textarea').show();
			        	$('.remove_multieditor').find('textarea').removeAttr('class');
			        	$('.remove_multieditor').find('textarea').val('');
			        } else {
			        	$(this).closest('.multichoiceinn_row').removeClass('remove_multieditor');
			        }
				});
		    }
		});


	// Switch toggle jquery (New Surve Js)
		jQuery(document).on('change','.switch input[type="checkbox"]',function(){
			var parAddopt3 = jQuery(this).closest('.quest_field_wrp');
			var select_opti = parAddopt3.find('#answerBankCategorySelect option:selected').val();
	        if(this.checked) {
	        	parAddopt3.find('#answerBankCategorySelect').removeClass('disablebankcatselect');
	        } else if(this.checked && select_opti !== "" && select_opti !== null) {
	        	parAddopt3.find('.anschoice_title .scale-container').css('display','inline-block');
	        } else {
	        	parAddopt3.find('#answerBankCategorySelect').addClass('disablebankcatselect');
	        	parAddopt3.find('#answerBankCategorySelect').val('');
	        	parAddopt3.find('.anschoice_title .scale-container').hide();
	        }
	    });

		jQuery(document).on('change','#answerBankCategorySelect',function(){
			var parAddopt4 = jQuery(this).closest('.quest_field_wrp');
		 	if(this.value && parAddopt4.find('.switch input[type="checkbox"]').is(':checked')) {
		 		parAddopt4.find('.anschoice_title .scale-container').css('display','inline-block');
		 	} else {
		 		parAddopt4.find('.anschoice_title .scale-container').hide();
		 	}
		});

	// jQuery for anserbankcategory select
		var agreedisagreeopt_7 = '<div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Strongly agree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp third_wrp second_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Agree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Somewhat agree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp third_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Neither agree nor disagree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Somewhat disagree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp third_wrp second_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Disagree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Strongly disagree</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div>';

		var satisdisatisopt_7 = '<div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Very dissatisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp third_wrp second_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Dissatisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Somewhat dissatisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp third_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Neither satisfied nor dissatisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Somewhat satisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp third_wrp second_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Satisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div><div class="multichoiceinn_row multichoiceinn_row_add fifth_wrp fourth_wrp"><div class="q-ans-input"><label><span></span></label><div class="answer-wrp"><textarea placeholder="Enter an answer choice">Very satisfied</textarea></div><div class="add_remove_ansrow_icon_wrp"><a href="javascript:;" class="addansrow">+</a><a href="javascript:;" class="removeansrow">-</a></div></div></div>';
		
		var yesornoopt = '<div class="multichoiceinn_row"> <div class="q-ans-input"> <label><input type="radio" name="your_selection"> </label> <div class="answer-wrp"> <textarea placeholder="Enter an answer choice"></textarea> <span class="error" id="multichoiceerr"></span> </div><div class="add_remove_ansrow_icon_wrp"> <a href="javascript:;" class="addansrow">+</a> <a href="javascript:;" class="removeansrow">-</a> </div></div></div>'

		var scale7opt = '<option value="2" class="yesnoopt">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="7" selected>7</option>';

	 	jQuery(document).on('change','#answerBankCategorySelect',function(){
	 		var parAddopt = jQuery(this).closest('.quest_field_wrp');
	 		if(parAddopt.find('#answerBankScaleSelect').has('option').length == 0) {
	 			parAddopt.find('#answerBankScaleSelect').html(scale7opt);
	 		}
 			parAddopt.find('.switch input').prop('checked',true);
 			parAddopt.find('.anschoice_title .scale-container').css('display','inline-block');
 			parAddopt.find('.anschoice_title .right').removeClass('disableansCatchange');
 			answerBankCategoryFunct(parAddopt);
	 	});

	 	jQuery(document).on('change','#answerBankScaleSelect',function(){
	 		var parAddopt1 = jQuery(this).closest('.quest_field_wrp');
	 		parAddopt1.find('.anschoice_title .right').removeClass('disableansCatchange');
	 		parAddopt1.find('.switch input').prop('checked',true);
	 		answerBankCategoryFunct(parAddopt1);
	 	});

	 	jQuery(document).on('change','.switch input',function(){
	 		var parAddopt2 = jQuery(this).closest('.quest_field_wrp');
 			parAddopt2.find('.anschoice_title .right').removeClass('disableansCatchange');
 			answerBankCategoryFunct(parAddopt2);
	 	});

	 // Function for answerBankCategory html
	 	function answerBankCategoryFunct(thisele){
	 		var scalevalonchange = thisele.find('#answerBankScaleSelect option:selected').val();
	 		var answerbankcatval = thisele.find('#answerBankCategorySelect option:selected').val();
	 		var selecttypecheck = thisele.find('.switch input:checked').length;
	 		if(answerbankcatval && selecttypecheck > 0) {
	 			if(answerbankcatval == '1') {
		 			thisele.find('.multichoice_field').html(agreedisagreeopt_7);
		 			thisele.find('#answerBankScaleSelect').removeClass('scale2show');
		 			if(scalevalonchange == 7) {
			 			thisele.find('.multichoiceinn_row').show();
			 		} else if(scalevalonchange == 5) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.fifth_wrp').show();
			 		} else if(scalevalonchange == 4) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.fourth_wrp').show();
			 		} else if(scalevalonchange == 3) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.third_wrp').show();
			 		} else if(scalevalonchange == 2) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.second_wrp').show();
			 		}
		 		} else if(answerbankcatval == '2') {
		 			thisele.find('.multichoice_field').html(satisdisatisopt_7);
		 			thisele.find('#answerBankScaleSelect').removeClass('scale2show');
		 			if(scalevalonchange == 7) {
			 			thisele.find('.multichoiceinn_row').show();
			 		} else if(scalevalonchange == 5) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.fifth_wrp').show();
			 		} else if(scalevalonchange == 4) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.fourth_wrp').show();
			 		} else if(scalevalonchange == 3) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.third_wrp').show();
			 		} else if(scalevalonchange == 2) {
			 			thisele.find('.multichoiceinn_row').hide();
			 			thisele.find('.multichoiceinn_row.second_wrp').show();
			 		}
		 		}  else if(answerbankcatval == '3') {
		 			thisele.find('.multichoice_field').html(yesornoopt);
		 			thisele.find('#answerBankScaleSelect').addClass('scale2show');
		 			thisele.find('#answerBankScaleSelect option:first-child').prop('selected','selected');
		 		}
		 	} else {
		 		emptyMultifieldFunct(thisele);
		 		thisele.find('.anschoice_title .scale-container').hide();
				thisele.find('#answerBankScaleSelect').html('');
	 		}
	 	}


	 // Star Rating jQuery
	 	jQuery(document).on('click','.color_box_wrp .colrshow',function(){
	 		if(jQuery(this).next('ul').is(":visible")) {
	 			jQuery(this).next('ul').slideUp();
	 		} else {
	 			jQuery(this).next('ul').slideDown();
	 		}
	 	});

	 	$(document).mouseup(function(e) {
		    var container = $(".color_box_wrp .colrshow");
		    // if the target of the click isn't the container nor a descendant of the container
		    if (!container.is(e.target))
		    {
		        jQuery('.color_box_wrp ul').slideUp();
		    }
		});

	 	jQuery(document).on('click','.color_box_wrp ul li',function(){
	 		jQuery('.color_box_wrp ul li').removeClass('selectedcolr');
	 		jQuery(this).addClass('selectedcolr');
	 		var currcolr = jQuery(this).attr('currcolr');
	 		jQuery('.color_box_wrp .colrshow').attr('class','colrshow '+currcolr+'');
	 		jQuery('.star_option .star_wrp').attr('class','star_wrp '+currcolr+'');
	 	});


	// Answer type checkbox jquery
		jQuery(document).on('click','.add-q-menu-container ul li a.add-q-item',function(){
			var closeAnsWrp = jQuery(this).closest('.quest_field_wrp');
			var singtextboxlength = closeAnsWrp.find('#SingleTextboxQuestion .multichoiceinn_row').length;
			closeAnsWrp.find('.add-q-menu-container ul li a.option.add-q-item').removeClass('selected');
			jQuery(this).addClass('selected');
			var currselanstext = jQuery(this).find('span').text();
			var currseleansopt = jQuery(this).attr('data-action');
			closeAnsWrp.find('.oneofanstypeoptwrp').hide();
			closeAnsWrp.find('#'+currseleansopt).show();
			if(currseleansopt != "StarRatingQuestion" && currseleansopt != "SingleTextboxQuestion") {
				closeAnsWrp.find('.ansbankcatselectoptwrp').show();
			} else {
				closeAnsWrp.find('.ansbankcatselectoptwrp').hide();
			}
			closeAnsWrp.find('#multichoice .qType').text(currselanstext);
			closeAnsWrp.find('#multichoice .qType').attr('value',currseleansopt);
			closeAnsWrp.find('.anschoice_title .right').removeClass('disableansCatchange');
			if(currseleansopt == "SingleTextboxQuestion") {
				no = $('.quest_field_clone_wrp .savequestbtn').closest('.quest_field_wrp').attr('questnumb')
				ansarr[no] = ' '
				if(singtextboxlength>1) {
					closeAnsWrp.find('#SingleTextboxQuestion .multichoiceinn_row').remove();
					closeAnsWrp.find('#SingleTextboxQuestion .multichoice_field').append(multichoicevar);
					if(closeAnsWrp.find('#SingleTextboxQuestion #multichoiceerr').length === 0) {
						closeAnsWrp.find('.multichoiceinn_row:first-child .answer-wrp').append(multichoiceerrvar);
					}
				}
			}
		});

	// Multi Field according to Answer count Function
		function AnsMultifieldFunct(count,currenteleId){
			for (j = 1; j <= count; j++){
				currenteleId.append(multichoicevar);
			}
		}

	// Edit Question Answer jQuery (New Survey js)
		jQuery(document).on('click','.survey_prevquest_block .editbtn',function(){
	
			
		    $('.savequestbtn').attr('data-type','edit');
			var parentwrp = jQuery(this).closest('.quest_ans_wrp');
			var AnsType = parentwrp.find('.survey_prevansw_block').attr('id');
			var QuesType = parentwrp.find('.survey_prevansw_block').attr('selectedquesttype');
			var countAns = parentwrp.find('.survey_prevansw_block .answrp').length;
			var countOpt = parentwrp.find('.survey_prevansw_block .answrp select option').length;
			var countStar = parentwrp.find('.survey_prevansw_block .starratinganswrp').length;
			if (countStar != 0) {
				var	Starcolr = parentwrp.find('.survey_prevansw_block div').attr('class').split(' ').pop();
			}
			var ansno = parentwrp.attr('id');
			// var questno = parseInt(ansno)+1;
			var questno = parseInt(ansno);
			if(parentwrp.find('.quest_field_wrp').length == 0) {
				parentwrp.append(jQuery('.quest_field_clone_wrp .quest_field_wrp').clone().addClass('edit_quest_field_wrp quest_field_clone_wrp '));
				parentwrp.find('#multichoiceerr').text('');
				parentwrp.find('.questerr').text('');
				parentwrp.find("textarea").val("");
				parentwrp.find('.richText-editor div').empty();
			}
			parentwrp.find('.savecanquestbtnwrp').show();
			parentwrp.find('.quest_field_wrp').attr('ansnumb',ansno);
			parentwrp.find('.quest_field_wrp').attr('questnumb',questno);
			var currquestval = parentwrp.find('.left h3 span:nth-child(2)').html();
			parentwrp.find('.quest_field_wrp .quest_field label span').text(ansno);
			parentwrp.find('.answertype_option_list .add-q-menu-container ul li a.add-q-item').each(function(){
				var currdataacti = jQuery(this).attr('data-action');
				if(currdataacti == QuesType) {
					parentwrp.find('.answertype_option_list .add-q-menu-container ul li a.add-q-item').removeClass('selected');
					jQuery(this).addClass('selected');
					var currdataactitext = jQuery(this).text();
						currdataactitext = $.trim(currdataactitext);
					parentwrp.find('#multichoice .qType').text(currdataactitext);
				}
			});
			parentwrp.find('.survey_prevquest_block').hide();
			parentwrp.find('.survey_prevansw_block').hide();
			parentwrp.find('.quest_field_wrp').show();
			parentwrp.find('.quest_field_wrp .oneofanstypeoptwrp').hide();
			parentwrp.find('.quest_field_wrp #'+QuesType+'').show();
			var currmulthtml = parentwrp.find('.quest_field_wrp #'+QuesType+' .multichoice_field');
			currmulthtml.html('');
			if(QuesType == "DropdownQuestion") {
				
				AnsMultifieldFunct(countOpt,currmulthtml);
				var allOpt = [];
				var currallopt = parentwrp.find('.survey_prevansw_block .answrp select option').each(function(){
					var $thisOpt = jQuery(this).text();
					allOpt.push($thisOpt);
				});
				currmulthtml.find('.multichoiceinn_row').each(function(index) {
					jQuery(this).find('textarea').val(allOpt[index]);
					richTextFunct(jQuery(this).find('textarea'));
				});
			} else if(QuesType == "StarRatingQuestion") {
				
				parentwrp.find('.rating_scale_options select option').each(function(){
					allStarcount = $(this).val();
					if(allStarcount == countStar) {
						parentwrp.find('.rating_scale_options select option').removeAttr('selected');
						$(this).prop('selected',true);
					}
				});
				if (countStar != 0) {
					parentwrp.find('.color_box_wrp .colrshow').attr('class','colrshow '+Starcolr+'');
					parentwrp.find('.star_option .star_wrp').attr('class','star_wrp '+Starcolr+'');
				} else {
					parentwrp.find('.color_box_wrp .colrshow').attr('class','colrshow black');
					parentwrp.find('.star_option .star_wrp').attr('class','star_wrp black');
				}
				parentwrp.find('.color_box_wrp ul li').removeClass('selectedcolr');
				parentwrp.find('.color_box_wrp ul li').each(function(){
					if($(this).hasClass(Starcolr)) {
						$(this).addClass('selectedcolr');
					}
				});
			} else {
				AnsMultifieldFunct(countAns,currmulthtml);
				var allAns = [];
				var currallansw = parentwrp.find('.survey_prevansw_block .answrp').each(function(){
					var $this = jQuery(this);
					// $this.find('input').remove();
					var $finalhtml = $this.html();
						$finalhtml = htmlEncode($finalhtml);
					allAns.push($finalhtml);

					let questionNo = $this.closest('.quest_ans_wrp').attr('id')
					if($this.html() == ansarr[questionNo]) {
						// console.log($('.quest_ans_wrp').last().closest('.all_enter_quest_wrp').siblings('.quest_field_clone_wrp').first().find('#MultipleChoiceQuestion').find('.multichoiceinn_row'))
						let optionRows = $('.quest_ans_wrp').last().closest('.all_enter_quest_wrp').find('.quest_ans_wrp').last().find('#MultipleChoiceQuestion').find('.multichoiceinn_row')
						optionRows.each((key, optionRow) => {
							console.log($(optionRow).find('.q-ans-input').first().find('.answer-wrp').text())
						})

					}
				});
				currmulthtml.find('.multichoiceinn_row').each(function(index) {
					jQuery(this).find('textarea').val(htmlDecode(allAns[index]));
					richTextFunct(jQuery(this).find('textarea'));
				});
			}
			parentwrp.find('.switch input').prop('checked',false);
			parentwrp.find('.anschoice_title .scale-container').hide();
			parentwrp.find('#answerBankCategorySelect').addClass('disablebankcatselect');
			parentwrp.find('.quest_field input').val(currquestval);
			var curQuestfielvisible = parentwrp.find('.oneofanstypeoptwrp').not(":hidden");
			if (curQuestfielvisible.find('#multichoiceerr').length === 0) {
				curQuestfielvisible.find('.multichoiceinn_row:first-child .answer-wrp').append(multichoiceerrvar);
			}
			if(curQuestfielvisible.find('.multichoiceinn_row').length == 1) {
				curQuestfielvisible.find('.multichoiceinn_row .removeansrow').remove();
			}
			
		});

	// Cancel Edit Question Answer jQuery
	    jQuery(document).on('click','.edit_quest_field_wrp .cancelquetbtn',function() {
	    	var cancelQuestWrp = jQuery(this).closest('.quest_ans_wrp');
	       	cancelQuestWrp.find('.survey_prevansw_block').show();
	       	cancelQuestWrp.find('.survey_prevquest_block').show();
	       	cancelQuestWrp.find('.edit_quest_field_wrp').remove();
	    });

	// Update Survey Question Answer jQuery
		jQuery(document).on('click','.edit_quest_field_wrp .savequestbtn',function(){

			var updateQuestWrp = jQuery(this).closest('.quest_ans_wrp');
			var questvalid1 = true;
			var storeviseleID1;

			updateQuestWrp.find('.oneofanstypeoptwrp').each(function(){
				if($(this).is(":visible")) {
					storeviseleID1 = $(this).attr('id');
				}
			});

			//console.log(storeviseleID1);

	        var els = updateQuestWrp.find('#'+storeviseleID1+' .multichoiceinn_row textarea').filter(function() {
			    return this.value !== "" && this.value !== "0";
			});

			//console.log(els.length);

			var questval = updateQuestWrp.find('.quest_field .mainquestfield').val();
			if(questval == "" || questval == null){
				updateQuestWrp.find('.questerr').text('Please write your question');
				questvalid1 = false;
			} else {
				updateQuestWrp.find('.questerr').text('');
			}

			if(storeviseleID1 != "StarRatingQuestion" && storeviseleID1 != "SingleTextboxQuestion") {
				if (els.length == 0) {
					updateQuestWrp.find('#'+storeviseleID1+' #multichoiceerr').text('You are required to have at least one choice.');
					questvalid1 = false;
				} else {
					updateQuestWrp.find('#'+storeviseleID1+' #multichoiceerr').text('');
				}
			}

			if(questvalid1) {
				updateQuestWrp.find('.survey_prevquest_block span:nth-child(2)').text(questval);
				updateQuestWrp.find('.survey_prevquest_block .left input').val(questval);

				var AnswerWrapper1 = updateQuestWrp.find('.survey_prevansw_block');

				AnswerWrapper1.html('');
				updateQuestWrp.find('.survey_prevquest_block').show();
				AnswerWrapper1.show();
				updateQuestWrp.find('.edit_quest_field_wrp').hide();

				surveyQuestAnsAddUpdateFun(AnswerWrapper1,updateQuestWrp,storeviseleID1);
			}

			return questvalid1;
		});


		function surveyQuestAnsAddUpdateFun(ansblockelem,currparntelem,currelemID){
			var hiddensurveyanslen = ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').length;
			var hiddensurveyanstypelen = ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').length;
			var hiddensurveyansratcolrelen = ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyratingcolr').length;
			var currsurvAnsID = ansblockelem.closest('.quest_ans_wrp').attr('id');
	    	if(hiddensurveyanslen == 0) {
	    		ansblockelem.closest('.quest_ans_wrp').append('<input type="hidden" name="surveyansno_'+currsurvAnsID+'"  class="hiddensurveyans">');
	    	}
	    	if(hiddensurveyanstypelen == 0) {
	    		ansblockelem.closest('.quest_ans_wrp').append('<input type="hidden" name="surveyanstype_'+currsurvAnsID+'" value='+currelemID+' class="hiddensurveyanstype">');
	    	}
			if(currelemID == 'DropdownQuestion') {
				ansblockelem.html('<div class="answrp"><select></select></div>');
			}
		    if(currelemID == "StarRatingQuestion") {
		     	finalrat = currparntelem.find('.rating_scale_options select option:selected').val();
		     	for(i=1; i<= finalrat; i++) {
		     		ansblockelem.append('<div class="starratinganswrp"><i class="fa fa-star" aria-hidden="true"></i></div>');
		     	}
		     	var starselcolr;
		     	currparntelem.find('.color_box_wrp ul li').each(function(){
		     		if(jQuery(this).hasClass('selectedcolr')) {
		     			starselcolr = jQuery(this).attr('currcolr');
		     			ansblockelem.find('.starratinganswrp').addClass(starselcolr);
		     		}
		     	});
		     	ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').attr('value',finalrat);
		     	if(hiddensurveyansratcolrelen == 0) {
		     		ansblockelem.closest('.quest_ans_wrp').append('<input type="hidden" name="surveyansratingcolr_'+currsurvAnsID+'" class="hiddensurveyratingcolr">');
		     	}
		     	ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyratingcolr').attr('value',starselcolr);
				ansblockelem.attr('id','StarRatingAnswer');
				ansblockelem.attr('selectedQuestType','StarRatingQuestion');
				ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').val('StarRatingQuestion');
		    } else {
				ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyratingcolr').remove();
				currparntelem.find('#'+currelemID+' .multichoiceinn_row').each(function(){
					var ansvalcheck = jQuery(this).find('textarea').val();
					var	Encodehtml = htmlEncode(ansvalcheck);
					var regX = /(<([^>]+)>)/ig;
		            var html = ansvalcheck;
		           		html = html.replace(regX, "");
					if(currelemID == 'MultipleChoiceQuestion') {
						if(ansvalcheck) {
							if (ansvalcheck === ansarr[currsurvAnsID]) {
								// $("input[name='your_selection"+currsurvAnsID+"']").remove();
								ansblockelem.append('<div class="answrp"><input type="radio" name="your_selection'+currsurvAnsID+'" checked="checked"> '+ansvalcheck+'</div>');
							} else {
								ansblockelem.append('<div class="answrp"><input type="radio" name="your_selection'+currsurvAnsID+'">'+ansvalcheck+'</div>');
							}
							ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').attr('value',htmlEncode(ansblockelem.html()));
					    	ansblockelem.attr('id','MultipleChoiceAnswer');
					    	ansblockelem.attr('selectedQuestType','MultipleChoiceQuestion');
							ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').val('MultipleChoiceQuestion');
							// console.log(ansblockelem.find('.answrp').children('label').siblings().last().get())
						}
					} else if(currelemID == 'CheckboxQuestion') {
						if(ansvalcheck) {
					    	ansblockelem.append('<div class="answrp">'+ansvalcheck+'</div>');
					    	ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').attr('value',htmlEncode(ansblockelem.html()));
					    	ansblockelem.attr('id','CheckboxAnswer');
					    	ansblockelem.attr('selectedQuestType','CheckboxQuestion');
							ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').val('CheckboxQuestion');
					    }
					} else if(currelemID == 'DropdownQuestion') {
						if(ansvalcheck) {
					    	ansblockelem.find('select').append('<option value="'+html+'">'+html+'</option>');
					    	ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').remove();
					    	ansblockelem.attr('id','DropdownAnswer');
					    	ansblockelem.attr('selectedQuestType','DropdownQuestion');
							ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').val('DropdownQuestion');
					    }
					} else if(currelemID == 'SingleTextboxQuestion') {
					    	ansblockelem.find('.answrp').remove();
					    	ansblockelem.append('<div class="answrp">'+ansvalcheck+'</div>');
					    	if(ansvalcheck) {
					    		ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').attr('value',htmlEncode(ansblockelem.html()));
					    	} else {
					    		ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyans').attr('value','');
					    	}
					    	ansblockelem.attr('id','SingleTextboxAnswer');
					    	ansblockelem.attr('selectedQuestType','SingleTextboxQuestion');
							ansblockelem.closest('.quest_ans_wrp').find('.hiddensurveyanstype').val('SingleTextboxQuestion');
					}
			    });
		    }
		}

	// Survey Title change popup
		jQuery('.survey_quest_wrp .surveymaintit').on('click',function(){
			$('#newsurveytit').val($('h3.surveymaintit').text().trim())
			jQuery('.survey_title_popup_wrp').show();
		});

		jQuery('.survey_title_popup_wrp .closepoup').on('click',function(){
			jQuery('.survey_title_popup_wrp').hide();
		});

		jQuery('.survey_title_popup_wrp #surveytitsub').on('click',function(e){
			e.preventDefault();
			var surveytitfield = jQuery('#newsurveytit').val();
			if (surveytitfield == "" || surveytitfield == null) {
				jQuery('#newsurveytiterr').text('Please enter new survey title')
			} else {
				var data = new FormData($('#surveytitfrm').get(0));
				//var endpoint = $("#surveytitfrm").attr("action");
				var endpoint = document.getElementById("surveydata").value;
				var csrftoken = getCookie('csrftoken');
				$.ajax({
					type: "POST",
					headers: {'X-CSRFToken': csrftoken},
					url: endpoint,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						if (data['sucess']){
						jQuery('.survey_title_popup_wrp').hide();
						jQuery('#newsurveytiterr').text('');
						jQuery('.survey_quest_wrp .surveymaintit').text(surveytitfield);
						// jQuery('.frmsucc_popup').show()
					  	jQuery('.frmsucc_popup p').text(data['success'])
						// jQuery('#title').text(surveytitfield);
						}
						else{

							jQuery('.frmsucc_popup').show()
							modalShow(true);
					  		jQuery('.frmsucc_popup p').text(data['fail'])
						}


					}
				});

			}

		});

	// Instruction Popup Design
		jQuery('.survey_upload_inst_btn a.instruction').on('click',function(){
			jQuery('#instructions').val('');
			jQuery('.instructions_popup_wrp').fadeIn();
		});

		jQuery('.instructions_popup_wrp .closepoup,.instructions_popup_wrp button#caninstbtn').on('click',function(){
			jQuery('.instructions_popup_wrp').fadeOut();
		});


		jQuery('#instructions').focusout(function () {
		   	var instructionval = jQuery(this).val();
			if(instructionval == "" || instructionval == null){
				jQuery('#instructionerr').text('Please Enter Instructions');
			} else {
				jQuery('#instructionerr').text('');
				jQuery('.instructions_popup_wrp').fadeOut();
				jQuery('.surveyinst_cnt').html('<p>'+instructionval+'</p>');
			}
		});

		jQuery('.instructions_popup_wrp #savinstbtn').on('click',function(e){
			e.preventDefault();
			var validinst = true;
			var instructions = jQuery('#instructions').val();
			if(instructions == "" || instructions == null){
				jQuery('#instructionerr').text('Please Enter Instructions');
				validinst = false;
			} else {
				jQuery('#instructionerr').text('');
			}
			return validinst;
		});


	// New Question jQuery (New Surve Js)
		jQuery('.add_new_quest_block .addnewquestbtn').on('click',function(){
			var mainquestwrp = jQuery('.quest_field_clone_wrp');
			console.log(parseInt($('.quest_ans_wrp').slice(-1).attr('id'))+1)
			// mainquestwrp.show();
			$('.quest_field_clone_wrp[questnumb="'+ parseInt($('.quest_ans_wrp').slice(-1).attr('id'))+1 +'"]').show();
			
			mainquestwrp.find('.quest_field_wrp').show();
			jQuery(this).addClass('disablebtn');
			mainquestwrp.find('.q-ans-input textarea').val('');
			mainquestwrp.find('#answerBankCategorySelect').addClass('disablebankcatselect');
			mainquestwrp.find('#answerBankCategorySelect').prop('selectedIndex',0);
			mainquestwrp.find('.switch input').prop('checked',false);
			mainquestwrp.find('.anschoice_title .scale-container').hide();
			mainquestwrp.find('.oneofanstypeoptwrp').hide();
			mainquestwrp.find('.answertype_option_list .add-q-menu-container ul li .add-q-item').removeClass('selected');
			mainquestwrp.find('#multichoice span.qType').text('Multiple Choice');
			mainquestwrp.find('.answertype_option_list .add-q-menu-container ul:first-child li:first-child .add-q-item').addClass('selected');
			mainquestwrp.find('.survey_questions_block').slideDown();
			var num = mainquestwrp.find('#answerBankScaleSelect option').length;
			mainquestwrp.find('#answerBankScaleSelect').prop('selectedIndex', num-1);
			jQuery('.quest_field_clone_wrp').find('.color_box_wrp .colrshow').attr('class','colrshow black');
			jQuery('.quest_field_clone_wrp').find('.star_option .star_wrp').attr('class','star_wrp black');
			jQuery('.quest_field_clone_wrp').find('.color_box_wrp ul li').removeClass('selectedcolr');
			jQuery('.quest_field_clone_wrp').find('.color_box_wrp ul li:first-child').addClass('selectedcolr');
			jQuery('.quest_field_clone_wrp').find('.rating_scale_options select').val('1');
		});

		// jQuery for submit all survey question
			jQuery('#surveyquestfrm #surveyquestfrmsub').on('click',function(e){
				//e.preventDefault();
				var totalnosurvquest = jQuery('.all_enter_quest_wrp .quest_ans_wrp').length;
				jQuery('#totalsurquestcount').val(totalnosurvquest);
				// var surveyquestfrmdata = jQuery('#surveyquestfrm').serialize();
				var surveyquestfrmdata = new FormData($('#surveyquestfrm').get(0));
				surveyquestfrmdata.append('ans', ansarr);
				//var endpoint = $("#surveyquestfrm").attr("action");
				var endpoint = document.getElementById("surveyqsurl").value;
			var csrftoken = getCookie('csrftoken');
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,
				data: surveyquestfrmdata,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
				  if (data['success']){
					  jQuery('.frmsucc_popup').show()
					  jQuery('.frmsucc_popup p').text(data['success'])
					  modalShow(true);


				  }
				  else{
					jQuery('.frmsucc_popup').show()
					jQuery('.frmsucc_popup p').text(data['fail']);
					modalShow(true);

				  }

				}
			});

				return false;
			});

			jQuery('.frmsucc_popup .closepoup').on('click',function(){
				jQuery('.frmsucc_popup').fadeOut();
				modalShow(false);
			});

		$(document).mouseup(function(e)
		{
		    var container = $(".answertype_option_list");

		    // if the target of the click isn't the container nor a descendant of the container
		    if (!container.is(e.target))
		    {
		        container.slideUp();
		    }
		});

	// Preview Survey Question according to device selection jquery
		jQuery('.deviceview_wrp .desktopicon').on('click',function(){

		});

		jQuery('.deviceview_wrp .tableticon').on('click',function(){

		});

		jQuery('.deviceview_wrp .mobileicon').on('click',function(){

		});

	// jQuery for Ready to send survey
		jQuery('.all_survey_btn .readytosendsurvey').on('click',function(){
			jQuery('.ready_send_survey_popup').show();
		});

		jQuery('.ready_send_survey_popup .closepoup').on('click',function(){
			jQuery('.ready_send_survey_popup').hide();
			modalShow(false);
		});

		jQuery('.ready_send_survey_popup #nosendsurvey').on('click',function(){
			jQuery('.ready_send_survey_popup').hide();
			modalShow(false);
			jQuery('.ready_send_no_survey_popup').show();
		});

		jQuery('.ready_send_no_survey_popup .closepoup').on('click',function(){
			jQuery('.ready_send_no_survey_popup').hide();
			modalShow(false);
		});

});

function readURL(input,imgid) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(imgid).attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}

// Restricts input for the set of matched elements to the given inputFilter function.
(function($) {
  $.fn.inputFilter = function(inputFilter) {
    return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  };
}(jQuery));

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

jQuery(window).on('load',function(){
	// jQuery for survey answer preview list
		var decodeallHtml = jQuery('.survey_prevansw_block').each(function(){
			var htmlval = jQuery(this).text();
			if(htmlval.indexOf("&lt;") >= 0 && htmlval.indexOf("&gt;") >= 0) {
				jQuery(this).html(htmlDecode(htmlval));
			}
		});
	// jQuery for check upload logo
		var  checkimage = jQuery('.showuploadlogoimgwrp img').attr('src');
		if(checkimage) {
			jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img src='+checkimage+' ></div>');
		}
});

