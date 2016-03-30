var dataManager = {
    params: {
        paramName: "ntlStorageObjet",
        importExportForm: ".import-export-form"
    },

    domManager: null,

    init: function(domManager) {
        this.domManager = domManager;
        this.loadDataFromStorage(this.domManager);
    },

    saveDataToStorage: function () {
        var _this = this;
        var save = {};
        save[_this.params.paramName] = ntlModel;
        chrome.storage.sync.set(save, function () {
            _this.domManager.renderData();
        });
    },

    loadDataFromStorage: function() {
        var _this = this;
        chrome.storage.sync.get(_this.params.paramName, function (obj) {
            if (obj[_this.params.paramName]) {
                ntlModel = obj[_this.params.paramName];
                _this.domManager.renderData();
            }
        });
    },

    exportLinkData: function() {
        var blob = new Blob([JSON.stringify(ntlModel)], {
            type: "text/plain;charset=utf-8;",
        });
        saveAs(blob, "newTabLinker.json");
    },

    importLinkData: function() {
        _this = this;
        input = document.getElementById('importFile');
        if (!input) {
          alert("Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
          alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
          alert("Please select a file before clicking 'Load'");               
        }
        else {
          file = input.files[0];
          fr = new FileReader();
          fr.onload = function(e) {
            ntlModel = JSON.parse(fr.result);
            _this.saveDataToStorage();
            $(_this.params.importExportForm).trigger('reset');
          };
          fr.readAsText(file);
        }
    },

    updateLinkValue: function(idx, name, link) {
        var quickLink = {
            name: name,
            link: link
        }
        ntlModel[idx] = quickLink;
    },

    addNewLink: function(name, link) {
        var quickLink = {
            name: name,
            link: link
        }
        ntlModel.push(quickLink);
    }
};