var ntlModel = [];

var newTabLinker = {
    params: {
        inputName: "#txtLink",
        buttonName: "#btnAddLink",
        valuesList: ".values-list",
        paramName: "ntlStorageObjet"
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
            var save = {};
            save[_this.params.paramName] = ntlModel;
            chrome.storage.sync.set(save, function () {
                _this.outputExistingValue();
            });
        });
    },

    outputExistingValue: function () {
        var _this = this;
        var existingValuesList = $(_this.params.valuesList);
        existingValuesList.html("");
        $.each(ntlModel, function (idx, val) {
            existingValuesList.append("<li>" + val + "</li>");
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
    });
}(jQuery));