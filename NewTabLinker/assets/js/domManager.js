var domManager = {
    params: {
        linkInputName: "#txtLink",
        nameInputName: "#txtName",
        searchTermInputName: "#searchTerm_",
        addButtonName: "#btnAddLink",
        linkButtonName: "#btnOpenLink",
        valuesList: ".values-list",
        removeLink: ".remove-link",
        templateName: "#template",
        settingsSwitch: ".settings-switch",
        settings: ".settings",
        isHidden: "is-hidden"
    },

    dataManager: null,

    init: function(dataManager) {
        this.dataManager = dataManager;
        this.bindAddButton();
        this.bindRemoveLinks();
        this.bindOpenButtons();
        this.bindSettingsSwitch();
    },

    bindSettingsSwitch: function() {
        var _this = this;
        $(_this.params.settingsSwitch).click(function (e) {
            $(_this.params.settings).toggleClass(_this.params.isHidden);
        });
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
            _this.dataManager.saveDataToStorage();

            link.val("");
            name.val("");
        });
    },

    bindRemoveLinks: function() {
        var _this = this;
        $(_this.params.valuesList).on("click", _this.params.removeLink, function(e) {
            ntlModel.splice($(this).attr("data-val"), 1);
            _this.dataManager.saveDataToStorage();
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
    }  
};
