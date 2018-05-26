Ext.define('RMIS.view.infobox.FormInfobox', {
    extend: 'Ext.form.Panel',
    xtype: 'forminfobox',
    
    record: null,
    hasRangeFieldset: false,
    
    bodyPadding: 10,
	border: false,
	bodyBorder: false,
	scrollable: 'y',
	
	fieldDefaults: {
		msgTarget: 'side',
		labelWidth: 60
	},
	
	listeners: {
		boxready: {
			scope: this,
			fn: this.onBoxReady
		}
	},
	
	constructor: function(config) {
		var me = this;
		if (me.hasRangeFieldset === true) {
			me.initRangeFieldset();
		}
		me.callParent([config]);
	},
	
	getTextField: function(name, label, unitCls, labelWidth, anchor, extraParam) {
		labelWidth = labelWidth ? labelWidth : this.fieldDefaults.labelWidth;
		anchor = anchor ? anchor : '95%';
		var config = {
			name: name,
			fieldLabel: label,
			anchor: anchor,
			labelWidth: labelWidth,
			editable: false,
            ui: 'oneline'
		};
		if (extraParam) {
			config = Ext.apply(config, extraParam);
		}
		if (unitCls) {
			var triggers = {
    			unit: {
    				cls: 'trigger-noop unit-' + unitCls
    			}
    		};
			if (extraParam && extraParam.triggers) {
				triggers = Ext.apply(triggers, extraParam.triggers);
			}
			Ext.apply(config, {
				cls: 'unit-field',
				triggers: triggers
			});
		}
		return Ext.create('Ext.form.field.Text', config);
	},
	
	updateRecord: function(record) {
		var me = this;
		me.record = record;
		if (me.hasRangeFieldset) {
			me.projectCountContainer.setHidden(record.get('projectcount') < 1);
			me.countyCountContainer.setHidden(record.get('countycount') < 1);
			me.rangeFieldset.setHidden(record.get('projectcount') < 1 && record.get('countycount') < 1);
		}
		me.getForm().reset();
		me.getForm().loadRecord(record);
	},
	
	initRangeFieldset: function() {
		var me = this;
		var projectCount = me.getTextField('projectcount', '涉及电站', 'ge');
		var countyCount = me.getTextField('countycount', '涉及区县', 'ge');
		
		me.projectCountContainer = Ext.create('Ext.container.Container', {
			width: '50%',
			layout: 'anchor',
			items: [projectCount]
		});
		
		me.countyCountContainer = Ext.create('Ext.container.Container', {
			width: '50%',
			layout: 'anchor',
			items: [countyCount]
		});
		
		me.rangeFieldset = Ext.create('Ext.form.FieldSet', {
			title: '涉及范围',
			anchor: '100%',
			items: [{
				xtype: 'container',
				anchor: '100%',
				layout: 'hbox',
				defaultType: 'container',
				items: [me.projectCountContainer, me.countyCountContainer]
			}]
		});
	},
	
	onBoxReady: function() {
		var me = this;
		me.updateRecord(me.record);
	}
	
});
	