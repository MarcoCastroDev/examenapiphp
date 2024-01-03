<?php
function getDatabaseConnection($server, $user, $password, $database)
{
    try {
        // Conexión PDO a SQL Server usando ODBC
        $dsn = "sqlsrv:Server=$server;Database=$database;";
        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $conn;
    } catch (PDOException $e) {
        die("Error de conexión a la base de datos: " . $e->getMessage());
    }
}
?>