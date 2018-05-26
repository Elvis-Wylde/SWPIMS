Ext.define('RMIS.store.RegionTree', {
	extend: 'Ext.data.TreeStore',
	
	storeId: 'RegionTree',
	
	fields: [
		{ name: 'id', itemId: 'string' }, 
		{ name: 'text', itemId: 'string' }
	],
	
	root: {
		id: "450000",
		text: "全部风电场",
		expanded: true,
		children: [{
			id: "1",
			text: "六坪顶风电场",
			leaf: true,
			type: "project"
		}, {
			id: "2",
			text: "灌阳风电场",
			leaf: true,
			type: "project"
		}, {
			id: "3",
			text: "全州风电场",
			leaf: true,
			type: "project"
		}, {
			id: "4",
			text: "恭城风电场",
			leaf: true,
			type: "project"
		}, {
			id: "5",
			text: "正江岭风电场",
			leaf: true,
			type: "project"
		}, {
			id: "6",
			text: "大容山风电场",
			leaf: true,
			type: "project"
		}]
	}

});
		