function exportExcel() {
  $('#loadingOverlay').show();
  try {
    // Obtener la instancia de DataTable
    var dataTableInstance = $('#dataTable').DataTable();
    // // Obtener todos los datos de DataTable
    var datos = dataTableInstance.rows().data().toArray();

    var data = []
    console.log(datos);
    try {
      // Iterar sobre las filas de la tabla y agregar datos al array
      datos.forEach(function (row) {
        var item = {
          Warehouse: row[0].trim(),
          SKU: row[1].trim(),
          "SKU NAME": row[2].trim(),
          "Current Target": parseInt(row[3].trim()),
          Buffer: parseInt(row[4].trim()),
          Diferencia: parseInt(row[5].trim()),
        };
        data.push(item);
      });
    }
    catch {
      Swal.fire({
        icon: 'info',
        title: 'No hay datos para exportar',
        text: 'Por favor, verifica tus filtros y asegúrate de que haya datos visibles en la tabla.',
      });
    }
    // console.log(item);
    console.log(data);

    // Crear un libro de trabajo
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet("Inventario");

    // Configurar estilo para el encabezado
    var headerStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "019a32" },
      },
      font: {
        name: "Trebuchet MS",
        size: 12,
        bold: true,
        color: { argb: "FFFFFF" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    // Configurar estilos adicionales
    var styleArray = {
      font: {
        name: "Trebuchet MS",
        size: 12,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    // Configurar estilo para la columna "SKU NAME"
    var skuNameStyle = {
      alignment: {
        horizontal: "left",
        vertical: "center",
      },
    };

    // Agregar las celdas de encabezado al archivo Excel
    var headerCells = $('#dataTable thead th').toArray();
    headerCells.forEach(function (headerCell, index) {
      worksheet.getCell(1, index + 1).value = $(headerCell).text().trim();
      worksheet.getCell(1, index + 1).style = headerStyle;
    });

    // Agregar datos al archivo Excel
    data.forEach(function (item, rowIndex) {
      Object.keys(item).forEach(function (key, colIndex) {
        var cell = worksheet.getCell(rowIndex + 2, colIndex + 1);
        cell.value = item[key];

        // Aplicar estilos adicionales según la columna
        if (key === "SKU NAME") {
          Object.assign(cell.style, styleArray, skuNameStyle);
        } else {
          Object.assign(cell.style, styleArray);
        }

        // Cambiar el color del texto solo en la columna "Diferencia"
        if (key === "Diferencia") {
          item[key] = parseInt(item[key]);
          // console.log(item);
          if (item[key] < 0) {
            // Rojo para valores negativos
            cell.font = { color: { argb: "FF0000" }, ...styleArray.font };
          } else if (item[key] === 0) {
            // Azul para valores iguales a 0
            cell.font = { color: { argb: "0000FF" }, ...styleArray.font };
          } else {
            // Verde para valores positivos
            cell.font = { color: { argb: "00FF00" }, ...styleArray.font };
          }
        }
      });
    });

    // Ajustar automáticamente el ancho de cada columna
    worksheet.columns.forEach(function (column, colIndex) {
      // Establecer el ancho de la columna según tus necesidades
      switch (colIndex) {
        case 0:
          column.width = 15; // Ancho para la primera columna
          break;
        case 1:
          column.width = 30; // Ancho para la segunda columna
          break;
        case 2:
          column.width = 80; // Ancho para la tercera columna
          break;
        case 3:
          column.width = 20; // Ancho para la cuarta columna
          break;
        case 4:
          column.width = 15; // Ancho para la quinta columna
          break;
        case 5:
          column.width = 15; // Ancho para la sexta columna
          break;
        default:
          column.width = 20; // Ancho predeterminado para otras columnas
          break;
      }
    });

    // Generar el nombre del archivo con la fecha y hora actual
    var now = new Date();
    var fileName =
      "Reporte_OBvsBuffer_" +
      now.getFullYear() +
      "_" +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      "_" +
      ("0" + now.getDate()).slice(-2) +
      "_" +
      ("0" + now.getHours()).slice(-2) +
      "/" +
      ("0" + now.getMinutes()).slice(-2) +
      ".xlsx";

    // Descargar el nuevo archivo
    workbook.xlsx.writeBuffer().then(function (buffer) {
      var blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    });

    // Muestra el mensaje de éxito después de completar la exportación
    Swal.fire({
      icon: 'success',
      title: 'Exportación Exitosa',
      html: 'Se realizó el proceso correctamente',
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'sweetalert-container',
        popup: 'sweetalert-popup',
        header: 'sweetalert-header',
        title: 'sweetalert-title',
        closeButton: 'sweetalert-close-button',
        icon: 'sweetalert-icon',
        text: 'sweetalert-text',
        footer: 'sweetalert-footer',
        confirmButton: 'sweetalert-confirm-button',
        cancelButton: 'sweetalert-cancel-button',
      }
    });

  } catch (error) {
    // Muestra un mensaje de error si hay algún problema
    Swal.fire({
      icon: 'error',
      title: 'Error en el proceso de exportación',
      html: error,
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'sweetalert-container',
        popup: 'sweetalert-popup',
        header: 'sweetalert-header',
        title: 'sweetalert-title',
        closeButton: 'sweetalert-close-button',
        icon: 'sweetalert-icon',
        text: 'sweetalert-text',
        footer: 'sweetalert-footer',
        confirmButton: 'sweetalert-confirm-button',
        cancelButton: 'sweetalert-cancel-button',
      }
    });

  } finally {
    // Oculta el overlay de carga después de completar la operación
    $('#loadingOverlay').hide();
  }
}
