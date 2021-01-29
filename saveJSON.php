<?php
/**
 * Created by PhpStorm.
 * User: Matt Jaquiery
 * Date: 19/03/2019
 * Time: 10:28
 *
 */
/*
The $_POST[] array will contain a JSON string which decomposes into:
{
    metadata:
        studyId: study identifier (becomes eid below)
        studyVersion: study version
        idCode: participant id
    data:
        JSON string to write to file
    privateData:
        JSON string to write to a protected file
}
Data are saved in the ./data/[public|private]/raw directory as specified in the incoming metadata.
An JSON string is returned with the following properties:
{
    error: description of any error which occurred,
    code: response code,
    content: message
}
*/
//phpinfo();
//error_reporting(0);
error_reporting(E_ALL);
ini_set("display_errors", 1);
ini_set("display_errors", true);
ini_set("auto_detect_line_endings", true);
ini_set("memory_limit", -1);
set_time_limit(0);
$log = "";
function sulk($err, $code) {
    $out = array(
        "error" => $err,
        "code" => $code,
    );
    die(json_encode($out));
}
// Unpack POST data
$tmp = file_get_contents("php://input");
$tmp2 = parse_str($tmp,$json);
$json = json_decode($json["data"],true);
$jsonRaw = json_decode($json["processedData"],true);
$id = $jsonRaw["id"];
//$id = $json["processedData"]["advisors"]["participantId"]; 

const PATH = "./data/public/JSONs/";
$body = date('Y_m_d_H_i_s') . "_" . $id;
    //$filename = PATH . $body . ".json";
    //echo $filename;
    $empty = false;
    $folder = PATH . $id;
    if (!is_dir($folder))
    {
        mkdir($folder,0755);
    }
    $filename = $folder . "/" . $body . ".json";
    if(!$empty) {
        if (!file_exists($filename)) {
            try {
                $handle = fopen($filename, "w+b");
                stream_copy_to_stream(stripslashes(json_encode($json)), $handle);
                fwrite($handle, stripslashes(json_encode($json)));
                fclose($handle);
            }
            catch (Exception $e)
            {
                echo 'Caught exception: ',  $e->getMessage(), "\n";
                $errorFile = PATH . $body . "_ERROR.txt";
                $errorHandle = fopen($errorFile, "w+b");
                fwrite($errorHandle, 'PHP - Caught exception: ');
                fwrite($errorHandle, $e->getMessage());
                fclose($errorHandle);
                sulk("Unable to create file.", 500);
            }
        } else
            sulk("File already exists!", 500);
    }
//}
// Send back the all clear
die(json_encode(array(
    "error" => "",
    "code" => 200,
    "content" => "Data saved successfully."
)));