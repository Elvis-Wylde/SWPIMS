Ext.define('RMIS.controller.panels.BalanceDetailPanelController', {
    extend: 'RMIS.controller.panels.FloatPanelController',
    alias: 'controller.balancedetailpanel',
    requires: [
        'RMIS.view.windows.BalanceMgrWindow'
    ],

    onSwitchIntoProvince: function(promise) {
        this.backToStatPanel();
    },

    onSwitchIntoProject: function(project, promise) {
        var me = this;
        me.closeCurrentWindow();
        me.updateRecord(project);
    },

    restore: function() {
        var me = this,
            mainViewModel = me.getMainViewModel(),
            currentProject = mainViewModel.get('CurrentProject');

        me.callParent();
        me.getCesiumEx().renderGeoJson([]);
        me.updateRecord(me.getProjectRecord(currentProject));
    },

    updateRecord: function(record) {
        var me = this,
            refs = me.getReferences(),
            viewModel = me.getViewModel();
        me.view.record = record;
        viewModel.set('projectTitleHtml', me.getTitleHtml());
        me.getCesiumEx().renderProjects([record], true, 1).then(function() {
            //refs.contentform.getForm().reset();
            //refs.contentform.getForm().loadRecord(record);
            me.renderMachines(record.get("id"));
            me.renderBackground(record.get("id"));
            // me.renderImages(record.get("id"));
            // me.renderVideos(record.get("id"));
            // me.renderBuilding();
        });
    },

    renderMachines: function(id) {
        var me = this, store = RMIS.getApplication().getStore('Machines');
        store.clearFilter();
        store.filter('projectid', id);
        me.getCesiumEx().renderMachines(store.getData().getRange(), 0);
    },

    renderBackground: function(id) {
        var me = this, cesiumEx = me.getCesiumEx(), layers = cesiumEx.viewer.imageryLayers;
        if (!cesiumEx.singleImageLayerSet['guanyang']) {
            cesiumEx.singleImageLayerSet['guanyang'] = new Cesium.ImageryLayer(new Cesium.SingleTileImageryProvider({
                url: 'data/files/guanyang.png',
                // rectangle: Cesium.Rectangle.fromDegrees(111.10146839, 25.46846577, 111.11750987, 25.47661062)
                // rectangle: Cesium.Rectangle.fromDegrees(111.10159077, 25.46831336, 111.11763225, 25.47645821)
                rectangle: Cesium.Rectangle.fromDegrees(111.10152077, 25.46825577, 111.11770225, 25.47663062)
            }), {
                alpha: 0.7
            });
            layers.add(cesiumEx.singleImageLayerSet['guanyang']);
        }
        cesiumEx.singleImageLayerSet['guanyang'].show = (id == "2");
    },

    renderImages: function(id) {
        var me = this,
            cesiumEx = me.getCesiumEx();
        if (id != "2") {
            cesiumEx.renderImages([], 0);
            return;
        }
        var imageStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: './data/JSON/photos.json',
                reader: {
                    rootProperty: 'results'
                },
                simpleSortMode: true
            }
        });
        imageStore.load({
            callback: function(records) {
                cesiumEx.renderImages(records, 0);
            }
        });
    },

    renderVideos: function(id) {
        var me = this,
            cesiumEx = me.getCesiumEx();
        if (id != "2") {
            cesiumEx.renderImages([], 0);
            return;
        }
        var videoStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: './data/JSON/videos.json',
                reader: {
                    rootProperty: 'results'
                },
                simpleSortMode: true
            }
        });
        videoStore.load({
            callback: function(records) {
                cesiumEx.renderVideos(records, 0);
            }
        });
    },

    getProjectRecord: function(id) {
        var store = RMIS.getApplication().getStore('Projects');
        return store.getById(id);
    },

    backToStatPanel: function() {
        var me = this,
            mainViewModel = me.getMainViewModel();
        me.closeCurrentWindow();
        var panel = me.getFloatPanel('constructstatpanel');
        me.view.hide();
        panel.restore();
        mainViewModel.set('CurrentFloatPanel', panel);
    },

    getTitleHtml: function() {
        var me = this,
            record = me.view.record;
        if (!record) {
            return "";
        }

        var result = '<p><span style="font-size: 18px; font-weight: bold; text-shadow: 2px 2px 3px #000"><span>' + record.get('location')  + '</span><span>' + record.get('name') + '</span></span></p>';
        result += '<p><span style="font-size: 13px;">工程建设状态 ' + record.get('GCJSJD') + '</span><br/>';
        result += '<span style="font-size: 13px;">工程总投资 ' + record.get('GCZTZ') + ' 万元，' + '装机容量 ' + record.get('ZJRL') + ' 兆瓦' + '</span></p>';

        return result;
    },

    onEntityClicked: function(id, type, longitude, latitude, entity) {
        var me = this,
            cesiumEx = me.getCesiumEx(),
            infoboxOverlay = cesiumEx.infoboxOverlay;
        if (type == cesiumEx.machineEntity) {
            var record = entity.record;
            infoboxOverlay.showOverlay({
                longitude: longitude,
                latitude: latitude,
                width: 450,
                height: 300,
                offset: {
                    x: 0, y: -20
                },
                contents: {
                    title: record.get('name'),
                    viewType: 'machineinfobox',
                    record: record
                }
            });
        }
        var formateDate = function(date) {
            var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
            return y + '年'+ m + '月' + d + '日';
        };

        if (type == cesiumEx.imageEntity) {
            var images = entity.record.get('sources'), contents = [];
            for (var i = 0, len = images.length; i < len; i++) {
                var image = images[i];
                contents.push({
                    sourceId: image.name,
                    title: '照片: ' + image.name + ' 拍摄日期: ' + formateDate(new Date(image.date)),
                    sourcePath: image.path
                });
            }
            RMIS.getApplication().showResourcesViewer('image', contents);
        }

        if (type == cesiumEx.videoEntity) {
            var videos = entity.record.get('sources'), contents = [];
            for (var i = 0, len = videos.length; i < len; i++) {
                var video = videos[i];
                contents.push({
                    sourceId: video.name,
                    title: '视频: ' + video.name + ' 拍摄日期: ' + formateDate(new Date(video.date)),
                    sourcePath: video.path
                });
            }
            RMIS.getApplication().showResourcesViewer('video', contents);
        }
    },

    onDetailBtnClick: function(btn, evt) {
        var me = this;
        me.showCurrentWindow('RMIS.view.windows.BalanceMgrWindow', btn)
    }

});