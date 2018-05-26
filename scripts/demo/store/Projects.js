Ext.define('RMIS.store.Projects', {
	extend: 'Ext.data.Store',
	
	alias: 'store,Projects',
	storeId: 'Projects',
	
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'}
	],
	grouper: {
		property: 'GCJSJD'
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