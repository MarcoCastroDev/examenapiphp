function exportPdf() {
  // Obtener la instancia de DataTable
  var dataTableInstance = $('#dataTable').DataTable();

  // Obtener todos los datos de DataTable
  var data = dataTableInstance.rows().data().toArray();

  var now = new Date();
  var timestamp =
    now.getFullYear() +
    "_" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "_" +
    ("0" + now.getDate()).slice(-2) +
    "_" +
    ("0" + now.getHours()).slice(-2) +
    "_" +
    ("0" + now.getMinutes()).slice(-2);

  var pdfDefinition = {
    header: function (currentPage, pageCount, pageSize) {
      // Encabezado para cada página
      return [
        {
          text: "Reporte de OneBeat vs Buffer",
          alignment: "center",
          fontSize: 18,
          margin: [0, 10],
          bold: true,
        },
        {
          text: "Página " + currentPage.toString() + " de " + pageCount,
          alignment: "right",
          margin: [10, 0],
          fontSize: 8,
          bold: true,
        },
      ];
    },
    content: [
      {
        table: {
          headerRows: 1,
          widths: [60.5, 128, "*", 56, 35, 55],
          body: [],
        },
      },
    ],
    pageOrientation: "landscape",
    styles: {
      header: {
        bold: true,
        fillColor: '#019a32', // Verde
        alignment: "center",
        color: '#FFFFFF',
      },
      leftAligned: {
        alignment: "left",
        fontSize: 11,
      },
      centerAligned: {
        alignment: "center",
        fontSize: 11,
      },
      redText: {
        color: 'red',
        alignment: "center",
        fontSize: 11,
      },
      blueText: {
        color: 'blue',
        alignment: "center",
        fontSize: 11,
      },
      greenText: {
        color: 'green',
        alignment: "center",
        fontSize: 11,
      },
    },
  };

  try {
    // Agregar encabezados al documento PDF
    var headerCells = $('#dataTable thead th').toArray();
    var headerData = [];
    for (var i = 0; i < headerCells.length; i++) {
      headerData.push({ text: headerCells[i].textContent.trim(), style: "header" });
    }
    pdfDefinition.content[0].table.body.push(headerData);

    // Agregar datos al documento PDF
    for (var i = 0; i < data.length; i++) {
      var rowData = [
        { text: data[i][0], style: "centerAligned" },
        { text: data[i][1], style: "centerAligned" },
        { text: data[i][2], style: "leftAligned" },
        { text: data[i][3], style: "centerAligned" },
        { text: data[i][4], style: "centerAligned" },
        { text: data[i][5], style: data[i][5] < 0 ? "redText" : (data[i][5] === 0 ? "blueText" : "greenText") },
      ];
      pdfDefinition.content[0].table.body.push(rowData);
    }

    // Generar el archivo PDF
    const pdf = createPdf(pdfDefinition);
    pdf.download("Reporte_OBvsBuffer_" + timestamp + ".pdf");
  } catch (error) {
    Swal.fire({
      icon: 'info',
      title: 'No hay datos para exportar',
      text: 'Por favor, verifica tus filtros y asegúrate de que haya datos visibles en la tabla.',
    });
  }
}
