<?php
include_once 's_conexion.php';

function cargarVerdedores($query)
{
    // echo $query;
    global $connSDTI;
    $totalFolios = 0;
    $totalVentas = 0;
    $totalBajas_Ind = 0;
    $totalBajas_Equ = 0;
    $totalBajas_tot = 0;
    $totalActivos_Ind = 0;
    $totalActivos_Equ = 0;
    $totalActivos_tot = 0;
    $totalGeneral_Ind = 0;
    $totalGeneral_Equ = 0;
    $totalGeneral_tot = 0;
    //echo $query;
    $stmt = sqlsrv_query($connSDTI, $query);
    // echo $stmt;
// while (sqlsrv_num_rows($stmt)) {
// echo $stmt;
// }
//echo $stmt;
    $tablaRpt = "";
    $pintaEncabezados = true;
    $thead = "";
    $tfoot = "";
    $tbody = "";

    $thead .= "<tr>";
    $thead .= "<th rowspan='2'>TIENDA</th>";
    $thead .= "<th rowspan='2'>CLAVE</th>";
    $thead .= "<th rowspan='2'>EMPLEADO</th>";
    $thead .= "<th rowspan='2'>ESTATUS</th>";
    $thead .= "<th rowspan='2'>FECHA INGRESO</th>";
    $thead .= "<th rowspan='2'>FECHA BAJA</th>";
    $thead .= "<th rowspan='2'>HORAS</th>";
    $thead .= "<th rowspan='2'>OPERACIONES</th>";
    $thead .= "<th rowspan='2'>$ VENTA</th>";
    $thead .= "<th rowspan='2'>$ META</th>";
    $thead .= "<th rowspan='2'>% NIV. VERDE</th>";
    $thead .= "<th rowspan='2'>% NIV. AMARILLO</th>";
    $thead .= "<th rowspan='2'>% NIV. ROJO</th>";
    $thead .= "<th colspan='2'>$ INCENTIVO</th>";
    $thead .= "<th rowspan='2'>$ BOLSA</th>";
    $thead .= "<th rowspan='2'>$ TOTAL</th>";
    $thead .= "</tr>";
    $thead .= "<tr>";
    $thead .= "<th>INDIVIDUAL</th>";
    $thead .= "<th>EQUIPO</th>";
    $thead .= "</tr>";

    echo sqlsrv_num_rows($stmt);

    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {

        if ($row['LINEA'] == '1') {
            $styleTD = (($row['PRES_DESCARTADO'] > 0) ? "color: red; font-weight: bold;" : "");
            $tbody .= '<tr class="group" codetienda="' . $row['TIENDA'] . '" style="font-weight: bold;background-color: #dddddd;">
    <td style="text-align:left;">' . $row['TIENDA'] . '</td>
    <td></td>
    <td style="text-align:left;">' . $row['NOMBRE_TIENDA'] . '</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:right; ' . $styleTD . '">PPTO DESCARTADO</td>
    <td style="text-align:right">REPARTO</td>
    <td style="text-align:right">TOTAL FOLIOS</td>
    <td style="text-align:right">VENTA</td>
    <td style="text-align:right">NIV. VERDE</td>
    <td style="text-align:right">NIV. AMARILLO</td>
    <td style="text-align:right">NIV. ROJO</td>
</tr>
<tr style="font-weight: bold;background-color: #dddddd;">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td style="text-align:right; ' . $styleTD . '" class="res_ppto_descartado"> ' .
                number_format($row['PRES_DESCARTADO'], 2) . '</td>
    <td style="text-align:right" class="res_reparto"> ' . number_format($row['COMPROMISO'], 2) . '</td>
    <td style="text-align:right" class="res_total_folio"> ' . number_format($row['total_folios'], 2) . '</td>
    <td style="text-align:right" class="res_venta"> ' . number_format($row['LOGRADO'], 2) . '</td>
    <td style="text-align:right" class="res_presupuesto"> ' . number_format($row['PRES_NIVEL_VERDE'], 2) . '</td>
    <td style="text-align:right" class="res_nivel1"> ' . number_format($row['PRES_NIVEL_AMARILLO'], 2) . '</td>
    <td style="text-align:right" class="res_nivel2"> ' . number_format($row['PRES_NIVEL_ROJO'], 2) . '</td>
</tr>
<tr style="font-weight: bold;background-color: #dddddd;">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>' . number_format($row['META_NIVEL_VERDE'], 0) . ' %</td>
    <td>' . number_format($row['META_NIVEL_AMARILLO'], 0) . ' %</td>
    <td>' . number_format($row['META_NIVEL_ROJO'], 0) . ' %</td>
</tr>';

            $totalFolios = $totalFolios + $row['total_folios'];
            $totalVentas = $totalVentas + $row['LOGRADO'];
        } else if ($row['LINEA'] == '3') {
            $tbody .= '<tr codetienda="' . $row['TIENDA'] . '" style="font-weight: bold;background-color: #FFC300;">
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>' . number_format($row['LOGRADO'], 2) . '</td>
    <td>' . number_format($row['COMPROMISO'], 2) . '</td>
    <td></td>
    <td></td>
    <td></td>
    <td>' . number_format($row['INC_INDIVIDUAL'], 2) . ' </td>
    <td>' . number_format($row['INC_EQUIPO'], 2) . ' </td>
    <td>' . number_format($row['BOLSA'], 2) . ' </td>
    <td>' . number_format($row['INC_TOTAL'], 2) . ' </td>
</tr>';
        } else {
            $styleSemaforo = "";
            if (intval($row['META_NIVEL_VERDE']) >= 100) {
                $styleSemaforo = 'background-color: #0080008f;';
            } else if (intval($row['META_NIVEL_AMARILLO']) >= 100) {
                $styleSemaforo = 'background-color: #ffff0094;';
            } else if (intval($row['META_NIVEL_ROJO']) >= 100) {
                $styleSemaforo = 'background-color: #ff0000b0;';
            }

            $tbody .= "<tr plaza=" . $row['PLAZA'] . " tienda=" . $row['TIENDA'] . ">";
            $tbody .= "<td>" . $row['TIENDA'] . "</td>";
            $tbody .= "<td style='width: 60px;'>" . $row['CAJERO'] . "</td>";
            $tbody .= "<td style='text-align:left;'>" . $row['NOMBRE'] . "</td>";
            $tbody .= "<td>" . $row['ESTATUS'] . "</td>";
            $tbody .= "<td>" . $row['FECHA_INGRESO']->format("Y-m-d") . "</td>";
            $tbody .= "<td>" . ((!empty($row['FECHA_BAJA'])) ? $row['FECHA_BAJA']->format("Y-m-d") : "") . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['HORAS'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['OPERACIONES'], 0) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['LOGRADO'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['COMPROMISO'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['META_NIVEL_VERDE'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['META_NIVEL_AMARILLO'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['META_NIVEL_ROJO'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['INC_INDIVIDUAL'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['INC_EQUIPO'], 2) . "</td>";
            $tbody .= "<td style='text-align:right'>" . number_format($row['BOLSA'], 2) . "</td>";
            $tbody .= "<td style='text-align:right; $styleSemaforo'>" . number_format($row['INC_TOTAL'], 2) . "</td>";
            $tbody .= "</tr>";

        }
    }
    $tfoot = '<tr style="font-weight: bold;background-color: #888888;">
    <td>TOTAL</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td> ' . number_format($totalFolios, 2) . '</td>
    <td> ' . number_format($totalVentas, 2) . '</td>
    <td></td>
    <td></td>
    <td></td>
</tr>';
    $tabla = "<table id='rptDetalleVendedor' class='display dataTable' cellspacing='0' style='width:100%;'>
    <thead>$thead</thead>
    <tbody>$tfoot $tbody $tfoot</tbody>
</table>";
    // echo (sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC));
    return $tabla;
}
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

<body>
    <button id="ejecutarFuncion">Ejecutar Función PHP</button>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="script.js"></script>
</body>
<script>
    $(document).ready(function () {
        // Manejar el clic en el botón
        $("#ejecutarFuncion").on("click", function () {
            // Realizar una solicitud AJAX al script PHP
            $.ajax({
                type: "POST",
                url: window.location.href, // Reemplaza "tuscript.php" con la ruta correcta a tu script PHP
                success: function (response) {
                    // Manejar la respuesta del servidor (si es necesario)
                    console.log(response);
                },
                error: function (error) {
                    // Manejar errores de la solicitud AJAX
                    console.error(error);
                }
            });
        });
    });

</script>

</html>