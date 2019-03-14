const dom = require('sketch/dom');
const BrowserWindow = require('sketch-module-web-view');

function traverse(layers, callback) {
  layers.forEach(layer => {
    callback(layer);
    if (layer.layers) {
      traverse(layer.layers, callback);
    }
  });
}

export default function() {
  const document = dom.getSelectedDocument();
  if (!document) return;
  const affectedLayers = [];
  traverse(document.selectedLayers, layer => {
    if (layer.type !== 'Text') return;
    const toHeight =
      layer.style.fontSize +
      layer.style.lineHeight * Math.max(0, layer.fragments.length - 1);
    layer.style.verticalAlignment = 'center';
    layer.frame.scale(1, toHeight / layer.frame.height);
    affectedLayers.push(layer);
  });
  traverse(document.selectedLayers, layer => (layer.selected = false));
  affectedLayers.forEach(layer => {
    let cursor = layer.parent;
    while (cursor.type === 'Group') {
      cursor.adjustToFit();
      cursor = cursor.parent;
    }
    layer.selected = true;
  });

  // const browserWindow = new BrowserWindow({
  //   identifier: 'adjust-multibyte-frame',
  //   width: 240,
  //   height: 180,
  //   show: true
  // });
  // const webContents = browserWindow.webContents;
  // webContents.on('did-finish-load', () => {});
  // browserWindow.loadURL(require('../resources/webview.html'));
}
