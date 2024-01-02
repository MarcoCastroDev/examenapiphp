<?php
require('dbconnection.php');
require('getapi.php');

// Datos de conexión a SQL
$token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
$endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';

// Obtener datos de la API
$data = fetchDataFromAPI($token, $endpoint);

if ($data === null) {
    echo 'No hay datos';
} else {
    // Gestión de la paginación y búsqueda
    $recordsPerPage = 10;
    $totalRecords = count($data['data']);
    $totalPages = ceil($totalRecords / $recordsPerPage);
    $currentPage = isset($_GET['page']) ? $_GET['page'] : 1;

    // Calcular el índice inicial y final de los registros a mostrar en la página actual
    $startIndex = ($currentPage - 1) * $recordsPerPage;
    $endIndex = min($startIndex + $recordsPerPage - 1, $totalRecords - 1);

    // Obtener solo los registros para la página actual
    $currentPageData = array_slice($data['data'], $startIndex, $recordsPerPage);

    // Filtrar los resultados si se proporciona una cadena de búsqueda
    $searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

    // Filtrar los resultados basándose en el término de búsqueda
    $filteredData = array_filter($data['data'], function ($item) use ($searchTerm) {
        return stripos($item['locations_external_id'], $searchTerm) !== false ||
            stripos($item['skus_external_id'], $searchTerm) !== false ||
            stripos($item['sku_name'], $searchTerm) !== false;
    });

    // Número total de registros filtrados
    $totalFilteredRecords = count($filteredData);

    // Número total de páginas para los registros filtrados
    $totalFilteredPages = ceil($totalFilteredRecords / $recordsPerPage);

    // Calcular el índice inicial y final de los registros a mostrar en la página actual
    $startIndex = ($currentPage - 1) * $recordsPerPage;
    $endIndex = min($startIndex + $recordsPerPage - 1, $totalFilteredRecords - 1);

    // Obtener solo los registros filtrados para la página actual
    $currentPageData = array_slice($filteredData, $startIndex, $recordsPerPage);
}

// Obtener conexión a la base de datos
$conn = getDatabaseConnection('172.19.0.31', 'Programador4', 'SAPFrogs13', 'Siti');

// Realizar la consulta SQL para obtener el buffer actual
$sql = "SELECT ItemCode,Whscode,Buffer FROM (SELECT LEFT(ItemCode,20) ITEMCODE, LEFT(WhsCode,8) WhsCode, Buffer,Empresa, ROW_NUMBER() OVER (PARTITION BY ItemCode, WhsCode,Empresa ORDER BY ItemCode, WhsCode, Fecha DESC, Hora DESC) Num FROM SITI..BYS_Buffer WITH (NOLOCK) WHERE Fecha <= GETDATE() and Empresa = 'BDGRUPOS_BUENA' AND whscode in (select location from onebeat_stock_locations) ) AS Z WHERE Z.NUM=1;";
// $sql = "SELECT TOP 20 * FROM stock_locations;";
$bufferResult = $conn->query($sql);

if (!$bufferResult) {
    echo "Error en la consulta SQL: " . print_r($conn->errorInfo(), true);
    exit;
}

// Inicializar un array para almacenar los datos del buffer
$bufferData = [];

// Procesar los resultados del buffer actual
while ($row = $bufferResult->fetch(PDO::FETCH_ASSOC)) {
    // Almacenar datos en el array bufferData
    $bufferData[strtoupper($row['ItemCode'])][strtoupper($row['Whscode'])] = $row['Buffer'];
}

$conn = null;

$combinedData = [];
$limit = 20;

foreach ($data['data'] as $apiItem) {
    $sku = strtoupper($apiItem['skus_external_id']);
    $warehouse = strtoupper($apiItem['locations_external_id']);

    // Set a default buffer value
    $bufferValue = 6;

    // Check if buffer data exists for the SKU
    if (isset($bufferData[$sku])) {
        // Iterate over warehouses for the given SKU
        foreach ($bufferData[$sku] as $bufferWarehouse => $value) {
            // Check if the current warehouse matches the one in the API data
            if ($warehouse === $bufferWarehouse) {
                // Assign buffer value to the API data
                $bufferValue = $value;
                break; // Exit the loop once a match is found
            }
        }
    }

    // Assign buffer value to the API data
    $apiItem['buffer_value'] = $bufferValue;

    // Add the combined data to the result array
    $combinedData[] = $apiItem;
}

