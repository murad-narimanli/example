import React from 'react';
import { Map, FeatureGroup, withLeaflet
    // Circle,  Marker, Popup, LayersControl, TileLayer
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


function MapNew(props) {

    // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

     const _onEdited = (e) => {
        let numEdited = 0;
        e.layers.eachLayer((layer) => {
            numEdited += 1;
        });
        console.log(`_onEdited: edited ${numEdited} layers`, e);
        onChange();
    }

     const _onCreated = (eobjCreated) => {
        let type = eobjCreated.layerType;
        if (type === 'marker') {
            // Do marker specific actions
            console.log("_onCreated: marker created", eobjCreated);
        }
        else {
            console.log("_onCreated: something else created:", type, eobjCreated);
        }
        onChange();
    }

     const _onDeleted = (e) => {
        let numDeleted = 0;
        e.layers.eachLayer((layer) => {
            numDeleted += 1;
        });
        console.log(`onDeleted: removed ${numDeleted} layers`, e);
        onChange();
    }

     const _onMounted = (drawControl) => {
        console.log('_onMounted', drawControl);
    }

     const _onEditStart = (e) => {
        console.log('_onEditStart', e);
    }

     const _onEditStop = (e) => {
        console.log('_onEditStop', e);
    }

     const _onDeleteStart = (e) => {
        console.log('_onDeleteStart', e);
    }

    const  _onDeleteStop = (e) => {
        console.log('_onDeleteStop', e);
    }



    const prov = OpenStreetMapProvider();
    const GeoSearchControlElement = withLeaflet(SearchControl);


    return (
        <>
            <Map
                center={[40.509264, 48.167092]}
                zoom={8}
            >
                <FeatureGroup ref={(reactFGref) => { onFeatureGroupReady(reactFGref); }}>
                    <EditControl
                        position='topright'
                        onEdited={_onEdited}
                        onCreated={_onCreated}
                        onDeleted={_onDeleted}
                        onMounted={_onMounted}
                        onEditStart={_onEditStart}
                        onEditStop={_onEditStop}
                        onDeleteStart={_onDeleteStart}
                        onDeleteStop={_onDeleteStop}
                        edit={{
                            remove: true,
                            edit: true
                        }}
                        draw={{
                            rectangle: {
                                shapeOptions: { color: "black" },
                            },
                            polygon: {
                                shapeOptions: { color: "red" },
                            },
                            polyline: {
                                shapeOptions: { color: "blue" },
                            },
                            circle: {
                                shapeOptions: { color: "green" },
                            },

                        }}
                    />
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

    let  _editableFG = null

    const  onFeatureGroupReady = (reactFGref) => {
        // populate the leaflet FeatureGroup with the geoJson layers
        let leafletGeoJSON = new L.GeoJSON(getGeoJson());
        let leafletFG = reactFGref.leafletElement;
        leafletGeoJSON.eachLayer((layer) => {
            leafletFG.addLayer(layer);
        });
        // store the ref for future access to content
        _editableFG = reactFGref;
    }

    const  onChange = () => {
        // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API
        const { onChange } = props;
        if (!_editableFG || !onChange) {
            return;
        }
        const geojsonData = _editableFG.leafletElement.toGeoJSON();
        onChange(geojsonData);
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



export default MapNew;
