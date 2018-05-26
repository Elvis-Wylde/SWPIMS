Ext.define('RMIS.controller.panels.EmptyPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.emptypanel',
    
    getMainStore: function() {
    	return null;
    },

    onSwitchIntoBasin: function() {},
    
    onSwitchIntoProvince: function() {},
    
    onSwitchIntoProject: function() {},
    
    restore: function() {
    	var me = this,
    		refs = me.getReferences(),
    		imagePath = me.view.getViewModel().get('image');
    	
    	if (imagePath) {
    		refs.container.setHtml('<img src="' + imagePath + '" />');
    	}
    	
    	me.callParent();
    }
    
});