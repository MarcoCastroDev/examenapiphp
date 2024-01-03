<?php
require('dbconnection.php');
require('getapi.php');
require('exportExcel.php');

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

// Configuración de paginación
$registrosPorPagina = 30;
$paginaActual = isset($_GET['pagina']) ? $_GET['pagina'] : 1;
$offset = ($paginaActual - 1) * $registrosPorPagina;

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
    $wharehouse = strtoupper($apiItem['locations_external_id']);
    $sku = strtoupper($apiItem['skus_external_id']);

    if (isset($bufferData[$sku])) {
        foreach ($bufferData[$sku] as $bufferWarehouse => $bufferValue) {
            $bufferWarehouse = trim($bufferWarehouse);
            // print_r($bufferWarehouse);
            if ($wharehouse === $bufferWarehouse) {
                $combinedDataItem['buffer_sql'] = $bufferValue;
                break;
            }
        }
    } else {
        $combinedDataItem['buffer_sql'] = 0;
    }
    $combinedData[] = $combinedDataItem;
}

// Paginar el array $combinedData
$combinedDataPaginado = array_slice($combinedData, $offset, $registrosPorPagina);

// Configuración de paginación
$totalRegistros = count($combinedData);
$totalPaginas = ceil($totalRegistros / $registrosPorPagina);

$conn = null;

// Barra de búsqueda
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

$filteredData = array_filter($combinedData, function ($item) use ($searchTerm) {
    $sku = strtoupper($item['skus_external_id']);
    $skuName = strtoupper($item['sku_name']);
    $warehouse = strtoupper($item['locations_external_id']);

    return strpos($sku, $searchTerm) !== false ||
        strpos($skuName, $searchTerm) !== false ||
        strpos($warehouse, $searchTerm) !== false;
});

$filteredDataPaginado = array_slice($filteredData, $offset, $registrosPorPagina);

if (isset($_POST['export_excel'])) {
    exportToCSV($filteredData);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examen Marco Castro</title>
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
    <nav class="navbar bg-dark justify-content-center w-100">
        <img src="https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png"
            alt="" class="navbar-brand m-2">
    </nav>

    <h1 class="title m-5"><i class="fas fa-clipboard-check p-3" style="color: #00a321;"></i>Listado de Inventario ideal
        por almacén</h1>

    <!-- Barra de búsqueda -->
    <div class="input-group offset-md-10 w-80">
        <form action="" method="GET">
            <div class="input-group w-100">
                <input type="text" class="form-control" id="searchInput" name="search"
                    placeholder="SKU/SKU name/Wharehouse" onkeyup="mayus(this);" value="<?= $searchTerm ?>">
                <div class="input-group-append">
                    <button type="submit" class="btn btn-primary">Buscar</button>
                </div>
            </div>
        </form>
    </div>


    <!--Tabla de datos -->
    <table border="1" class="table m-5" id="dataTable">
        <thead>
            <th>Wharehouse</th>
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
    <!-- Agregar controles de paginación -->
    <div class="d-flex justify-content-center mt-3">
        <ul class="pagination">
            <?php
            if ($paginaActual > 1) {
                echo '<li class="page-item"><a class="page-link" href="?pagina=' . ($paginaActual - 1) . '">Página anterior</a></li>';
            }

            for ($i = max(1, $paginaActual - 2); $i <= min($totalPaginas, $paginaActual + 2); $i++) {
                echo '<li class="page-item ' . ($i == $paginaActual ? 'active' : '') . '"><a class="page-link" href="?pagina=' . $i . '">' . $i . '</a></li>';
            }

            for ($i = max(1, $totalPaginas - 2); $i <= $totalPaginas; $i++) {
                if ($i > $paginaActual) {
                    echo '<li class="page-item"><a class="page-link" href="?pagina=' . $i . '">' . $i . '</a></li>';
                }
            }

            if ($paginaActual < $totalPaginas) {
                echo '<li class="page-item"><a class="page-link" href="?pagina=' . ($paginaActual + 1) . '">Página siguiente</a></li>';
            }
            ?>
        </ul>
    </div>

    <div class="d-flex justify-content-center mt-3">
        <form method="post">
            <button type="submit" name="export_excel" class="btn btn-success m-2">Exportar a Excel</button>
        </form>
        <button type="button" class="btn btn-danger m-2">Exportar a PDF</button>
    </div>

</body>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const searchInput = document.getElementById('searchInput');
        const tableRows = document.querySelectorAll('.table tbody tr');

        // Establecer el valor inicial del input de búsqueda
        searchInput.value = '<?= $searchTerm ?>';
    });

    function mayus(e) {
        e.value = e.value.toUpperCase();
    }
</script>

</html>