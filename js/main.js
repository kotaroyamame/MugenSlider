window.Slider={};
Slider.settings={
    chengeTime:5*1000,
    animateSpeed:2*1000,
    animateVari:4, //0:slideright 1:slidedown 2:fade
    tileXsize:5,
    tileYsize:5
};

$(function () {
    Slider.Model1=Backbone.Model.extend({
        initialize:function(){
            this.filename=this.get("filename");
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
            this.tileBlockLen=this.$el.find(".tileBlock").length;
            this.timer=false;
            var this_=this;
            $(window).on('load',$.proxy(this,'setsize'));
            $(window).on('resize',$.proxy(this,'onresize'));
            this_.collection.fetch({
                success:function(){
                    this_.setInt();
                }
            });
        },
//        events:{
//            "resize .tilesWrap":"onResize"
//        },
        onresize:function(){
            var this_=this;
            if (this.timer !== false) {
                clearTimeout(this.timer);
            }
            this.timer=setTimeout(function(){
                this_.setsize();
            },400);       
        },
        setsize:function(){
            var this_=this;
            this.slidW=this_.$el.find(".tileBlock").eq(0).width();  
            this.slidH=this_.$el.find(".tileBlock").eq(0).height();
            this.slidwrapH=this.$el.height();
        },
        render:function(){
            var changeBlockNo=Math.floor(Math.random()*this.tileBlockLen);
            if(this.i==0){
                this.collection.reset(this.collection.shuffle(), {silent:true});
            }else if(this.i>=this.collection.size()){
                this.i=0;
            };
            var html_ = '<div class="tileBlock__inner">'+
                            '<div class="tileBlock__inner__image"><img src="img/'+this.collection.at(this.i).get("filename")+'" /></div>'+
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
                                if(findImgLen>2){
                                    this_el_find_img.eq(0).remove();
                                };
                            });
                        break;
                    case 4:
                        this_el_find_img.eq(-1)
                            .css({zIndex:0,top:"0px",display:"block"});
                        this_el_find_img.eq(-2)
                            .css({zIndex:2,top:"0px",display:"block"})
                            .animate({top:this_.slidwrapH+"px"},Slider.settings.animateSpeed,function(){
                                if(findImgLen>1){
                                    this_el_find_img.eq(0).remove();
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
        }
    });
    
    Slider.coll=new Slider.Coll;
    Slider.container=new Slider.Container({
        collection:Slider.coll
    });    
 });
    
    


