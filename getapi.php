<?php
function fetchDataFromAPI($token, $endpoint)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Content-Type: application/json",
    ]);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        echo 'Error al conectarse al Endpoint';
        return null;
    } else {
        curl_close($ch);
    }

    return json_decode($response, true);
}

?>