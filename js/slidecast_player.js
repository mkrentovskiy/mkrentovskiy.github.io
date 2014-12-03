(function($) {
    var sshp = {};
    var scp = {};
    var RECALL_PERIOD = 500;

    function check(id, a, cs) {
        var b = true;
        if(sshp[id] && scp[id]) {
            if(sshp[id].getCurrentSlide) {
                var c = sshp[id].getCurrentSlide();

                if(cs != c) {
                    for(i = 0; i < a.length; i++) { if(c == a[i][2]) scp[id].seekTo(a[i][0]); };
                    cs = c;
                } else {
                    b = false;
                    scp[id].getPosition(function(v) { 
                            for(i = 0; i < a.length; i++) { 
                                if(v >= a[i][0] && v < a[i][1] && a[i][2] != c) {
                                    sshp[id].jumpTo(a[i][2]); 
                                    cs = c;
                                };
                            };
                            setTimeout(function() { check(id, a, cs); }, RECALL_PERIOD);                  
                        });
                }
            } 
        } 
        if(b) setTimeout(function() { check(id, a, cs); }, RECALL_PERIOD);
    }


    
    $.slidecast_player = function(target, ss, sc, a) {
        var id = Math.floor((Math.random() * 100000) + 1);

        $("<div id='ssh_player_box_" + id + "'></div>\
            <iframe id='sc-widget-" + id + "' width='476' height='166' scrolling='no' frameborder='no' \
             src='https://w.soundcloud.com/player/?url=" + sc + "&show_artwork=false'></iframe>").appendTo(target);

        SC.Widget($("#sc-widget-" + id)[0]).bind(SC.Widget.Events.READY, function() { 
            scp[id] = SC.Widget($("#sc-widget-" + id)[0]); }); 

        swfobject.embedSWF(
            "http://static.slidesharecdn.com/swf/ssplayer2.swf", 
            "ssh_player_box_" + id, 
            "476", 
            "400", 
            "8", 
            null, 
            { doc : ss, startSlide : 1, rel : 0 }, 
            { allowScriptAccess: "always" }, 
            { id: "ssh_player_" + id }, 
            function(e) { if(e.success) sshp[id] = $("#ssh_player_" + id)[0]; });

        setTimeout(function() { check(id, a, 1); }, RECALL_PERIOD);
    };
    
})(window.jQuery);
  