<?php
// function exportProduct($productResult)
// {
//     $timestamp = time();
//     $filename = 'Export_' . $timestamp . '.xls';

//     header("Content-Type: application/vnd.ms-excel");
//     header("Content-Disposition: attachment; filename=\"$filename\"");

//     echo '<pre>';
//     print_r($filename);
//     echo '</pre>';

//     $isPrintHeader = false;

//     foreach ($productResult as $row) {
//         if (!$isPrintHeader) {
//             echo implode("\t", array_keys($row)) . "\n";
//             $isPrintHeader = true;
//         }
//         echo implode("\t", array_values($row)) . "\n";
//     }
//     exit();
// }
?>