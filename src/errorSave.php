<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
ini_set("display_errors", true);
ini_set("auto_detect_line_endings", true);
ini_set("memory_limit", -1);
set_time_limit(0);
$log = "";

// Unpack POST data
$tmp = file_get_contents("php://input");
$tmp2 = parse_str($tmp,$err);
const PATH = "./data/public/JSONs/";
$body = date('Y_m_d_H_i_s');
    $filename = PATH . $body . "POSTERROR.txt";
    echo $filename;
    $empty = false;
    if(!$empty) {
        if (!file_exists($filename)) {
            try {
                $handle = fopen($filename, "w+b");

                fwrite($handle, $err);
                fclose($handle);
            }
            catch (Exception $e)
            {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                $errorHandle = fopen($filename, "w+b");
                fwrite($errorHandle, 'PHP - Caught exception in JS but could not save: ');
                fwrite($errorHandle, $e->getMessage());
                fclose($errorHandle);
            }
        }
    }