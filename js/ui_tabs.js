(function ($) {
    $.fn.extend({
        responsiveTabs: function (options) {
            // Set the default values, use comma to separate the settings, example:
            var defaults = {
                type: 'default', // default, vertical, accordion;
                width: 'auto',
                fit: true,
                closed: false,
                activate: function(){}
            }
            // Variables
            var options = $.extend(defaults, options);            
            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';

            // Events
            $(this).bind('tabactivate', function(e, currentTab) {
                if(typeof options.activate === 'function') {
                    options.activate.call(currentTab, e)
                }
            });

            // Main function
            this.each(function () {
                var $respTabs = $(this);
                var $respTabsList = $respTabs.find('ul.tab-labels');
                $respTabs.find('ul.tab-labels li').addClass('tab-item');
                $respTabs.css({
                    'display': 'block',
                    'width': jwidth
                });

                $respTabs.find('.tab-container > div').addClass('tab-content');
                jtab_options();
                //Properties Function
                function jtab_options() {
                    if (jtype == vtabs) {
                        $respTabs.addClass('vtabs');
                    }
                    if (jfit == true) {
                        $respTabs.css({ width: '100%', margin: '0px' });
                    }
                    if (jtype == accord) {
                        $respTabs.addClass('tb-accordion');
                        $respTabs.find('.tab-labels').css('display', 'none');
                    }
                }

                //Assigning the div markup to accordion title
                var $tabItemdiv;
                $respTabs.find('.tab-content').before("<div class='tab-accordion-label' role='tab'><span class='arrow'></span></div>");

                var itemCount = 0;
                $respTabs.find('.tab-accordion-label').each(function () {
                    $tabItemdiv = $(this);
                    var innertext = $respTabs.find('.tab-item:eq(' + itemCount + ')').html();
                    $respTabs.find('.tab-accordion-label:eq(' + itemCount + ')').append(innertext);
                    $tabItemdiv.attr('tb-controls', 'tab_item-' + (itemCount));
                    itemCount++;
                });

                //Assigning the 'tb-controls' to Tab items
                var count = 0,
                $tabContent;
                $respTabs.find('.tab-item').each(function () {
                    $tabItem = $(this);
                    $tabItem.attr('tb-controls', 'tab_item-' + (count));
                    $tabItem.attr('role', 'tab');

                    //First active tab, keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode 
                    if(options.closed !== true && !(options.closed === 'accordion' && !$respTabsList.is(':visible')) && !(options.closed === 'tabs' && $respTabsList.is(':visible'))) {                  
                        $respTabs.find('.tab-item').first().addClass('tab-active');
                        $respTabs.find('.tab-accordion-label').first().addClass('tab-active');
                        $respTabs.find('.tab-content').first().addClass('tab-content-active').attr('style', 'display:block');
                    }

                    //Assigning the 'tb-labelledby' attr to tab-content
                    var tabcount = 0;
                    $respTabs.find('.tab-content').each(function () {
                        $tabContent = $(this);
                        $tabContent.attr('tb-labelledby', 'tab_item-' + (tabcount));
                        tabcount++;
                    });
                    count++;
                });

                //Tab Click action function
                $respTabs.find("[role=tab]").each(function () {
                    var $currentTab = $(this);
                    $currentTab.click(function () {

                        var $tabAria = $currentTab.attr('tb-controls');

                        if ($currentTab.hasClass('tab-accordion-label') && $currentTab.hasClass('tab-active')) {
                            $respTabs.find('.tab-content-active').slideUp('', function () { $(this).addClass('tab-accordion-label-closed'); });
                            $currentTab.removeClass('tab-active');
                            return false;
                        }
                        if (!$currentTab.hasClass('tab-active') && $currentTab.hasClass('tab-accordion-label')) {
                            $respTabs.find('.tab-active').removeClass('tab-active');
                            $respTabs.find('.tab-content-active').slideUp().removeClass('tab-content-active tab-accordion-label-closed');
                            $respTabs.find("[tb-controls=" + $tabAria + "]").addClass('tab-active');

                            $respTabs.find('.tab-content[tb-labelledby = ' + $tabAria + ']').slideDown().addClass('tab-content-active');
                        } else {
                            $respTabs.find('.tab-active').removeClass('tab-active');
                            $respTabs.find('.tab-content-active').removeAttr('style').removeClass('tab-content-active').removeClass('tab-accordion-label-closed');
                            $respTabs.find("[tb-controls=" + $tabAria + "]").addClass('tab-active');
                            $respTabs.find('.tab-content[tb-labelledby = ' + $tabAria + ']').addClass('tab-content-active').attr('style', 'display:block');
                        }
                        //Trigger tab activation event
                        $currentTab.trigger('tabactivate', $currentTab);
                    });
                    //Window resize function                   
                    $(window).resize(function () {
                        $respTabs.find('.tab-accordion-label-closed').removeAttr('style');
                    });
                });
});
}
});
})(jQuery);