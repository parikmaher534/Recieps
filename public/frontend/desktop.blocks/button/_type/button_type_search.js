modules.define('control',
    function(provide, Control) {

        provide(Control.decl({
            onSetMod : {
                js: function() {
                    console.log('FFF', this)
                }
            }
        }));

    }
)