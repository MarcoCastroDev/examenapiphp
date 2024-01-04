<?php

require('fpdf186\fpdf.php');

function exportToPDF($data)
{
    $pdf = new FPDF();
    $pdf->AddPage();

    // Establecer encabezados de columna
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(40, 10, 'Warehouse');
    $pdf->Cell(40, 10, 'SKU');
    $pdf->Cell(40, 10, 'SKU name');
    $pdf->Cell(40, 10, 'Pack Constraint');
    $pdf->Cell(40, 10, 'Buffer');
    $pdf->Cell(40, 10, 'Diferencia');

    // Establecer estilo de texto regular
    $pdf->SetFont('Arial', '', 12);

    // Agregar datos a la tabla
    foreach ($data as $item) {
        $bufferValue = isset($item['buffer_sql']) ? $item['buffer_sql'] : 0;
        $diferencia = $item['pack_constraint'] - $bufferValue;

        $pdf->Ln();
        $pdf->Cell(40, 10, $item['locations_external_id']);
        $pdf->Cell(40, 10, $item['skus_external_id']);
        $pdf->Cell(40, 10, $item['sku_name']);
        $pdf->Cell(40, 10, $item['pack_constraint']);
        $pdf->Cell(40, 10, $bufferValue);
        $pdf->Cell(40, 10, $diferencia);
    }

    // Salida del PDF
    $pdf->Output('Export_PDF.pdf', 'D');
}

?>