window.onload = function () {

	// 播放视频
	$("#videoModal").on('show.bs.modal', function(e){
		var fileRoot = '<%=filesvradress%>'
		var starname = '<%=star.name%>';
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

	//删除star
	var delStarResponseTimer;
	var starHref;
	var starLink;
	var delButton;
	$('.star-cover img').each(function(index, starCover)
	{
		starCover.onmousedown = showDelStarButton;
		starCover.onmouseup = function(e){clearTimeout(delStarResponseTimer);}
		//处理手机事件
		starCover.touchstart = showDelStarButton
		starCover.touchend = function(e){clearTimeout(delStarResponseTimer);}
	})
	$('body').mousedown(function(e){
		if (delButton){
			if ($(e.target)[0] == delButton[0])
				return
		}
		hideDelStarButton()
	});

	function showDelStarButton(e)
	{
		var starCover = e.currentTarget;
		delStarResponseTimer = setTimeout(function(){
			starLink = $(starCover).parent()
			starHref = starLink.attr('href')
			starLink.removeAttr('href');
			delButton = starLink.parent().find('.del-button');
			delButton.css('visibility', 'visible')
			delButton.click(delStar);
		}, 1000)
	}
	function hideDelStarButton()
	{
		if (delButton)
		{
			delButton.css('visibility', 'hidden')
			delButton = null;
		}
		if (starLink){
			starLink.attr('href', starHref)
			starLink = null;
		}
	}
	function delStar()
	{
		delButton.parent().remove();
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
}