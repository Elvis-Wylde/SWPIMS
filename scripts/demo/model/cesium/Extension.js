Ext.define('RMIS.model.cesium.Extension', {
	extend: 'Ext.mixin.Observable',
	
	requires: ['RMIS.model.cesium.InfoBoxOverlay'],
	
	viewer: null,
	screenSpaceHandler: null,
	
	/* entity类型常量 */
	basinEntity: 0,
	countyEntity: 1,
	projectEntity: 2,
	modificationEntity: 3,
	residentEntity: 4,
	communityEntity: 5,
	townEntity: 6,
	constructionEntity: 7,
	
	machineEntity: 8,
	buildingEntity: 9,
	// 多媒体entity
	imageEntity: 10,
	videoEntity: 11,
	
	// ======= public APIs ======== //
	
	constructor: function(options) {
		this.container = "cesium-container";
    	if (options && options.container) {
    		this.container = options.container;
    	}
    	this._initMembers();
    	this._initViewer(this.container);
    	this._initDataSources();
    	this._initOverlays(this.container);
    	this._initHandler();
    	this.callParent();
	},
	
	initLocation: function(duration, destination) {
    	var me = this,
    		scene = me.viewer.scene,
    		camera = scene.camera,
    		promise = Cesium.when.defer();
    	
    	camera.flyTo({
			destination: Cesium.defined(destination) ? destination : me.defaultInitDest,// (97.3661, 26.0661, 108.5329, 34.3203),
			duration: duration,
			complete: function() {
				promise.resolve(true);
			}
		});
    	return promise;
    },
	
	// 加载geojson数据
    loadGeoJson: function(sourceUri, geoJsonCollection) {
    	var promise = Cesium.when.defer();
    	Cesium.loadJson(sourceUri).then(function(result) {
    		var features = result['features'];
        	for (var i = 0, len = features.length; i < len; i++) {
        		var feature = features[i],
        			id = feature.properties.id ? feature.properties.id : "geojson-" + i;
        		geoJsonCollection[id] = feature;
        	}
        	promise.resolve(true);
    	});
    	return promise;
    },
    
    renderGeoJson: function(idxArr) {
    	var me = this, unique = {},
    		i = 0, len = idxArr.length,
			promise = Cesium.when.defer();
    	
    	me.regionDataSource.entities.removeAll();
    	for (; i < len; i++) {
    		if (unique[idxArr[i]]) {
				continue;
			} else {
				unique[idxArr[i]] = true;
			}
    		var feature = me.geoJsonSet[idxArr[i].toString()];
    		if (Cesium.defined(feature)) {
    			var entity = me._getGeoJsonEntity(feature);
    			me.regionDataSource.entities.add(entity);
    		}
    	}
    	promise.resolve(true);
    	return promise;
    },
    
    loadProjects: function(sourceUri) {
    	var me = this, 
    		promise = Cesium.when.defer();
    	if (!me.projectSet) {
    		me.projectSet = {};
    	}
    	Cesium.loadJson(sourceUri).then(function(result) {
    		var projects = result['results'];
        	for (var i = 0, len = projects.length; i < len; i++) {
        		var project = projects[i],
        			id = project.id;
        		me.projectSet[id] = project;
        	}
        	promise.resolve(true);
    	});
    	return promise;
    },
    
    renderProjects: function(projects, isRenderCounties, flyDuration) {
    	var me = this,
			flyDuration = Cesium.defined(flyDuration) ? flyDuration : 0;
			promise = Cesium.when.defer(),
			counties = [];
		
    	me.projectDataSource.entities.removeAll();
    	
    	for (var i = 0, len = projects.length; i < len; i++) {
    		var entity = me._getProjectEntity(projects[i]);
			me.projectDataSource.entities.add(entity);
			entity.label.show = true;
			counties = counties.concat(entity.record.get('counties'));
    	}
    	
    	if (isRenderCounties && counties.length > 0) {
    		me.renderGeoJson(counties).then(function() {
    			// me.currentRegionLevel += 1;
    			if (flyDuration > 0) {
    				promise = me._flyToEntities(me.regionDataSource.entities, {flyDuration: flyDuration});
    			} else {
    				promise.resolve(true);
    			}
    		});
    	} else {
    		if (flyDuration > 0) {
    			promise = me._flyToEntities(me.projectDataSource.entities, {flyDuration: flyDuration});
        	} else {
        		promise.resolve(true);
        	}
    	}
		return promise;
    },
    
    renderMachines: function(records, flyDuration) {
    	return this._renderPointEntities(records, this.machineDataSource, this._getMachineEntity, false, flyDuration);
    },
    
    renderBuildings: function(records, flyDuration) {
    	return this._renderPointEntities(records, this.buildingDataSource, this._getBuildingEntity, false, flyDuration);
    },
    
    renderImages: function(records, flyDuration) {
    	return this._renderPointEntities(records, this.imageDataSource, this._getImageEntity, false, flyDuration);
    },
    
    renderVideos: function(records, flyDuration) {
    	return this._renderPointEntities(records, this.videoDataSource, this._getVideoEntity, false, flyDuration);
    },

	renderRoad: function(visible, positions, flyDuration) {
        this.roadDataSource.entities.removeAll();
		if (visible) {
            if (!this.roadEntity) {
            	this.roadEntity = new Cesium.Entity({
					id: 'road-1',
                    corridor: new Cesium.CorridorGraphics({
                        positions : Cesium.Cartesian3.fromDegreesArray(positions),
                        width : 5.0,
                        material : Cesium.Color.RED.withAlpha(0.7)
                    })
                });
            }
            this.roadDataSource.entities.add(this.roadEntity);
		}
		if (flyDuration > 0) {
            this._flyToEntity(this.roadEntity, {flyDuration: flyDuration, range: 50});
		}
	},
    
    switchRegion: function(id) {
    	if (id instanceof Cesium.Entity) {
    		id = id.id || id.properties.id;
    	}
    	var node = RMIS.getApplication().getStore('RegionTree').getNodeById(id);
    	RMIS.getApplication().view.getViewModel().set('selectedRegion', node);
    },
    
    switchIntoProvince: function() {
    	var me = this,
    		promise = me.reset(1);
    	me.fireEvent('switchIntoProvince', promise);
    	
    	return promise;
    },
    
    switchIntoBasin: function(entityOrId) {
    	var me = this, id, name;
    	
    	if (entityOrId instanceof Cesium.Entity) {
    		id = entityOrId.properties.id;
			name = entityOrId.properties.name;
    	} else if (typeof(entityOrId) == "string") {
    		id = entityOrId;
    		name = me.geoJsonSet[id].properties.name;
    	}
    	me.fireEvent('switchIntoBasin', id, name);
    },
    
    switchIntoProject: function(entityOrId) {
    	var me = this,
			camera = me.viewer.scene.camera,
			project;
    	if (typeof(entityOrId) == 'string' && me.projectDataSource) {
    		project = me._getProjectEntity({id: entityOrId});// me.projectDataSource.entities.getById(entityOrId);
    	}
    	if ((entityOrId instanceof Cesium.Entity) && entityOrId.entityType == me.projectEntity) {
    		project = entityOrId;
    	}
    	// me.viewer.selectedEntity = project;
    	if (project) {
    		me.fireEvent('switchIntoProject', project.record);
    	}
    },
    
    flyToProject: function(id) {
    	var me = this,
    		entity = me.projectDataSource.entities.getById(id);
    	if (entity) {
    		var counties = entity.record.get('counties'),
    			countyEntities = [];
    		for (var i = 0, len = counties.length; i < len; i++) {
    			var county = me.regionDataSource.entities.getById(counties[i]);
    			if (county) {
    				countyEntities.push(county);
    			}
    		}
    		if (countyEntities.length > 0) {
    			countyEntities.push(entity);
    			return me._flyToEntities(countyEntities, {flyDuration: 1});
    		} else {
    			return me._flyToEntity(entity, {flyDuration: 1});
    		}
    	}
    	return null;
    },
    
    flyToEntityById: function(id, dataSource) {
    	var me = this, entity;
    	
    	if (Cesium.defined(dataSource) && me.viewer.dataSources.contains(dataSource)) {
    		entity = dataSource.entities.getById(id);
    	}
    	me._flyToEntity(entity, {flyDuration: 1, heading: 0, pitch: -0.85, range: 5000});
    },
    
    /*
     * 通过id和type选择地图上的某个元素，并触发entityClick事件
     * @param {String} id 元素的id
     * @param {Number} id 元素的类别，参考CesiumExtension的类型常量
     */
    selectEntityById: function(id, type) {
    	var me = this, promise, entity;
    	if (type == me.basinEntity || type == me.countyEntity) {
    		entity = me.regionDataSource.entities.getById(id);
    		if (entity) {
    			promise = me._flyToRegion(entity);
    		}
    	} else if (type == me.projectEntity) {
    		entity = me.projectDataSource.entities.getById(id);
    		if (entity) {
    			promise = me.flyToProject(id);
    		}
    	} else {
    		if (type == me.modificationEntity) {
    			entity = me.modificationDataSource.entities.getById(id);
    		} else if (type == me.residentEntity) {
    			entity = me.residentDataSource.entities.getById(id);
    		} else if (type == me.communityEntity) {
    			entity = me.communityDataSource.entities.getById(id);
    		} else if (type == me.constructionEntity) {
    			entity = me.constructionDataSource.entities.getById(id);
    		}
    		if (entity)	{
    			promise = me._flyToEntity(entity, {flyDuration: 1, heading: 0, pitch: -0.85, range: 5000});
    		}
    	}
    	if (entity) {
    		promise.then(function() {
    			me.viewer._selectedEntity = undefined;
    			// me._updateEntityHeight(entity);
    			var entityPosition = entity.position.getValue(Cesium.JulianDate.now());
        		var cartographic = me.viewer.scene.globe.ellipsoid.cartesianToCartographic(entityPosition);
    			var lon = Cesium.Math.toDegrees(cartographic.longitude);
        		var lat = Cesium.Math.toDegrees(cartographic.latitude);
        		me.fireEvent('entityClicked', entity.id, entity.entityType, lon, lat, entity);
    		});
    	}
    },
    
    reset: function(flyDuration) {
    	var me = this;
    	me.viewer.scene.globe.depthTestAgainstTerrain = false;
    	me.renderGeoJson(['450100', '450200', '450300', '450400', '450500', '450600', '450700', '450800', '450900', '451000', '451100', '451200', '451300', '451400']);
    	return me.initLocation(flyDuration);
    	// me.renderProjects(flyDuration);
    },
    
    addLabelEntity: function(id, text, lon, lat, options) {
    	var me = this,
    		size = Cesium.defined(options.size) ? options.size : 16,
    		color = Cesium.defined(options.color) ? options.color : Cesium.Color.YELLOW,
    		offsetX = Cesium.defined(options.offsetX) ? options.offsetX : 0,
			offsetY = Cesium.defined(options.offsetY) ? options.offsetY : 0,
			offset = new Cesium.Cartesian2(offsetX, offsetY),
			position = Cesium.defined(options.position) ? options.position : Cesium.Cartesian3.fromDegrees(lon, lat);
    	
    	var entity = new Cesium.Entity({
    		id: id,
    		position: position,
    		label: new Cesium.LabelGraphics({
				text: text,
				font: size + 'px FYYuanti',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	            fillColor: color,
	            outlineColor: color,
	            outlineWidth: 1,
	            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
	            verticalOrigin: Cesium.VerticalOrigin.CENTER,
	            pixelOffset: offset,
	            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			})
    	});
    	me.labelDataSource.entities.add(entity);
    	return entity;
    },
    
    removeLabelEntity: function() {
    	
    },
    
    removeAllLabel: function() {
    	var me = this;
    	if (me.labelDataSource) {
    		me.labelDataSource.entities.removeAll();
    	}
    },
    
    // ======= protected & private methods ========= //
	_initMembers: function() {
    	this.defaultInitDest = Cesium.Rectangle.fromDegrees(104.6277, 20.9390, 115.3456, 26.4249);
    	this.colorHash = {
			"": Cesium.Color.LIGHTCORAL.withAlpha(0.0)
//			"大渡河流域": Cesium.Color.DEEPSKYBLUE.withAlpha(0.4),
//			"雅砻江流域": Cesium.Color.MEDIUMBLUE.withAlpha(0.4),
//			"金沙江流域": Cesium.Color.CORNFLOWERBLUE.withAlpha(0.4),
//			"其他流域": Cesium.Color.SLATEBLUE.withAlpha(0.4)
    	};
    	this.geoJsonSet = {};
    	this.regionCollection = {};
    	this.singleImageLayerSet = {};
    	// this.tempDataSource = new Cesium.GeoJsonDataSource('temp');
    	// this.regionDataSource = new Cesium.GeoJsonDataSource('region');
    	// this.projectDataSource = new Cesium.GeoJsonDataSource('project');
    },
    
    _initOverlays: function(container) {
    	this.infoboxOverlay = Ext.create('RMIS.model.cesium.InfoBoxOverlay', {
    		cesiumEx: this,
    		parentEl: container,
    		hidden: true
    	});
    },
    
    _initViewer: function(container) {
    	var me = this,
			clock = Cesium.JulianDate.clone(Cesium.JulianDate.now());
		clock.secondsOfDay = 17600;
		
		// me.googleImageryProvider = new Cesium.LocalImageryProvider({
		// 	url: 'GetTile',
		// 	dataset: 'GoogleImagery',
		// 	tilingScheme: 'WebMercator',
		// 	numberOfLevelZeroTilesX: 1,
		// 	numberOfLevelZeroTilesY: 1,
		// 	tileWidth: 256,
		// 	tileHeight: 256,
		// 	minimumLevel: 0,
		// 	maximumLevel: 20,
		// 	emptyLevels: 0
		// });
		//
		// me.terrainProvider = new Cesium.LocalTerrainProvider({
		// 	url : 'GetTerrain',
		// 	metadataUrl: 'metadata/terrain.json',
		// 	requestWaterMask : false,
		// 	requestVertexNormals : false
		// });
		
//		me.terrainProvider = new Cesium.CesiumTerrainProvider({
//			url : 'https://assets.agi.com/stk-terrain/world',
//			requestWaterMask : true,
//			requestVertexNormals : true
//		});
		
		me.viewer = new Cesium.Viewer(container, {
			// imageryProvider: me.googleImageryProvider,
			animation: false,
			timeline: false,
			baseLayerPicker: false,
			homeButton: false,
			sceneModePicker: false,
			geocoder: false,
			infoBox : false,
			selectionIndicator : true,
			shadows : false,
			navigationHelpButton: false,
			fullscreenButton: false,
			scene3DOnly: true,
			terrainShadows: Cesium.ShadowMode.DISABLED,
			clock: new Cesium.Clock({currentTime: clock, canAnimate: false, shouldAnimate: false}),
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: 'http://10.7.1.249:8888/tileservice/imagery/GoogleAerial/{z}/{x}/{y}',
                maximumLevel: 20,
                hasAlphaChannel: false,
                enablePickFeatures: false
            }),
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: 'http://10.7.1.249:8888/tileservice/terrain/STKTerrain',
                requestWaterMask: true,
                requestVertexNormals: true
            })
		});
		
		// me.viewer.shadowMap.maxmimumDistance = 10000.0;
		// me.viewer.scene.globe.enableLighting = true;
		new Cesium.StatusDisplay(me.viewer);
		me.viewer.scene.globe.depthTestAgainstTerrain = false;
		
		/*
		var layers = me.viewer.imageryLayers;
	    var tiandituWatProvider = new Cesium.LocalImageryProvider({
	  	    url: 'GetTile',
	    	dataset: 'TianDituWat',
	    	tilingScheme: 'WebMercator',
	    	hasAlphaChannel: true,
	    	numberOfLevelZeroTilesX: 1,
	    	numberOfLevelZeroTilesY: 1,
	    	tileWidth: 256,
	    	tileHeight: 256,
	    	minimumLevel: 1,
	    	maximumLevel: 16,
	    	emptyLevels: 0
	    });
	    
	    var tiandituCiaProvider = new Cesium.LocalImageryProvider({
		    url: 'GetTile',
	      	dataset: 'TianDituCia',
	      	tilingScheme: 'WebMercator',
	      	hasAlphaChannel: true,
	      	numberOfLevelZeroTilesX: 1,
	      	numberOfLevelZeroTilesY: 1,
	      	tileWidth: 256,
	      	tileHeight: 256,
	      	minimumLevel: 1,
	      	maximumLevel: 16,
	      	emptyLevels: 0
	    });
	    
	    me.mapboxProvider = new Cesium.LocalImageryProvider({
			url: 'GetTile',
			dataset: 'MapboxStreets',
			tilingScheme: 'WebMercator',
			numberOfLevelZeroTilesX: 1,
			numberOfLevelZeroTilesY: 1,
			tileWidth: 256,
			tileHeight: 256,
			minimumLevel: 0,
			maximumLevel: 20,
			emptyLevels: 0
		});
	    
	    me.mapboxLayer = new Cesium.ImageryLayer(me.mapboxProvider, {
		  	  show: false
	    });
	    me.watlayer = new Cesium.ImageryLayer(tiandituWatProvider, {
		  	  alpha: 0.8, show: false
	    });
	    me.cialayer = new Cesium.ImageryLayer(tiandituCiaProvider, {
		  	  alpha: 0.8, show: false
	    });
	    
	    layers.add(me.mapboxLayer);
	    layers.add(me.watlayer);
	    layers.add(me.cialayer);
	    */
    },
    
    _initDataSources: function() {
    	var me = this;
    	if (!Cesium.defined(me.regionDataSource)) {
    		me.regionDataSource = new Cesium.CustomDataSource('region');
    		me.viewer.dataSources.add(me.regionDataSource, {
    			camera : me.viewer.scene.camera,
    		    canvas : me.viewer.scene.canvas
    		});
    	}
    	if (!Cesium.defined(me.projectDataSource)) {
    		me.projectDataSource = new Cesium.CustomDataSource('projects');
    		// configuration cluster
//    		me.projectDataSource.clustering.enabled = true;
//	    	me.projectDataSource.clustering.clusterLabels = false;
//	    	me.projectDataSource.clustering.pixelRange = 15;
//	    	me.projectDataSource.clustering.minimumClusterSize = 2;
//	    	
//	    	me.projectDataSource.clustering.nonClusterEvent.addEventListener(function(entity) {
//	    		entity.label.show = true;
//	    	});
//	    	me.projectDataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
//	    		for (var i = 0, len = clusteredEntities.length; i < len; i++) {
//	    			clusteredEntities[i].label.show = false;
//	    		}
//	    		cluster.billboard.image = clusteredEntities[0].billboard.image._value;
//	    		cluster.billboard.show = true;
//	    		cluster.label.show = true;
//	    		cluster.label.font = '16px FYYuanti'; // 15px sans-serif
//	    		cluster.label.fillColor = new Cesium.Color(0.97, 0.91, 0.62, 0.7);
//	    		cluster.label.text = cluster.label.text + '项工程';
//	    		cluster.label.pixelOffset = new Cesium.Cartesian2(20, 0);
//	    		
//	    		cluster.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
//	    		cluster.label.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
//	    	});
    		me.viewer.dataSources.add(me.projectDataSource, {
    			camera : me.viewer.scene.camera,
    		    canvas : me.viewer.scene.canvas
    		});
    	}
    	if (!Cesium.defined(me.machineDataSource)) {
			me.machineDataSource = new Cesium.CustomDataSource('machines');
			me.viewer.dataSources.add(me.machineDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
    	if (!Cesium.defined(me.buildingDataSource)) {
			me.buildingDataSource = new Cesium.CustomDataSource('building');
			me.viewer.dataSources.add(me.buildingDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
        if (!Cesium.defined(me.roadDataSource)) {
            me.roadDataSource = new Cesium.CustomDataSource('road');
            me.viewer.dataSources.add(me.roadDataSource, {
                camera : me.viewer.scene.camera,
                canvas : me.viewer.scene.canvas
            });
        }
    	/*
    	if (!Cesium.defined(me.labelDataSource)) {
    		me.labelDataSource = new Cesium.CustomDataSource('labels');
    		me.viewer.dataSources.add(me.labelDataSource, {
    			camera : me.viewer.scene.camera,
    		    canvas : me.viewer.scene.canvas
    		});
    	}
    	if (!Cesium.defined(me.modificationDataSource)) {
			me.modificationDataSource = new Cesium.CustomDataSource('modifications');
			me.viewer.dataSources.add(me.modificationDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
    	if (!Cesium.defined(me.residentDataSource)) {
			me.residentDataSource = new Cesium.CustomDataSource('residents');
			me.viewer.dataSources.add(me.residentDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
			me.residentDataSource.clustering.enabled = true;
	    	me.residentDataSource.clustering.clusterLabels = false;
	    	me.residentDataSource.clustering.pixelRange = 15;
	    	me.residentDataSource.clustering.minimumClusterSize = 2;
	    	
	    	me.residentDataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
	    		cluster.billboard.image = clusteredEntities[0].billboard.image._value;
	    		cluster.billboard.show = true;
	    		cluster.label.show = true;
	    		cluster.label.font = '14px FYYuanti'; // 15px sans-serif
	    		cluster.label.fillColor = new Cesium.Color(0.97, 0.91, 0.62, 0.8);
	    		cluster.label.text = cluster.label.text + '户';
	    		cluster.label.pixelOffset = new Cesium.Cartesian2(20, 8);
	    		cluster.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
	    		cluster.label.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
	    	});
		}
    	if (!Cesium.defined(me.communityDataSource)) {
			me.communityDataSource = new Cesium.CustomDataSource('community');
			me.viewer.dataSources.add(me.communityDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
		if (!Cesium.defined(me.constructionDataSource)) {
			me.constructionDataSource = new Cesium.CustomDataSource('construction');
			me.viewer.dataSources.add(me.constructionDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
		*/
    	if (!Cesium.defined(me.imageDataSource)) {
			me.imageDataSource = new Cesium.CustomDataSource('images');
			me.viewer.dataSources.add(me.imageDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
    	if (!Cesium.defined(me.videoDataSource)) {
			me.videoDataSource = new Cesium.CustomDataSource('videos');
			me.viewer.dataSources.add(me.videoDataSource, {
				camera : me.viewer.scene.camera,
			    canvas : me.viewer.scene.canvas
			});
		}
    },
    
    _initHandler: function() {
    	var me = this,
    		camera = me.viewer.scene.camera;
    	me.screenSpaceHandler = new Cesium.ScreenSpaceEventHandler(me.viewer.canvas);
    	
    	var clickHandler = function(click) {
    		if (me.dblclicked) {
    			me.dblclicked = ((--me.clickCount) > 0);
    			return;
    		}
    		var pickedObject = me.viewer.scene.pick(click.position);
    		if (pickedObject && pickedObject.id instanceof Cesium.Entity && pickedObject.id.entityType >= 0) {
    			var cameraPosition = camera.position,
					height = camera.positionCartographic.height;
    			
    			var entity = pickedObject.id,
    				entityPosition = entity.position.getValue(Cesium.JulianDate.now()),
    				cartographic = me.viewer.scene.globe.ellipsoid.cartesianToCartographic(entityPosition),
    				lon = Cesium.Math.toDegrees(cartographic.longitude),
    				lat = Cesium.Math.toDegrees(cartographic.latitude);
    			
    			var callback = function () {
    				me.viewer._selectedEntity = undefined;
    				// me._updateEntityHeight(entity);
    				me.fireEvent('entityClicked', entity.id, entity.entityType, lon, lat, entity);
    			};
    			
    			camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
					duration: 1,
//					orientation: {
//						heading: camera.heading,
//						pitch: camera.pitch
//					},
					maximumHeight: height,
					complete: callback,
					cancel: callback
				});
    		}
    		me.clickCount = 0;
    	};
    	
    	var dblclickHandler = function(dblclick) {
    		me.dblclicked = true;
    		me.clickCount = 2;
    		var pickedObject = me.viewer.scene.pick(dblclick.position);
    		if (pickedObject && pickedObject.id instanceof Cesium.Entity) {
    			// me.viewer._trackedEntity = undefined;
    			var entity = pickedObject.id;
    			if (entity.entityType == me.countyEntity) {
    				//var entity = pickedObject.id;
    				// me._flyToRegion(entity).then(function() {
    					//var id = entity.properties.id;
    					//me.switchSubRegion(id, me.divisionGeoJsonSet);
    				// });
    			} else if (entity.entityType == me.basinEntity) {
    				// me.switchIntoBasin(pickedObject.id);
    				me.switchRegion(entity);
    			} else if (entity.entityType == me.projectEntity) {
    				// var entity = pickedObject.id;
    				// me.switchIntoProject(entity);
    				me.switchRegion(entity);
//    				me.switchIntoProject(entity).then(function() {
//    					me.viewer._selectedEntity = undefined;
//    				});
    				
    			}
    		}
    		me.viewer._selectedEntity = undefined;
    		me.viewer._needTrackedEntityUpdate = false;
    	};
    	
    	me.screenSpaceHandler.setInputAction(function(click) {
    		setTimeout(function() {
    			clickHandler(click);
    		}, 300);
    	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    	
    	me.screenSpaceHandler.setInputAction(function(click) {
    		dblclickHandler(click);
    	}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    	
    	camera.percentageChanged = 0.001;
    	var near = 1.5e4, far = 2.5e6;
    	camera.changed.addEventListener(function() {
    		var cameraHeight = camera.positionCartographic.height;
    		var show = cameraHeight >= near && cameraHeight <= far ? true : false;
    		// me.regionDataSource.entities.show = show;
    	});
    },
    
    _getColor: function(name, opacity) {
    	var me = this, 
    		color = me.colorHash[name];
		if (!color) {
			color = Cesium.Color.fromRandom({
				alpha: Cesium.defined(opacity) ? opacity : 0.4
			});
			me.colorHash[name] = color;
		}
		return color;
    },
    
    _getPolygonCenter: function(polygon) {
    	if (polygon) {
    		var cartesian = Cesium.BoundingSphere.fromPoints(polygon.hierarchy.getValue().positions).center;
    		Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(cartesian, cartesian);
            return new Cesium.ConstantPositionProperty(cartesian);
    	}
    	return null;
    },
    
    _getGeoJsonEntity: function(feature) {
    	var me = this, id = feature.properties.id;
    	if (!me.regionCollection[id]) {
    		me.regionCollection[id] = me._createGeoJsonEntity(feature);
    	}
    	return me.regionCollection[id];
    },
    
    _createGeoJsonEntity: function(feature) {
    	var me = this,
    		properties = feature.properties,
    		geometry = feature.geometry,
    		id = properties.id,
    		name = properties.name,
    		parentid = properties.parentid,
    		entityType = properties.isbasin ? me.basinEntity : me.countyEntity,
    		coordinates = geometry.coordinates,
    		type = geometry.type;
    	
    	//if (type != 'polygon') {
    	//	return null;
    	//}
    	var position, positions = [];
    	for (var i = 0, len = coordinates[0].length; i < len; i++) {
    		positions = positions.concat(coordinates[0][i]);
    	}
    	
    	var polygon = new Cesium.PolygonGraphics({
    		outline: true,
    		outlineWidth: 1,
    		outlineColor: Cesium.Color.YELLOW,
    		// height: 0,
    		material: me._getColor(name),
    		hierarchy: Cesium.Cartesian3.fromDegreesArray(positions)
    	});
    	
    	if (properties.parentid == "450000") {
    		polygon.height = 0;
    	} else {
    		
    		
    	}
    	
		if (Cesium.defined(properties.cp)) {
			position = Cesium.Cartesian3.fromDegrees(properties.cp[0], properties.cp[1]);
		} else {
			position = me._getPolygonCenter(polygon);
		}
		
    	var entity = new Cesium.Entity({
    		id: id,
    		name: name,
    		position: position,
    		polygon: polygon,
    		parentid: parentid,
    		entityType: entityType,
    		properties: properties,
    		label: {
    			text: name,
    			position: position,
    			heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
				translucencyByDistance: new Cesium.NearFarScalar(2e6, 1, 3.5e6, 0),
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(3e3, 3.5e6),
				// font: me.basinEntity ? '700 16px SimHei' : '500 14px SimHei',
				font: '700 16px SimHei',
				fillColor: Cesium.Color.YELLOW,
				outlineColor: Cesium.Color.BLACK,
				outlineWidth: 1,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE
    		}
    	});
    	return entity;
    },
    
    _getProjectEntity: function(record) {
    	var me = this, id = record.get ? record.get('id') : record.id;
    	if (!me.projectCollection) {
    		me.projectCollection = {};
    	}
    	if (!me.projectCollection[id]) {
	    	var iconPath = me._getProjectIconPath(record),
	    		name = record.get('name'),
	    		lon = record.get('lon'),
	    		lat = record.get('lat');
	    		//lon = record.get('coordinate')[0],
	    		//lat = record.get('coordinate')[1];
	    	me.projectCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.projectEntity, record, '16px SimHei', 0.4);
    	}
    	return me.projectCollection[id];
    },
    
    _getProjectIconPath: function(record) {
    	// return './resources/images/map/fdj_marker.png';
    	switch(record.get('GCJSJD')) {
    		case '在建':
			default:
				return './resources/images/map/marker1-red.png';
			case '拟建':
				return './resources/images/map/marker1-blue.png';
			case '已建':
				return './resources/images/map/marker1-green.png';
    	}
    },

    _renderPointEntities: function(records, dataSource, entityGetter, showLabel, flyDuration) {
    	var me = this,
			flyDuration = Cesium.defaultValue(flyDuration, 0);
			promise = Cesium.when.defer();
		dataSource.entities.removeAll();
		for (var i = 0, len = records.length; i < len; i++) {
			var entity = entityGetter.call(me, records[i]);
			dataSource.entities.add(entity);
			entity.label.show = !!showLabel;
		}
		if (flyDuration > 0) {
			promise = me._flyToEntities(dataSource.entities, {flyDuration: flyDuration});
		} else {
			promise.resolve(true);
		}
		return promise;
    },
    
    _getMachineEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.machineCollection) {
    		me.machineCollection = {};
    	}
    	if (!me.machineCollection[id]) {
	    	var	name = record.get('name'),
				lon = record.get('lon'),
				lat = record.get('lat'),
				iconPath = "./resources/images/map/fdj_marker.png";
	    	me.machineCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.machineEntity, record, '12px FYYuanti', 0.15);
    	}
    	return me.machineCollection[id];
    },
    
    _getBuildingEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.buildingCollection) {
    		me.buildingCollection = {};
    	}
    	if (!me.machineCollection[id]) {
	    	var	name = record.get('name'),
				lon = record.get('lon'),
				lat = record.get('lat'),
				iconPath = "./resources/images/map/fdj_marker.png";
	    	me.buildingCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.buildingEntity, record, '12px FYYuanti', 0.15);
    	}
    	return me.buildingCollection[id];
    },
    
    _getResidentEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.residentCollection) {
    		me.residentCollection = {};
    	}
    	if (!me.residentCollection[id]) {
	    	var	name = record.get('name'),
				lon = record.get('lon'),
				lat = record.get('lat'),
				iconPath = "./resources/images/map/house.png";
	    	me.residentCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.residentEntity, record, '12px FYYuanti', 1);
    	}
    	return me.residentCollection[id];
    },
    
    _getModifyEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.modifyCollection) {
    		me.modifyCollection = {};
    	}
    	if (!me.modifyCollection[id]) {
	    	var	name = record.get('name'),
		    	lon = record.get('coordinate')[0],
	    		lat = record.get('coordinate')[1],
				iconPath = "./resources/images/map/marker1-" + (record.get("type") == "重大设计变更" ? "red" : "blue") + ".png";
	    	me.modifyCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.modificationEntity, record, '12px FYYuanti', 0.4);
    	}
    	return me.modifyCollection[id];
    },
    
    _getCommunityEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.communityCollection) {
    		me.communityCollection = {};
    	}
    	if (!me.communityCollection[id]) {
	    	var	name = record.get('name'),
		    	lon = record.get('LON'),
				lat = record.get('LAT'),
				status = record.get('status'),
				color = 'blue';
	    	if (status == '未启动') {
	    		color = 'red';
	    	} else if (status == '已竣工') {
	    		color = 'green';
	    	}
			var iconPath = "./resources/images/map/circle_marker_house_" + color + ".png";
	    	me.communityCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.communityEntity, record, '300 14px FYYuanti', 0.8);
    	}
    	return me.communityCollection[id];
    },
    
    _getImageEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.imageCollection) {
    		me.imageCollection = {};
    	}
    	if (!me.imageCollection[id]) {
	    	var	lon = record.get('lon'),
				lat = record.get('lat');
			var iconPath = "./resources/images/map/photoicon.png";
	    	me.imageCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.imageEntity, record, '300 14px FYYuanti', 0.6);
    	}
    	return me.imageCollection[id];
    },
    
     _getConstructionEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.constructionCollection) {
    		me.constructionCollection = {};
    	}
    	if (!me.constructionCollection[id]) {
	    	var	name = record.get('name'),
				lon = record.get('LON'),
				lat = record.get('LAT'),
				iconPath = "./resources/images/map/marker1-red.png";
	    	me.constructionCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.constructionEntity, record, '12px FYYuanti', 0.4);
    	}
    	return me.constructionCollection[id];
    },
    
    _getVideoEntity: function(record) {
    	var me = this, id = record.get('id');
    	if (!me.videoCollection) {
    		me.videoCollection = {};
    	}
    	if (!me.videoCollection[id]) {
	    	var	lon = record.get('lon'),
				lat = record.get('lat');
			var iconPath = "./resources/images/map/videoicon.png";
	    	me.videoCollection[id] = me._createEntity(id, name, iconPath, lon, lat, me.videoEntity, record, '300 14px FYYuanti', 0.6);
    	}
    	return me.videoCollection[id];
    },
    
    _createEntity: function(id, name, icon, lon, lat, entityType, record, font, scale) {
    	var entity = new Cesium.Entity({
    		id: id,
    		name: name,
    		position: Cesium.Cartesian3.fromDegrees(lon, lat),
    		// description: info,
    		entityType: entityType,
    		record: record,
    		billboard: new Cesium.BillboardGraphics({
    			image: icon,
    			scale: scale,
    			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    			horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    			verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    		}),
    		label: new Cesium.LabelGraphics({
				text: name,
				font: font,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	            fillColor: Cesium.Color.WHITE,// Cesium.Color.YELLOW,
	            outlineColor: Cesium.Color.BLACK,
	            outlineWidth: 1,
	            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
	            verticalOrigin: Cesium.VerticalOrigin.CENTER,
	            pixelOffset: new Cesium.Cartesian2(20, -20),
	            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			})
    	});
    	return entity;
    },
    
    _flyToRegion: function(region) {
    	var me = this, promise,
    		camera = me.viewer.scene.camera,
    		options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT),
			flyDuration = Cesium.defaultValue(options.flyDuration, 1),
			heading = Cesium.defaultValue(options.heading, 0),
			pitch = Cesium.defaultValue(options.pitch, camera.pitch),
			range = Cesium.defaultValue(options.range, 0);
			
    	if ((region instanceof Cesium.Entity) && (region.entityType == me.countyEntity || region.entityType == me.basinEntity)) {
        	promise = me.viewer.flyTo(region, {
				duration: flyDuration,
				offset: new Cesium.HeadingPitchRange(heading, pitch, range)
			});
        	return promise;
    	}
    	return null;
    },
    
    _flyToEntity: function(entity, options) {
    	var me = this, promise,
			camera = me.viewer.scene.camera,
			options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT),
			flyDuration = Cesium.defaultValue(options.flyDuration, 1),
			heading = Cesium.defaultValue(options.heading, 0),
			pitch = Cesium.defaultValue(options.pitch, camera.pitch),
			range = Cesium.defaultValue(options.range, 5000);
    	
    	if (Cesium.defined(entity) && entity instanceof Cesium.Entity) {
	    	promise = me.viewer.flyTo(entity, {
				duration: flyDuration,
				offset: new Cesium.HeadingPitchRange(heading, pitch, range)
			});
	    	return promise;
    	}
    	return null;
    },
    
    _flyToEntities: function(entities, options) {
    	var me = this, promise,
			camera = me.viewer.scene.camera,
			options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT),
			flyDuration = Cesium.defaultValue(options.flyDuration, 1),
			heading = Cesium.defaultValue(options.heading, 0),
			pitch = Cesium.defaultValue(options.pitch, camera.pitch),
			// defaultRange = (entities.values.length || entities.length) > 1 ? 0 : 5000,
			range = Cesium.defaultValue(options.range, 500);
			
    	promise = me.viewer.flyTo(entities, {
			duration: flyDuration,
			offset: new Cesium.HeadingPitchRange(heading, pitch, range)
		});
    	
    	return promise;
    },
    
    _updateEntityHeight: function(entity) {
    	/*
    	if (entity.entityType >= 0) {
    		if (entity.entityType == me.countyEntity || entity.entityType == me.basinEntity) {
        		return;
        	}
    	}
    	*/
    }
	
});