Ext.define('RMIS.store.Machines', {
	extend: 'Ext.data.Store',
	
	alias: 'store,Machines',
	storeId: 'Machines',
	autoLoad: true,
	
	fields: [
		{name: 'id', type: 'string'},
		{name: 'name', type: 'string'}
	],
	
	proxy: {
     	type: 'ajax',
     	url: './data/JSON/machines.json',
     	reader: {
     		rootProperty: 'results'
     	},
     	simpleSortMode: true
     }
});
 		