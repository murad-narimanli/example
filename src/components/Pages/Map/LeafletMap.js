import React, { Component } from 'react';
import { Map, FeatureGroup, withLeaflet,
  Circle,  Polyline, Popup, LayersControl, Polygon , Rectangle
} from 'react-leaflet';
import "./map.css";
import '../../../assets/css/map/leaflet.css'
import '../../../assets/css/map/leaflet.draw.css'
import '../../../assets/css/map/geosearch.css'
import L from 'leaflet';
import { EditControl } from "react-leaflet-draw"
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { SearchControl, OpenStreetMapProvider } from 'react-leaflet-geosearch'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

const inner = [
    [41.09591205639546, 46.32385253906251],
    [40.58475654701271, 49.82849121093751],
    [39.930800820752765, 47.02148437500001],
    [40.89275342420696, 46.43371582031251],
    [41.09591205639546, 46.32934570312501]
]


const  mapdata =  [
  {
    type: 'Polygon',
    properties: {
      color: 'blue'
    },
    coordinates: [
      [40.913048330389195, 48.34437170162817],
      [40.546515385724675, 49.438222045199645],
      [40.37958779355346, 47.774970309105896],
    ]
  },
  {
    type: 'Circle',
    properties: {
      color: 'green',
      radius: 200
    },
    coordinates: [
      [
        40.82254771746225,
        48.044686634648784
      ],
    ]
  },
  {
    type: 'Polyline',
    properties: {
      color: 'yellow',
    },
    coordinates: [
      [40.856499949351 ,47.42034299661398],
      [40.64874272105836, 48.654046237306154],
      [40.15510243449732, 48.1395870902964],
      [40.48586249940393, 47.28049009949327],
      [40.87158431797705, 47.40036405921688],
    ]
  },
  {
    type: 'Rectangle',
    properties: {
      color: 'blue',
    },
    coordinates: [
      [40.954646783612766, 47.70004912619626],
      [41.397673230554545, 47.70004912619626],
      [41.397673230554545, 49.433227143179934],
      [40.954646783612766, 49.433227143179934],
    ]
  }
]


export default class LeafletMap extends Component {

  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  _onEdited = (e) => {
    let numEdited = 0;
    e.layers.eachLayer((layer) => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);
    this._onChange();
  }

  _onCreated = (eobjCreated) => {
    let type = eobjCreated.layerType;
    if (type === 'marker') {
      // Do marker specific actions
      console.log("_onCreated: marker created", eobjCreated);
    }
    else {
      console.log("_onCreated: something else created:", type, eobjCreated);
      console.log(eobjCreated.layer._latlngs)
      console.log(eobjCreated.layerType)
    }
    this._onChange();
  }

