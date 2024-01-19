function exportExcel() {
  var table = document.getElementById("dataTable");
  var data = [];

  // Obtener solo las filas visibles en la tabla después de aplicar el filtro
  var visibleRows = Array.from(
    table.querySelectorAll("tbody tr:not(#noResultsRow)")
  ).filter((row) => row.style.display !== "none");

  // Iterar sobre las filas de la tabla y agregar datos al array
  var row = 5;
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

  // Verificar si hay datos para exportar
  if (data.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // Crear una hoja de cálculo
  var ws = XLSX.utils.json_to_sheet(data);

  // Obtener las celdas de la primera fila
  var headerCells = Object.keys(ws).filter((cell) => cell.startsWith("A1:"));

  // Aplicar estilo a las celdas de encabezado
  headerCells.forEach((cell) => {
    ws[cell].s = { fill: { fgColor: { rgb: "3498db" } } };
  });

  // Crear un libro de trabajo
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventario");

  // Guardar el archivo
  XLSX.writeFile(wb, "Export_Excel.xlsx");
}
