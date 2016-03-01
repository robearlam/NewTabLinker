var ntlModel = [];

(function ($) {
    $(document).ready(function () {
        dataManager.init(domManager);
        domManager.init(dataManager);
    });
}(jQuery));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};