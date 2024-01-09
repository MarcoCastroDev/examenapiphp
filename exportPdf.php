<?php

require('fpdf\fpdf.php');
// Función para generar y exportar datos a un archivo PDF
function exportToPDF($data)
{
    class PDF extends FPDF
    {
        private $fillColor;
        function Header()
        {
            $this->AddFont('CenturyGothic', '', 'CenturyGothic.php');
            $this->SetFont('CenturyGothic', '', 12);
            $this->Image('https://senorfrogs.com/es/wp-content/uploads/sites/3/elementor/thumbs/SF_MexicanFood_Logo-pj9g6cyhnmoz63fbv9hov658qdq4jeeccosiqqi2ve.png', 10, 8, 33);
            $this->Cell(0, 10, iconv('UTF-8', 'ISO-8859-1', 'LISTADO DE INVENTARIO IDEAL POR ALMACÉN'), 0, 1, 'C');
            $this->Cell(0, 10, 'p. ' . $this->PageNo(), 0, 1, 'R');
            $this->Ln(10);

            $this->fillColor = !$this->fillColor;
            $this->SetFillColor(200, 220, 255);
            $this->SetFont('CenturyGothic', '', 10);
            $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', 'Warehouse'), 1, 0, 'C', $this->fillColor);
            $this->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1', 'SKU'), 1, 0, 'C', $this->fillColor);
            $this->Cell(110, 10, iconv('UTF-8', 'ISO-8859-1', 'SKU name'), 1, 0, 'C', $this->fillColor);
            $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', 'Pack Constraint'), 1, 0, 'C', $this->fillColor);
            $this->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1', 'Buffer'), 1, 0, 'C', $this->fillColor);
            $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', 'Diferencia'), 1, 0, 'C', $this->fillColor);
            $this->Ln();
        }

        function Row($data)
        {
            $this->AddFont('CenturyGothic', '', 'CenturyGothic.php');
            $this->SetFont('CenturyGothic', '', 8);
            $fill = $this->fillColor;
            foreach ($data as $item) {
                $bufferValue = isset($item['buffer_sql']) ? $item['buffer_sql'] : 0;
                $diferencia = $item['pack_constraint'] - $bufferValue;
                // Colores para la diferencia
                $color = ($diferencia > 0) ? [0, 255, 0] : (($diferencia < 0) ? [255, 0, 0] : [0, 0, 0]);
                $this->Ln();
                $this->SetFillColor(200, 220, 255);
                $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', $item['locations_external_id']), 1, 0, 'C', $fill);
                $this->Cell(40, 10, iconv('UTF-8', 'ISO-8859-1', $item['skus_external_id']), 1, 0, 'C', $fill);
                $this->Cell(110, 10, iconv('UTF-8', 'ISO-8859-1', $item['sku_name']), 1, 0, 'S', $fill);
                $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', $item['pack_constraint']), 1, 0, 'C', $fill);
                $this->Cell(20, 10, iconv('UTF-8', 'ISO-8859-1', $bufferValue), 1, 0, 'C', $fill);
                // Cambiar color de texto para la diferencia
                $this->SetTextColor($color[0], $color[1], $color[2]);
                $this->Cell(30, 10, iconv('UTF-8', 'ISO-8859-1', $diferencia), 1, 0, 'C', $fill);
                $this->SetTextColor(0, 0, 0);
                $fill = !$fill;
            }
            $this->fillColor = !$this->fillColor;
        }
    }

    $pdf = new PDF('L', 'mm', 'Letter');
    $pdf->AddPage();
    $pdf->Row($data);
    // Salida del PDF
    $pdf->Output('Export_PDF.pdf', 'D');
}

?>