var domManager = {
    params: {
        inputUrl: "#txtUrl",
        inputName: "#txtName",
        addButtonName: "#btnAddLink",
        valuesList: ".values-list",
        paramName: "ntlStorageObjet",
        removeLink: ".remove-link",
        linkButtonName: ".btnOpenLink"
    },

    dataManager: null,

    init: function(dataManager) {
        this.dataManager = dataManager;
        this.bindAddButton();
        this.bindRemoveButtons();
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
            _this.dataManager.saveDataToStorage();
        });
    },

    bindRemoveButtons: function() {
        var _this = this;
        $(_this.params.valuesList).on("click", _this.params.removeLink, function(e) {
            ntlModel.splice($(this).attr('data-val'), 1);
            _this.dataManager.saveDataToStorage();
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
    }    
};