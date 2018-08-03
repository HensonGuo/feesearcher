window.onload = function () {

	// 播放视频
	$("#videoModal").on('show.bs.modal', function(e){
		var url = document.location.toString();
		var arrUrl = url.split("/");

		var fileRoot = "http://" + arrUrl[1]
		var starname = $("#starName span").text()
		
		var artname = $(e.relatedTarget).attr('name')
		var videopath = fileRoot + '/video/' + starname + '/' + artname + '.mp4'
		videopath = 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'

		var children = $('#videoPlayerContainer').children();
		var count = children.length;
		if (!count)
		{
			$('#videoPlayerContainer').append('<video id="videoPlayer" ></video>');
		}
		else{
			for (var child in children)
				children.remove();
			$('#videoPlayerContainer').append('<video id="videoPlayer" ></video>');
		}
		
		var video = $('#videoPlayer').videoCt({
            title: artname,              //标题
            volume: 0.2,                //音量
            barrage: true,              //弹幕开关
            comment: false,              //弹幕
            reversal: true,             //镜像翻转
            playSpeed: true,            //播放速度
            update: true,               //下载
            autoplay: true,            //自动播放
            commentSwitch:true,
            clarity: {
                type: ['高清'],            //清晰度
                src: [videopath]      //链接地址
            },
        });
	})

	//全局body点击
	$('body').mousedown(function(e){
		if (delStarButton){
			if ($(e.target)[0] == delStarButton[0])
				return
		}
		if (delArtButton){
			if ($(e.target)[0] == delArtButton[0])
				return
		}
		hideDelStarButton()
		hideDelArtButton()
	});


	//删除star
	var delStarResponseTimer;
	var starHref;
	var starLink;
	var delStarButton;
	$('.star-cover img').each(function(index, starCover)
	{
		starCover.onmousedown = showDelStarButton;
		starCover.onmouseup = function(e){clearTimeout(delStarResponseTimer);}
		//处理手机事件
		starCover.touchstart = showDelStarButton
		starCover.touchend = function(e){clearTimeout(delStarResponseTimer);}
	})

	function showDelStarButton(e)
	{
		var starCover = e.currentTarget;
		delStarResponseTimer = setTimeout(function(){
			starLink = $(starCover).parent()
			starHref = starLink.attr('href')
			starLink.removeAttr('href');
			delStarButton = starLink.parent().find('.del-button');
			delStarButton.css('visibility', 'visible')
			delStarButton.click(delStar);
		}, 1000)
	}
	function hideDelStarButton()
	{
		if (delStarButton)
		{
			delStarButton.css('visibility', 'hidden')
			delStarButton = null;
		}
		if (starLink){
			starLink.attr('href', starHref)
			starLink = null;
		}
	}
	function delStar()
	{
		delStarButton.parent().remove();
		var count = $(".star-cover").length;
		$('.xCount').html('--total:'+ count + '--')
		starName = starHref.split('/').pop()
		$.ajax({
			type:"POST",
			url:'/delstar?name=' + starName,
			dataType: "jsonp",
			success:function(data){
				console.log(data)
			}
		})
	}

	//添加star
	var addStarSubmit = $("#addStarSubmit");
	addStarSubmit.click(function()
	{
		name = $("#addStarName").val()
		$.ajax({
			type:"POST",
			url:'/addStar?name=' + name,
			dataType: "jsonp",
			success:function(data){
				result = data.result
				if (result)
				{
					var url = document.location.toString();
					var arrUrl = url.split("//");
					var start = arrUrl[1].indexOf("/");
					var relUrl = arrUrl[1].substring(start);
					if(relUrl.indexOf("?") != -1){
			　　　　　　relUrl = relUrl.split("?")[0];
			　　　　}
					if (relUrl != '/')
						return
					var addElement = '<div class="col-sm-2">'+
										'<div class="star-cover">'+
											'<div class="glyphicon glyphicon-remove del-button"></div>'+
												'<a href="/follows/' + name +'">'+
													'<img src="/images/test.png" alt="star.cover"/>'+
												'</a>'+
											'<div class="starName">'+name+'</div>'+
										'</div>'+
									'</div>'
					var addStarContent = $(".add-star").parent()
					var silbingsCount = addStarContent.siblings().length;
					if (silbingsCount >= 5)
					{
						var addStarContentParent = addStarContent.parent()
						var rootElement = addStarContentParent.parent()
						rootElement.append('<div class="row star-row"><div class="col-sm-2">'+addStarContent.html()+'</div></div>')
						addStarContent.remove()
						addStarContentParent.append(addElement)
					}
					else
					{
						var addStarContentParent = addStarContent.parent()
						addStarContent.remove()
						addStarContentParent.append(addElement)
						addStarContentParent.append('<div class="col-sm-2">'+addStarContent.html()+'</div>')
					}
				}
			}
		})
	})


	//删除art
	var delArtResponseTimer;
	var artVideoToggle;
	var artLink;
	var delArtButton;
	$('.art-cover img').each(function(index, artCover)
	{
		artCover.onmousedown = showDelArtButton;
		artCover.onmouseup = function(e){clearTimeout(delArtResponseTimer);}
		//处理手机事件
		artCover.touchstart = showDelArtButton
		artCover.touchend = function(e){clearTimeout(delArtResponseTimer);}
	})
	function showDelArtButton(e)
	{
		var artCover = e.currentTarget;
		delArtResponseTimer = setTimeout(function(){
			artLink = $(artCover).parent()
			artVideoToggle = artLink.attr('data-target')
			artLink.removeAttr('data-target');
			delArtButton = artLink.parent().find('.del-button');
			delArtButton.css('visibility', 'visible')
			delArtButton.click(delArt);
		}, 1000)
	}
	function hideDelArtButton()
	{
		if (delArtButton)
		{
			delArtButton.css('visibility', 'hidden')
			delArtButton = null;
		}
		if (artLink){
			artLink.attr('data-target', artVideoToggle)
			artLink = null;
		}
	}
	function delArt()
	{
		var artname = delArtButton.next().next().text()
		var starname = $("#starName span").text()

		$.ajax({
			type:"POST",
			url:'/delart?starname=' + starname + '&artname='+artname,
			dataType: "jsonp",
			success:function(data){
				result = data.result;
				if (result)
				{
					delArtButton.parent().remove()
				}
				console.log(data)
			}
		})
	}



	//添加art
	var addArtSubmit = $("#addArtSubmit");
	addArtSubmit.click(function()
	{
		var starname = $("#starName span").text()
		var artname = $("#inputArtName").val()
		var artcover = $("#inputArtCover").val()
		$.ajax({
			type:"POST",
			url:'/addArt?starname='+ starname + '&artname=' + artname + '&artcover=' + artcover,
			dataType: "jsonp",
			success:function(data){
				console.info(data)
				result = data.result
				if (result)
				{
					var addElement = '<div class="col-sm-3">'+
										'<div class="art-cover">'+
											'<div class="glyphicon glyphicon-remove del-button"></div>'+
												'<a class="art-link" name="' + artname +'" data-toggle="modal" data-target="#videoModal">'+
													'<img src="'+ artcover + '" alt="art.cover"/>'+
												'</a>'+
											'<div class="art-name">'+artname+'</div>'+
										'</div>'+
									'</div>'
					var addArtContent = $(".add-art").parent()
					var silbingsCount = addArtContent.siblings().length;
					if (silbingsCount >= 3)
					{
						var addArtContentParent = addArtContent.parent()
						var rootElement = addArtContentParent.parent()
						rootElement.append('<div class="row art-row"><div class="col-sm-3">'+addArtContent.html()+'</div></div>')
						addArtContent.remove()
						addArtContent.append(addElement)
					}
					else
					{
						var addArtContentParent = addArtContent.parent()
						addArtContent.remove()
						addArtContentParent.append(addElement)
						addArtContentParent.append('<div class="col-sm-3">'+addArtContent.html()+'</div>')
					}
				}
			}
		})
	})


	//编辑
	var editOrgHtml;
	var editStarName;
	onEdit = function()
	{
		var edit = $("#edit");
		edit.css('visibility', 'hidden')
		var starname = $("#starName span").text()
		var enname = $("#enname span").text()
		var birth = $("#birth span").text()
		var height = $("#height span").text()
		var measurements = $("#measurements span").text()
		var cupsize = $("#cupsize span").text()
		var tag = $("#tag span").text()
		var minorid = $("#minorid span").text()
		var html = '<ul class="edit-ul">'+
						'<li>'+
							'<em class="edit-item-title">name: </em>'+
							'<input class="edit-item-input" id="input-name" type="text" placeholder="'+ starname + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">enname: </em>'+
							'<input class="edit-item-input" id="input-enname" type="text" placeholder="'+ enname + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">birth: </em>'+
							'<input class="edit-item-input" id="input-birth" type="text" placeholder="'+ birth + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">height: </em>'+
							'<input class="edit-item-input" id="input-height" type="text" placeholder="'+ height + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">measurements: </em>'+
							'<input class="edit-item-input" id="input-measurements" type="text" placeholder="'+ measurements + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">cupsize: </em>'+
							'<input class="edit-item-input" id="input-cupsize" type="text" placeholder="'+ cupsize + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">tag: </em>'+
							'<input class="edit-item-input" id="input-tag" type="text" placeholder="'+ tag + '"/>'+
						'</li>'+
						'<li>'+
							'<em class="edit-item-title">minorid: </em>'+
							'<input class="edit-item-input" id="input-minorid" type="text" placeholder="'+ minorid + '"/>'+
						'</li>'+
						'<li>' +
							'<div class="glyphicon glyphicon-ok-circle" id="editOk" onclick="commitEdit();"></div>' +
							'<div class="glyphicon glyphicon-remove-circle" id="editCancel" onclick="cancelEdit();"></div>' +
						'</li>' + 
					'</ul>'
		var container = edit.parent();
		editOrgHtml = container.children()
		editStarName = starname
		container.empty()
		container.append(html)
	}
	cancelEdit = function()
	{
		editOrgHtml.filter("#edit").css('visibility', 'visible');
		var editCancelBtn = $("#editCancel")
		var container = editCancelBtn.parent().parent();
		container.empty()
		container.append(editOrgHtml)
	}
	commitEdit = function()
	{
		var starname = ($("#input-name").val()) ? $("#input-name").val() : $("#input-name").attr('placeholder')
		var enname = ($("#input-enname").val()) ? $("#input-enname").val() : $("#input-enname").attr('placeholder')
		var birth = ($("#input-birth").val()) ? $("#input-birth").val() : $("#input-birth").attr('placeholder')
		var height = ($("#input-height").val()) ? $("#input-height").val() : $("#input-height").attr('placeholder')
		var measurements = ($("#input-measurements").val()) ? $("#input-measurements").val() : $("#input-measurements").attr('placeholder')
		var cupsize = ($("#input-cupsize").val()) ? $("#input-cupsize").val() : $("#input-cupsize").attr('placeholder')
		var tag = ($("#input-tag").val()) ? $("#input-tag").val() : $("#input-tag").attr('placeholder')
		var minorid = ($("#input-minorid").val()) ? $("#input-minorid").val() : $("#input-minorid").attr('placeholder')

		console.info(tag)
		$.ajax({
			type:"POST",
			url:'/editStar?starname='+ starname + '&orgname=' + editStarName +
				'&enname=' + enname + '&birth=' + birth + '&height=' + height + 
				'&measurements=' + measurements + '&cupsize=' + cupsize + 
				'&tag=' + tag + '&minorid=' + minorid,
			dataType: "jsonp",
			success:function(data){
				console.info(data)
				result = data.result
				if (result){
					editOrgHtml.filter("#edit").css('visibility', 'visible');
					editOrgHtml.filter("#starName").children("span").text(starname)
					editOrgHtml.filter("#enname").children("span").text(enname)
					editOrgHtml.filter("#birth").children("span").text(birth)
					editOrgHtml.filter("#height").children("span").text(height)
					editOrgHtml.filter("#measurements").children("span").text(measurements)
					editOrgHtml.filter("#cupsize").children("span").text(cupsize)
					editOrgHtml.filter("#tag").children("span").text(tag)
					editOrgHtml.filter("#minorid").children("span").text(minorid)
					var editOKBtn = $("#editOk")
					var container = editOKBtn.parent().parent();
					container.empty()
					container.append(editOrgHtml)
				}
			}
		})
	}

	

}