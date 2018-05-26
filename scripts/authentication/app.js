Ext.getDoc().on("contextmenu", function(e) {
	e.stopEvent();
});

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
	extend: 'Ext.app.Application',
	name: 'RMIS',
	appFolder: 'scripts/authentication',
	requires: [
		'RMIS.view.LockScreen',
		'RMIS.view.Login',
		'RMIS.view.Register',
		'RMIS.view.PasswordReset'
    ],
    
	init: function() {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	},
	
	launch: function() {
		Ext.create('RMIS.view.Login', {
			renderTo: Ext.getBody()
		});
	}

});
