import React, { Component } from 'react';
import { bind } from 'lodash-decorators';
import Loading from 'main/components/Loading';
import GoogleMap from "react-google-maps/lib/GoogleMap";
import GoogleMapLoader from "react-google-maps/lib/GoogleMapLoader";
import ScriptjsLoader from "react-google-maps/lib/async/ScriptjsLoader";
import { triggerEvent }  from "react-google-maps/lib/utils";
import Marker from "react-google-maps/lib/Marker";
import styles from './styles.css';

export default class Preview extends Component {
  componentDidMount() {
    window.addEventListener(`resize`, this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.handleWindowResize);
  }

  @bind()
  handleWindowResize() {
    triggerEvent(this.map, `resize`);
  }
  /**
   * Fit google maps to geocoded viewport
   *
   * @param  {GoogleMap} map Ref to GoogleMap component
   */
  fitBounds() {
    const { map } = this;
    if (!map) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(this.props.geometry.location);
    const { viewport } = this.props.geometry;
    if (viewport) {
      Object.keys(viewport).forEach(key => bounds.extend(viewport[key]));
    }
    map.fitBounds(bounds);
  }
  render() {
    const { location } = this.props.geometry;
    const { name } = this.props;

    const marker = {
      position: location,
      key: name
    };

    return (
      <ScriptjsLoader
        protocol={"https"}
        hostname={"maps.googleapis.com"}
        pathname={"/maps/api/js"}
        query={{libraries: "geometry,drawing,places"}}
        loadingElement={ <Loading />}
        containerElement={ <div className={styles.container} /> }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this.map = map) && this.fitBounds()}
            defaultZoom={3}
            defaultCenter={location}
          >
            <Marker {...marker} />
          </GoogleMap>
        }
      />
    );
  }
}
