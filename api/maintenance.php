<?php
// Supabase connection details
$supabase_url = 'https://mkvoybjmontlczsdepaa.supabase.co';
$supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdm95Ymptb250bGN6c2RlcGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjgwODAsImV4cCI6MjA2NDA0NDA4MH0.jHEjWJfNqCgCZBy_HBDTsKYTuVZ1yFTwmsvXFZQXgco';

// Function to make API request to Supabase
function getMaintenanceRequests() {
    global $supabase_url, $supabase_key;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $supabase_url . '/rest/v1/maintenance_requests?select=*');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_key,
        'Authorization: Bearer ' . $supabase_key,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Get maintenance requests
$requests = getMaintenanceRequests();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance Requests - The Vera Imperia</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f4f8;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2d3748;
            text-align: center;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #4a5568;
        }
        tr:hover {
            background-color: #f8fafc;
        }
        .urgency-normal {
            color: #38a169;
        }
        .urgency-high {
            color: #d69e2e;
        }
        .urgency-emergency {
            color: #e53e3e;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Maintenance Requests</h1>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Service Type</th>
                    <th>Urgency</th>
                    <th>Issue</th>
                    <th>Preferred Date</th>
                    <th>Permission to Enter</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($requests as $request): ?>
                <tr>
                    <td><?php echo htmlspecialchars($request['name']); ?></td>
                    <td><?php echo htmlspecialchars($request['unit']); ?></td>
                    <td><?php echo htmlspecialchars($request['contactNumber']); ?></td>
                    <td><?php echo htmlspecialchars($request['email']); ?></td>
                    <td><?php echo htmlspecialchars($request['serviceType']); ?></td>
                    <td class="urgency-<?php echo htmlspecialchars($request['urgencyLevel']); ?>">
                        <?php echo htmlspecialchars($request['urgencyLevel']); ?>
                    </td>
                    <td><?php echo htmlspecialchars($request['issue']); ?></td>
                    <td><?php echo htmlspecialchars($request['preferredDate']); ?></td>
                    <td><?php echo $request['permissionToEnter'] ? 'Yes' : 'No'; ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>