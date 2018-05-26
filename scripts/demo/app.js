Ext.getDoc().on("contextmenu", function(e) {
	e.stopEvent();
});

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
	extend: 'Ext.app.Application',
	name: 'RMIS',
	appFolder: 'scripts/demo',
	requires: [
        'RMIS.view.main.MainView',
        'RMIS.view.widgets.ResourcesViewer'
    ],
    
    stores: [
		'NavigationTree', 'RegionTree', "Projects", "Machines", "PreProcess"
	],
     
    defaultToken : 'mapview',
    
	init: function() {
		Ext.ariaWarn = Ext.emptyFn;
		Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	},
	
	launch: function() {
		// var profile = this.verifyAuth(false);
		var profile = {
            "userid": "Y10301",
            "name": "王世华",
            "password": "666666",
            "email": "wangshihua@swpis.com",
            "phone": "13888888888",
            "orgName": "长委监理",
            "title": "总监",
            "image": "resources/images/user-profile/2.png",
            "role": 1,
            "permission":["demo"]
        };
		if (profile) {
			this.view = Ext.create('RMIS.view.main.MainView', {
				renderTo: Ext.getBody()
			});
			this.view.getController().updateUserProfile(profile);
			this.view.mask();
			var maskEl = this.view.getEl().getData().maskEl;
			maskEl.setStyle({
				background: 'transparent'
			});
		}
	},
	
	verifyAuth: function(alert) {
		var me = this, profile;
		var connection = new Ext.data.Connection({
        	async: false,
            url: 'GetAuthentication',
            method: 'POST',
            withCredentials: true,
            extraParams: {
            	method: 'verify'
            }
        });
    	connection.request({
    		async: false,
        	success: function (response) {
        		var result = Ext.decode(response.responseText);
        		if (result.success) {
        			profile = result.result;
        		} else {
        			if (alert) {
        				Ext.MessageBox.alert('会话超时', result.error.mesage, function() {
        					window.location.replace("index.html#login");
        				});
        			} else {
        				window.location.replace("index.html#login");
        			}
        		}
        	},
        	failure: function (response, opts) {
        		if (alert) {
	        		Ext.MessageBox.alert('验证失败', "用户验证服务连接失败，请重新登录。", function() {
						window.location.replace("index.html#login");
					});
        		} else {
        			window.location.replace("index.html#login");
        		}
        	}
        });
    	return profile;
	},
	
	/**
	 * @param {String} contentType 3个备选值：image/iframe/pdf
	 * @param {Object[]} contents 3个属性，title指定显示名称，sourcePath指定内容路径,sourceId指定image或videoDOM对象ID
	 * @param {Ext.Component} target 从哪里显示，optional
	 * @param {Number} index 初始化显示第几个内容
	 */
	showResourcesViewer: function(contentType, contents, target, index) {
		index = (index > 0 && index < contents.length) ? index : 0;
    	var resourcesViewer = Ext.create('RMIS.view.widgets.ResourcesViewer', {
    		contentType: contentType,
    		contentArray: contents,
    		currentCardIdx: index
    	});
    	resourcesViewer.show(target);
	}

});
