Ext.define('RMIS.store.PreProcess', {
	extend: 'Ext.data.Store',
	
	alias: 'store,PreProcess',
	storeId: 'PreProcess',
	
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'}
	],
	grouper: {
		property: 'QQJD'
	},
	proxy: {
     	type: 'ajax',
     	url: './data/JSON/projects.json',
     	reader: {
     		rootProperty: 'results'
     	},
     	simpleSortMode: true
     }
});