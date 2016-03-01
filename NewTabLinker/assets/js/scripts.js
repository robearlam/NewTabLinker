var ntlModel = [];

var newTabLinker = {
    params: {
        inputUrl: "#txtUrl",
        inputName: "#txtName",
        addButtonName: "#btnAddLink",
        valuesList: ".values-list",
        paramName: "ntlStorageObjet",
        removeLink: ".remove-link",
        linkButtonName: ".btnOpenLink"
    },

    bindAddButton: function () {
        var _this = this;
        $(_this.params.addButtonName).click(function (e) {
            var inputUrlValue = $(_this.params.inputUrl).val();
            var inputNameValue = $(_this.params.inputName).val();
            if (!inputUrlValue || !inputNameValue) {
                alert("Please ensure you have completed the Name and URL fields.");
                return;
            }

            var newEntry = {name:inputNameValue, url: inputUrlValue};
            ntlModel.push(newEntry);
            _this.saveDataToStorage();
        });
    },

    bindRemoveButtons: function() {
        var _this = this;
        $(_this.params.valuesList).on("click", _this.params.removeLink, function(e) {
            ntlModel.splice($(this).attr('data-val'), 1);
            _this.saveDataToStorage();
        });
    },

    bindLinkButton: function() {
        var _this = this;
        $(_this.params.linkButtonName).click(function (e) {
            var props = { url: "http://www.google.com.au" };
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.update(tab.id, props);
            });
        });
    },

    outputExistingValue: function () {
        var _this = this;
        var existingValuesList = $(_this.params.valuesList);
        existingValuesList.html("");
        $.each(ntlModel, function (idx, entry) {
            _this.outputRow(existingValuesList, idx, entry);
        });
        _this.bindLinkButton();
    },

    outputRow: function(list, idx, entry) {
        list.append("<li><input type=\"text\" name=\"searchField\" /><input name=\"btnOpenLink\" data-val=\"" + idx + "\" class=\"btnOpenLink\" type=\"button\" value=\"Search " + entry.name + "\" /> - <a href=\"#\" class=\"remove-link\" data-val=\"" + idx + "\">remove</a></li>");
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
        newTabLinker.bindRemoveButtons();
    });
}(jQuery));