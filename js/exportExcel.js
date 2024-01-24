function exportExcel() {
  var table = document.getElementById("dataTable");
  var data = [];

  // Obtener solo las filas visibles en la tabla después de aplicar el filtro
  var visibleRows = Array.from(
    table.querySelectorAll("tbody tr:not(#noResultsRow)")
  ).filter((row) => row.style.display !== "none");

  try {
    // Iterar sobre las filas de la tabla y agregar datos al array
    visibleRows.forEach(function (row) {
      var cells = row.cells;
      var item = {
        Warehouse: row.cells[0].textContent.trim(),
        SKU: row.cells[1].textContent.trim(),
        "SKU NAME": row.cells[2].textContent.trim(),
        "PACK Constraint": parseInt(row.cells[3].textContent.trim()),
        Buffer: parseInt(row.cells[4].textContent.trim()),
        Diferencia: parseInt(row.cells[5].textContent.trim()),
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

  // Verificar si hay datos para exportar
  if (data.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'No hay datos para exportar',
      text: 'Por favor, verifica tus filtros y asegúrate de que haya datos visibles en la tabla.',
    });
    return;
  }

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

  // Obtener las celdas de la primera fila
  var headerCells = table.querySelectorAll("thead th");

  // Agregar las celdas de encabezado al archivo Excel
  headerCells.forEach(function (headerCell, index) {
    worksheet.getCell(1, index + 1).value = headerCell.textContent.trim();
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
}