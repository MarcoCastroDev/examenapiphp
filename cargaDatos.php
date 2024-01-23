<?php
require('dbconnection.php');
require('getapi.php');

$server = '172.19.0.31';
$user = 'react';
$password = 'SAPFrogs09';
$database = 'Siti';

$token = "Kze7r3s6oHvHBgIfpOlZD5RFTHZqHPEhrx0h7ngiJnoHq9yBUYjP7zYXtigTRKFCEIZ3YwSXoNkHsL5qVFLxfNiemzhoHsX3J7fZPVtqVWAUef6Ag96eWAXszJKeyxzweCJ7frvnDLrrxTrh1fBYYhFCBgl0F1AQEfZhqRcwXhp5fTSOdnhJbU9YPNG7h6R6exkGiCOaDt5IwQsGxn4m7X2q3IFaBGDv9cO85dbxdPmjorTQTbXyayUii9cYF4Zp";
$endpoint = 'https://api.onebeat.co/v1/exporters/targets?account_id=4756a8d4-ce6c-47b5-b4e3-fa924fe71d88';

$accion = isset($_POST['accion']) ? $_POST['accion'] : '';
switch ($_POST['accion']) {
	case 'CARGATIENDASPORPLAZA':
		$plazasTiendas = isset($_POST['plazasTiendas']) ? $_POST['plazasTiendas'] : null;
		$conjuntosChecks = '';
		$inclu_bodega_ = $_POST['incluir_bodega'];


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
				$conjuntosChecks .= "<div class='p-1 contOpcionPlaza div50Tienda " . $row['tipo'] . "' identifi='" . $row['Code'] . "' ><label for='tienda_" . $row['Code'] . "' ><input type='checkbox' id='tienda_" . $row['Code'] . "' />" . $row['name'] . "</label></div>";
			}
		}
		echo json_encode(array('tiendas' => $conjuntosChecks));
		break;

	case 'CARGARTABLAFILTRADA':

		$server = '172.19.0.31';
		$user = 'react';
		$password = 'SAPFrogs09';
		$database = 'Siti';

		$plazasTiendas = isset($_POST['plazasTiendas']) ? $_POST['plazasTiendas'] : null;
		$plazasTiendas = join(",", $_POST['plazasTiendas']);
		
		// Obtener conexión a la base de datos
		$conn = getDatabaseConnection($server, $user, $password, $database);
		// Obtener datos de la API
		$data = fetchDataFromAPI($token, $endpoint);

		// Realizar la consulta SQL para obtener el buffer actual
		$sql = "SELECT ItemCode,Whscode,Buffer FROM (SELECT LEFT(ItemCode,20) ITEMCODE, LEFT(WhsCode,8) WhsCode, Buffer,Empresa, ROW_NUMBER() OVER (PARTITION BY ItemCode, WhsCode,Empresa ORDER BY ItemCode, WhsCode, Fecha DESC, Hora DESC) Num FROM SITI..BYS_Buffer WITH (NOLOCK) WHERE Fecha <= GETDATE() and Empresa = 'BDGRUPOS_BUENA' AND whscode in (select location from onebeat_stock_locations 
            WHERE Location IN (
                SELECT WhsCode
                FROM BDGrupoS_Buena..OWHS 
                WHERE U_U_BYS_MAXIMIZADOR IN (2,4) 
                    AND Location IN (" . $plazasTiendas . ")
            )) ) AS Z WHERE Z.NUM=1;";

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

		echo json_encode($filteredDataPaginado);
		break;
}

?>