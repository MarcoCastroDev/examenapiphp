<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Función para generar y exportar datos a un archivo CSV
function exportToExcel($data) {
    // Crear una instancia de PhpSpreadsheet
    $spreadsheet = new Spreadsheet();

    // Configurar estilo para el encabezado
    $headerStyle = [
        'font' => [
            'bold' => true,
            'color' => ['rgb' => 'FFFFFF'],
        ],
        'fill' => [
            'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
            'startColor' => ['rgb' => '3498db'],
        ],
        'alignment' => [
            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
        ],
    ];

    // Obtener la hoja activa
    $sheet = $spreadsheet->getActiveSheet();

    // Configurar el encabezado
    $sheet->setCellValue('A1', 'Warehouse')->getStyle('A1')->applyFromArray($headerStyle);
    $sheet->setCellValue('B1', 'SKU')->getStyle('B1')->applyFromArray($headerStyle);
    $sheet->setCellValue('C1', 'SKU name')->getStyle('C1')->applyFromArray($headerStyle);
    $sheet->setCellValue('D1', 'Pack Constraint')->getStyle('D1')->applyFromArray($headerStyle);
    $sheet->setCellValue('E1', 'Buffer')->getStyle('E1')->applyFromArray($headerStyle);
    $sheet->setCellValue('F1', 'Diferencia')->getStyle('F1')->applyFromArray($headerStyle);

    // Configurar datos
    $row = 2;
    foreach ($data as $item) {
        $bufferValue = isset($item['buffer_sql']) ? $item['buffer_sql'] : 0;
        $diferencia = $item['pack_constraint'] - $bufferValue;

        $sheet->setCellValue('A' . $row, $item['locations_external_id']);
        $sheet->setCellValue('B' . $row, $item['skus_external_id']);
        $sheet->setCellValue('C' . $row, $item['sku_name']);
        $sheet->setCellValue('D' . $row, $item['pack_constraint']);
        $sheet->setCellValue('E' . $row, $bufferValue);
        $sheet->setCellValue('F' . $row, $diferencia);

        // Establecer el color de la diferencia
        $color = ($diferencia > 0) ? '00FF00' : (($diferencia < 0) ? 'FF0000' : '000000');
        $sheet->getStyle('F' . $row)->getFont()->getColor()->setARGB($color);

        $row++;
    }

    // Configurar estilos adicionales
    $styleArray = [
        'alignment' => [
            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
        ],
    ];
    $sheet->getStyle('A2:F' . $row)->applyFromArray($styleArray);
    $sheet->getStyle('C2:C' . $row)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);

    // Configurar anchos de columna automático
    foreach (range('A', 'F') as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    // Configurar la respuesta para descargar
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="Export_Listado.xlsx"');
    header('Cache-Control: max-age=0');

    // Crear el escritor para Excel (Xlsx)
    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
}

?>