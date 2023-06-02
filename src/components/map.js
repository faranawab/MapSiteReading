import React , {useRef, useEffect}from "react";
import { loadModules } from "esri-loader";


 function Map(){
  //useRef hook is used to create a reference to the DOM element that will serve as the container for the ArcGIS map. 
    const MapEl = useRef(null)

    useEffect(
        ()=>{
          // Load the required modules from the ArcGIS 
            loadModules(["esri/views/MapView","esri/Map","esri/layers/GeoJSONLayer","esri/widgets/Search","esri/widgets/Home"],{
                css:true
            }).then(([MapView,Map, GeoJSONLayer,Search,Home])=>{

              // Create a new Map instance
                const webmap = new Map({
                    basemap: 'topo-vector'// You can choose a different basemap if needed
                })

                 // Create a new MapView instance
                const view = new MapView({
                    map:webmap,
                    center:[-74, 39],// Specify the initial map center
                    zoom:8,//Specify the initial zoom level
                    scale: 3000000,
                    container:MapEl.current
                })

                // Customize the popup template content
                const template = {
                    title: "Site Info",
                    content: `Site: {SITE_NAME}, Address: {SITE_ADDRESS}, Ozone PPM: {OZONE_PPM}`,              
                  };
          
                  const renderer = {
                    // Customize the symbol and visualization of the layer
                    type: "simple",
                    field: "OBJECTID",
                    symbol: {
                      type: "simple-marker",
                      color: "orange",
                      outline: {
                        color: "white"
                      }
                    },
                    visualVariables: [
                      {
                        type: "size",
                        field: "OBJECTID",
                        stops: [
                          {
                            value: 2.5,
                            size: "4px"
                          },
                          {
                            value: 8,
                            size: "20px"
                          }
                        ]
                      }
                    ]
                  };

                 // Create a GeoJSONLayer instance with the URL to the GeoJSON data source
                const geojsonlayer = new GeoJSONLayer(
                    {
                        url: "https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",// Replace with your GeoJSON URL
                        copyright: "Latest Site Readings",
                        popupTemplate: template,
                        renderer: renderer,
                        orderBy: {
                          field: "OBJECTID"
                        }
                    }
                )
                webmap.add(geojsonlayer)

                // Create a new Search widget
                    const searchWidget = new Search({
                    view: view
                });
  
            // Add the Search widget to the top-right corner of the map view
                view.ui.add(searchWidget, {
                    position: 'top-right'
                });

                const homeButton = new Home({
                    view: view
                  });
          
                  // Add the home button widget to the top left corner of the view
                  view.ui.add(homeButton, 'top-left');
            })
            })
            return(
                <div style={{height:800}} ref={MapEl}>
                </div>
            )
        }
        export default Map
