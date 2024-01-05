<?php
require('dbconnection.php');
require('getapi.php');
require('exportExcel.php');
require('exportPdf.php');

// Datos de conexión a API
$token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
$endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';
// Datos de conexión a SQL
$server = '172.19.0.31';
$user = 'Programador4';
$password = 'SAPFrogs13';
$database = 'Siti';

// Obtener datos de la API
$data = fetchDataFromAPI($token, $endpoint);
// Obtener conexión a la base de datos
$conn = getDatabaseConnection($server, $user, $password, $database);

// Realizar la consulta SQL para obtener el buffer actual
$sql = "SELECT ItemCode,Whscode,Buffer FROM (SELECT LEFT(ItemCode,20) ITEMCODE, LEFT(WhsCode,8) WhsCode, Buffer,Empresa, ROW_NUMBER() OVER (PARTITION BY ItemCode, WhsCode,Empresa ORDER BY ItemCode, WhsCode, Fecha DESC, Hora DESC) Num FROM SITI..BYS_Buffer WITH (NOLOCK) WHERE Fecha <= GETDATE() and Empresa = 'BDGRUPOS_BUENA' AND whscode in (select location from onebeat_stock_locations) ) AS Z WHERE Z.NUM=1;";
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

// Crear arreglo combinado con datos de API y de BD
$combinedData = [];

foreach ($data['data'] as $apiItem) {
    $combinedDataItem = $apiItem;
    $warehouse = strtoupper($apiItem['locations_external_id']);
    $sku = strtoupper($apiItem['skus_external_id']);

    if (isset($bufferData[$sku])) {
        foreach ($bufferData[$sku] as $bufferWarehouse => $bufferValue) {
            $bufferWarehouse = trim($bufferWarehouse);
            if ($warehouse === $bufferWarehouse) {
                $combinedDataItem['buffer_sql'] = trim($bufferValue);
                break;
            }
        }
    } else {
        $combinedDataItem['buffer_sql'] = 0;
    }
    $combinedData[] = $combinedDataItem;
}

// Función de comparación para usort
function compareWarehouses($a, $b)
{
    return strcmp($a['locations_external_id'], $b['locations_external_id']);
}

// Ordenar el array por el campo "Warehouse"
usort($combinedData, 'compareWarehouses');

// Configuración de paginación
$registrosPorPagina = 10;
$paginaActual = isset($_GET['pagina']) ? $_GET['pagina'] : 1;
$offset = ($paginaActual - 1) * $registrosPorPagina;

// Filtrar los resultados basados en la búsqueda
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
$filteredData = array_filter($combinedData, function ($item) use ($searchTerm) {
    $sku = strtoupper($item['skus_external_id']);
    $skuName = strtoupper($item['sku_name']);
    $warehouse = strtoupper($item['locations_external_id']);
    return strpos($sku, $searchTerm) !== false || strpos($skuName, $searchTerm) !== false || strpos($warehouse, $searchTerm) !== false;
});

// Recalcular el total de registros y páginas para la nueva búsqueda
$totalRegistros = count($filteredData);
$totalPaginas = ceil($totalRegistros / $registrosPorPagina);

// Paginar el array $filteredData
$filteredDataPaginado = array_slice($filteredData, $offset, $registrosPorPagina);

$conn = null;

// Exportación a Excel
if (isset($_POST['export_excel'])) {
    exportToExcel($filteredData);
}

