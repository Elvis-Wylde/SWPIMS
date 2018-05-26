Ext.define('RMIS.controller.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',
    
    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },
    
    onRouteChange: function(id) {
    	this.setCurrentView(id);
    },
    
    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        if (hashTag != 'register' && hashTag != 'passwordreset') {
            hashTag = 'login';
        }

        var me = this,
            lastView = me.lastView,
            newView;
        
        // Kill any previously routed window
        if (lastView && (lastView.isWindow)) {
            lastView.destroy();
        }

        newView = Ext.create({
            xtype: hashTag,
            hideMode: 'offsets'
        });

        if (newView.isFocusable(true)) {
            newView.focus();
        }
        me.lastView = newView;
    },
    
    onWinAccountLogin: function () {
        // TODO: implement windows account log in handler
    },

    onLoginButton: function () {
        // TODO: log in action
        // this.redirectTo('dashboard', true);
        window.location.replace("demo.html");

        /*
        var me = this,
            viewModel = me.getViewModel(),
            cookie = Ext.state.Manager.getProvider();
        if (viewModel.get("persist")) {
            cookie.set("login-persist", true);
            cookie.set("login-userid", viewModel.get("userid"));
            cookie.set("login-password", viewModel.get("password"));
        } else {
            cookie.clear("login-persist");
            cookie.clear("login-userid");
            cookie.clear("login-password");
        }
        
        var connection = new Ext.data.Connection({
        	async: false,
            url: 'GetAuthentication',
            method: 'POST',
            withCredentials: true,
            extraParams: {
            	method: 'login',
            	userid: viewModel.get("userid"),
                password: viewModel.get("password")
            }
        });
        
        connection.request({
        	success: function (response) {
        		var result = Ext.decode(response.responseText);
        		if (result.success) {
        			var role = result.result.role;
        			var permission = result.result.permission;
        			if (permission.length == 1) {
        				window.location.replace(permission[0] + ".html");
        			} else if (permission.length == 2) {
        				var win = Ext.create('RMIS.view.AppChooser');
        				win.show();
        			}
        		} else {
        			Ext.toast({
        	            html: result.error.message,
        	            closable: false,
        	            align: 't',
        	            slideInDuration: 800,
        	            minWidth: 400
        	        });
        		}
        	},
        	failure: function (response, opts) {
        		Ext.toast({
    	            html: "无法连接认证服务",
    	            closable: false,
    	            align: 't',
    	            slideInDuration: 800,
    	            minWidth: 400
    	        });
        	}
        });
        */

        /*
        Ext.Ajax.request({
            async: false,
            url: 'GetAuthentication',
            method: 'POST',
            // username: 'user',
            // password: '123',
            withCredentials: true,
            extraParams: {
            	username: 'user',
                password: '123'
            },
            success: function (response) {
            	console.log(response);
                var result = Ext.decode(response.responseText);
                window.userProfile = result.userprofile;
                window.userProfile.name = viewModel.get("userid");
                // me.redirectTo('mapview', true);
                window.location.replace("index.html");
            },
            failure: function (response, opts) {
                window.userUpdated = false;
                var status = response.status,
                    result = Ext.decode(response.responseText);
                console.log('server-side failure with status code: ' + status);
            }
        });
        */
    },

    onLoginAsButton: function () {
        this.redirectTo('login', true);
    },

    onNewAccount: function () {
        // TODO: 
        this.redirectTo('register', true);
    },

    onSignupClick: function () {
        // TODO: 
        // this.redirectTo('dashboard', true);
    },

    onResetClick: function () {
        // TODO: 
        // this.redirectTo('dashboard', true);
    },

    afterLoginRender: function () {
        var me = this,
            cookie = Ext.state.Manager.getProvider(),
            viewModel = me.getViewModel(),
            refs = me.getReferences().authDialog.getController().getReferences();
        if (cookie.get("login-persist")) {
            viewModel.set("userid", cookie.get("login-userid"));
            viewModel.set("password", cookie.get("login-password"));
            viewModel.set("persist", true);
            refs.userid.setValue(cookie.get("login-userid"));
            refs.password.setValue(cookie.get("login-password"));
            refs.loginpersist.setValue('true');
        }
    }
});