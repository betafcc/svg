import fs from 'fs'
import * as d3 from 'd3'
import 'd3-selection-multi'
import PDFDocument from 'pdfkit'

import { SVGNode as SVG } from '../../dist'

const doc = new PDFDocument()

doc.pipe(fs.createWriteStream('output.pdf'))

SVG.create()
  .call(node =>
    d3
      .select(node)
      .append('circle')
      .attrs({
        cx: 50,
        cy: 50,
        r: 50,
        fill: 'green'
      })
  )
  .toPDFKit(doc)

doc.end()
