window.Slider={};
Slider.settings={
    chengeTime:1.5*1000,
    animateSpeed:2*1000,
    animateVari:4, //0:slideright 1:slidedown 2:fade
    tileXsize:2,
    tileYsize:5
};

$(function () {
    Slider.Model1=Backbone.Model.extend({
        initialize:function(){
            this.filename=this.get("filename");
            this.width=this.get("width");
            this.height=this.get("height");
        }
    });
    Slider.Coll=Backbone.Collection.extend({
        url:'./imgjson.php',
        model:Slider.Model1,
        parse:function(data){
		return data;
	} 
    });
    Slider.Container=Backbone.View.extend({
        el:'.tilesWrap',
        initialize:function(){
            this.i=0;
            //this.tileBlockLen=this.$el.find(".tileBlock").length;
            this.timer=false;
            this.timer2=false;
            this.tileBlockLen=Slider.settings.tileXsize*Slider.settings.tileYsize;
            var this_=this;
            $(window).on('load',$.proxy(this,'setsize'));
            $(window).on('resize',$.proxy(this,'onresize'));
            this_.collection.fetch({
                success:function(){
                    this_.setElements();
                    this_.setInt();
                }
            });
        },
//        events:{
//            "click .tileBlock":"onclick"
//        },
        onclick:function(e){
            this.render(this.$el.find(".tileBlock").index(e));
        },
        onresize:function(){
            var this_=this;
            if (this.timer2 !== false) {
                clearTimeout(this.timer2);
            }
            this.timer2=setTimeout(function(){
                this_.setsize();
            },400);       
        },
        setsize:function(){
            this.slidwrapH=this.$el.height();
            this.slidwrapW=this.$el.width();
            console.log(this.slidwrapH+":"+this.slidwrapW);
            this.slidW=Math.floor(this.slidwrapW/Slider.settings.tileXsize)-2;  
            this.slidH=Math.floor(this.slidwrapH/Slider.settings.tileYsize)-2;
            this.slidAspect=this.slidH/this.slidW;
            this.$el.find(".tileBlock")
                .css({width:this.slidW+"px",height:this.slidH+"px"});
        },
        setElements:function(){
            var this_=this;
            
            var html_="";
            for(var i=0;i<this.tileBlockLen;i++){
                var imgH=this_.collection.at(i%this_.collection.size()).get("height");
                var imgW=this_.collection.at(i%this_.collection.size()).get("width");
                var covArray=this_.makeCover(imgH,imgW);
            html_ += '<div class="tileBlock">'+
                '<div class="tileBlock__inner">'+
                            '<div class="tileBlock__inner__image"><img src="img/'+this_.collection.at(i%this_.collection.size()).get("filename")+'" style="top:'+covArray.topSlidePX+'px;left:'+covArray.leftSlidePX+'px;width:'+covArray.imgW+'px;height:'+covArray.imgH+'px" /></div>'+
                            '<div class="tileBlock__inner__caption"><span class="tileBlock__caption__title"></span></div>'+
                        '</div>'+
                '</div>'
            }
            this.$el.html(html_);
            this.$el.find(".tileBlock")
                .css({width:this.slidW+"px",height:this.slidH+"px"});
            this.$el.find(".tileBlock").unbind();
            this.$el.find(".tileBlock").on('click',function(){
                this_.onclick(this);
            });
        },
        render:function(blockNO){
            var this_=this;
            var changeBlockNo;
            if(blockNO==null){
                do{
                    changeBlockNo=Math.floor(Math.random()*this.tileBlockLen);
                    console.log(this.changeBlockNo+"::"+changeBlockNo);
                }while(changeBlockNo===this.changeBlockNo);
                this_.changeBlockNo=changeBlockNo;
            }else{
                changeBlockNo=blockNO;
            }
            if(this.i==0){
                this.collection.reset(this.collection.shuffle(), {silent:true});
            }else if(this.i>=this.collection.size()){
                this.i=0;
            };
            var imgH=this_.collection.at(this.i).get("height");
            var imgW=this_.collection.at(this.i).get("width");
            var covArray=this_.makeCover(imgH,imgW);
            var html_ = '<div class="tileBlock__inner">'+
                            '<div class="tileBlock__inner__image"><img src="img/'+this_.collection.at(this.i).get("filename")+'" style="top:'+covArray.topSlidePX+'px;left:'+covArray.leftSlidePX+'px;width:'+covArray.imgW+'px;height:'+covArray.imgH+'px" /></div>'+
                            '<div class="tileBlock__inner__caption"><span class="tileBlock__caption__title"></span></div>'+
                        '</div>'
            this.$el.find(".tileBlock").eq(changeBlockNo).append(html_);
            this.animate(changeBlockNo);
            this.i++;
            return this;
        },
        animate: function(changeBlockNo){
            var this_=this;
            var this_el_find_img=this.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner');
            var findImgLen=this_el_find_img.length;
            this_el_find_img.css({zIndex:0});
            switch(Slider.settings.animateVari){
                    case 0:
                        this_el_find_img.eq(-1)
                            .css({zIndex:1,left:this_.slidW+"px",width:this_.slidW+"px",display:"block"})
                            .animate({left:0},Slider.settings.animateSpeed,function(){
                                if(findImgLen>1){
                                    this_el_find_img.eq(0).remove();
                                };
                            });
                        break;
                    case 1:
                        this_el_find_img.eq(-1)
                            .css({zIndex:1,top:this_.slidH+"px",display:"block"})
                            .animate({top:0},Slider.settings.animateSpeed,function(){
                                if(findImgLen>1){
                                    this_el_find_img.eq(0).remove();
                                };
                            });
                        break;
                    case 2:
                        this_el_find_img.eq(-1)
                            .css({zIndex:1,left:-this_.slidW+"px",width:this_.slidW+"px",display:"block"})
                            .animate({left:0},Slider.settings.animateSpeed,function(){
                                if(findImgLen>1){
                                    this_el_find_img.eq(0).remove();
                                };
                            });
                        break;
                    case 3:
                        this_el_find_img.eq(-1)
                            .css({zIndex:1,top:-this_.slidH+"px",display:"block"})
                            .animate({top:0},Slider.settings.animateSpeed,function(){
                                if(findImgLen>1){
                                    this_el_find_img.eq(0).remove();
                                };
                            });
                        break;
                    case 4:
                        this.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner').each(function(index,domEle){
                            $(this).css({zIndex:5-index,top:"0px",display:"block"});
                        });
                        this.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner').eq(0)
                            .css({zIndex:6,top:"0px",display:"block"})
                            .addClass("vib")
                            .animate({top:this_.slidwrapH+50+"px"},Slider.settings.animateSpeed,function(){
                                while(this_.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner').length>2){
                                    this_.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner').eq(0).remove();
                                    this_.$el.find(".tileBlock").eq(changeBlockNo).find('.tileBlock__inner').removeClass("vib");
                                };
                            });
                        break;
            };
        },
        setInt:function(){
            var this_=this;
            this.timer=setInterval(function(){
                this_.render();
            },Slider.settings.chengeTime);
        },
        removeInt:function(){
            clearInterval(this.timer);
        },
        makeCover:function(h,w){
            var this_=this;
            var imgAspect=h/w;
            var leftSlidePX=0,topSlidePX=0,imgH_,imgW_;
                if(imgAspect<this_.slidAspect){
                    imgH_=this_.slidH;
                    imgW_=(1/imgAspect)*this_.slidH;
                    leftSlidePX= -1*(imgW_-this_.slidW)/2;
                }else{
                    imgH_=imgAspect*this_.slidW;
                    imgW_=this_.slidW;
                    topSlidePX= -1*(imgH_-this_.slidH)/2;
                };
            var covArray={"imgH":imgH_,"imgW":imgW_,"topSlidePX":topSlidePX,"leftSlidePX":leftSlidePX};
            return covArray;
        
        }
    });
    
    Slider.coll=new Slider.Coll;
    Slider.container=new Slider.Container({
        collection:Slider.coll
    });    
 });
    
    


