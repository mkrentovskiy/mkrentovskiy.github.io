(function($) {
    var sshp = null;
    var scp = null;

    $.app = {}
    $.app.init = function() {
    }

    function loadSlideSharePlayer(doc_id) {
        var params = { allowScriptAccess: "always" };
        var atts = { id: "ssh_player_box" };
        var flashvars = { doc : doc_id, startSlide : 1, rel : 0 };
        swfobject.embedSWF("http://static.slidesharecdn.com/swf/ssplayer2.swf", 
            "ssh_player", "598", "480", "8", null, flashvars, params, atts);
        sshp = $("ssh_player")[0];
    }
    
    $.app.jumpTo = function jumpTo(slide) { sshp.jumpTo(slide); }

})(window.jQuery);

$(document).ready(function() { $.app.init(); });