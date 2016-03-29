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
        isHidden: "is-hidden",
        settingsError: ".settings .error",
        importButton: "#btnImport",
        exportButton: "#btnExport",
        chooseFileInput: "#importFile",
        chooseFileText: "Choose File",
        searchInput: ".search"
    },

    dataManager: null,

    init: function(dataManager) {
        this.dataManager = dataManager;
        this.bindAddButton();
        this.bindRemoveLinks();
        this.bindOpenButtons();
        this.bindSettingsSwitch();
        this.bindExportButton();
        this.bindImportButton();
        this.bindChooseFileLink();

        $(this.params.settings).slideToggle(0);
        $(this.params.removeLink).fadeToggle(0);
    },

    bindSettingsSwitch: function() {
        var _this = this;
        $(_this.params.settingsSwitch).click(function (e) {
            $(_this.params.settings).slideToggle("fast");
            $(_this.params.removeLink).fadeToggle("fast");
        });
    },

    bindAddButton: function () {
        var _this = this;
        $(_this.params.addButtonName).click(function (e) {
            var error = $(_this.params.settingsError);
            error.addClass(_this.params.isHidden);

            var link = $(_this.params.linkInputName);
            var name = $(_this.params.nameInputName);
            if (!link.val() || !name.val()) {
                error.removeClass(_this.params.isHidden);
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
            var li = $(this).closest("li");
            var idx = li.attr("data-index");
            var quickLink = ntlModel[idx];
            var searchTerm = li.find(_this.params.searchTermInputName + idx).val().trim();
            var props = { url: quickLink.link.replaceAll("{VALUE}", searchTerm) };
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.update(tab.id, props);
            });         
        });

        $(_this.params.valuesList).on('keyup', this.params.searchInput, function(e) {
            if(event.keyCode == 13){
                $(this).next().click();
            }
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

    bindExportButton: function() {
        var _this = this;
        $(_this.params.exportButton).click(function (e) {
            _this.dataManager.exportLinkData();
        });
    },

    bindImportButton: function() {
        var _this = this;
        var chooseFileInput = $(_this.params.chooseFileInput);
        var label    = chooseFileInput.next();
        var labelValue = label.html();
        var importButton = $(_this.params.importButton);

        $(_this.params.importButton).click(function (e) {
            _this.dataManager.importLinkData();
            $(_this.params.importExportForm).trigger('reset');
            label.html(labelValue);
            importButton.prop('disabled', true);
        });
    },

    bindChooseFileLink: function() {
        var _this = this;
        var chooseFileInput = $(_this.params.chooseFileInput);
        var label    = chooseFileInput.next();
        var labelVal = label.html();
        var importButton = $(_this.params.importButton);

        chooseFileInput.on('change', function( e )
        {
            var fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName ) {
                label.html(labelVal.replaceAll(_this.params.chooseFileText,fileName));
                importButton.prop('disabled', false);
            }
            else {
                label.html(labelVal);
                importButton.prop('disabled', true);
            }
        });
    }
};
