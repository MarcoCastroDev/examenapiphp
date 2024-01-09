<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Función para generar y exportar datos a un archivo CSV
function exportToExcel($data)
{
    // Crear una instancia de PhpSpreadsheet
    $spreadsheet = new Spreadsheet();

    // Configurar estilo para el encabezado
    $headerStyle = [
        'font' => [
            'name' => 'Century Gothic',
            'size' => 12,
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

    // Agregar logo y título en la fila 3
    $logoPath = 'https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png';
    $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing();
    $drawing->setImageResource(imagecreatefrompng($logoPath));
    $drawing->setWidth(120);
    $drawing->setHeight(50);
    $drawing->setCoordinates('A1');
    $drawing->setWorksheet($sheet);

    $sheet->mergeCells('A2:F2');
    $sheet->getRowDimension(2)->setRowHeight(30);
    $sheet->setCellValue('A2', 'Listado de Inventario ideal por almacén')->getStyle('A2')->applyFromArray($headerStyle);

    // Configurar el encabezado
    $sheet->setCellValue('A4', 'Warehouse')->getStyle('A4')->applyFromArray($headerStyle);
    $sheet->setCellValue('B4', 'SKU')->getStyle('B4')->applyFromArray($headerStyle);
    $sheet->setCellValue('C4', 'SKU name')->getStyle('C4')->applyFromArray($headerStyle);
    $sheet->setCellValue('D4', 'Pack Constraint')->getStyle('D4')->applyFromArray($headerStyle);
    $sheet->setCellValue('E4', 'Buffer')->getStyle('E4')->applyFromArray($headerStyle);
    $sheet->setCellValue('F4', 'Diferencia')->getStyle('F4')->applyFromArray($headerStyle);

    // Configurar datos
    $row = 5;
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
        $sheet->getStyle('F' . $row)->getFont()->getColor()->setRGB($color);
        $row++;
    }

    // Configurar estilos adicionales
    $styleArray = [
        'font' => [
            'name' => 'Century Gothic',
            'size' => 12,
            // 'color' => ['rgb' => '000000'],
        ],
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
    header('Content-Disposition: attachment;filename="Export_Excel.xlsx"');
    header('Cache-Control: max-age=0');

    // Crear el escritor para Excel (Xlsx)
    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit();
}

?>