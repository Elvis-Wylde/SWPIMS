Ext.define('RMIS.view.widgets.UnitTextField', {
	extend: 'Ext.form.field.Number',

    alias: 'widget.unitfield',
    
    unitText: '',
    unitColor: 'green',
    
    
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        
        me.on('render', function(ct){
	    	var me = this;
	    	if(me.unitText != '') {
	    		var dom = me.el.dom,
	    			children = dom.children,
	    			// width = dom.offsetWidth,
	    			width = 188,
	    			labelWidth = children[0].offsetWidth,
	    			unitWidth = me.unitText.replace(/[^\x00-\xff]/g, "xx").length * 6 + 7,
	    			leftWidth = width - labelWidth - unitWidth,
	    			bodyEl = children[1];
	    		
	    		me.unitEl = document.createElement("span");
	    		me.unitEl.style.width = unitWidth + "px";
	    		me.unitEl.style.color = me.unitColor;
	    		me.unitEl.appendChild(document.createTextNode(me.unitText));
	    		me.el.dom.appendChild(me.unitEl);
	    		bodyEl.style.width = leftWidth + "px";
	    		
	    		me.alignErrorIcon= function() { 
	    			me.errorIcon.alignTo(this.unitEl,'tl-tr', [2, 0]);
	    		}
	    		
//	    		me.
//	    		
//	    		me.el.addListener('DOMAttrModified', function(e, t) {
//	            	var me = this;
//	            	console.log(t.style.width);
//	            	console.log(me.getWidth());
//	            });
	    	}
	    });
        
    }
    
});
    