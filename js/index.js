import * as greg from "./greg.js";
import * as tranq from "./tranq.js";

(function() {
    $(window).bind("hashchange", function() {
        init();
    });

    function init() {

        if (cal) {
            cal.unload();
        }

        // Starts with character '#'
        const hash = window.location.hash.substring(1);
        if (hash.startsWith(greg.name)) {
            cal = new greg.Greg(hash);
        } else {
            // Default is also tranq
            cal = new tranq.Tranq(hash);
        }

        cal.load();
    }

    let cal;
    init();
})();
