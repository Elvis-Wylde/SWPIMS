Ext.define('RMIS.view.infobox.MachineInfobox', {
	extend: 'RMIS.view.infobox.FormInfobox',
    xtype: 'machineinfobox',
    
    bodyPadding: '0 10 10 10',
	fieldDefaults: {
		labelWidth: 65
	},
	
	initComponent: function() {
		var me = this;
		
		var capacity = me.getTextField('capacity', '单机容量');
		var height = me.getTextField('height', '轮毂高度');
		var radius = me.getTextField('radius', '风轮直径');
		var windspeed = me.getTextField('windspeed', '额定风速');
		var inspeed = me.getTextField('inspeed', '切入风速');
		var outspeed = me.getTextField('outspeed', '切出风速');
		var powerregulate = me.getTextField('powerregulate', '功率调节');
		var generator = me.getTextField('generator', '发电机');
		var voltage = me.getTextField('voltage', '出口电压');
		var breaks = me.getTextField('break', '气动刹车');
		var groundwork = me.getTextField('groundwork', '地基基础设施级别', null, 108);
		var security = me.getTextField('security', '基础结构安全等级', null, 108);
		var expectancy = me.getTextField('expectancy', '基础设计使用年限', null, 108);
		
		me.items = [{
			xtype: 'container',
			anchor: '100%',
			defaultType: 'fieldset',
			items: [{
				title: '基本信息',
				anchor: '100%',
				
				items: [{
	            	xtype: 'container',
	                anchor: '100%',
	                layout: 'hbox',
	                defaultType: 'container',
	                defaults: { flex: 1, layout: 'anchor' },
	                items: [{
						items: [capacity, radius, inspeed, powerregulate, voltage],
					},{
						items: [height, windspeed, outspeed, generator, breaks]
					}]
	            }, {
		    		xtype: 'container',
	                anchor: '100%',
	                layout: 'anchor',
	                items: [groundwork, security, expectancy]
		    	}]
			}]
		}];
		me.callParent();
	}
});
	