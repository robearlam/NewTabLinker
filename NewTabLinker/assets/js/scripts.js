var ntlModel = [];

(function ($) {
    $(document).ready(function () {
        dataManager.init(domManager);
        domManager.init(dataManager);
    });
}(jQuery));