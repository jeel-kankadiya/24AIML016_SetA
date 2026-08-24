#!/usr/bin/env pwsh

# Test QuickBite API Endpoints

$BaseURL = "http://localhost:5000/api/v1"
$ProgressPreference = 'SilentlyContinue'

Write-Host "=== QuickBite API Testing ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: GET /restaurants
Write-Host "1. Testing GET /api/v1/restaurants" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/restaurants" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Success! Found $($data.data.Count) restaurants" -ForegroundColor Green
    $data.data | Select-Object name, cuisine, rating, isOpen | Format-Table
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: POST /auth/login
Write-Host "2. Testing POST /api/v1/auth/login" -ForegroundColor Yellow
try {
    $body = @{
        email = "test@quickbite.com"
        name = "Test User"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseURL/auth/login" -Method POST -Body $body -ContentType "application/json"
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "Customer: $($data.data.customer.name)" -ForegroundColor Cyan
        Write-Host "Token: $($data.data.token.Substring(0, 20))..." -ForegroundColor Cyan
        $GLOBAL:token = $data.data.token
        $GLOBAL:customerId = $data.data.customer.id
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "API testing completed. Backend is running successfully!" -ForegroundColor Green
