<?php
require('dbconnection.php');
require('getapi.php');
require('exportExcel.php');
require('exportPdf.php');

function cargarBufferDatos($bufferResult)
{
    $bufferData = [];

    // Verificar si se recibieron datos a través de una petición AJAX
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Obtener los datos de la petición POST
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        // Verificar si se recibieron datos válidos
        if (!empty($data['bufferData'])) {
            // Usar los datos de la petición AJAX
            $bufferData = $data['bufferData'];
        }
    }

    // Procesar los resultados del buffer actual
    while ($row = $bufferResult->fetch(PDO::FETCH_ASSOC)) {
        // Almacenar datos en el array bufferData
        $bufferData[strtoupper($row['ItemCode'])][strtoupper($row['Whscode'])] = $row['Buffer'];
    }

    return $bufferData;
}

// Datos de conexión a API
$token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
$endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';
// Datos de conexión a SQL
$server = '172.19.0.31';
$user = 'react';
$password = 'SAPFrogs09';
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
    // print_r($combinedDataItem);
    $combinedData[] = $combinedDataItem;
}

// print_r($combinedData);

// Función de comparación para usort
function compareWarehouses($a, $b)
{
    return strcmp($a['locations_external_id'], $b['locations_external_id']);
}

// Ordenar el array por el campo "Warehouse"
usort($combinedData, 'compareWarehouses');

// Configuración de paginación
$registrosPorPagina = 70;
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
    <link rel="stylesheet" href="./css/styles.css">
    <script src="https://kit.fontawesome.com/a4ee172207.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>

    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.css" />

    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.9/pdfmake.min.js"
        integrity="sha512-5wC3oH3tojdOtHBV6B4TXjlGc0E2uk3YViSrWnv1VUmmVlQDAs1lcupsqqpwjh8jIuodzADYK5xCL5Dkg/ving=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="./js/exportExcel.js"></script>
    <script src="./js/exportPdf.js"></script>

</head>

