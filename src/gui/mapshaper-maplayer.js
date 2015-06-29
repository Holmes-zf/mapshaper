/* @requires mapshaper-canvas, mapshaper-gui-shapes */

// Interface for displaying the points and paths in a dataset
//
function LayerGroup(dataset) {
  var _surface = new CanvasLayer(),
      _filteredArcs = dataset.arcs ? new FilteredArcCollection(dataset.arcs) : null,
      _bounds = MapShaper.getDatasetBounds(dataset),
      _draw,
      _shapes,
      _lyr,
      _style,
      _map;

  this.showLayer = function(lyr) {
    // TODO: make sure lyr is in dataset
    if (lyr.geometry_type == 'point') {
      _shapes = new FilteredPointCollection(lyr.shapes);
      _draw = MapShaper.drawPoints;
    } else {
      // TODO: show shapes, not arcs
      _shapes = _filteredArcs;
      _draw = MapShaper.drawPaths;
    }
    return this;
  };

  this.getBounds = function() {
    return _bounds;
  };

  this.getDataset = function() {
    return dataset;
  };

  this.setStyle = function(style) {
    _style = style;
    return this;
  };

  this.hide = function() {
    _surface.clear();
    _shapes = null;
  };

  this.setRetainedPct = function(pct) {
    _filteredArcs.setRetainedPct(pct);
    return this;
  };

  this.refresh = function() {
    if (_map && _shapes && _style) {
      var ext = _map.getExtent();
      _surface.prepare(ext.width(), ext.height());
      _shapes.setMapExtent(ext);
      _draw(_shapes, _style, _surface.getContext());
    }
  };

  this.remove = function() {
    if (_surface) {
      _surface.getElement().remove();
    }
  };

  this.setMap = function(map) {
    _map = map;
    _surface.getElement().appendTo(map.getElement());
  };
}
