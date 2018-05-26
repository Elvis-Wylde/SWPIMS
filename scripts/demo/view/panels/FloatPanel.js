Ext.define('RMIS.view.panels.FloatPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
	    'RMIS.controller.panels.FloatPanelController'
    ],    
    controller: 'floatpanel',
    width: 450,
    floating: true,
    bodyPadding: 0,
    border: false,
    bodyBorder: false,
    constrain: true,
    bounds: null,
    hidden: true,
    
    style: {
    	opacity: 0
    },
    
    listeners: {
    	// show: 'onShow',
    	boxready: 'onPanelReady',
    	resize: 'onResize',
    	render: 'onRender',
    	hide: 'onHide'
    },
    
    slideInAnimate: function(bounds) {
    	var me = this;
    	
    	if (!bounds && me.bounds) {
    		bounds = me.bounds;
    	}
    	
    	me.setHidden(false);
    	me.animate({
    		duration: 500,
    		from: {
    			opacity: 0,
    			x: bounds.x + bounds.width,
    			y: bounds.y
    		},
    		to: {
    			opacity: 0.9,
    			x: bounds.x,
    			y: bounds.y
    		},
    		listeners: {
    			scope: me.controller,
    			afteranimate: me.controller.afteranimate
    		}
    	});
    },
    
    restore: function() {
    	var me = this;
    	me.controller.restore();
    	me.show();
		me.slideInAnimate();
    },
    
    initComponent: function() {
    	var me = this;
    	// Ext.apply(me, {cesiumEx: me.config.cesiumEx});
    	me.callParent();
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