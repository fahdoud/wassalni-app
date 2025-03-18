
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getZoom(): number;
      setOptions(options: MapOptions): void;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      data: Data;
    }

    class Data {
      forEach(callback: (feature: Data.Feature) => void): void;
      remove(feature: Data.Feature): void;
    }

    // Define the Data.Feature interface properly
    namespace Data {
      interface Feature {
        // Feature properties go here
        getProperty(name: string): any;
        setProperty(name: string, value: any): void;
      }
    }

    class LatLngBounds {
      constructor();
      extend(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
    }

    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void;
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions);
      setMap(map: Map | null): void;
      setDirections(directions: DirectionsResult): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
      zoomControl?: boolean;
      styles?: any[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
      animation?: Animation;
    }

    enum Animation {
      BOUNCE,
      DROP
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
      size?: Size;
      origin?: Point;
      anchor?: Point;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
      toString(): string;
      equals(other: LatLng): boolean;
    }

    interface DirectionsRequest {
      origin: LatLng | LatLngLiteral | string;
      destination: LatLng | LatLngLiteral | string;
      travelMode: TravelMode;
      waypoints?: DirectionsWaypoint[];
      optimizeWaypoints?: boolean;
      provideRouteAlternatives?: boolean;
      avoidFerries?: boolean;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
      region?: string;
    }

    interface DirectionsWaypoint {
      location: LatLng | LatLngLiteral | string;
      stopover?: boolean;
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[];
      overview_path: LatLng[];
      overview_polyline: string;
      warnings: string[];
      waypoint_order: number[];
      bounds: LatLngBounds;
    }

    interface DirectionsLeg {
      distance: Distance;
      duration: Duration;
      start_location: LatLng;
      end_location: LatLng;
      steps: DirectionsStep[];
    }

    interface DirectionsStep {
      distance: Distance;
      duration: Duration;
      instructions: string;
      path: LatLng[];
    }

    interface Distance {
      text: string;
      value: number;
    }

    interface Duration {
      text: string;
      value: number;
    }

    interface DirectionsRendererOptions {
      map?: Map;
      directions?: DirectionsResult;
      panel?: Element;
      suppressMarkers?: boolean;
      suppressInfoWindows?: boolean;
      polylineOptions?: PolylineOptions;
      preserveViewport?: boolean;
      routeIndex?: number;
      draggable?: boolean;
    }

    interface PolylineOptions {
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      clickable?: boolean;
      draggable?: boolean;
      editable?: boolean;
      geodesic?: boolean;
      icons?: IconSequence[];
      path?: LatLng[] | LatLngLiteral[];
      visible?: boolean;
      zIndex?: number;
    }

    interface IconSequence {
      icon: Symbol;
      offset?: string;
      repeat?: string;
    }

    interface Symbol {
      path: SymbolPath | string;
      anchor?: Point;
      fillColor?: string;
      fillOpacity?: number;
      labelOrigin?: Point;
      rotation?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }

    enum TravelMode {
      DRIVING = "DRIVING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
      WALKING = "WALKING"
    }

    type DirectionsStatus = "OK" | "NOT_FOUND" | "ZERO_RESULTS" | "MAX_WAYPOINTS_EXCEEDED" | "INVALID_REQUEST" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR";
    
    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
      function trigger(instance: any, eventName: string): void;
      function addDomListener(element: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
      function clearInstanceListeners(instance: any): void;
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

interface Window {
  google: typeof google;
  initMap?: () => void;
}
