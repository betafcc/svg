import * as d3 from 'd3'
import 'd3-selection-multi'

import svg from '../../dist/index.js'


import PDFDocument from 'pdfkit'
import blobStream from 'blob-stream'

const doc = new PDFDocument();

// pipe the document to a blob
const stream = doc.pipe(blobStream());


svg
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


doc.end();
stream.on('finish', function() {
  const blob = stream.toBlob('application/pdf');
  const url = stream.toBlobURL('application/pdf');
  const iframe = document.querySelector('iframe');

  if (iframe !== null)
    iframe.src = url
});
