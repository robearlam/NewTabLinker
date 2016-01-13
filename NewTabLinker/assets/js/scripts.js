var ntlModel = [];

var newTabLinker = {
    params: {
        inputName: "#txtLink",
        buttonName: "#btnAddLink",
        valuesList: ".values-list",
        paramName: "ntlStorageObjet",
        removeLink: ".remove-link"
    },

    bindAddButton: function () {
        var _this = this;
        $(_this.params.buttonName).click(function (e) {
            var inputValue = $(_this.params.inputName).val();
            if (!inputValue) {
                alert("Please enter some text");
                return;
            }

            ntlModel.push(inputValue);
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

    saveDataToStorage: function() {
        var _this = this;
        var save = {};
        save[_this.params.paramName] = ntlModel;
        chrome.storage.sync.set(save, function () {
            _this.outputExistingValue();
        });
    },

    outputExistingValue: function () {
        var _this = this;
        var existingValuesList = $(_this.params.valuesList);
        existingValuesList.html("");
        $.each(ntlModel, function (idx, val) {
            _this.outputRow(existingValuesList, idx, val);
        });
    },

    outputRow: function(list, idx, val) {
        list.append("<li>" + idx + " - " + val + " - <a href=\"#\" class=\"remove-link\" data-val=\"" + idx + "\">remove</a></li>");
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