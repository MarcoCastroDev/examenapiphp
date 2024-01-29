<?php
try {
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

	// Obtener conexión a la base de datos
	$conn = getDatabaseConnection($server, $user, $password, $database);

	$tempName = '##apiTemp';
	$dropTemp = "IF OBJECT_ID('tempdb..$tempName', 'U') IS NOT NULL DROP TABLE $tempName";

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
	$sqlCombinedData = "SELECT B.*, T.*
							FROM $tempName T
							LEFT JOIN (
								SELECT ItemCode, Whscode, Buffer, TipoProducto
								FROM (
									SELECT LEFT(T0.ItemCode,20) AS ITEMCODE, 
										LEFT(T1.WhsCode,8) AS WhsCode, 
										T0.Buffer, 
										ROW_NUMBER() OVER (PARTITION BY T0.ItemCode, T1.WhsCode ORDER BY T0.ItemCode, T1.WhsCode, T0.Fecha DESC, T0.Hora DESC) AS Num, 
									CASE 
										WHEN T2.QryGroup4 = 'Y' THEN 'Accesorio' 
										WHEN T2.QryGroup2 = 'Y' THEN 'Moda' 
										WHEN T2.QryGroup1 = 'Y' THEN 'Linea' 
										ELSE '' -- Puedes especificar un valor predeterminado o dejarlo en blanco según tus necesidades
									END AS TipoProducto
									FROM Siti.dbo.BYS_Buffer_Reporte_test T0 WITH (NOLOCK)
									INNER JOIN BDGRUPOS_BUENA..OWHS T1 ON T1.WhsCode = T0.WhsCode 
									INNER JOIN BDGRUPOS_BUENA..OITM T2 ON T2.ItemCode = T0.ItemCode
									WHERE T0.Fecha <= GETDATE() AND T0.Empresa = 'BDGRUPOS_BUENA'
								) AS Z
								WHERE Z.NUM = 1
							) B
							ON B.Whscode COLLATE SQL_Latin1_General_CP1_CI_AS = T.locations_external_id COLLATE SQL_Latin1_General_CP1_CI_AS
							AND B.ItemCode COLLATE SQL_Latin1_General_CP1_CI_AS = T.skus_external_id COLLATE SQL_Latin1_General_CP1_CI_AS";

	// Ejecutar la consulta para obtener los datos combinados
	$combinedResult = $conn->query($sqlCombinedData);

	if (!$combinedResult) {
		throw new Exception("Error en la consulta SQL combinada: " . print_r($conn->errorInfo(), true));
	}

	// Inicializar un array para almacenar los datos combinados
	$combinedData = [];

	while ($row = $combinedResult->fetch(PDO::FETCH_ASSOC)) {
		$combinedData[] = $row;
	}

	$conn = null;

} catch (Exception $e) {
	echo "Error: " . $e->getMessage();
	error_log($e->getMessage(), 3, "error_log.txt");
	exit;
}

// echo json_encode($combinedData);

?>