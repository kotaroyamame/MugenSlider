window.Slider={};
Slider.settings={
    chengeTime:5*1000,
    animateSpeed:2*1000
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
            var this_=this;
            
            this_.collection.fetch({
                success:function(){
                    this_.setInt();
                }
            });
        },
        events:{
            //"load resize":"render"
        
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
            var slidW=this.$el.find(".tileBlock").width(); 
            var findImgLen=this_el_find_img.length;
            this_el_find_img.css({zIndex:0});
            this_el_find_img.eq(-1)
                .css({zIndex:1,left:slidW+"px",width:slidW+"px",display:"block"})
                .animate({left:0},Slider.settings.animateSpeed,function(){
                    if(findImgLen>2){
                        this_el_find_img.eq(0).remove();
                    };
                });
        },
        setInt:function(){
            var this_=this;
            this.timer=setInterval(function(){
                this_.render();
            },Slider.settings.chengeTime);
        },
        close:function(){
            clearInterval(this.timer);
        }
    });
    
    Slider.coll=new Slider.Coll;
    Slider.container=new Slider.Container({
        collection:Slider.coll
    });    
 });
    
    