  _onDeleted = (e) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
    this._onChange();
  }

  _onMounted = (drawControl) => {
    console.log('_onMounted', drawControl);
  }

  _onEditStart = (e) => {
    console.log('_onEditStart', e);
  }

  _onEditStop = (e) => {
    console.log('_onEditStop', e);
  }

  _onDeleteStart = (e) => {
    console.log('_onDeleteStart', e);
  }

  _onDeleteStop = (e) => {
    console.log('_onDeleteStop', e);
  }


  _editableFG = null

  _onFeatureGroupReady = (reactFGref) => {
    // populate the leaflet FeatureGroup with the geoJson layers
    let leafletGeoJSON = new L.GeoJSON(getGeoJson());
    // let leafletFG = reactFGref.leafletElement;
    leafletGeoJSON.eachLayer((layer) => {
      // leafletFG.addLayer(layer);
    });
    // store the ref for future access to content
    this._editableFG = reactFGref;
  }

  _onChange = () => {
    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API
    const { onChange } = this.props;
    if (!this._editableFG || !onChange) {
      return;
    }
    const geojsonData = this._editableFG.leafletElement.toGeoJSON();
    onChange(geojsonData);
  }

  render() {
    const prov = OpenStreetMapProvider();
    const GeoSearchControlElement = withLeaflet(SearchControl);
    return (
        <>
          <Map
              center={[40.509264, 48.167092]}
              zoom={8}
          >
            <FeatureGroup ref={(reactFGref) => { this._onFeatureGroupReady(reactFGref); }}>
              <EditControl
                  position='topright'
                  onEdited={this._onEdited}
                  onCreated={this._onCreated}
                  onDeleted={this._onDeleted}
                  onMounted={this._onMounted}
                  onEditStart={this._onEditStart}
                  onEditStop={this._onEditStop}
                  onDeleteStart={this._onDeleteStart}
                  onDeleteStop={this._onDeleteStop}
                  edit={{
                    remove: true,
                    edit: true
                  }}
                  draw={{
                    rectangle: {
                      shapeOptions: {
                        color: "black",
                        opacity: 1,
                      },
                    },
                    polygon: {
                      shapeOptions: {
                        color: "red",
                        opacity: 1,
                      },
                    },
                    polyline: {
                      shapeOptions: {
                        color: "blue",
                        opacity: 1,
                      },
                    },
                    circle: {
                      shapeOptions: {
                        color: "green",
                        opacity: 1,
                      },
                    },

                  }}
              />



              {/*<Circle*/}
              {/*    center={[*/}
              {/*      40.82254771746225,*/}
              {/*      48.044686634648784*/}
              {/*    ]}*/}
              {/*    pathOptions={{ fillColor: 'red' }}*/}
              {/*    radius={500}*/}
              {/*>*/}
              {/*  <Popup>Daire</Popup>*/}
              {/*</Circle>*/}

              {/*<Polygon*/}
              {/*    pathOptions={{color: 'blue'}}*/}
              {/*    positions={*/}
              {/*      [*/}
              {/*        [40.913048330389195, 48.34437170162817],*/}
              {/*        [40.546515385724675, 49.438222045199645],*/}
              {/*        [40.37958779355346, 47.774970309105896],*/}
              {/*      ]*/}
              {/*    }*/}
              {/*/>*/}

              {/*<Polyline*/}
              {/*    pathOptions={{color: 'green'}}*/}
              {/*    positions={*/}
              {/*      [*/}
              {/*        [40.856499949351 ,47.42034299661398],*/}
              {/*        [40.64874272105836, 48.654046237306154],*/}
              {/*        [40.15510243449732, 48.1395870902964],*/}
              {/*        [40.48586249940393, 47.28049009949327],*/}
              {/*        [40.87158431797705, 47.40036405921688],*/}
              {/*      ]*/}
              {/*    }*/}
              {/*/>*/}

              {/*<Rectangle*/}
              {/*    bounds={*/}
              {/*      [*/}
              {/*        [40.954646783612766, 47.70004912619626],*/}
              {/*        [41.397673230554545, 47.70004912619626],*/}
              {/*        [41.397673230554545, 49.433227143179934],*/}
              {/*        [40.954646783612766, 49.433227143179934],*/}
              {/*      ]*/}
              {/*    }*/}
              {/*    pathOptions={{color: 'blue'}}*/}
              {/*/>*/}





            </FeatureGroup>

            <ReactLeafletGoogleLayer
                googleMapsLoaderConf={{ KEY: "AIzaSyAmuy79KEiGsKJR5hiueSfAtaXuwcHgpwI" }}
                type={"hybrid"}
            />
            <GeoSearchControlElement
                provider={prov} showMarker= {true} showPopup={true} popupFormat={({ query, result }) => result.label}
                maxMarkers={3}  retainZoomLevel= {false}  animateZoom= {true} autoClose= {false}
                searchLabel={'Enter address, please'} keepResult= {true}
            />
          </Map>
        </>
    );
  }
}

// data taken from the example in https://github.com/PaulLeCam/react-leaflet/issues/176
function getGeoJson() {
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              13.25441561846926,
              38.162839676288336
            ],
            [
              13.269521819641135,
              38.150961340209484
            ],
            [
              13.250982390930197,
              38.150961340209484
            ],
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                13.250982390930197,
                38.150961340209484
              ],
              [
                13.269521819641135,
                38.150961340209484
              ],
              [
                13.25441561846926,
                38.162839676288336
              ],
              [
                13.24342929034426,
                38.150691355539586
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                13.277074920227072,
                38.18335224460118

              ],
              [
                13.30660067706301,
                38.18389197106355

              ],
              [
                13.278104888488791,
                38.165808957979515

              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                13.309476005126974,
                38.13233005362,
              ],
              [

                13.337628470947287,
                38.135030534863766
              ],
              [
                13.31805907397463,
                38.11153300139878
              ]
            ]
          ]
        }
      }
    ]
  }
}
