<?php
header('Content-Type: application/json');

function writeToLogFile($requestData, $response)
{
    $logFilePath = 'form_submissions.log';
    $logEntry = sprintf(
        "[%s] Request: %s | Response: %s\n",
        date('Y-m-d H:i:s'),
        json_encode($requestData),
        json_encode($response)
    );
    file_put_contents($logFilePath, $logEntry, FILE_APPEND);
}

function connectToDatabase()
{
    try {
        $connection = new PDO('sqlite:form_data.db');
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $connection;
    } catch (PDOException $error) {
        sendJsonResponse(['success' => false, 'message' => 'Не удалось подключиться к базе данных']);
        exit;
    }
}

function sendJsonResponse($response)
{
    echo json_encode($response);
}

function getRequestData()
{
    $rawInput = file_get_contents('php://input');
    $parsedData = json_decode($rawInput, true);

    if (!$parsedData) {
        sendJsonResponse(['success' => false, 'message' => 'Данные не получены']);
        exit;
    }

    return $parsedData;
}

function saveFormData($dbConnection, $formData)
{
    try {
        $query = $dbConnection->prepare(
            "INSERT INTO form_submissions (first_name, last_name, email, phone, time_selector, select_price, comments, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $query->execute([
            $formData['firstName'] ?? '',
            $formData['lastName'] ?? '',
            $formData['email'] ?? '', // +
            $formData['phone'] ?? '',// +
            $formData['serviceTime'] ?? '',
            $formData['price'] ?? '',
            $formData['comments'] ?? '',
            $formData['country'] ?? ''// +
        ]);

        return ['success' => true, 'redirect_url' => '/Thanks.html', 'message' => 'Форма успешно отправлена.'];
    } catch (Exception $error) {
        return ['success' => false, 'message' => 'Ошибка при сохранении данных формы'];
    }
}

$dbConnection = connectToDatabase();
$requestData = getRequestData();
$response = saveFormData($dbConnection, $requestData);
writeToLogFile($requestData, $response);
sendJsonResponse($response);
?>
