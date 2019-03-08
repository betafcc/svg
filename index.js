const util = require('util')
const D3Node = require('d3-node')
const SVGtoPDF = require('svg-to-pdfkit')


// props: {options, width, height, attrs, call}
const _svg = props => ({
  width(w) { return (w === undefined) ? props.width : _svg({...props, width: w}) },
  height(h) { return (h === undefined) ? props.height : _svg({...props, height: h}) },
  attrs(a) { return (a === undefined) ? props.attrs : _svg({...props, attrs: a}) },
  viewBox(v) { return (v === undefined) ? props.viewBox : _svg({...props, viewBox: v}) },
  options(o) { return (o === undefined) ? props.options : _svg({...props, options: {...props.options, ...o}}) },
  call(f) { return (f === undefined) ? props.call : _svg({...props, call: ((_s, _self) => { props.call(_s, _self); f(_s, _self); }) }) },

  toString() {
    const d3n = new D3Node(props.options)

    props.call(d3n.createSVG(props.width, props.height, {
      ...props.attrs,
      viewBox: props.viewBox || undefined,
    }), _svg(props))

    return d3n.svgString()
  },

  [util.inspect.custom]() {
    return _svg(props).toString()
  },

  drawString(doc, str, {x=0, y=0, ...options}={}) {
    SVGtoPDF(doc, str, x, y, options)
  },

  draw(doc, {x=0, y=0, ...options}={}) {
    SVGtoPDF(doc, _svg(props).toString(), x, y, options)
  },
})


module.exports = _svg({call: (e => e), viewBox: '0 0 100 100'})
