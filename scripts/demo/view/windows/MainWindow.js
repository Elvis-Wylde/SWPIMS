Ext.define('RMIS.view.windows.MainWindow', {
	extend: 'Ext.window.Window',
	
	bodyBorder: false,
	border: false,
	constrain: false,
	closable: true,
	shadow: false,
	closeAction: 'destroy',
	closeToolText: null,
	resizable: false,
	draggable: false,
	
	layout: {
		type: 'fit'
	},
	
	initWindowBounds: function() {
		var me = this,
			mainViewModel = RMIS.getApplication().view.getViewModel();
			floatPanel = mainViewModel.get('CurrentFloatPanel'),
			blankWidth = floatPanel ? floatPanel.width : 0,
			blankHeight = floatPanel ? floatPanel.height : 0,
			padding = 10,
			blankY = floatPanel ? floatPanel.y : padding,
			clientWidth = document.body.clientWidth,
			containerW = Ext.get('cesium-container').getWidth(),
			width = containerW - blankWidth - 3 * padding,
			x = clientWidth - containerW + padding;
		
		me.x = x;
		me.y = blankY;
		me.width = width;
		me.height = blankHeight;
	},
	
	getFileRealPath: function(relativePath) {
    	if (!this.prefixPath) {
    		var location = window.document.location,
    			origin = location.origin,
    			pathname = location.pathname.split('/')[1];
    		this.prefixPath = origin + '/' + pathname + '/';
    	}
    	return this.prefixPath + relativePath;
    	// return this.prefixPath + 'data/files/' + fileName + '.' +  (fileExt ? fileExt : 'pdf');
    },
    
    localizeGridMenu: function(grid) {
    	if (grid && grid.headerCt.getMenu()) {
    		grid.headerCt.getMenu().items.each(function(item, index, length) {
        		if (item.text == "Sort Ascending") {
        			item.setText('升序');
        		} else if (item.text == "Sort Descending") {
        			item.setText('降序');
        		} else if (item.text == "Columns") {
        			item.setText('列选择');
        		}
        	});
    	}
    }
	
});