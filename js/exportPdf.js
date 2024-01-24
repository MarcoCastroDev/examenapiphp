function exportPdf() {
  var table = document.getElementById("dataTable");
  var data = [];

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

  // Obtener solo las filas visibles en la tabla después de aplicar el filtro
  // Verificar si hay datos para exportar
  if (!data.length === 0) {
    var visibleRows = Array.from(
      table.querySelectorAll("tbody tr:not(#noResultsRow)")
    ).filter((row) => row.style.display !== "none");

    // Iterar sobre las filas de la tabla y agregar datos al array
    visibleRows.forEach(function (row) {
      var cells = row.cells;
      var diferenciaValue = parseInt(cells[5].textContent.trim());

      // Establecer el estilo de color según el valor de "Diferencia"
      var diferenciaStyle =
        diferenciaValue < 0
          ? "redText"
          : diferenciaValue === 0
            ? "blueText"
            : "greenText";

      var item = {
        Warehouse: { text: cells[0].textContent.trim(), style: "centerAligned" },
        SKU: { text: cells[1].textContent.trim(), style: "centerAligned" },
        "SKU NAME": { text: cells[2].textContent.trim(), style: "leftAligned" },
        "PACK Constraint": { text: cells[3].textContent.trim(), style: "centerAligned" },
        Buffer: { text: cells[4].textContent.trim(), style: "centerAligned" },
        Diferencia: { text: cells[5].textContent.trim(), style: diferenciaStyle },
      };
      data.push(item);
    });
  } else {
    alert("No hay datos para exportar.");
    return;
  }

  // Agregar encabezados al documento PDF
  var headerCells = table.querySelectorAll("thead th");
  var headerData = [];
  for (var i = 0; i < headerCells.length; i++) {
    headerData.push({ text: headerCells[i].textContent.trim(), style: "header" });
  }
  pdfDefinition.content[0].table.body.push(headerData);

  // Agregar datos al documento PDF
  for (var i = 0; i < data.length; i++) {
    var rowData = [
      data[i].Warehouse,
      data[i].SKU,
      data[i]["SKU NAME"],
      data[i]["PACK Constraint"],
      data[i].Buffer,
      data[i].Diferencia,
    ];
    pdfDefinition.content[0].table.body.push(rowData);
  }

  // Generar el archivo PDF
  const pdf = createPdf(pdfDefinition);
  pdf.download("Reporte_OBvsBuffer_" + timestamp + ".pdf");
}
