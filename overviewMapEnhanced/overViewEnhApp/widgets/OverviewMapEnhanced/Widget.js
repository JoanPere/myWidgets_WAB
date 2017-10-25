///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2017 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/aspect',
    "esri/layers/ArcGISDynamicMapServiceLayer",
    'widgets/OverviewMapEnhanced/OverviewMap/Widget',
    'jimu/BaseWidget',
    'esri/dijit/OverviewMap',
    'jimu/utils',
    "dojo/dom-style"
  ],
  function(
    declare,
    lang,
    html,
    array,
    on,
    aspect,
    ArcGISDynamicMapServiceLayer,
    parentWidget,
    BaseWidget,
    OverviewMap,
    utils,
    domStyle) {
    var clazz = declare([parentWidget], {

      baseClass: 'jimu-widget-overviewEnhanced',
      



      createOverviewMap: function(visible) {
        var json = lang.clone(this.config.overviewMap);
        json.map = this.map;
        if (visible !== undefined) {
          json.visible = visible;
        }
        //this._processAttachTo(json, this.position);
        // overviewMap dijit has bug in IE8
        var _isShow = json.visible;
        json.visible = false;

        var _hasMaximizeButton = 'maximizeButton' in json;
        json.maximizeButton = _hasMaximizeButton ? json.maximizeButton : true;
        json.width = 200;
        json.height = 200;
        json.expandFactor = 2;
        json.attachTo = this.config.overviewMap.attachTo;

        //lineas modificadas
        //var urlServ = "http://services.arcgisonline.com/arcgis/rest/services/Ocean_Basemap/MapServer";
        var layer = new ArcGISDynamicMapServiceLayer(this.config.overviewMap.urlService);
        json.baseLayer = layer;


        this.overviewMapDijit = new OverviewMap(json);
        this._handles.push(aspect.after(
          this.overviewMapDijit,
          'show',
          lang.hitch(this, '_afterOverviewShow')
        ));
        this._handles.push(aspect.after(
          this.overviewMapDijit,
          'hide',
          lang.hitch(this, '_afterOverviewHide')
        ));
        this.overviewMapDijit.startup();

        this._updateDomPosition(json.attachTo);
        this.domNode.appendChild(this.overviewMapDijit.domNode);
        if (_isShow) {
          this.overviewMapDijit.show();
        }
      }


    });

    return clazz;
  });