// Exportación a PDF
if (isset($_POST['export_pdf'])) {
    exportToPDF($filteredData);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario - Marco</title>
    <link rel="shortcut icon" href="img\Senor-frogs-logo-removebg-preview.png" />
    <!-- Llamado de Bootsrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/a4ee172207.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
</head>

<body>
    <!-- Barra de navegación -->
    <nav class=" navbar bg-dark justify-content-center w-100">
        <img src="https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png"
            alt="" class="navbar-brand m-2">
    </nav>
    <h1 class="title m-5"><i class="fas fa-clipboard-check p-3" style="color: #00a321;"></i>Listado de Inventario ideal
        por almacén</h1>
    <!-- Barra de búsqueda -->
    <div class="input-group offset-md-7 w-100">
        <div class="dropdown">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="fas fa-file-export"></i> Exportar
            </button>
            <ul class="dropdown-menu">
                <form method="post">
                    <button type="submit" name="export_excel" class="btn dropdown-item">
                        <i class="fas fa-file-excel" style="color: #217346;"></i> Excel
                    </button>
                    <button type="submit" name="export_pdf" class="btn dropdown-item">
                        <i class="fas fa-file-pdf" style="color: #ff4343;"></i> PDF
                    </button>
                </form>
            </ul>
        </div>
        <form action="" method="GET" class="ms-2" style="width: 32%;">
            <div class="input-group">
                <input type="text" class="form-control" id="searchInput" name="search"
                    placeholder="SKU / SKU name / Warehouse" onkeyup="mayus(this);" value="<?= $searchTerm ?>">
                <button type="submit" class="btn btn-primary">Buscar</button>
                <?php
                if (!empty($searchTerm)) {
                    echo '<a href="/examen_marco/" class="btn btn-secondary ms-2">Reiniciar</a>';
                }
                ?>
            </div>
        </form>
    </div>

    <!--Tabla de datos -->
    <table border="1" class="table m-5" id="dataTable" style="width: 186vh; ">
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
            foreach ($filteredDataPaginado as $item) {
                // Verificar si la clave "buffer_sql" existe en el array actual
                $bufferValue = isset($item['buffer_sql']) ? $item['buffer_sql'] : 0;
                // Calcular la diferencia
                $diferencia = $item['pack_constraint'] - $bufferValue;
                // Determinar la clase de estilo basada en el valor de diferencia
                $class = '';
                if ($diferencia > 0) {
                    $class = 'text-primary';
                } elseif ($diferencia == 0) {
                    $class = 'text-success';
                } else {
                    $class = 'text-danger';
                }
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
                    <td class="<?= $class ?>">
                        <?= $diferencia ?>
                    </td>
                </tr>
                <?php
            }
            ?>
        </tbody>
    </table>

    <!-- Controles de paginación -->
    <div class="d-flex justify-content-center mt-3">
        <ul class="pagination">
            <?php
            $urlParams = !empty($searchTerm) ? '&search=' . urlencode($searchTerm) : '';

            // Botón "Prev"
            if ($paginaActual > 1) {
                echo '<li class="page-item"><a class="page-link" href="?pagina=' . ($paginaActual - 1) . $urlParams . '">Prev</a></li>';
            }

            // Páginas intermedias
            $maxPages = min($totalPaginas, 5);  // Máximo 5 páginas intermedias
            $startPage = max(1, min($paginaActual - floor($maxPages / 2), $totalPaginas - $maxPages + 1));

            for ($i = $startPage; $i < $startPage + $maxPages; $i++) {
                echo '<li class="page-item ' . ($i == $paginaActual ? 'active' : '') . '"><a class="page-link" href="?pagina=' . $i . $urlParams . '">' . $i . '</a></li>';
            }

            // Última página
            if ($paginaActual < $totalPaginas - 2) {
                echo '<li class="page-item"><span class="page-link">...</span></li>';
                echo '<li class="page-item"><a class="page-link" href="?pagina=' . $totalPaginas . $urlParams . '">' . $totalPaginas . '</a></li>';
            }

            // Botón "Next"
            if ($paginaActual < $totalPaginas) {
                echo '<li class="page-item"><a class="page-link" href="?pagina=' . ($paginaActual + 1) . $urlParams . '">Next</a></li>';
            }
            ?>
        </ul>
    </div>
</body>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('searchInput');
        const tableRows = document.querySelectorAll('.table tbody tr');
        // Establecer el valor inicial del input de búsqueda
        searchInput.value = '<?= $searchTerm ?>';
        // $('#dataTable').DataTable();
    });
    function mayus(e) {
        e.value = e.value.toUpperCase();
    }
</script>

<style>
    body {
        width: 100vw;
        overflow-x: hidden;
    }

    #dataTable {
        max-width: 100%;
    }
</style>

</html>