// // Print debug information
// echo '<pre>';
// print_r($bufferData);
// echo '</pre>';

// Gestión de la paginación ----------------------------------------------------------------
// Número de registros por página
$recordsPerPage = 10;

// Número total de registros
$totalRecords = count($data['data']);

// Número total de páginas
$totalPages = ceil($totalRecords / $recordsPerPage);

// Página actual (por defecto, la primera página)
$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;

// Calcular el índice inicial y final de los registros a mostrar en la página actual
$startIndex = ($currentPage - 1) * $recordsPerPage;
$endIndex = min($startIndex + $recordsPerPage - 1, $totalRecords - 1);

// Obtener solo los registros para la página actual
$currentPageData = array_slice($data['data'], $startIndex, $recordsPerPage);

// Gestión del buscador -------------------------------------------------------------------
// Filtrar los resultados si se proporciona una cadena de búsqueda
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

// Filtrar los resultados basándose en el término de búsqueda
$filteredData = array_filter($data['data'], function ($item) use ($searchTerm) {
    return stripos($item['locations_external_id'], $searchTerm) !== false ||
        stripos($item['skus_external_id'], $searchTerm) !== false ||
        stripos($item['sku_name'], $searchTerm) !== false;
});

// Número total de registros filtrados
$totalFilteredRecords = count($filteredData);

// Número total de páginas para los registros filtrados
$totalFilteredPages = ceil($totalFilteredRecords / $recordsPerPage);

// Página actual (por defecto, la primera página)
$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;

// Calcular el índice inicial y final de los registros a mostrar en la página actual
$startIndex = ($currentPage - 1) * $recordsPerPage;
$endIndex = min($startIndex + $recordsPerPage - 1, $totalFilteredRecords - 1);

// Obtener solo los registros filtrados para la página actual
$currentPageData = array_slice($filteredData, $startIndex, $recordsPerPage);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examen Práctico Marco Castro</title>
    <!-- Llamado de Bootsrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
</head>

