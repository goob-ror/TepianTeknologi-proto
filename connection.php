<?php
$server = "localhost";
$database = "tepiantekno";
$username = "root";
$password = "";

$conn = mysqli_connect($server, $username, $password, $database);

if(!$conn) {
    die("Failed to connect to the database");
}
?>