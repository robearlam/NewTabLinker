var dataManager = {
    params: {
        paramName: "ntlStorageObjet"
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
            _this.domManager.outputExistingValue();
        });
    },

    loadDataFromStorage: function() {
        var _this = this;
        chrome.storage.sync.get(_this.params.paramName, function (obj) {
            if (obj[_this.params.paramName]) {
                ntlModel = obj[_this.params.paramName];
                _this.domManager.outputExistingValue();
            }
        });
    }
};