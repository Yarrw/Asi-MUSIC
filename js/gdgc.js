$(function(){
    //获取推荐歌单，推荐
    function getgedan(url){
        $.ajax({
            type:'GET',
            url:url,
            success:function(date){
                console.log('date',date)
                $.each(date.result,function(i,v){
                   /*  console.log("i",i)
                    console.log("v",v) */
                     var div=$(` <div class="gdgc-item" id="${v.id}">
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
            },
            error:function(err){
                console.log("err",err)
            }
            
        })
    }
    getgedan('http://www.arthurdon.top:3000/personalized')
  /*   $.ajax({
        type:'GET',
        url:'http://www.arthurdon.top:3000/personalized',
        success:function(date){
            console.log('date',date)
            $.each(date.result,function(i,v){
               
                 var div=$(` <div class="gdgc-item" id="${v.id}">
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
        },
        error:function(err){
            console.log("err",err)
        }
        
    }) */

    //首页的推荐
    $.ajax({
        type:'GET',
        url:'http://www.arthurdon.top:3000/top/playlist?cat=流行',
        success:function(gedan){
            console.log('gadan',gedan)
           /*  $.each(date.result,function(i,v){
              
                 var div=$(` <div class="gdgc-item" id="${v.id}">
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
            }) */
        },
        error:function(err){
            console.log("err",err)
        }
        
    })
})