$(function(){
    //记录点击的位置
    window.index=0
    //防止按下拖拽时出现卡音
    window.isPress = false;
    //定义一个变量判断是否点击最近那播放列表
    window.isRen=false
    //定义一个对象保存最近播放的歌曲的信息
    window.recentlyplay={}
    //初始化最近播放列表
    var recentlyPlayList=localStorage.getItem('recentlyPlayList')
    if(!recentlyPlayList){
        loaclStorage=localStorage.setItem('recentlyPlayList',JSON.stringify([]))
    }
    var audio=$('#audio')[0]
    //点击后退返回主界面
    $('.houtui').on('click',function(){
        $('.gdgc').css({
            display:'none'
        })
        $('header').css({
            display:'block'
        })
        $('.middle').css({
            display:'block'
        })
    })
    //点击歌单广场 跳转页面
    $('.gedan-all').on('click',function(){
        $('.gdgc').css({
            display:'block'
        })
        $('header').css({
            display:'none'
        })
        $('.middle').css({
            display:'none'
        })
    })
    //点击歌单，跳转页面
    $('#gd').on('click',function(){
        $('.gdgc').css({
            display:'block'
        })
        $('header').css({
            display:'none'
        })
        $('.middle').css({
            display:'none'
        })
    })
    //点击歌单详情后退返回歌单广场
    $('.top-houtui').on('click',function(){
        $('.gdxq').css({
            display:'none'
        })
        $('.gdgc').css({
            display:'block'
        })
    })
    //格式化时间，接收一个单位毫秒的参数
    function formatTime(m) {
    //将毫秒转换为秒
    var second = Math.floor(m / 1000 % 60);
  
    second = second >= 10 ? second : '0' + second;
  
    //将毫秒转换为分钟
    var minute = Math.floor(m / 1000 / 60);
  
    minute = minute >= 10 ? minute : '0' + minute;
  
    return minute + ':' + second;
  }




    //首页 推荐歌单数据
    $.ajax({
        type:'GET',
        url:'http://www.arthurdon.top:3000/personalized?limit=6',
        success:function(date){
            
            console.log(date)
            $.each(date.result,function(i,v){
                var div =$(`<div class="gedan-item " id="${v.id}">
                            <div class="gedan-img">
                                <img src='${v.picUrl}' alt="" class="auto-img">
                            </div>
                            <div class="gedan-wenzi two-text">${v.name}</div>
                            <div class="layer">
                             <div class="lister-number fr">${(v.playCount/10000).toFixed(1)}万
                             </div>
                             <div class="lister-icon fr">
                             </div>
                            </div>
                            </div>`)
            
           $('.gedan-list').append(div)
            })
        },
        error: function (err) {
            //请求失败
            console.log('err ==> ', err);
          }
    })
  
    //创建推荐数据
    function createTJ(date){
        $.each(date,function(i,v){
              var div=$(` <div class="gdgc-item info-item" id="${v.id}">
                         <div class="item-img"> 
                             <img src="${v.picUrl}" alt="" class="auto-img">
                         </div>
                         <div class="item-text two-text">
                             ${v.name}
                         </div>
                         <div class="layer">
                             <div class="lister-number fr">${(v.playCount/10000).toFixed(1)}万
                             </div>
                             <div class="lister-icon fr">
                             </div>
                         </div>
                     </div>`)
             $('.gdgc-biao').append(div)
         })
    }

    //创建其他数据
    function createQT(date){
        $.each(date,function(i,v){
               
            var div=$(` <div class="gdgc-item info-item" id="${v.id}">
                       <div class="item-img"> 
                           <img src="${v.coverImgUrl}" alt="" class="auto-img">
                       </div>
                       <div class="item-text two-text">
                           ${v.name}
                       </div>
                       <div class="layer">
                           <div class="lister-number fr">${(v.playCount/10000).toFixed(1)}万
                           </div>
                           <div class="lister-icon fr">
                           </div>
                       </div>
                   </div>`)
           $('.gdgc-biao').append(div)
       })
    }

    //获取推荐歌单，推荐
    function gettuijie(){
        //开始截取下标
        var startIndex = 0;
        //截取数据数量
        var count = 12;
        //获取缓存数据
        var tuijianInfo = localStorage.getItem('tuijianInfo')
        //如果不存在数据请求
        if(!tuijianInfo){
            console.log('不存在数据');
            $('.tip').show()
        //获取数据并储存本地  
            $.ajax({
                type:'GET',
                url:'http://www.arthurdon.top:3000/personalized',
                success:function(date){
                    $('.tip').hide()
                    console.log('date',date)
                    //  存在本地
                    localStorage.setItem('tuijianInfo',JSON.stringify(date))
                    tuijianInfo=date
                    //首次展示12条
                    createTJ(date.result.slice(startIndex ,startIndex+count))
                    //重置下次开始截取数据的下标
                     startIndex += count;
                   
                },
                error: function (err) {
                    //请求失败
                    console.log('err ==> ', err);
                  }
            })
        }else{
            //将tuijianInfo转换为普通对象
            tuijianInfo=JSON.parse(tuijianInfo)
            console.log('存在数据')
            //展示12条数据
            //开始截取下标
            var startIndex = 0;

            //截取数据数量
             var count = 12;
            createTJ(tuijianInfo.result.slice(startIndex, startIndex + count))
            startIndex += count;
        }
    }


    //获取推荐歌单，其他
    function getgedan(tag,zhonglei){
        //开始截取下标
        var startIndex = 0;
        //截取数据数量
        var count = 12;
        //获取缓存数据
        var qitaInfo = localStorage.getItem(tag)
        //如果不存在数据请求
        if(!qitaInfo){
            console.log('不存在数据');
            $('.tip').show()
        //获取数据并储存本地  
            $.ajax({
                type:'GET',
                url:'http://www.arthurdon.top:3000/top/playlist?cat='+zhonglei,
                success:function(date){
                    $('.tip').hide()
                    console.log('date',date)
                    //  存在本地
                    localStorage.setItem(tag,JSON.stringify(date))
                    qitaInfo=date
                    //首次展示12条
                    createQT(date.playlists.slice(startIndex ,startIndex+count))
                    //重置下次开始截取数据的下标
                     startIndex += count;
                   
                },
                error: function (err) {
                    //请求失败
                    console.log('err ==> ', err);
                  }
            })
        }else{
            //将qitaInfo转换为普通对象
            qitaInfo=JSON.parse(qitaInfo)
            console.log('存在数据')

            //展示12条数据

            createQT(qitaInfo.playlists.slice(startIndex, startIndex + count))
            startIndex += count;
        }
    }

    //第一次加载
    gettuijie()
    
    //保存定时器
    var timers=[]
    //头部高度
    var heard=$('.gdgc-top').height()+$('.gdgc-nav').height()+24

   
    
    //歌单广场的导航绑定点击事件
    $('.gdgc-nav-list >li').on('click',function(){
        
        
     
        //如果含有激活的类名，就不执行
        if($(this).hasClass('em')){
            return
        }
        //每次切换歌单种类都清空滑动事件
        $('.gdgc-list-box').unbind('scroll')
        //每次切换歌单种类都使滚动条返回顶端
        $('.gdgc-list-box').scrollTop(0)       
        var line=$('.xiahuaxian')
        var li0= $('.gdgc-nav-list >li')[0]
        //改变下划线
        line.animate({
            left:$(this).index()*($(li0).outerWidth(true)-$(li0).outerWidth()+$(this).width())+8
        },300)

        $(this).addClass('em')
        $(this).siblings().removeClass('em')
        console.log($(this).text())
        //每次点击都清除数据
        $('.gdgc-biao').empty()
        //根据点击的值进行数据生成
        if($(this).text()=='推荐'){
             
            
            $('.banan').css({
                display:'block'
            }),
            $('.vip-box').css({
                display:'none'
            }),
            gettuijie()
 
            
        }else if($(this).text()=='精品'){
            $('.banan').css({
                display: 'none'
            }) ,
            $('.vip-box').css({
                display:'block'
            })
        }
         else(
            
            $('.vip-box').css({
                display:'none'
            }),
            $('.banan').css({
                display: 'none'
            }) ,
            getgedan($(this).data('tag'),$(this).text())
            
         )
        
            
    
    
    //懒加载数据
    var starindex=12
    var count=12
    
    
    $('.gdgc-list-box').on('scroll',function(){
       
        var self=this
        var li=$('.em')
        
        var timer=setTimeout(function(){
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
              }

        //滚动条滚动高度
       var scrollTop=$(self).scrollTop()
       //最后一个节点相对于整个页面的高度
       var last=$('.info-item').last()
       var lastTop=last.offset().top
       //最后一个节点的高
       var lastHeight=last.height()
       if(scrollTop+heard+lastHeight>=lastTop){
           console.log('触发')
            if(li.text()=='推荐'){
                var data= JSON.parse(localStorage.getItem('tuijianInfo'))
                createTJ(data.result.slice(starindex, starindex+ count))
                starindex+=count

            }
            else{
                var data= JSON.parse(localStorage.getItem(li.data('tag')))
                createQT(data.playlists.slice(starindex, starindex+ count))
                starindex+=count

            }
       }        
        //清空所有定时器序号
        timers = [];
        },400)
            timers.push(timer)
        console.log('starIndex',starindex)
        
        
    })  
})

    //第一次懒加载
    var starindex=12
    var count=12
    $('.gdgc-list-box').on('scroll',function(){
        
        var self=this
        var li=$('.em')
        
        var timer=setTimeout(function(){
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
              }
        //滚动条滚动高度
       var scrollTop=$(self).scrollTop()
       //最后一个节点相对于整个页面的高度
       var last=$('.info-item').last()
       var lastTop=last.offset().top
       //最后一个节点的高
       var lastHeight=last.height()
       if(scrollTop+heard+lastHeight>=lastTop){
           console.log('触发')
           console.log(li.text())
            if(li.text()=='推荐'){
                var data= JSON.parse(localStorage.getItem('tuijianInfo'))
                createTJ(data.result.slice(starindex, starindex+ count))
                starindex+=count 
            }
       }        
        //清空所有定时器序号
        timers = [];
        },400)
            timers.push(timer)
        console.log('starIndex',starindex)
    })  


    //点击歌单获取歌单详情
    $('.gdgc-biao').on('click','.gdgc-item',function(){
    //点解跳转
    $('.gdgc').css({
        display:'none'
    })
    $('.gdxq').css({
        display:'block'
    })
    //清空列表数据
    $('.gdxq-item-box').empty()
    //显示加载页面
    $('.tip').show()
    //根据歌单id获取歌单详情
    var gdID=$(this).attr('id')
    /* console.log(gdID) */
    $.ajax({
        type:'GET',
        url:'http://www.arthurdon.top:3000/playlist/detail?id='+gdID,
        success:function(data){
            //隐藏加载页面
            $('.tip').hide()
            console.log(data)
            $('#gdtu').attr('src',data.playlist.coverImgUrl)
            $('#playCount').text((data.playlist.playCount/10000).toFixed(1)+'万')
            $('#name').text(data.playlist.name)
            $('#nickname').text(data.playlist.creator.nickname)
            $('#description').text(data.playlist.description)
            $('.xzuozhe-tou').css({
                'background-image' :'url(' +data.playlist.creator.avatarUrl+')',
                
            })
            $('.list-top-mun').text('(共'+(data.playlist.tracks.length)+'首)')
            $.each(data.playlist.tracks,function(i,v){
                //把歌曲的时间跟id 头像URL绑定到data上
                var div=$(`
                <div class="gdxq-list-item" data-id="${v.id}" data-play="0" data-dt="${v.dt}" data-img="${v.al.picUrl}">
                    <div class="xuhao fl ">${i+1}
                    <div class="laba ">
                    <img src="./icon/laba1.jpg" alt="" class="auto-img">
                </div>
                    </div>
                   
                <div class="gdxq-0 fl">
                    <div class="gdxq-1 one-text">${v.name}</div>
                    <div class="gdxq-2 one-text">${v.ar[0].name}-${v.al.name}</div>
                </div>
                <div class="xinxin fr"></div>
                </div>`)
                $('.gdxq-item-box').append(div)
            })
        },
        error: function (err) {
            //请求失败
            console.log('err ==> ', err);
          }
    })
    })
    //首页推荐歌单的点击事件
    $('.gedan-list').on('click','.gedan-item',function(){
        //页面跳转
        $('header').css({
            display:'none'
        })
        $('.middle').css({
            display:'none'
        })
        $('.gdgc').css({
            display:'none'
        })
        $('.gdxq').css({
            display:'block'
        })
        //清空列表数据
    $('.gdxq-item-box').empty()
    //显示加载页面
    $('.tip').show()
    //根据歌单id获取歌单详情
    var gdID=$(this).attr('id')
    /* console.log(gdID) */
    $.ajax({
        type:'GET',
        url:'http://www.arthurdon.top:3000/playlist/detail?id='+gdID,
        success:function(data){
            //隐藏加载页面
            $('.tip').hide()
            console.log(data)
            $('#gdtu').attr('src',data.playlist.coverImgUrl)
            $('#playCount').text((data.playlist.playCount/10000).toFixed(1)+'万')
            $('#name').text(data.playlist.name)
            $('#nickname').text(data.playlist.creator.nickname)
            $('#description').text(data.playlist.description)
            $('.xzuozhe-tou').css({
                'background-image' :'url(' +data.playlist.creator.avatarUrl+')',
                
            })
            $('.list-top-mun').text('(共'+(data.playlist.tracks.length)+'首)')
            $.each(data.playlist.tracks,function(i,v){
                //把歌曲的时间跟id 绑定到data上
                var div=$(`
                <div class="gdxq-list-item" data-id="${v.id}" data-play="0" data-dt="${v.dt}" data-img="${v.al.picUrl}">
                    <div class="xuhao fl ">${i+1}
                    <div class="laba ">
                    <img src="./icon/laba1.jpg" alt="" class="auto-img">
                </div>
                    </div>
                   
                <div class="gdxq-0 fl">
                    <div class="gdxq-1 one-text">${v.name}</div>
                    <div class="gdxq-2 one-text">${v.ar[0].name}-${v.al.name}</div>
                </div>
                <div class="xinxin fr"></div>
                </div>`)
                $('.gdxq-item-box').append(div)
            })
        },
        error: function (err) {
            //请求失败
            console.log('err ==> ', err);
          }
    })
    })


    //歌曲能播放时
    audio.oncanplay=function(){

       
        
        audio.play()
        $('.singword').empty()
        //判断时候点击最近播放列表
        if(isRen){
            var ren= $('.RecentlyPlayed-list-item.playing')
            //修改bottom的状态
            $('.bottom').attr('name',1)
             //更换头像
             var renimg=ren.data('img')
             $('.simg-box').find('img').attr('src',renimg)
             //更改信息
             var rentext=ren.find('.rp-item-zuo').find(".rp-sname").text()
             var renzuoze=ren.find('.rp-item-zuo').find(".rp-singer").text()
             $('.sname').text(rentext)
             $('.singer').text(renzuoze.split('-')[1])
             //给歌名绑定当前歌曲的id
             var renid=ren.data('id')
             $('.sname').data('id',renid)
             //给歌名绑定当前歌曲的总时间
             var rendt=ren.data('dt')
             $('.sname').data('dt',rendt)
             //执行音符动画
             $('.yinfu').addClass('activeYF')
             //修改播放暂停图标
             $('.play').css({
                backgroundImage:'url(./icon/stop.png)'
            })
            //修改播放按钮状态
            $('.play').data('play',1)
            //修改歌词面板的歌名跟歌手
            var songname=$('.sname').text()
            var singer=$('.singer').text()
            $('.gc-name').text(songname)
            $('.gc-singer').text(singer)
            //初始化歌词面板
            var ssid=$('.sname').data('id')
            $.ajax({
                type:'GET',
                url:'http://www.arthurdon.top:3000/lyric',
                data:{
                    id:ssid
                },
                success:function(gcdata){
                    console.log('歌词加载完成')
                    console.log('gcdata',gcdata)
                    //获取歌词
                    var lrc=gcdata.lrc.lyric
                    lrc = lrc.split(/[\n\r]/);
                    //去除最后一个空值
                    lrc.splice(-1, 1);
                    for (var i = 0; i < lrc.length; i++) {

                        var lrcItem = lrc[i].split(/\]/);

                        //当前歌词的时间
                        var songCt = lrcItem[0].slice(1);
                    
                        //歌词时间
                        var time = songCt.split(/:/);
                    
                        //获取分钟
                        var minute = Number(time[0]) * 60;
                    
                        //获取秒钟
                        var second = Number(time[1]);
                    
                        //当前歌词的时刻
                        var t0 = minute + second;
                    
                        //创建歌词列表
                        var p = $(`<p name="${t0}">${lrcItem[1]}</p></br>`);

                        $('.singword').append(p);

                    }
                  
                }
            })
            //修改歌词面板的按钮状态
            $('.gc-play').attr('name',1)
            //修改歌词面板的按钮图片
            $('.gc-play').css({
                backgroundImage:'url(./icon/gcstop.png)'
            })
            

            //重置判断是否点击最近播放列表播放歌曲
            isRen = false
            return
        }

            //添加喇叭更改播放状态
            $('.gdxq-list-item.act').data('play',1).find('.xuhao').children().addClass('jihuo')
            //改变播放按钮的状态
            $('.play').data('play',1)
            //开启音符动画
            $('.yinfu').addClass('activeYF')
            //更该改播放按钮
            $('.play').css({
                backgroundImage:'url(./icon/stop.png)'
            })
            //更换头像
            var imgURL=$('.gdxq-list-item.act').data('img')
            $('.simg-box').find('img').attr('src',imgURL)
            //更改信息
            var text=$('.gdxq-list-item.act').find('.gdxq-0').find('.gdxq-1').text()
            var zuoze=$('.gdxq-list-item.act').find('.gdxq-0').find('.gdxq-2').text()
            $('.sname').text(text)
            $('.singer').text(zuoze.split('-')[0])
            //给歌名绑定当前歌曲的id
            var id=$('.gdxq-list-item.act').data('id')
            $('.sname').data('id',id)
             //给歌名绑定当前歌曲的总时长
             var dt=$('.gdxq-list-item.act').data('dt')
            $('.sname').data('dt',dt)
            //改变botto状态
            $('.bottom').attr('name',1)
            //修改歌词面板的时间
            var dt =$('.sname').data('dt')
            $('.end').text(formatTime(dt))
            
            

            //获取最近播放歌曲
            var recentlyPlayList=JSON.parse(localStorage.getItem('recentlyPlayList'))
            for(var i=0;i<recentlyPlayList.length;i++){
                if($('.gdxq-list-item.act').data('id')==recentlyPlayList[i].songid){  
                    recentlyPlayList.splice(i,1)
                }
            }

            //保存最近播放歌曲的id
            recentlyplay.songid=$('.gdxq-list-item.act').data('id')
            //保存最近播放歌曲的时长
            recentlyplay.songdt=$('.gdxq-list-item.act').data('dt')
            //保存最近播放歌曲的图片
            recentlyplay.songimg=$('.gdxq-list-item.act').data('img')
            //保存最近播放歌曲的名字
            recentlyplay.songname=$('.gdxq-list-item.act').find('.gdxq-0').find('.gdxq-1').text()
            //保存最近播放歌曲的歌手
            var songsinger=$('.gdxq-list-item.act').find('.gdxq-0').find('.gdxq-2').text()
            recentlyplay.songsinger=songsinger.split('-')[0]
            
         
            
             
            recentlyPlayList.unshift(recentlyplay)
           
            localStorage.setItem('recentlyPlayList',JSON.stringify(recentlyPlayList))



            
                        //修改歌词面板的歌名跟歌手
                        var songname=$('.sname').text()
                        var singer=$('.singer').text()
                        $('.gc-name').text(songname)
                        $('.gc-singer').text(singer)
                        //初始化歌词面板
                        var ssid=$('.sname').data('id')
                        $.ajax({
                            type:'GET',
                            url:'http://www.arthurdon.top:3000/lyric',
                            data:{
                                id:ssid
                            },
                            success:function(gcdata){
                                console.log('歌词加载完成')
                                console.log('gcdata',gcdata)
                                //获取歌词
                                var lrc=gcdata.lrc.lyric
                                lrc = lrc.split(/[\n\r]/);
                                //去除最后一个空值
                                lrc.splice(-1, 1);
                                for (var i = 0; i < lrc.length; i++) {
            
                                    var lrcItem = lrc[i].split(/\]/);
            
                                    //当前歌词的时间
                                    var songCt = lrcItem[0].slice(1);
                                
                                    //歌词时间
                                    var time = songCt.split(/:/);
                                
                                    //获取分钟
                                    var minute = Number(time[0]) * 60;
                                
                                    //获取秒钟
                                    var second = Number(time[1]);
                                
                                    //当前歌词的时刻
                                    var t0 = minute + second;
                                
                                    //创建歌词列表
                                    var p = $(`<p name="${t0}">${lrcItem[1]}</p></br>`);
            
                                    $('.singword').append(p);
            
                                }
                              
                            }
                        })
             
             //修改歌词面板的按钮状态
             $('.gc-play').attr('name',1)
             //修改歌词面板的按钮图片
             $('.gc-play').css({
                 backgroundImage:'url(./icon/gcstop.png)'
             })

            
    }

    //歌单详情点击歌曲
    var basepath='http://www.arthurdon.top:3000/song/url?'
    $('.gdxq-item-box').on('click','.gdxq-list-item',function(){
        var self=this
        index= Number( $(this).find('.xuhao').text())
        
        if($(this).hasClass('act')){
            //歌曲播放状态
            /* var playsta= */$(this).data('play')
            //根据状态选择播放还是停止，0：停止，1：播放
            if($(this).data('play')==1){
                //停止歌曲
                audio.pause();
                //停启音符动画
                $('.yinfu').removeClass('activeYF')
                //更该改播放按钮
                $('.play').css({
                backgroundImage:'url(./icon/play.png)'
                })
                //改变按钮状态
                $('.play').data('play',0)
                //更改播放状态
                $(this).data('play',0)
                console.log('data1',$(this).data('play'))
                //改变botto状态
                $('.bottom').attr('name',0)
                //歌词页面的按钮
                $('.gc-play').css({
                    backgroundImage:'url(./icon/gcplay.png)'
                })
                $('.gc-play').attr('name',0)
            }else /* if($(this).data('play')==1) */{
                //播放歌曲
                audio.play()
                //激活喇叭
                $('.gdxq-list-item.act').find('.xuhao').children().addClass('jihuo')
                //开启音符动画
                $('.yinfu').addClass('activeYF')
                //更该改播放按钮
                $('.play').css({
                backgroundImage:'url(./icon/stop.png)'
                })
                //改变按钮状态
                $('.play').data('play',1)
                //改变播放状态
                $(this).data('play',1)
                console.log('data2',$(this).data('play'))
                //改变botto状态
                $('.bottom').attr('name',1)
                //歌词页面的按钮
                $('.gc-play').css({
                    backgroundImage:'url(./icon/gcstop.png)'
                })
                $('.gc-play').attr('name',1)
                

            }
        }
            else{
                var songid=$(this).data('id')
        
                //根据歌曲id获取音频
                $.ajax({
                type:'GET',
                url:basepath,
                data:{
                    id:songid
                },
                success:function(data){
                    console.log(data)
                    console.log('song',data)
                if(data.data[0].url==null){
                    console.log('会员专属')
                    $('.vip-tip').css({display:'block'})
                    setTimeout(function(){
                        $('.vip-tip').css({display:'none'})
                    },1000)
                    return
                }
                //查找之前激活的gdxq-list-item
                var gdxqlistitem=$('.gdxq-list-item.act')
                //console.log(gdxqlistitem)返回一个含有act类的gdxq-list-item的数组
                //如果存在之前激活的gdxq-list-item
                if(gdxqlistitem.length==1){
                    //移除激活状态，更改播放状态
                    gdxqlistitem.removeClass('act').data('play',0)
                    //移除喇叭
                    var laba=gdxqlistitem.find('.xuhao').children()
                    if((laba).hasClass('jihuo')){
                        laba.removeClass('jihuo')
                    }
                }
                    //设置audio的src
                    $(audio).attr('src',data.data[0].url)
                    //保存最近播放歌曲的url
                    recentlyplay.songurl=data.data[0].url
                   /*  //保存src
                    $(self).attr('name',data.data[0].url) */
                    //添加激活类
                    $(self).addClass('act')
                    
                    
                   
                },
                error: function (err) {
                    //请求失败
                    console.log('err ==> ', err);
                  }

                })
               
            }

    })

    //播放按钮点击事件
    $('.play').on('click',function(){
        if($(this).data('play')==0&&$(audio).attr('src')){
            //播放歌曲
            audio.play()
            //开启音符动画
            $('.yinfu').addClass('activeYF')
            //更改播放歌曲的状态
            $('.gdxq-list-item.act').data('play',1)
            //更该改播放按钮
            $('.play').css({
                backgroundImage:'url(./icon/stop.png)'
            })
            //更改自身状态                            
            $(this).data('play',1)
            //改变botto状态
            $('.bottom').attr('name',1)
            //歌词面板的播放按钮
            $('.gc-play').css({
                backgroundImage:'url(./icon/gcstop.png)'
            })
            $('.gc-play').attr('name',1)

            
        }else{
            //停止歌曲
            audio.pause()
             //停止音符动画
             $('.yinfu').removeClass('activeYF')
             //更改播放歌曲的状态
             $('.gdxq-list-item.act').data('play',0)
             //更该改播放按钮
            $('.play').css({
                backgroundImage:'url(./icon/play.png)'
            })
            //更改自身状态
            $(this).data('play',0)
            //改变botto状态
            $('.bottom').attr('name',0)
            //歌词面板的播放按钮
             $('.gc-play').css({
                backgroundImage:'url(./icon/gcplay.png)'
            })
            $('.gc-play').attr('name',0)

        }
    })
  
    //显示最近播放列表
    $('.menuopen').on('click',function(){
        $('.RecentlyPlayed-bg').css({display:'block'})
        $('.RecentlyPlayed-box').animate({
            bottom:0
        },300)

        //根据recentlyPlayList数据生成列表
        $('.RecentlyPlayed-list').empty()

        var data=JSON.parse(localStorage.getItem('recentlyPlayList'))
        $('.rp-zuo').text('列表循环(' +data.length +')')
        $.each(data,function(i,v){
            var div=$(`<div class="RecentlyPlayed-list-item" data-dt="${v.songdt}" data-img="${v.songimg}" data-id="${v.songid}"
             data-url="${v.songurl}" name="0">
            <div class="rp-item-zuo fl">
                <div class="lb-icon "></div>
                <div class="rp-sname one-text">${v.songname}</div>
                <div class="rp-singer">-${v.songsinger}</div>
            </div>
            <div class="rp-item-you fr">
                <div class="rp-remove"></div>
            </div>
        </div>`)
        $('.RecentlyPlayed-list').append(div)
        })


        //获取最近播放列表中的正在播放歌曲
        var songid=$('.sname').data('id')
        $('.RecentlyPlayed-list-item').each(function(i,v){
            if($(v).data('id')==songid){
                $(v).addClass('playing')
                $(v).find('.rp-item-zuo').find('.lb-icon').addClass('lb-act')
                $(v).find('.rp-item-zuo').find('.rp-sname').addClass('rp-sname-act')  
            }
                
        })
    })
    //隐藏最近播放列表
    $('.RecentlyPlayed-bg').on('click',function(){
        $('.RecentlyPlayed-bg').css({display:'none'})
        $('.RecentlyPlayed-box').animate({
            bottom:-400
        },300)
    })

    //删除最近播放列表的单曲
    $('.RecentlyPlayed-list').on('click','.rp-remove',function(e){
        e.stopPropagation()
        var parent=$(this).parents('.RecentlyPlayed-list-item')
        var parentID=parent.data('id')
        console.log(parentID)
        var data=JSON.parse(localStorage.getItem('recentlyPlayList'))
        for(var i=0;i<data.length;i++){
            if(parentID==data[i].songid){
                data.splice(i, 1);
                parent.remove()
                localStorage.setItem('recentlyPlayList',JSON.stringify(data))
            }
        }

    })

    //删除最近播放列表的全部单曲
    $('.del').on('click',function(){
        var data=JSON.parse(localStorage.getItem('recentlyPlayList'))
        data.splice(0,data.length)
        $('.RecentlyPlayed-list').empty()
        localStorage.setItem('recentlyPlayList',JSON.stringify(data))
    })

    //最近播放列表的单曲点击事件
    $('.RecentlyPlayed-list').on('click','.RecentlyPlayed-list-item',function(e){
        e.stopPropagation()
        //如果点击的歌曲是正在播放
        if($(this).hasClass('playing')){
            /* isRen=true */
           if($('.bottom').attr('name')==1){
               //停止歌曲
               audio.pause()
               //停止动画
               $('.yinfu').removeClass('activeYF')
               //更该改播放按钮
                $('.play').css({
                backgroundImage:'url(./icon/play.png)'})
                //更改播放歌曲的状态
                $('.gdxq-list-item.act').data('play',0)
                //更该改播放按钮的状态
                $('.play').data('play',0)
               //改变botto状态
               $('.bottom').attr('name',0)
               //歌词面板的播放按钮
                $('.gc-play').css({
                backgroundImage:'url(./icon/gcplay.png)'
                })
                $('.gc-play').attr('name',0)

               

           }else if($('.bottom').attr('name')==0){
                //播放歌曲
                audio.play()
                 //改bottom身状态
               $('.bottom').attr('name',1)
                //开启音符动画
                $('.yinfu').addClass('activeYF')
                //更改播放歌曲的状态
                $('.gdxq-list-item.act').data('play',1)
                //更该改播放按钮
                $('.play').css({
                    backgroundImage:'url(./icon/stop.png)'
                })
                //更改播放按钮状态
                $('.play').data('play',1)
                //歌词面板的播放按钮
                $('.gc-play').css({
                backgroundImage:'url(./icon/gcstop.png)'
                })
                $('.gc-play').attr('name',1)
            }
        }else{//不处于激活状态
            //是否点击了最近播放列表
            isRen=true
            
            //除去喇叭，改变文字
            $('.RecentlyPlayed-list-item.playing').find('.rp-item-zuo').find('.lb-icon').removeClass('lb-act')
            $('.RecentlyPlayed-list-item.playing').find('.rp-item-zuo').find('.rp-sname').removeClass('rp-sname-act')  
            //去除最近播放列表里的单曲的激活状态
            $('.RecentlyPlayed-list-item.playing').removeClass('playing')

             //判断歌单详情是否显示
             var ishidden=$('.gdxq').is(':hidden')            
             /* console.log('ishidden',ishidden) *///显示为false 隐藏为true
             if(!ishidden){
                 //查找之前激活的gdxq-list-item
                var gdxqlistitem=$('.gdxq-list-item.act')
                //console.log(gdxqlistitem)返回一个含有act类的gdxq-list-item的数组
                //如果存在之前激活的gdxq-list-item
                if(gdxqlistitem.length==1){
                    //移除激活状态，更改播放状态
                    gdxqlistitem.removeClass('act').data('play',0)
                    //移除喇叭
                    var laba=gdxqlistitem.find('.xuhao').children()
                    if((laba).hasClass('jihuo')){
                        laba.removeClass('jihuo')
                    }
                }
                 //在歌单列表寻找正在播放的歌曲
                 var s=$('.gdxq-item-box>.gdxq-list-item')
                 for(var i=0;i<s.length;i++){
                     var sid=$(s[i]).data('id')
                     if(sid==$(this).data('id')){
                         //添加激活//改变播放状态//显示喇叭
                         $(s[i]).addClass('act').data('play',1).find('.xuhao').children().addClass('jihuo')
                         break;
                     }
                 }
             }


            //播放新歌
            $(audio).attr('src',$(this).data('url'))
            //添加激活类
            $(this).addClass("playing")
            //添加喇叭，改变文字
            $(this).find('.rp-item-zuo').find('.lb-icon').addClass('lb-act')
            $(this).find('.rp-item-zuo').find('.rp-sname').addClass('rp-sname-act')  

        }
            
            
        
    })


    //点击头像显示歌词面板
    $('.simg-box').on('click',function(){
        console.log(123)
        $('.gcym').animate({
            bottom : 0
        },100)
    })



    //歌词面板返回
    $('.gc-black').on('click',function(){
        $('.gcym').animate({
            bottom : "-100%"
        },100)
    })
    //监听音频时事变化事件
 
    var singwordTop = parseFloat($('.singword').css('top'));
    audio.ontimeupdate=function(){
        if (isPress) {
            
            return;
          }
        //歌曲播放时间(s)
        var nowtime=this.currentTime
          /* console.log('nowtime',nowtime) */
        //歌曲总时长(ms)
        var songtime=$('.sname').data('dt')
        
        var timeprcent=nowtime*1000/songtime
        //滑条总长度
        var maxleft=$('.hkb').width()-$('.hk').width()
        
        var left=maxleft*timeprcent
        $('.hk').animate({
            left:left
        },100)
        $('.hdt').animate({
            width:left
        },100)
        $('.star').text(formatTime(nowtime*1000))
        //歌词移动
        var p=$('.singword>p')
        for(var i=0;i<p.length;i++){
            var pheight=$(p[0]).height()
            //获取当前p的时间
            var t1 = Number($(p[i]).attr('name'));
            //获取下一个p时间
            //防止越界
            var t2 = 0;
            if (p[i + 1]) {
                t2 = Number($(p[i + 1]).attr('name'));
            } else {
                t2 = Number.MAX_VALUE;
            }
            if (nowtime >= t1 && nowtime < t2) {

                
                $(p[i]).addClass('gcact').siblings().removeClass('gcact');
                
                
                var top = singwordTop - (pheight+21)*i;
                // console.log('top ==> ', top);
        
                $('.singword').animate({
                  top: top + 'px'
                }, 60)
                i = 0;

                break;
              }

        }
    }
    /* //播放模式切换
    $('.mode').on('click',function(){
        if($(this).attr('name')==1){
            $(this).css({
                backgroundImage:'url(./icon/sjbficon.png)'
            })
            $(this).attr('name',2)
        }else if($(this).attr('name')==2){
            $(this).css({
                backgroundImage:'url(./icon/dqxhicon.png)'
            })
            $(this).attr('name',3)
        }else if($(this).attr('name')==3){
            $(this).css({
                backgroundImage:'url(./icon/xhbficon.png)'
            })
            $(this).attr('name',1)
        }
    }) */
     function gcc(){
        var sing=$('.gdxq-list-item')
        for(var i=index-1;i<sing.length;i++){
          /*   audio.attr('src',$(sing[i+1]).data()) */
          var songid=$(sing[i]).data('id')
          console.log('songid',songid)
          //根据歌曲id获取音频
          $.ajax({
            type:'GET',
            url:basepath,
            data:{
                id:songid
            },
            success:function(data){
                console.log('song',data)
            if(data.data[0].url==null){
                console.log('会员专属')
                $('.vip-tip').css({display:'block'})
                setTimeout(function(){
                    $('.vip-tip').css({display:'none'})
                },1000)
                return
            }
            //查找之前激活的gdxq-list-item
            var gdxqlistitem=$('.gdxq-list-item.act')
            //console.log(gdxqlistitem)返回一个含有act类的gdxq-list-item的数组
            //如果存在之前激活的gdxq-list-item
            if(gdxqlistitem.length>0){
                //移除激活状态，更改播放状态
                gdxqlistitem.removeClass('act').data('play',0)
                //移除喇叭
                var laba=gdxqlistitem.find('.xuhao').children()
                if((laba).hasClass('jihuo')){
                    laba.removeClass('jihuo')
                }
            }
                //设置audio的src
                $(audio).attr('src',data.data[0].url)
                //保存最近播放歌曲的url
                recentlyplay.songurl=data.data[0].url
               
                //添加激活类
                $(sing[i]).addClass('act')
                
                
               
            },
            error: function (err) {
                //请求失败
                console.log('err ==> ', err);
              }

            })
           
            break;
        }
     }
    //下一首
    $('.next').on('click',function(){
        index=index+1
        gcc()
    })
    //上一首
    $('.prev').on('click',function(){
        index=index-1
        gcc()
    })
    audio.onended=function(){
        //列表循环
            var sing=$('.gdxq-list-item')
            for(var i=index-1;i<sing.length;i++){
              /*   audio.attr('src',$(sing[i+1]).data()) */
              var songid=$(sing[i+1]).data('id')
              console.log('songid',songid)
              //根据歌曲id获取音频
              $.ajax({
                type:'GET',
                url:basepath,
                data:{
                    id:songid
                },
                success:function(data){
                    console.log('song',data)
                if(data.data[0].url==null){
                    console.log('会员专属')
                    $('.vip-tip').css({display:'block'})
                    setTimeout(function(){
                        $('.vip-tip').css({display:'none'})
                    },1000)
                    return
                }
                //查找之前激活的gdxq-list-item
                var gdxqlistitem=$('.gdxq-list-item.act')
                //console.log(gdxqlistitem)返回一个含有act类的gdxq-list-item的数组
                //如果存在之前激活的gdxq-list-item
                if(gdxqlistitem.length>0){
                    //移除激活状态，更改播放状态
                    gdxqlistitem.removeClass('act').data('play',0)
                    //移除喇叭
                    var laba=gdxqlistitem.find('.xuhao').children()
                    if((laba).hasClass('jihuo')){
                        laba.removeClass('jihuo')
                    }
                }
                    //设置audio的src
                    $(audio).attr('src',data.data[0].url)
                    //保存最近播放歌曲的url
                    recentlyplay.songurl=data.data[0].url
                   
                    //添加激活类
                    $(sing[i+1]).addClass('act')
                    
                    
                   
                },
                error: function (err) {
                    //请求失败
                    console.log('err ==> ', err);
                  }

                })
                if(i==sing.length-1){
                    i=0
                }
                index=index+1
                break;
            }
        
    }


    function move(e){
        var left=e.changedTouches[0].pageX-48.48-$('.hk').width()/2
        var min=0;
        var max=$('.hkb').width()
        left = left<=min ? min : left >=max ? max : left
        console.log(left)   
        $('.hk').css({
            left:left
        })
        $('.hdt').css({
            width:left
        })
         prence=left/max
    }

    //点击触屏
    $('.hkb').on('touchstart',function(e){
        isPress = true;
        move(e)
    })
    //触屏滑动
    $('.hkb').on('touchmove',function(e){
        move(e)
    })
    //触屏结束
    $('.hkb').on('touchend',function(){
        var ct = audio.duration * prence;
        audio.currentTime=ct
        $('.star').text(formatTime(ct * 1000))
        isPress = false;
    })
    //歌词页面的播放按钮
    $('.gc-play').on('click',function(){
        if($(this).attr('name')==1){
            audio.pause()
            $(this).css({
                backgroundImage:'url(./icon/gcplay.png)'
            })
            $(this).attr('name',0)
            $('.yinfu').removeClass('activeYF')
            //主页面的播放按钮
             $('.play').css({
                backgroundImage:'url(./icon/play.png)'
            })                           
            $('.play').data('play',0)
            //更改播放歌曲的状态
            $('.gdxq-list-item.act').data('play',0)
            //改bottom身状态
            $('.bottom').attr('name',0)

        }else if($(this).attr('name')==0){
            audio.play()
            $(this).css({
                backgroundImage:'url(./icon/gcstop.png)'
            })
            $(this).attr('name',1)
            $('.yinfu').addClass('activeYF')
            //主页面的播放按钮
            $('.play').css({
                backgroundImage:'url(./icon/stop.png)'
            })                      
            $('.play').data('play',1)
            //更改播放歌曲的状态
            $('.gdxq-list-item.act').data('play',1)
            //改bottom身状态
            $('.bottom').attr('name',1)
        }
    })

    


})

