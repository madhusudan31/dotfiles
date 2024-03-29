/*
Author: Valerio Maggio (@leriomaggio)
http://github.com/leriomaggio

 ==================================================
 Custom JQuery function that handles the scrolling
 to anchor links positioning the landing of the top
 pixel to the correct offset, considering that the
 header toolbar is FIXED by default.
 ==================================================

*/


window.onload = function() {
    if (window.JQuery) {
        function customise_anchor_links_click() {
            $("a").on("click", function (e) {
                const hash = this.hash;  // full hash reference, if any (e.g. #numpy.arange)
                if (hash !== "") {  // check that this is an anchor link
                    // Remove any existing handler
                    $(this).unbind();
                    // Get anchor (get rid of sharp symbol)
                    // and escape any invalid character for a JQuery selector
                    // e.g. numpy.arange ==> "numpy\.arange"
                    const anchor = $.escapeSelector(hash.substr(1));
                    // Look for ID selector
                    let anchor_sel = "#" + anchor;
                    let t = $(anchor_sel);
                    if ((t === undefined) || (t.length === 0)) {
                        // if not ID, look for a link name anchor
                        anchor_sel = "a[name='" + anchor + "'";
                        t = $(anchor_sel);
                    }
                    if ((t !== undefined) && (t.length > 0)) {
                        // Prevent default anchor click behavior
                        e.preventDefault();
                        const page = $("html, body");
                        // Using jQuery's animate() method to add smooth page scroll
                        // The optional number (800) specifies the number of milliseconds
                        // it takes to scroll to the specified area
                        let header_height = $("#header").height();
                        let scrollTopOffset = $(t).offset().top - header_height;

                        /*
                         * FIX Scrolling Animation Freeze:
                         * https://stackoverflow.com/questions/18445590/jquery-animate-stop-scrolling-when-user-scrolls-manually
                         */
                        page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
                            page.stop(true);  // clearQueue
                        });
                        page.stop(true).animate({
                            scrollTop: scrollTopOffset
                        }, 800, function () {
                            page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
                        });
                        return false;
                    }
                }
            });
        }

        // Trigger the selection when the page is ready
        $(document).ready(function () {
            customise_anchor_links_click();
        });

        /*
         Trigger a new selection scan every time a
         Markdown cell is rendered -
         so that (possible) newly defined links can be captured.
         */
        $([IPython.events]).on("rendered.MarkdownCell", function () {
            customise_anchor_links_click();
        });
    }


}