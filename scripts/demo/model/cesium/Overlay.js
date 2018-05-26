Ext.define('RMIS.model.cesium.Overlay', {
	
	extend: 'Ext.mixin.Observable',
	
	idxPrefix: 'overlay-',
	singleMode: false,
	cesiumEx: null,
	parentEl: null,
	
	_overlayPool: {},
	_singleOverlay: null,
	
	_defaultLongitude: 0,
	_defaultLatitude: 0,
	_defaultWidth: 200,
	_defaultHeight: 100,
	
	constructor: function(config) {
        var me = this;
        Ext.apply(me, config);
        
        if (!me.cesiumEx) {
        	me.cesiumEx = RMIS.getApplication().view.getViewModel().get('cesiumEx');
        }
        if (!me.parentEl) {
        	me.parentEl = me.cesiumEx.container;
        }
        
        if (me.singleMode) {
        	me._singleOverlay = me._createOverlay(config);
        }
        
        var camera = me.cesiumEx.viewer.scene.camera;
    	// camera.percentageChanged = 0.001;
    	camera.changed.addEventListener(function() {
    		me._updateOverlaysPosition();
    	});
    	
        me.callParent();
    },
    
    showOverlay: function(options) {
    	var me = this, overlay;
    	if (options.id) {
    		overlay = getOverlayById(options.id);
    	}
    	if (!overlay) {
    		overlay = me.getAvailabelOverlay(options);
    	}
    	Ext.apply(options, {hidden: false});
    	me._updateOverlayAttrs(overlay, options);
    	me._updateOverlaySize(overlay);
    	me._updateOverlayPostion(overlay);
    	me._updateOverlayContents(overlay, options);
    },
    
    hideOverlay: function(overlay, destroy) {
    	var me = this;
    	if (me.singleMode) {
    		overlay = me._singleOverlay;
    	}
    	if (!overlay) {
    		return;
    	}
    	me._updateOverlayAttrs(overlay, {hidden: true});
    	
    	if (!me.singleMode && destroy) {
    		var id = overlay.id;
    		var container = overlay.data.container;
    		overlay.leaderLay.destroy();
    		overlay.destroy();
    		container.destroy();
    		delete me._overlayPool[id];
    	}
    },
    
    hideAllOverlays: function(destroy) {
    	var me = this;
    	if (me.singleMode) {
    		me.hideOverlay();
    	} else {
    		Ext.Array.each(me.getVisibleOverlays(), function(overlay) {
    			me.hideOverlay(overlay, destroy);
    		});
    	}
    },
    
    getAvailabelOverlay: function(options) {
    	var me = this;
    	if (me.singleMode) {
    		return me._singleOverlay;
    	} else {
    		for (var key in me._overlayPool) {
    			var overlay = me._overlayPool[key];
    			if (!overlay.data.hidden) {
    				return overlay;
    			}
    		}
    	}
    	return me._createOverlay(options);
    },
    
    getVisibleOverlays: function() {
    	var me = this;
    	if (me.singleMode) {
    		return [me._singleOverlay];
    	} else {
    		var results = [];
    		for (var key in me._overlayPool) {
    			var overlay = me._overlayPool[key];
    			if (!overlay.data.hidden) {
    				results.push(overlay);
    			}
    		}
    		return results;
    	}
    },
    
    getOverlayById: function(id) {
    	if (!id || id.length == 0) {
    		return null;
    	}
    	return this._overlayPool[id];
    },
    
    _createOverlay: function(options) {
    	var me = this,
    		id = me.getValue(options, 'id', me.generateId()),
    		cls = me.getValue(options, 'cls', ""),
    		hidden = me.getValue(options, 'hidden', true);
    	
    	var overlayContainer = Ext.DomHelper.append(me.parentEl, {
			role: 'presentation',
			style: {
    			position: 'absolute',
    			backgroundColor: 'transparent'
    		}
		}, true);
		
    	var overlay = Ext.DomHelper.append(overlayContainer, {
    		id: id,
    		role: 'presentation',
    		cls: cls,
    		style: {
    			backgroundColor: 'transparent',
    			boxShadow: '#666666 0px 0px 10px'
    		}
    	}, true);
    	
    	var leaderLay = Ext.DomHelper.append(overlayContainer, {
    		role: 'presentation',
    		style: {
    			background: 'url(./resources/images/leader.png) no-repeat',
    			backgroundPosition: 'center',
    			opacity: '0.9',
    	    	filter: 'alpha(opacity=90)'
    		}
    	}, true);
    	
    	Ext.apply(overlay, {
    		data: {
    			id: id,
    			container: overlayContainer,
    			leaderLay: leaderLay,
    			longitude: me.getValue(options, 'longitude', me._defaultLongitude),
    			latitude: me.getValue(options, 'latitude', me._defaultLatitude),
    			width: me.getValue(options, 'width', me._defaultWidth),
    			height: me.getValue(options, 'height', me._defaultHeight),
    			hidden: hidden,
    			offset: me.getValue(options, 'offset', {x: 0, y: 0})
    		}
    	});
    	overlayContainer.setDisplayed(!hidden);
    	me._updateOverlaySize(overlay);
    	me._updateOverlayPostion(overlay);
    	
    	me._overlayPool[id] = overlay;
    	return overlay;
    },
    
    _updateOverlayAttrs: function(overlay, options) {
    	var me = this, attrs = overlay.data;
    	attrs.longitude = me.getValue(options, 'longitude', attrs.longitude);
    	attrs.latitude = me.getValue(options, 'latitude', attrs.latitude);
    	attrs.width = me.getValue(options, 'width', attrs.width);
    	attrs.height = me.getValue(options, 'height', attrs.height);
    	attrs.hidden = me.getValue(options, 'hidden', attrs.hidden);
    	attrs.offset = me.getValue(options, 'offset', attrs.offset);
    	
    	attrs.container.setDisplayed(!attrs.hidden);
    },
    
    _updateOverlaySize: function(overlay) {
    	var data = overlay.data;
    	data.container.setWidth(data.width);
		data.container.setHeight(data.height + 25);
		overlay.setWidth(data.width);
    	overlay.setHeight(data.height);
    	data.leaderLay.setWidth(data.width);
    	data.leaderLay.setHeight(25);
    },
    
    _updateOverlayPostion: function(overlay) {
    	if (overlay.data.hidden) {
			return;
		}
    	
    	var me = this, 
    		viewer = me.cesiumEx.viewer,
			globe = viewer.scene.globe,
			lon = overlay.data.longitude,
			lat = overlay.data.latitude,
			cartesian = Cesium.Cartesian3.fromDegrees(lon, lat),
			cartographic = globe.ellipsoid.cartesianToCartographic(cartesian),
			height = globe.getHeight(cartographic),
			anchor = Cesium.Cartesian3.fromDegrees(lon, lat, height),
			result = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(viewer.scene, anchor),
			// cameraHeight = viewer.camera.positionCartographic.height,
			container = overlay.data.container,
			offset = overlay.data.offset;
		
		if(Cesium.defined(result)){
			container.setTop(result.y - parseInt(container.getHeight()) + offset.y);
			container.setLeft(result.x - parseInt(container.getWidth() / 2) + offset.x);
			container.setDisplayed(true);
	    } else {
	    	container.setDisplayed(false);
	    }
    },
    
    _updateOverlaysPosition: function() {
    	var me = this;
    	Ext.Array.each(me.getVisibleOverlays(), function(overlay) {
    		me._updateOverlayPostion(overlay);
    	});
    },
    
    _updateOverlayContents: Ext.emptyFn,
    
    generateId: function() {
    	var id = Date.now().toString(16);
    	id = this.idxPrefix + Math.random().toString(16).substr(3) + id;
    	return id;
    },
    
    getValue: function(options, key, defaultValue) {
    	return Cesium.defined(options[key]) ? options[key] : defaultValue;
    }
});