
$body = @{
    userId = "user_1770708685349"
    projectId = "proj_1770709170121"
    categoryId = "cat_1770709275937"
    date = "2026-02-11"
    startTime = "2026-02-11T10:00:00.000Z"
    endTime = "2026-02-11T16:45:00.000Z"
    durationMinutes = 405
    description = "structure design"
    status = "PENDING"
    isBillable = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/time-entries" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Server Response: $($reader.ReadToEnd())"
    }
}
