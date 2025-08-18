declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: MapOptions) => Map;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        Event: {
          addListener: (target: any, event: string, listener: Function) => void;
        };
        MapTypeControlStyle: {
          DROPDOWN: number;
        };
      };
    };
    // NAVER Map loader callback and auth failure handler
    initNaverMap?: () => void;
    navermap_authFailure?: () => void;
  }
}

interface MapOptions {
  center: LatLng;
  zoom: number;
  mapTypeControl: boolean;
  mapTypeControlOptions?: {
    style: number;
  };
}

interface MarkerOptions {
  position: LatLng;
  map: Map;
}

interface InfoWindowOptions {
  content: string;
}

interface LatLng {
  lat: () => number;
  lng: () => number;
}

interface Map {
  getCenter: () => LatLng;
  setCenter: (center: LatLng) => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
}

interface Marker {
  getPosition: () => LatLng;
  setPosition: (position: LatLng) => void;
  getMap: () => Map | null;
  setMap: (map: Map | null) => void;
}

interface InfoWindow {
  open: (map: Map, marker: Marker) => void;
  close: () => void;
  getMap: () => Map | null;
}

export {}; 