<body>
    <nav class="navbar bg-dark justify-content-center">
        <img src="https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png"
            alt="" class="navbar-brand m-2">
    </nav>

    <h1 class="title m-5">Listado de Inventario ideal por almacén</h1>

    <!-- Formulario de búsqueda -->
    <form class="form-inline m-5 w-25" method="GET">
        <div class="input-group">
            <input type="text" class="form-control" name="search" placeholder="Buscar..." value="<?= $searchTerm ?>">
            <button type="submit" class="btn btn-primary">Buscar</button>
        </div>
    </form>

    <!--Tabla de datos -->
    <table border="1" class="table m-5">
        <thead>
            <th>Warehouse</th>
            <th>SKU</th>
            <th>SKU name</th>
            <th>Pack Constraint</th>
            <th>Buffer</th>
            <th>Diferencia</th>
        </thead>
        <tbody>
            <?php
            $limit = 20;
            foreach ($combinedData as $item) {
                // Obtener el valor del buffer de la base de datos SQL
                $bufferValue = $item['buffer_value'];

                // Calcular la diferencia
                $diferencia = $item['pack_constraint'] - $bufferValue;

                ?>
                <tr class="justify-content-center">
                    <td>
                        <?= $item['locations_external_id'] ?>
                    </td>
                    <td>
                        <?= $item['skus_external_id'] ?>
                    </td>
                    <td>
                        <?= $item['sku_name'] ?>
                    </td>
                    <td>
                        <?= $item['pack_constraint'] ?>
                    </td>
                    <td>
                        <?= $bufferValue ?>
                    </td>
                    <td>
                        <?= $diferencia ?>
                    </td>
                </tr>
                <?php
                $limit--;
                if ($limit === 0) {
                    break;
                }
            }
            ?>
        </tbody>
    </table>
    <ul class="pagination justify-content-center">
        <!-- Botón "Previous" -->
        <li class="page-item <?= $currentPage == 1 ? 'disabled' : '' ?>">
            <a class="page-link" href="?page=<?= $currentPage - 1 ?>&search=<?= $searchTerm ?>" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>

        <!-- Mostrar hasta 5 páginas anteriores a la actual -->
        <?php for ($i = max(1, $currentPage - 4); $i < $currentPage; $i++) { ?>
            <li class="page-item">
                <a class="page-link" href="?page=<?= $i ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php } ?>

        <!-- Página actual -->
        <li class="page-item active">
            <a class="page-link" href="?page=<?= $currentPage ?>">
                <?= $currentPage ?>
            </a>
        </li>

        <!-- Mostrar hasta 5 páginas posteriores a la actual -->
        <?php for ($i = $currentPage + 1; $i <= min($currentPage + 2, $totalPages); $i++) { ?>
            <li class="page-item">
                <a class="page-link" href="?page=<?= $i ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php } ?>

        <!-- Mostrar 3 de las últimas páginas -->
        <?php
        $lastPages = min(3, $totalPages - max($currentPage + 5, 1));
        for ($i = max(1, $totalPages - $lastPages + 1); $i <= $totalPages; $i++) { ?>
            <li class="page-item">
                <a class="page-link" href="?page=<?= $i ?>">
                    <?= $i ?>
                </a>
            </li>
        <?php } ?>

        <!-- Botón "Next" -->
        <li class="page-item <?= $currentPage == $totalFilteredPages ? 'disabled' : '' ?>">
            <a class="page-link" href="?page=<?= $currentPage + 1 ?>&search=<?= $searchTerm ?>" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
</body>

<!-- Exportar datos -->
<div class="container m-5 align-content-center">
    <button class="btn btn-success" onclick="exportToExcel()">Exportar a Excel</button>
    <button class="btn btn-danger" onclick="exportToPDF()">Exportar a PDF</button>
</div>

<!-- <script>
    // Función para combinar datos de la API con datos del sistema (buffer y diferencia)
    function mergeData(apiData, systemData) {
        return apiData.map(item => {
            // Obtener el valor del buffer y la diferencia
            var bufferValue = systemData[item.skus_external_id] && systemData[item.skus_external_id][item.locations_external_id]
                ? systemData[item.skus_external_id][item.locations_external_id]
                : 0;
            var diferencia = item.pack_constraint - bufferValue;

            // Devolver la fila con los datos actualizados
            return {
                'Warehouse': item.locations_external_id,
                'SKU': item.skus_external_id,
                'SKU Name': item.sku_name,
                'Pack Constraint': item.pack_constraint,
                'Buffer': bufferValue,
                'Diferencia': diferencia
            };
        });
    }
    
    function exportToExcel() {
        // Obtener datos para exportar (combina datos de API con datos del sistema)
        var dataToExport = <?php echo json_encode(mergeData($currentPageData, $bufferData)); ?>;

        // Crear un libro de Excel
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(dataToExport);

        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, "Inventario");

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, "inventario.xlsx");
    }

    function exportToPDF() {
        // Obtener datos para exportar (combina datos de API con datos del sistema)
        var dataToExport = <?php echo json_encode(mergeData($currentPageData, $bufferData)); ?>;

        // Crear un documento PDF
        var doc = new jsPDF();

        // Añadir una tabla al PDF
        doc.autoTable({
            head: [['Warehouse', 'SKU', 'SKU Name', 'Pack Constraint', 'Buffer', 'Diferencia']],
            body: dataToExport.map(item => [
                item.Warehouse,
                item.SKU,
                item['SKU Name'],
                item['Pack Constraint'],
                item.Buffer,
                item.Diferencia
            ])
        });

        // Descargar el archivo PDF
        doc.save('inventario.pdf');
    }
</script> -->

</html>