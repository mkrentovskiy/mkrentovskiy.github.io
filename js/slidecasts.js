(function($) {
    var sshp = null;
    var scp = null;
    var slide_pattern = null;
    var total = 0;

    $.app = {}
    
    $.app.init = function() {
        slide_pattern = $("#_p").clone();
        $("#_p").remove();

        $("#btn_ls").hide();
        $("#btn_cb").hide();
    }

    $.app.addSlideshare = function() {
        var doc_id = $("#slideshare_source").val();
        
        if(doc_id.length > 0) {
            var params = { allowScriptAccess: "always" };
            var atts = { id: "ssh_player" };
            var flashvars = { doc : doc_id, startSlide : 1, rel : 0 };
            swfobject.embedSWF(
                "http://static.slidesharecdn.com/swf/ssplayer2.swf", 
                "ssh_player_box", 
                "678", 
                "480", 
                "8", 
                null, 
                flashvars, 
                params, 
                atts, 
                function(e) {
                    if(e.success) sshp = $("#ssh_player")[0];
                });

            $("#btn_ss").hide();
            $("#btn_ls").show();
        }
    }

    $.app.addSoundcloud = function() {
        var doc_id = $("#soundcloud_source").val();
        
        if(doc_id.length > 0) {
            var widgetIframe = document.getElementById('sc-widget'),
                widget = SC.Widget(widgetIframe);

            widget.bind(SC.Widget.Events.READY, function() {
                widget.load(doc_id, { show_artwork: false });
                scp = widget;
                $("#btn_sc").hide();
            }); 
        }
    }

    $.app.listSlides = function() {
        if(sshp && sshp.getTotalSlides) {
            total = sshp.getTotalSlides();

            if(total > 0) {
                for(i = 1; i <= total; i++) {
                    var n = slide_pattern.clone();
                    var cb = (function(ind) {   
                            return function() {
                                var val = $("#slide_" + ind).val(); 
                                if(val == "") setTimeForSlide(ind);
                                else {
                                    if(sshp) sshp.jumpTo(ind);
                                    if(scp) scp.seekTo(0 + val);
                                };
                            }
                        })(i);
                    $("input", n).attr("id", "slide_" + i);
                    $(".num", n).text(i);
                    $(".btn", n).click(cb);
                    $("#for_slides").append(n);
                }
                $("#mark_slides_timestamp").removeClass("hide");
                $("#btn_cb").show();
                $("#btn_ls").hide();
            } else {
                $("#btn_sc").show();
            }
        }
    }

    $.app.forCurrentSlide = function() { setTimeForSlide(sshp.getCurrentSlide()); }

    function setTimeForSlide(i) {
        if(scp) scp.getPosition(function(v) { $("#slide_" + i).val(v); });
        if(i < total) sshp.jumpTo(i + 1);
    }

    $.app.generate = function() {
        $("#generate_code").removeClass("hide");

        s = "";
        for(i = 1; i <= total; i++) {
            var p = (i == 1) ? 0 : $("#slide_" + (i - 1)).val();
            var pn = (i == total) ? 999999999 : $("#slide_" + i).val();
            
            s += "\t\t[" +  p + ", " + pn + ", " + i + "]" + (i == total ? "\n" : ",\n");
        }
        ss = $("#slideshare_source").val();
        sc = $("#soundcloud_source").val();

        var code = "<script type=\"text/javascript\" src=\"//code.jquery.com/jquery-2.1.1.min.js\"></script>\n\
<script type=\"text/javascript\" src=\"//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js\"></script>\n\
<script type=\"text/javascript\" src=\"//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js\"></script>\n\
<script type=\"text/javascript\" src=\"//w.soundcloud.com/player/api.js\"></script>\n\
<script type=\"text/javascript\" src=\"//mkrentovskiy.github.io/js/slidecast_player.js\"></script>\n\
\n\
<div id=\"slidecast\"></div>\n\
<script type=\"text/javascript\">\n\
\t$.slidecast_player($(\"#slidecast\"), \"" + ss + "\", \"" + sc + "\", [\n" + s + "\t]);\n\
</script>\n";
        
        $("#result").val(code);
    }
    
})(window.jQuery);

$(document).ready(function() { $.app.init(); });