<?php

$server = '172.19.0.31';
$user = 'react';
$password = 'SAPFrogs09';
$database = 'Siti';

$token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
$endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';

$accion = isset($_POST['accion']) ? $_POST['accion'] : '';
switch ($accion) {
    case 'CARGATIENDASPORPLAZA':
        $plazasTiendas = isset($_POST['plazasTiendas']) ? $_POST['plazasTiendas'] : null;
        $conjuntosChecks = '';
        $inclu_bodega_ = $_POST['incluir_bodega'];

        include_once('dbconnection.php');
        if (!empty($plazasTiendas)) {
            $plazasTiendas = join(",", $_POST['plazasTiendas']);
            $connectionInfo = array("Database" => "BDGrupoS_Buena", "UID" => $user, "PWD" => $password);
            $conn = sqlsrv_connect($server, $connectionInfo);
            if ($conn === false) {
                die(print_r(sqlsrv_errors(), true));
            }
            if ($inclu_bodega_ == 0) {
                $sql = "SELECT WhsCode Code, WhsName name, CASE  WHEN U_bys_clasificacion in (2) then 'T_SKORO' else 'T_FROGS' END tipo FROM BDGrupoS_Buena..OWHS WHERE U_U_BYS_MAXIMIZADOR IN(2,4) and Location in(" . $plazasTiendas . ") order by  WhsName ";
            }
            if ($inclu_bodega_ == 1) {
                $sql = "SELECT WhsCode Code, WhsName name FROM BDGrupoS_Buena..OWHS WHERE U_U_BYS_MAXIMIZADOR IN(2,4,3,1) and Location in(" . $plazasTiendas . ") order by  WhsName ";
            }
            $stmt = sqlsrv_query($conn, $sql);
            if ($stmt === false) {
                die(print_r(sqlsrv_errors(), true));
            }
            $conjuntosChecks = "<div class='p-1'><label for='tienda_all' ><input class='me-1' type='checkbox' id='tienda_all' />Seleccionar Todo</label></div>";
            while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                $conjuntosChecks .= "<div class='contOpcionPlaza div50Tienda " . $row['tipo'] . "' idtienda='" . $row['Code'] . "' ><label class='p-1' for='tienda_" . $row['Code'] . "' ><input class='me-1' type='checkbox' id='tienda_" . $row['Code'] . "' />" . $row['name'] . "</label></div>";
            }
        }
        echo json_encode(array('tiendas' => $conjuntosChecks));
        break;

    case 'CARGARTABLAFILTRADA':
        // Inicializar un array para almacenar los datos combinados
        $combinedData = [];
        try {
            $agrupacion = isset($_POST['agrupacion']) ? $_POST['agrupacion'] : null;
            $auxAgrupacion = isset($_POST['auxAgrupacion']) ? $_POST['auxAgrupacion'] : null;
            $plazasTiendas = isset($_POST['plazasTiendas']) ? $_POST['plazasTiendas'] : null;
            require('dbconnection.php');
            require('getapi.php');

            // Datos de conexión a API
            $token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
            $endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';
            // Datos de conexión a SQL
            $server = '172.19.0.31';
            $user = 'react';
            $password = 'SAPFrogs09';
            $database = 'Siti';

            $plazasTiendas = join(",", $_POST['plazasTiendas']);
            $auxAgrupacion = join(",", $_POST['auxAgrupacion']);
            // Obtener conexión a la base de datos
            $conn = getDatabaseConnection($server, $user, $password, $database);

            $tempName = '##apiTemp';
            $dropTemp = "IF OBJECT_ID('tempdb..$tempName', 'U') IS NOT NULL
             DROP TABLE $tempName";

            $conn->exec($dropTemp);

            $createTemp = "CREATE TABLE $tempName (
                locations_external_id VARCHAR(255),
                skus_external_id VARCHAR(255),
                sku_chart_url VARCHAR(255),
                sku_name VARCHAR(255),
                current_target INT,
                old_target INT,
                pack_constraint INT 
            )";
            $conn->exec($createTemp);

            // Obtener datos de la API
            $data = fetchDataFromAPI($token, $endpoint);

            if (!empty($data['data'])) {
                $insertTemp = "INSERT INTO $tempName (locations_external_id, skus_external_id, sku_chart_url, sku_name, current_target, old_target, pack_constraint)
                          VALUES (:locations_external_id, :skus_external_id, :sku_chart_url, :sku_name, :current_target, :old_target, :pack_constraint)";

                $stmt = $conn->prepare($insertTemp);

                foreach ($data['data'] as $apiItem) {
                    $stmt->bindValue(':locations_external_id', $apiItem['locations_external_id']);
                    $stmt->bindValue(':skus_external_id', $apiItem['skus_external_id']);
                    $stmt->bindValue(':sku_chart_url', $apiItem['sku_chart_url']);
                    $stmt->bindValue(':sku_name', $apiItem['sku_name']);
                    $stmt->bindValue(':current_target', $apiItem['current_target']);
                    $stmt->bindValue(':old_target', $apiItem['old_target']);
                    $stmt->bindValue(':pack_constraint', $apiItem['pack_constraint']);
                    $stmt->execute();
                }
            } else {
                throw new Exception("No hay datos de la API para insertar en la tabla temporal.");
            }

            // Consulta para combinar datos del buffer y la tabla temporal de la API
            $sqlCombinedData = "declare @Vision INT = " . $agrupacion . ", --1 Global, 2 Region, 3 Plaza, 4 Tienda.
	                                    @AuxVision VARCHAR(MAX) = '" . $auxAgrupacion . "' --Dependiendo la vision seria el concatenado de lo que quiere ver, ya sea region, plaza o tienda. 
                                SELECT B.*, T.*
                                        FROM $tempName T
                                        inner JOIN (
                                            SELECT ItemCode, Whscode, Buffer
                                            FROM (
                                                SELECT LEFT(T0.ItemCode,20) ITEMCODE, LEFT(T1.WhsCode,8) WhsCode, T0.Buffer,
                                                    ROW_NUMBER() OVER (PARTITION BY T0.ItemCode, T1.WhsCode ORDER BY T0.ItemCode, T1.WhsCode, T0.Fecha DESC, T0.Hora DESC) Num
                                                FROM SITI..BYS_Buffer T0 WITH (NOLOCK)
                                                inner join BDGRUPOS_BUENA..OWHS T1 ON T1.WhsCode = T0.WhsCode 
                                                WHERE T0.Fecha <= GETDATE() AND T0.Empresa = 'BDGRUPOS_BUENA'
                                                AND (
                                                    (@Vision = 1) --DE GRUPO, SE CONSULTA TODO; 59
                                                    OR
                                                    (@Vision = 2 AND T1.U_Bys_RegionWhs IN (SELECT Item FROM Siti..Split(@AuxVision,','))) --REGION, SOLO LAS REGIONES INTERESADAS
                                                    OR
                                                    (@Vision = 3 AND T1.Location IN (SELECT Item FROM Siti..Split(@AuxVision,','))) --PLAZA, SOLO LAS PLAZAS SELECCIONADAS
                                                    OR
                                                    (@Vision = 4 AND T1.WhsCode IN (SELECT Item FROM Siti..Split(@AuxVision,','))) --TIENDA, SOLO LAS TIENDAS SELECCIONADAS
                                                )
                                            ) AS Z
                                            WHERE Z.NUM = 1
                                            ) B
                                            ON B.Whscode COLLATE SQL_Latin1_General_CP1_CI_AS = T.locations_external_id COLLATE SQL_Latin1_General_CP1_CI_AS
                                            AND B.ItemCode COLLATE SQL_Latin1_General_CP1_CI_AS = T.skus_external_id COLLATE SQL_Latin1_General_CP1_CI_AS";

            // print_r($sqlCombinedData);

            // Ejecutar la consulta para obtener los datos combinados
            $combinedResult = $conn->query($sqlCombinedData);

            if (!$combinedResult) {
                throw new Exception("Error en la consulta SQL combinada: " . print_r($conn->errorInfo(), true));
            }

            while ($row = $combinedResult->fetch(PDO::FETCH_ASSOC)) {
                $combinedData[] = $row;
            }

            $conn = null;


        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            error_log($e->getMessage(), 3, "error_log.txt");
            exit;
        }

        echo json_encode($combinedData);
        break;
}

?>