<body>
    <!-- Barra de navegación -->
    <nav class=" navbar bg-dark justify-content-center w-100">
        <img src="https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png"
            alt="" class="navbar-brand m-2">
    </nav>
    <div class="container-fluid">
        <h1 class="title m-5"><i class="fas fa-clipboard-check p-3" style="color: #00a321;"></i>Reporte de OneBeat vs
            Buffer
        </h1>
        <!-- Barra de búsqueda -->
        <!-- <div class="input-group offset-md-7 w-100">
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i class="fas fa-file-export"></i> Exportar
                </button>
                <ul class="dropdown-menu">
                    <form>
                        <button type="button" name="export_excel" class="btn dropdown-item" onclick="exportExcel()">
                            <i class="fas fa-file-excel" style="color: #217346;"></i> Excel
                        </button>
                        <button type="button" name="export_pdf" class="btn dropdown-item" onclick="exportPdf()">
                            <i class="fas fa-file-pdf" style="color: #ff4343;"></i> PDF
                        </button>
                    </form>
                </ul>
            </div>
            <div class="ms-2" style="width: 32%;">
                <div class="input-group">
                    <input type="text" class="form-control" id="searchInput" name="search"
                        placeholder="SKU / SKU name / Warehouse" onkeyup="mayus(this);" value="<?= $searchTerm ?>">
                </div>
            </div>
        </div> -->
        <div class="m-5">
            <label for="agrupadoPor" class="form-label">Agrupador:</label>
            <div class="input-group w-25">
                <select class="form-select w-25" id="agrupadoPor">
                    <!-- <option value="1">Región</option>
                    <option value="2">Plaza</option> -->
                    <option value="3">Tienda</option>
                </select>
                <button type="button" class="btn btn-primary" id="buscar"><i
                        class="fa-solid fa-magnifying-glass me-1"></i>Buscar</button>
            </div>
        </div>
        <!-- Contenedor para opciones dinámicas -->
        <div id="opcionVision" class="m-5" style="width: 186vh;"></div>

        <div class="dropdown offset-md-12">
            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="fas fa-file-export"></i> Exportar
            </button>
            <ul class="dropdown-menu">
                <form>
                    <button type="button" name="export_excel" class="btn dropdown-item" onclick="exportExcel()">
                        <i class="fas fa-file-excel" style="color: #217346;"></i> Excel
                    </button>
                    <button type="button" name="export_pdf" class="btn dropdown-item" onclick="exportPdf()">
                        <i class="fas fa-file-pdf" style="color: #ff4343;"></i> PDF
                    </button>
                </form>
            </ul>
        </div>
        <!--Tabla de datos -->
        <!-- <table border="1" class="table m-5" id="dataTable" style="width: 186vh; "> -->
        <table id="dataTable" class="table table-responsive table-striped" style="width: 183vh; ">
            <thead>
                <th>Warehouse</th>
                <th>SKU</th>
                <th>SKU name</th>
                <th>Pack Constraint</th>
                <th>Buffer</th>
                <th>Diferencia</th>
            </thead>
            <tbody>
                <!-- <tr id="noResultsRow" class="table-danger" style="display: none;">
                    <td colspan="6" class="text-center">No se encontraron resultados.</td>
                </tr> -->
                <?php
                foreach ($combinedData as $item) {
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
            <tfoot>
                <tr>
                    <th>Warehouse</th>
                    <th>SKU</th>
                    <th>SKU name</th>
                    <th>Pack Constraint</th>
                    <th>Buffer</th>
                    <th>Diferencia</th>
                </tr>
            </tfoot>
        </table>

        <!-- Paginación -->
        <div class="d-flex justify-content-center mt-3 position-absolute bottom-25 start-50 translate-middle-x">
            <ul class="pagination">
                <?php
                $urlParams = !empty($searchTerm) ? '&search=' . urlencode($searchTerm) : '';
                // Botón "Prev"
                if ($paginaActual > 1) {
                    echo '<li class="page-item"><a class="page-link" href="?pagina=' . ($paginaActual - 1) . $urlParams . '">Prev</a></li>';
                }
                // Páginas intermedias
                $maxPages = min($totalPaginas, 5);
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
    </div>
</body>

<div id="loadingOverlay" class="overlay">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>

<script>
    new DataTable('#dataTable');

    $(function () {
        $("#agrupadoPor").change();
    });
    document.addEventListener('DOMContentLoaded', function () {
        const noResultsRow = document.getElementById('noResultsRow');
        const searchInput = document.getElementById('searchInput');
        const dataTable = document.getElementById('dataTable');
        const buscar = document.getElementById('buscar');

        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toUpperCase();
            const tableRows = dataTable.querySelectorAll('tbody tr:not(#noResultsRow)');

            let hasResults = false;

            tableRows.forEach(row => {
                const sku = row.cells[1].textContent.toUpperCase();
                const skuName = row.cells[2].textContent.toUpperCase();
                const warehouse = row.cells[0].textContent.toUpperCase();

                if (sku.includes(searchTerm) || skuName.includes(searchTerm) || warehouse.includes(searchTerm)) {
                    row.style.display = '';
                    hasResults = true;
                } else {
                    row.style.display = 'none';
                }
            });

            // Mostrar u ocultar la fila especial según si hay resultados
            noResultsRow.style.display = hasResults ? 'none' : '';
        });
    });
    function mayus(e) {
        e.value = e.value.toUpperCase();
    }

    $(document).ready(function () {
        // Manejo del cambio en el agrupador
        $("#agrupadoPor").on("change", function () {
            var contOpcionVision = "";

            switch ($(this).val()) {
                case '1'://regiones
                    contOpcionVision += "<span class='titulodiv50 bg-dark' id='contPlazadv50'>Regiones</span>";
                    <?php
                    $connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
                    $conn = sqlsrv_connect($server, $connectionInfo);
                    if ($conn === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }

                    $sql = "SELECT Code,Code + '  ' +  Name Name  FROM BDGrupoS_Buena..[@BYS_REGIONES_WHS] WHERE Code NOT IN (04,05) ORDER BY Code;";

                    $stmt = sqlsrv_query($conn, $sql);
                    if ($stmt === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }
                    echo "contOpcionVision+=" . '"' . "<div class='p-1'><label for='region_all' ><input class='me-1' type='checkbox' id='region_all' />Seleccionar Todo</label></div>" . '"' . ";";

                    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                        echo "contOpcionVision+=" . '"' . "<div class='p-1 contOpcion' iden='" . $row['Code'] . "' ><label for='region_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='region_" . $row['Code'] . "' />" . $row['Name'] . "</label></div>" . '"' . ";";
                    }

                    ?>
                    break;
                case '2'://plazas
                    contOpcionVision += "<span class='titulodiv50 bg-dark ' id='contPlazadv50'>Plazas</span>";

                    <?php
                    $connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
                    $conn = sqlsrv_connect($server, $connectionInfo);
                    if ($conn === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }

                    $sql = "SELECT Code,Location FROM BDGrupoS_Buena..OLCT WHERE Code not in (5,11,12,9,10,13,14,15,16,17,18)";

                    $stmt = sqlsrv_query($conn, $sql);
                    if ($stmt === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }
                    echo "contOpcionVision+=" . '"' . "<div class='p-1' ><label for='region_all' ><input class='me-1' type='checkbox' id='region_all' />Seleccionar Todo</label></div>" . '"' . ";";

                    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                        echo "contOpcionVision+=" . '"' . "<div class='p-1 contOpcion P_" . $row['Location'] . "' id='" . $row['Code'] . "' ><label for='region_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='region_" . $row['Code'] . "' />" . $row['Location'] . "</label></div>" . '"' . ";";
                    }

                    ?>
                    break;
                case '3'://Tiendas
                    contOpcionVision += "<div class='div50'>";
                    contOpcionVision += "<span class='titulodiv50 bg-dark ' id='contPlazadv50'>Plazas</span>";
                    <?php
                    $connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
                    $conn = sqlsrv_connect($server, $connectionInfo);
                    if ($conn === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }

                    $sql = "SELECT Code,Location FROM BDGrupoS_Buena..OLCT WHERE Code not in (5,11,12,9,10,13,14,15,16,17,18)";

                    $stmt = sqlsrv_query($conn, $sql);
                    if ($stmt === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }
                    echo "contOpcionVision+=" . '"' . "<div class='p-1'' ><label for='region_all' ><input class='me-1' type='checkbox' id='region_all' />Seleccionar Todo</label></div>" . '"' . ";";

                    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                        echo "contOpcionVision+=" . '"' . "<div class='p-1 contOpcion div50Plaza P_" . $row['Location'] . "' id='" . $row['Code'] . "' ><label for='region_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='region_" . $row['Code'] . "' />" . $row['Location'] . "</label></div>" . '"' . ";";
                    }

                    ?>
                    contOpcionVision += "</div>";
                    contOpcionVision += "<div id='contTiendadv50' class='div50'>";
                    contOpcionVision += "<span class='titulodiv50 bg-dark' id='contPlazadv50'>Tiendas</span>";
                    contOpcionVision += "</div>";
                    break;
            }

            $("#opcionVision").html(contOpcionVision);
        });

        $(document).on("change", "#region_all", function () {
            $(".contOpcion input").prop("checked", $(this).prop("checked"));
            $(".contOpcion ").last().change();
        });

        $(document).on("change", ".contOpcion input", function () {
            todosSeleccionados = true;
            $(".contOpcion input").each(function () {
                if (!$(this).prop("checked")) {
                    todosSeleccionados = false;
                }
            });
            $("#region_all").prop("checked", todosSeleccionados);
        });
        $(document).on("change", "#tienda_all", function () {

            $(".div50Tienda input").prop("checked", $(this).prop("checked"));
            $(".div50Tienda ").last().change();
        });
        $(document).on("change", ".div50Tienda input", function () {
            todosSeleccionados = true;
            $(".div50Tienda input").each(function () {
                if (!$(this).prop("checked")) {
                    todosSeleccionados = false;
                }

            });
            $("#tienda_all").prop("checked", todosSeleccionados);

        });
        $(document).on("change", ".div50Plaza", function () {
            plazasTiendas = new Array();
            tiendasCheckeadas = new Array();
            $(".contOpcion input").each(function () {
                if ($(this).prop("checked")) {
                    plazasTiendas.push($(this).attr("id").split("_")[1]);
                }

            });
            $("#contTiendadv50").find("input").each(function () {
                if ($(this).prop("checked")) {
                    tiendasCheckeadas.push($(this).attr("id"));
                }

            });

            incluir_bodega = 0;

            var data = {
                accion: 'CARGATIENDASPORPLAZA',
                incluir_bodega: incluir_bodega,
                plazasTiendas: plazasTiendas,
            };
            // console.log("Datos enviados:", data);
            // console.log("plazasTiendas:", plazasTiendas);
            $.ajax({
                type: 'post',
                url: './cargaDatos.php',
                data: data,
                async: false,
                dataType: "json",
                success: function (ttr) {
                    $("#contTiendadv50").html("<span  class='titulodiv50 bg-dark '>Tiendas</span>" + ttr['tiendas']);
                    $.each(tiendasCheckeadas, function (index, val) {
                        $("#" + val).prop("checked", true);

                    });
                    $(".div50Tienda ").last().change();
                }, error: function (ttr) {
                    console.log(ttr.responseText);
                    alert('Error al enviar datos!!!\nPosibles errores:\n-El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n-La sesión ha expirado(actualize la página web o teclee f5).\n-Ha cancelado la peticion al servidor.');

                }

            });
        });

        $("#agrupadoPor").trigger("change");

        $("#buscar").on("click", function () {
            plazasTiendas = new Array();
            $(".contOpcion input").each(function () {
                if ($(this).prop("checked")) {
                    plazasTiendas.push($(this).attr("id").split("_")[1]);
                }

            });
            var contOpcionVision = "";
            var agrupacion = $("#agrupadoPor").val();
            auxAgrupacion = new Array();
            banderaauxAgrupacion = false;

            switch (agrupacion) {
                case '1'://region
                    $(".contOpcion").find("input").each(function () {
                        if ($(this).prop("checked")) {
                            auxAgrupacion.push($(this).attr("id").split("_")[1]);
                            banderaauxAgrupacion = true;
                        }
                    });
                    if (!banderaauxAgrupacion) {
                        $("#opcionVision").css("border-color", "red");
                        alertt("Es necesario que seleccione por lo menos una opcion, en la selección de regiones");
                        return false;
                    }
                    break;
                case '2'://plaza
                    $(".contOpcion").find("input").each(function () {

                        if ($(this).prop("checked")) {
                            auxAgrupacion.push($(this).attr("id").split("_")[1]);
                            banderaauxAgrupacion = true;
                        }
                    });
                    if (!banderaauxAgrupacion) {
                        $("#opcionVision").css("border-color", "red");
                        alertt("Es necesario que seleccione por lo menos una opcion, en la selección de plazas");
                        return false;
                    }
                    break;
                case '3'://tienda
                    $("#contTiendadv50").find("input").each(function () {
                        if ($(this).prop("checked")) {
                            auxAgrupacion.push($(this).attr("id").split("_")[1]);
                            banderaauxAgrupacion = true;
                        }


                    });
                    if (!banderaauxAgrupacion) {
                        $("#opcionVision").css("border-color", "red");
                        alertt("Es necesario que seleccione por lo menos una opcion, en la selección de tiendas");
                        return false;
                    }
                    break;
            }
            var data = {
                accion: 'CARGARTABLAFILTRADA',
                agrupacion: agrupacion,
                plazasTiendas: plazasTiendas,
                auxAgrupacion: auxAgrupacion,
            };
            $('#loadingOverlay').show();

            $.ajax({
                type: 'post',
                url: './cargaDatos.php',
                data: data,
                dataType: "json",
                beforeSend: function () {
                    // Mostrar el loader antes de la solicitud AJAX
                    $('#loadingOverlay').show();
                },
                success: function (response) {
                    try {
                        // Limpiar el cuerpo de la tabla
                        $('#dataTable tbody').empty();

                        if (response && response.contenido && response.contenido.length > 0) {
                            // Actualizar la tabla con los nuevos datos
                            response.contenido.forEach(function (item) {
                                // Calcular la diferencia
                                var diferencia = item.pack_constraint - (item.buffer_sql || 0);

                                // Determinar la clase de estilo basada en la diferencia
                                var cssClass = '';
                                if (diferencia > 0) {
                                    cssClass = "text-primary";
                                } else if (diferencia === 0) {
                                    cssClass = 'text-success';
                                } else {
                                    cssClass = 'text-danger';
                                }

                                // Crear una nueva fila para la tabla
                                var newRow = '<tr>' +
                                    '<td>' + item.locations_external_id + '</td>' +
                                    '<td>' + item.skus_external_id + '</td>' +
                                    '<td>' + item.sku_name + '</td>' +
                                    '<td>' + item.pack_constraint + '</td>' +
                                    '<td>' + (item.buffer_sql || 0) + '</td>' +
                                    '<td class="' + cssClass + '">' + diferencia + '</td>' +
                                    '</tr>';

                                // Append the new row to the table
                                $('#dataTable tbody').html(newRow);
                            });
                        } else {
                            // Mostrar un mensaje si no hay resultados
                            $('#noResultsRow').show();
                        }
                    } catch (error) {
                        console.error('Error al procesar la respuesta AJAX:', error);
                    } finally {
                        // Ocultar el loader después de completar la solicitud AJAX
                        $('#loadingOverlay').hide();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error en la solicitud AJAX:', xhr.responseText);

                    // Ocultar el loader en caso de error
                    $('#loadingOverlay').hide();
                }
            });

        });
    });

</script>

<style>
    body {
        width: 100vw;
        overflow-x: hidden;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        font-size: 14px;
    }
</style>

</html>