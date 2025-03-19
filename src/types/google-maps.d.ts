
declare namespace google.maps {
  export class Map {
    constructor(mapDiv: Element | null, opts?: MapOptions);
    data?: Data;
    setCenter(latLng: LatLng | LatLngLiteral): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
    fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
  }

  export interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    fullscreenControl?: boolean;
    streetViewControl?: boolean;
    zoomControl?: boolean;
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
    styles?: MapTypeStyle[];
  }

  export interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers: MapTypeStyler[];
  }

  export interface MapTypeStyler {
    visibility?: string;
    color?: string;
    weight?: number;
    [k: string]: any;
  }

  export class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    lat(): number;
    lng(): number;
    toString(): string;
  }

  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    toString(): string;
    isEmpty(): boolean;
  }

  export interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  export interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  export class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng;
    setTitle(title: string): void;
    getTitle(): string;
  }

  export interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    label?: string | MarkerLabel;
    animation?: Animation;
    draggable?: boolean;
    clickable?: boolean;
    visible?: boolean;
    zIndex?: number;
  }

  export interface MarkerLabel {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    text: string;
  }

  export interface Icon {
    url: string;
    scaledSize?: Size;
    size?: Size;
    origin?: Point;
    anchor?: Point;
  }

  export class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    width: number;
    height: number;
  }

  export class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  export interface Symbol {
    path: SymbolPath | string;
    fillColor?: string;
    fillOpacity?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }

  export enum SymbolPath {
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW
  }

  export enum Animation {
    BOUNCE,
    DROP
  }

  export class Data {
    forEach(callback: (feature: Data.Feature) => void): void;
    remove(feature: Data.Feature): void;
  }

  export namespace Data {
    export class Feature {
      getGeometry(): Data.Geometry;
      getProperty(name: string): any;
      setProperty(name: string, value: any): void;
    }

    export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;
  }

  export class DirectionsService {
    route(request: DirectionsRequest, callback: (result: DirectionsResult | null, status: DirectionsStatus) => void): void;
  }

  export interface DirectionsRequest {
    origin: string | LatLng | LatLngLiteral | Place;
    destination: string | LatLng | LatLngLiteral | Place;
    travelMode: TravelMode;
    transitOptions?: TransitOptions;
    drivingOptions?: DrivingOptions;
    unitSystem?: UnitSystem;
    waypoints?: DirectionsWaypoint[];
    optimizeWaypoints?: boolean;
    provideRouteAlternatives?: boolean;
    avoidFerries?: boolean;
    avoidHighways?: boolean;
    avoidTolls?: boolean;
    region?: string;
  }

  export interface DirectionsResult {
    routes: DirectionsRoute[];
  }

  export interface DirectionsRoute {
    bounds: LatLngBounds;
    legs: DirectionsLeg[];
    overview_path: LatLng[];
    overview_polyline: string;
    warnings: string[];
    waypoint_order: number[];
  }

  export interface DirectionsLeg {
    distance: Distance;
    duration: Duration;
    end_address: string;
    end_location: LatLng;
    start_address: string;
    start_location: LatLng;
    steps: DirectionsStep[];
  }

  export interface DirectionsStep {
    distance: Distance;
    duration: Duration;
    instructions: string;
    path: LatLng[];
    travel_mode: TravelMode;
    transit: TransitDetails;
  }

  export interface Distance {
    text: string;
    value: number;
  }

  export interface Duration {
    text: string;
    value: number;
  }

  export interface TransitDetails {
    arrival_stop: TransitStop;
    arrival_time: Time;
    departure_stop: TransitStop;
    departure_time: Time;
    headsign: string;
    headway: number;
    line: TransitLine;
    num_stops: number;
  }

  export interface TransitStop {
    location: LatLng;
    name: string;
  }

  export interface Time {
    text: string;
    time_zone: string;
    value: Date;
  }

  export interface TransitLine {
    agencies: TransitAgency[];
    color: string;
    icon: string;
    name: string;
    short_name: string;
    text_color: string;
    url: string;
    vehicle: TransitVehicle;
  }

  export interface TransitAgency {
    name: string;
    phone: string;
    url: string;
  }

  export interface TransitVehicle {
    icon: string;
    local_icon: string;
    name: string;
    type: string;
  }

  export interface DirectionsWaypoint {
    location: string | LatLng | LatLngLiteral | Place;
    stopover?: boolean;
  }

  export interface TransitOptions {
    arrivalTime?: Date;
    departureTime?: Date;
    modes?: TransitMode[];
    routingPreference?: TransitRoutePreference;
  }

  export enum TransitMode {
    BUS,
    RAIL,
    SUBWAY,
    TRAIN,
    TRAM
  }

  export enum TransitRoutePreference {
    FEWER_TRANSFERS,
    LESS_WALKING
  }

  export interface DrivingOptions {
    departureTime: Date;
    trafficModel?: TrafficModel;
  }

  export enum TrafficModel {
    BEST_GUESS,
    OPTIMISTIC,
    PESSIMISTIC
  }

  export enum UnitSystem {
    IMPERIAL,
    METRIC
  }

  export enum TravelMode {
    BICYCLING,
    DRIVING,
    TRANSIT,
    WALKING
  }

  export type DirectionsStatus = 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_WAYPOINTS_EXCEEDED' | 'MAX_ROUTE_LENGTH_EXCEEDED' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';

  export interface Place {
    location: LatLng | LatLngLiteral;
    placeId: string;
    query: string;
  }

  export class DirectionsRenderer {
    constructor(opts?: DirectionsRendererOptions);
    setMap(map: Map | null): void;
    setDirections(directions: DirectionsResult): void;
    setRouteIndex(routeIndex: number): void;
    getRouteIndex(): number;
  }

  export interface DirectionsRendererOptions {
    map?: Map;
    directions?: DirectionsResult;
    panel?: Element;
    routeIndex?: number;
    polylineOptions?: PolylineOptions;
    suppressMarkers?: boolean;
    suppressInfoWindows?: boolean;
    suppressPolylines?: boolean;
  }

  export class Polyline {
    constructor(opts?: PolylineOptions);
    setMap(map: Map | null): void;
    getPath(): MVCArray<LatLng>;
    setPath(path: MVCArray<LatLng> | LatLng[] | LatLngLiteral[]): void;
  }

  export interface PolylineOptions {
    path?: MVCArray<LatLng> | LatLng[] | LatLngLiteral[];
    geodesic?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    map?: Map;
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    visible?: boolean;
    zIndex?: number;
  }

  export class MVCArray<T> {
    constructor(array?: T[]);
    clear(): void;
    getArray(): T[];
    getAt(i: number): T;
    getLength(): number;
    insertAt(i: number, elem: T): void;
    pop(): T;
    push(elem: T): number;
    removeAt(i: number): T;
    setAt(i: number, elem: T): void;
  }

  export class event {
    static addListener(instance: any, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    static addDomListener(instance: any, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    static removeListener(listener: MapsEventListener): void;
    static trigger(instance: any, eventName: string, ...args: any[]): void;
  }

  export interface MapsEventListener {
    remove(): void;
  }
}

interface Window {
  google: typeof google;
  initMapCallback?: () => void;
  gm_authFailure?: () => void;
}
