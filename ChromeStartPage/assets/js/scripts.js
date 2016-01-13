var newTabLinker = {
    params: {
        inputName: '#txtLink',
        buttonName: '#btnAddLink'
    },

    init: function () {
        alert('ntl-init');

        $(this.params.buttonName).click(function (e) {
            alert('button clicked');
        });
    }
};

(function ($) {
    $(document).ready(function () {
        newTabLinker.init();
    });
}(jQuery));