import { useEffect, useMemo } from 'react';
import { map } from '../core/MapView';

class ScreenshotControl {
  constructor() {
    this.takeScreenshot = this.takeScreenshot.bind(this);
  }

  onAdd() {
    this.button = document.createElement('button');
    this.button.className = 'maplibregl-ctrl-icon maplibre-ctrl-screenshot';
    this.button.type = 'button';
    this.button.onclick = this.takeScreenshot;

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }

  takeScreenshot() {
    try {
      if (!map) {
        console.error('Map instance not found');
        alert('Map not found. Please refresh the page.');
        return;
      }

      if (!map.loaded()) {
        console.warn('Map is not fully loaded yet');
        alert('Please wait for the map to fully load.');
        return;
      }

      const canvas = map.getCanvas();
      
      const link = document.createElement('a');
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-');
      link.download = `traccar-map-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Screenshot taken successfully');
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      alert(`Failed to take screenshot: ${error.message}`);
    }
  }
}

const MapScreenshot = () => {
  const control = useMemo(() => new ScreenshotControl(), []);

  useEffect(() => {
    try {
      map.addControl(control);
      console.log('Screenshot control added successfully');
    } catch (error) {
      console.error('Failed to add screenshot control:', error);
    }
    return () => {
      try {
        map.removeControl(control);
      } catch (error) {
        console.error('Failed to remove screenshot control:', error);
      }
    };
  }, [control]);

  return null;
};

export default MapScreenshot;
