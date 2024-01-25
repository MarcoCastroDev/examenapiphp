<?php
// require('cargaDatos.php');
require('opcionesFiltrado.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de
        OneBeat vs Buffer</title>
    <link rel="shortcut icon" href="img\faviconTGC.ico" />
    <!-- Llamado de Bootsrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <!-- Hoja de estilos -->
    <link rel="stylesheet" href="./css/styles.css">
    <!-- DataTables CSS -->
    <link href="DataTables/datatables.min.css" rel="stylesheet">
    <!-- Incluir SweetAlert2 CSS con el tema de Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.min.css">
</head>

<!-- Spinner de carga -->
<div id="loadingOverlay" class="overlay" style="display: inline;">
    <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>
</div>

<body>
    <!-- Barra de navegación -->
    <nav class=" navbar bg-dark justify-content-center w-100">
        <img src="https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png"
            alt="" class="navbar-brand m-2">
    </nav>
    <div class="container-fluid">
        <h1 class="title ms-4 mt-4"><i class="fas fa-clipboard-check p-3" style="color: #00a321;"></i><strong>Reporte de
                OneBeat vs Buffer</strong></h1>
        <div class="container w-100 ">
            <div class="d-flex justify-content-between align-items-center" id="buttons">
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-secondary align-content-start" id="buffer">Aplicar
                        Buffer</button>
                </div>
                <!-- Botones de Exportar y Filtrar -->
                <div class="d-flex me-5">
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle me-4" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="fas fa-file-export"></i> Exportar
                        </button>
                        <ul class="dropdown-menu">
                            <form>
                                <button type="button" name="export_excel" class="btn dropdown-item"
                                    onclick="exportExcel()">
                                    <i class="fas fa-file-excel" style="color: #217346;"></i> Excel
                                </button>
                                <button type="button" name="export_pdf" class="btn dropdown-item" onclick="exportPdf()">
                                    <i class="fas fa-file-pdf" style="color: #ff4343;"></i> PDF
                                </button>
                            </form>
                        </ul>
                    </div>
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#opcionesModal">
                        <i class="fa-solid fa-filter me-1"></i>Filtrar Resultados
                    </button>
                </div>
                <!-- Modal -->
                <div class="modal fade" id="opcionesModal" tabindex="-1" aria-labelledby="opcionesModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header justify-content-center text-center">
                                <h5 class="modal-title" id="exampleModalLabel text-center ">Filtrar</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <label for="agrupadoPor" class="form-label ms-4 mt-2">Agrupador:</label>
                                <div class="input-group w-50 ms-4" id="agrupadorContent">
                                    <select class="form-select" id="agrupadoPor">
                                        <option value="1">Global</option>
                                        <option value="2">Región</option>
                                        <option value="3">Plaza</option>
                                        <option value="4">Tienda</option>
                                    </select>
                                    <button type="button" class="btn btn-primary" id="buscar">
                                        <i class="fa-solid fa-magnifying-glass me-1"></i>Buscar
                                    </button>
                                </div>
                                <div id="opcionVision" class="w-auto m-4"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Tabla de datos -->
        <table id="dataTable" class="table table-responsive table-striped" style="width: 183vh; ">
            <thead>
                <th class="text-center">Warehouse</th>
                <th class="text-center">SKU</th>
                <th class="text-center">SKU name</th>
                <th class="text-center">Current Target</th>
                <th class="text-center">Buffer</th>
                <th class="text-center">Diferencia</th>
            </thead>
            <tbody>
                <?php
                foreach ($combinedData as $item) {
                    // Verificar si la clave "buffer_sql" existe en el array actual
                    $bufferValue = isset($item['Buffer']) ? $item['Buffer'] : 0;
                    // Calcular la diferencia
                    $diferencia = $item['current_target'] - $item['Buffer'];
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
                        <td class="text-center">
                            <?= $item['locations_external_id'] ?>
                        </td>
                        <td class="text-center">
                            <?= $item['skus_external_id'] ?>
                        </td>
                        <td>
                            <?= $item['sku_name'] ?>
                        </td>
                        <td class="text-center">
                            <?= $item['current_target'] ?>
                        </td>
                        <td class="text-center">
                            <?= $item['Buffer'] ?>
                        </td>
                        <td class="<?= $class ?> text-center ">
                            <?= $diferencia ?>
                        </td>
                    </tr>

                    <?php
                }
                ?>
            </tbody>
            <tfoot>
                <tr>
                    <th class="text-center">Warehouse</th>
                    <th class="text-center">SKU</th>
                    <th class="text-center">SKU name</th>
                    <th class="text-center">Current Target</th>
                    <th class="text-center">Buffer</th>
                    <th class="text-center">Diferencia</th>
                </tr>
            </tfoot>
        </table>
    </div>
</body>

<!-- Incluir FontAwesom y Bootstrap -->
<script src="https://kit.fontawesome.com/a4ee172207.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
    crossorigin="anonymous"></script>
<!-- Include jQuery -->
<script src="DataTables/datatables.min.js"></script>
<!-- Incluir Exportación Excel y PDF -->
<script src="https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.9/pdfmake.min.js"
    integrity="sha512-5wC3oH3tojdOtHBV6B4TXjlGc0E2uk3YViSrWnv1VUmmVlQDAs1lcupsqqpwjh8jIuodzADYK5xCL5Dkg/ving=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts.js"></script>
<!-- Incluir SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js"></script>
<!-- Archivos de exportación -->
<script src="./js/exportExcel.js"></script>
<script src="./js/exportPdf.js"></script>

<script>
    $(function () {
        $("#agrupadoPor").change();
    });
    document.addEventListener('DOMContentLoaded', function () {
        const noResultsRow = document.getElementById('noResultsRow');
        const searchInput = document.getElementById('searchInput');
        const dataTable = document.getElementById('dataTable');
        const buscar = document.getElementById('buscar');
        const buffer = document.getElementById('buffer');

        var dataTableInstance = new DataTable('#dataTable', {
            // language: {
            //     search: 'Buscar: ',
            //     url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json'
            // },
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "62%" },
                { "width": "8%" },
                { "width": "5%" },
                { "width": "5%" },
            ]
        });

        $(document).ready(function () {
            // Manejo del cambio en el agrupador
            $("#agrupadoPor").on("change", function () {
                var contOpcionVision = "";

                switch ($(this).val()) {
                    case '1':
                        contOpcionVision += "<div class='p-1 d-flex justify-content-center align-items-center mt-5'><label><strong>Se buscará en todos los registros</strong></label></div>";
                        break;
                    case '2'://regiones
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
                            echo "contOpcionVision+=" . '"' . "<div class='contOpcion' idregion='" . $row['Code'] . "' ><label class='p-1 me-2' for='region_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='region_" . $row['Code'] . "' />" . $row['Name'] . "</label></div>" . '"' . ";";
                        }

                        ?>
                        break;
                    case '3'://plazas
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
                        echo "contOpcionVision+=" . '"' . "<div class='p-1' ><label for='plaza_all' ><input class='me-1' type='checkbox' id='plaza_all' />Seleccionar Todo</label></div>" . '"' . ";";

                        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                            echo "contOpcionVision+=" . '"' . "<div class='contOpcion P_" . $row['Location'] . "' idplaza='" . $row['Code'] . "' ><label class='p-1 me-2' for='plaza_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='plaza_" . $row['Code'] . "' />" . $row['Location'] . "</label></div>" . '"' . ";";
                        }

                        ?>
                        break;
                    case '4'://Tiendas
                        contOpcionVision += "<div class='div50' style='display: grid'>";
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
                            echo "contOpcionVision+=" . '"' . "<div class='contOpcion div50Plaza P_" . $row['Location'] . "' id='" . $row['Code'] . "' ><label class='p-1 me-2' for='region_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='region_" . $row['Code'] . "' />" . $row['Location'] . "</label></div>" . '"' . ";";
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
                    url: './opcionesFiltrado.php',
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
                        // Utilizar SweetAlert2 para mostrar un mensaje de error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al enviar datos',
                            text: 'Posibles errores:\n- El servidor no ha respondido a su solicitud (inténtelo de nuevo).\n- La sesión ha expirado (actualize la página web o teclee F5).\n- Ha cancelado la petición al servidor.',
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

                    }

                });
            });

            $("#agrupadoPor").trigger("change");

            $("#buscar").on("click", function () {
                cargarTablaFiltrada()
            });

            function cargarTablaFiltrada() {
                $('#loadingOverlay').show();
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

                $("#opcionVision").css("border-color", "#808080");

                // console.log(agrupacion);

                switch (agrupacion) {
                    case '1'://global
                        auxAgrupacion = [];
                        banderaauxAgrupacion = true;
                        break;
                    case '2'://region
                        $(".contOpcion").find("input").each(function () {
                            if ($(this).prop("checked")) {
                                var idRegion = $(this).attr("id");
                                if (idRegion) {
                                    auxAgrupacion.push(idRegion.split("_")[1]);
                                }
                                banderaauxAgrupacion = true;
                            }
                        });
                        if (!banderaauxAgrupacion) {
                            $("#opcionVision").css("border-color", "red");
                            Swal.fire({
                                icon: 'error',
                                title: 'Error de selección',
                                text: 'Es necesario que seleccione por lo menos una opción, en la selección de regiones',
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
                            return false;
                        }
                        break;
                    case '3'://plaza
                        $(".contOpcion").find("input").each(function () {
                            if ($(this).prop("checked")) {
                                var idPlaza = $(this).attr("id");
                                if (idPlaza) {
                                    auxAgrupacion.push(idPlaza.split("_")[1]);
                                }
                                banderaauxAgrupacion = true;
                            }
                        });
                        if (!banderaauxAgrupacion) {
                            $("#opcionVision").css("border-color", "red");
                            Swal.fire({
                                icon: 'error',
                                title: 'Error de selección',
                                text: 'Es necesario que seleccione por lo menos una opción, en la selección de plazas',
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
                            return false;
                        }
                        break;
                    case '4'://tienda
                        $("#contTiendadv50").find("input").each(function () {
                            if ($(this).prop("checked")) {
                                var idTienda = $(this).attr("id");
                                if (idTienda) {
                                    auxAgrupacion.push(idTienda.split("_")[1]);
                                }
                                banderaauxAgrupacion = true;
                            }


                        });
                        if (!banderaauxAgrupacion) {
                            $("#opcionVision").css("border-color", "red");
                            Swal.fire({
                                icon: 'error',
                                title: 'Error de selección',
                                text: 'Es necesario que seleccione por lo menos una opción, en la selección de tiendas',
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
                            return false;
                        }
                        break;
                }

                var data = {
                    accion: 'CARGARTABLAFILTRADA',
                    agrupacion: agrupacion,
                    auxAgrupacion: auxAgrupacion,
                    plazasTiendas: plazasTiendas,
                    auxAgrupacion: auxAgrupacion,
                };
                $('#loadingOverlay').show();
                $.ajax({
                    type: 'post',
                    url: './opcionesFiltrado.php',
                    data: data,
                    dataType: "json",
                    beforeSend: function () {
                        // Mostrar el loader antes de la solicitud AJAX
                        $('#loadingOverlay').show();
                    },
                    success: function (response) {

                        // Limpiar la tabla y destruir la instancia DataTable
                        $('#dataTable tbody').empty();
                        if (dataTableInstance) {
                            dataTableInstance.destroy();
                        }

                        // Verificar si la respuesta es un array y tiene datos
                        if (Array.isArray(response) && response.length > 0) {
                            // Obtener el elemento de la tabla
                            var table = document.getElementById("dataTable");
                            $(table).find('tbody').empty();

                            // Crear un fragmento de documento para optimizar la manipulación del DOM
                            var fragment = document.createDocumentFragment();

                            // Iterar sobre los datos y agregar filas al fragmento
                            response.forEach(function (item) {
                                // Verificar si la clave "Buffer" existe en el objeto actual
                                var bufferValue = item.Buffer || 0;
                                // Calcular la diferencia
                                var diferencia = item.current_target - bufferValue;
                                // Determinar la clase de estilo basada en el valor de diferencia
                                var classStyle = '';
                                if (diferencia > 0) {
                                    classStyle = 'text-primary';
                                } else if (diferencia === 0) {
                                    classStyle = 'text-success';
                                } else {
                                    classStyle = 'text-danger';
                                }
                                const textCenter = 'text-center'

                                // Crear la fila de la tabla con datos del objeto
                                var row = document.createElement('tr');

                                var tdLocationsExternalId = document.createElement('td');
                                tdLocationsExternalId.textContent = item.locations_external_id;
                                tdLocationsExternalId.classList.add(textCenter);
                                row.appendChild(tdLocationsExternalId);

                                var tdSkusExternalId = document.createElement('td');
                                tdSkusExternalId.textContent = item.skus_external_id;
                                tdSkusExternalId.classList.add(textCenter);
                                row.appendChild(tdSkusExternalId);

                                var tdSkuName = document.createElement('td');
                                tdSkuName.textContent = item.sku_name;
                                row.appendChild(tdSkuName);

                                var tdCurrentTarget = document.createElement('td');
                                tdCurrentTarget.textContent = item.current_target;
                                tdCurrentTarget.classList.add(textCenter);
                                row.appendChild(tdCurrentTarget);

                                var tdBuffer = document.createElement('td');
                                tdBuffer.textContent = bufferValue;
                                tdBuffer.classList.add(textCenter);
                                row.appendChild(tdBuffer);

                                var tdDiferencia = document.createElement('td');
                                tdDiferencia.textContent = diferencia;
                                tdDiferencia.classList.add(classStyle);
                                tdDiferencia.classList.add(textCenter);
                                row.appendChild(tdDiferencia);

                                // Agregar la fila al fragmento
                                fragment.appendChild(row);
                            });

                            // Agregar todas las filas al cuerpo de la tabla de una vez
                            $('#dataTable tbody').append(fragment);

                            // Volver a inicializar DataTable con los nuevos datos
                            dataTableInstance = new DataTable('#dataTable', {
                                // language: {
                                //     search: 'Buscar: ',
                                //     url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json'
                                // },
                                "columns": [
                                    { "width": "5%" },
                                    { "width": "15%" },
                                    { "width": "62%" },
                                    { "width": "8%" },
                                    { "width": "5%" },
                                    { "width": "5%" },
                                ]
                            });

                            $('#opcionesModal').modal('hide');
                            $('#loadingOverlay').show();
                        } else {
                            // Volver a inicializar DataTable
                            dataTableInstance = new DataTable('#dataTable', {
                                // language: {
                                //     search: 'Buscar: ',
                                //     url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-MX.json'
                                // },
                                "columns": [
                                    { "width": "5%" },
                                    { "width": "15%" },
                                    { "width": "62%" },
                                    { "width": "8%" },
                                    { "width": "5%" },
                                    { "width": "5%" },
                                ]
                            });

                            $('#opcionesModal').modal('hide');
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se encontraron registros.',
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

                        }
                        // Ocultar el loader después de cargar los datos
                        $('#loadingOverlay').hide();
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error en la solicitud AJAX',
                            html: xhr.responseText.replace(/<br \/>/g, ''),
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
                        // Ocultar el loader en caso de error
                        $('#loadingOverlay').hide();
                    }
                });
            }

            $("#buffer").on("click", function () {
                // Mostrar una alerta de confirmación
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esto aplicará el buffer. ¿Quieres continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
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
                }).then((result) => {
                    // Si el usuario hace clic en "Aceptar"
                    if (result.isConfirmed) {
                        var agrupacion = $("#agrupadoPor").val();

                        var dataTableData = dataTableInstance.rows().data().toArray();
                        if (dataTableData.length === 0) {
                            Swal.fire({
                                icon: 'info',
                                title: 'No hay datos para aplicar buffer',
                                text: 'Por favor, verifica tus filtros y asegúrate de que haya datos visibles en la tabla.',
                            });
                            return;
                        }
                        var data = {
                            accion: 'APLICARBUFFER',
                            agrupacion: agrupacion,
                            dataTableData: JSON.stringify(dataTableData),
                        };

                        $('#loadingOverlay').show();
                        $.ajax({
                            type: 'post',
                            url: './opcionesFiltrado.php',
                            data: data,
                            dataType: "json",
                            beforeSend: function () {
                                // Mostrar el loader antes de la solicitud AJAX
                                $('#loadingOverlay').show();

                            },
                            success: function (response) {
                                // Lógica para manejar la respuesta exitosa del buffer

                                cargarTablaFiltrada();

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Aplicar buffer',
                                    html: response,
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

                                // Ocultar el loader después de aplicar el buffer
                                $('#loadingOverlay').hide();
                            },
                            error: function (xhr, status, error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error en la solicitud AJAX',
                                    html: xhr.responseText.replace(/<br \/>/g, ''),
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
                                $('#loadingOverlay').hide();
                            }
                        });
                    }
                });
            });
            $('#dataTable').show();
            $('#loadingOverlay').hide();
        });
    });

</script>

</html>