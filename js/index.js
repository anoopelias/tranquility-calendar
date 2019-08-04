import Greg from "./greg.js";
import Tranq from "./tranq.js";

(function() {
    $(window).bind("hashchange", init);

    function init() {
        if (cal) {
            cal.unload();
        }

        // Starts with character '#'
        const hash = window.location.hash.substring(1);
        if (hash.startsWith(Greg.name)) {
            cal = new Greg(hash);
        } else {
            // Default is also tranq
            cal = new Tranq(hash);
        }

        cal.load();
    }

    let cal;
    init();
})();
