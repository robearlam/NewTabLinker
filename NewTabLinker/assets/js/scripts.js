var ntlModel = [];

var newTabLinker = {
    params: {
        linkInputName: "#txtLink",
        nameInputName: "#txtName",
        searchTermInputName: "#searchTerm_",
        addButtonName: "#btnAddLink",
        linkButtonName: "#btnOpenLink",
        valuesList: ".values-list",
        paramName: "ntlStorageObjet",
        removeLink: ".remove-link",
        templateName: "#template"
    },

    bindAddButton: function () {
        var _this = this;
        $(_this.params.addButtonName).click(function (e) {
            var link = $(_this.params.linkInputName);
            var name = $(_this.params.nameInputName);
            if (!link.val() || !name.val()) {
                alert("Please ensure you have entered the link and its name");
                return;
            }

            var quickLink = {
                name: $(name).val(),
                link: $(link).val()
            }
            ntlModel.push(quickLink);
            _this.saveDataToStorage();

            link.val("");
            name.val("");
        });
    },

    bindRemoveLinks: function() {
        var _this = this;
        $(_this.params.valuesList).on("click", _this.params.removeLink, function(e) {
            ntlModel.splice($(this).attr("data-val"), 1);
            _this.saveDataToStorage();
        });
    },

    bindOpenButtons: function() {
        var _this = this;
        $(_this.params.valuesList).on("click", _this.params.linkButtonName, function(e) {
            var li = $(this).parent("li");
            var idx = li.attr("data-index");
            var quickLink = ntlModel[idx];
            var searchTerm = li.find(_this.params.searchTermInputName + idx).val();
            var props = { url: quickLink.link.replaceAll("{VALUE}", searchTerm) };
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.update(tab.id, props);
            });         
        });
    },

    outputExistingValue: function () {
        var _this = this;
        var existingValuesList = $(_this.params.valuesList);
        existingValuesList.html("");
        $.each(ntlModel, function (idx, quickLink) {
            _this.outputRow(existingValuesList, idx, quickLink);
        });
    },

    outputRow: function(list, idx, quickLink) {
        var _this = this;
        var templateHtml = $(_this.params.templateName).clone().html();
        list.append(_this.replacePlaceholders(templateHtml, idx, quickLink));
    },

    replacePlaceholders: function(html, idx, quickLink) {
        var outputHtml = html.replaceAll("{INDEX}", idx);
        outputHtml = outputHtml.replaceAll("{NAME}", quickLink.name);
        outputHtml = outputHtml.replaceAll("{LINK}", quickLink.link);
        return outputHtml;
    },

    saveDataToStorage: function () {
        var _this = this;
        var save = {};
        save[_this.params.paramName] = ntlModel;
        chrome.storage.sync.set(save, function () {
            _this.outputExistingValue();
        });
    },

    loadDataFromStorage: function() {
        var _this = this;
        chrome.storage.sync.get(_this.params.paramName, function (obj) {
            if (obj[_this.params.paramName]) {
                ntlModel = obj[_this.params.paramName];
                _this.outputExistingValue();
            }
        });
    }
};

(function ($) {
    $(document).ready(function () {
        newTabLinker.loadDataFromStorage();
        newTabLinker.bindAddButton();
        newTabLinker.bindRemoveLinks();
        newTabLinker.bindOpenButtons();
    });
}(jQuery));


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};