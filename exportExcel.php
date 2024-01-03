<?php
// Función para generar y exportar datos a un archivo CSV
function exportToCSV($data) {
    $timestamp = time();
    print_r($timestamp);
    $filename = 'Export_' . $timestamp . '.csv';

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $output = fopen('php://output', 'w');

    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));
    fputcsv($output, array('Warehouse', 'SKU', 'SKU name', 'Pack Constraint', 'Buffer', 'Diferencia'));

    // Escribe los datos al archivo CSV
    foreach ($data as $item) {
        $bufferValue = isset($item['buffer_sql']) ? $item['buffer_sql'] : 0;
        $diferencia = $item['pack_constraint'] - $bufferValue;
        $row = array(
            $item['locations_external_id'],
            $item['skus_external_id'],
            $item['sku_name'],
            $item['pack_constraint'],
            $bufferValue,
            $diferencia
        );
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}

?>