function exportPdf() {
  $('#loadingOverlay').show();
  // Obtener la instancia de DataTable
  var dataTableInstance = $('#dataTable').DataTable();

  // Obtener todos los datos de DataTable
  var data = dataTableInstance.rows().data().toArray();

  if (dataTableInstance.data().any()) {
    try {
      // Iterar sobre las filas de la tabla y agregar datos al nuevo array
      var pdfData = data.map(function (row) {
        return [
          { text: row[0], style: "centerAligned" },
          { text: row[1], style: "centerAligned" },
          { text: row[2], style: "centerAligned" },
          { text: row[3], style: "leftAligned" },
          { text: row[4], style: "centerAligned" },
          { text: row[5], style: "centerAligned" },
          { text: row[6], style: "centerAligned" },
          { text: row[7], style: row[7] < 0 ? "redText" : (row[7] <= 0 ? "greenText" : "blueText") },
        ];
      });

      // Agregar encabezados al documento PDF
      var headerCells = $('#dataTable thead th').toArray();
      var headerData = headerCells.map(function (headerCell) {
        return { text: headerCell.textContent.trim(), style: "header" };
      });
      pdfData.unshift(headerData);

      // Generar el archivo PDF
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
              widths: [60.5, 128, 56, "*", 35, 56, 35, 55],
              body: pdfData,
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
            fontSize: 8,
          },
          centerAligned: {
            alignment: "center",
            fontSize: 8,
          },
          redText: {
            color: 'red',
            alignment: "center",
            fontSize: 8,
          },
          blueText: {
            color: 'blue',
            alignment: "center",
            fontSize: 8,
          },
          greenText: {
            color: 'green',
            alignment: "center",
            fontSize: 8,
          },
        },
      };

      const pdf = createPdf(pdfDefinition);
      pdf.download("Reporte_OBvsBuffer_" + timestamp + ".pdf");

      // Muestra el mensaje de éxito después de completar la exportación
      Swal.fire({
        icon: 'success',
        title: 'Exportación Exitosa',
        html: 'Se realizó el proceso correctamente',
        confirmButtonText: 'Aceptar',
      });

    } catch (error) {
      Swal.fire({
        icon: 'info',
        title: 'Error al exportar PDF',
        text: 'Ocurrió un error al generar el archivo PDF.',
      });
    } finally {
      // Oculta el overlay de carga después de completar la operación
      $('#loadingOverlay').hide();
    }

  } else {
    // Muestra un mensaje de información si no hay datos en la tabla
    Swal.fire({
      icon: 'info',
      title: 'No hay datos para exportar',
      text: 'Por favor, verifica tus filtros y asegúrate de que haya datos visibles en la tabla.',
    });

    $('#loadingOverlay').hide();
  }
}
