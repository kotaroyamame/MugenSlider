window.Slider={};

$(function () {
    Slider.Container=Backbone.View.extend({
        el:'.maintitleBox__backImgWrap__inner',
        initialize:function(){
            this.i=0;
            var this_=this;
            $.ajax({
                type:'GET',
                url:'./imgjson.php',
                dataType:'json',
                success:function(data){
                    this_.setcolle(data);
                },
                  error:function(){
                      alert("えらー");
                  }
            });
        },
        render:function(){
            if(this.i>this.colle.length){
                this.i=0;
                this.colle=this.shuffle(this.colle);
                
            };
            var html_ = '<div class="maintitleBox__backImgWrap__backImg" style="display:none;"><img src="img/'+this.colle[this.i % this.colle.length]+'" /></div>'
            this.$el.append(html_);
            this.animate();
            this.i++;
            return this;
        },
        success:function(model){
        },
        setHash:function(hash){
            this.hash=hash;
        },
        animate: function(){
            var this_=this;
            var slidW=this.$el.width(); 
            var width_=slidW;
            var findImgLen=this.$el.find('.maintitleBox__backImgWrap__backImg').length;
            this.$el.find('.maintitleBox__backImgWrap__backImg').css({zIndex:0});
            this.$el.find('.maintitleBox__backImgWrap__backImg').eq(-1)
                .css({zIndex:1,left:width_+"px",width:width_+"px",display:"block"})
                .animate({left:0},2000,function(){
                    if(findImgLen>2){
                        this_.$el.find('.maintitleBox__backImgWrap__backImg').eq(0).remove();
                    };

                });
        },
        colle:"",
        setcolle:function(data){
            this.colle=this.shuffle(data);
        },
        shuffle:function (array) {
              var n = array.length, t, i;

              while (n) {
                i = Math.floor(Math.random() * n--);
                t = array[n];
                array[n] = array[i];
                array[i] = t;
              }

              return array;
            }

    });
    
    Slider.container=new Slider.Container();
    $(window).on('load',function(){
    setInterval('Slider.container.render()',3000);
    });
    
 });
    
    


