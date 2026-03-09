# Search VUW Email for NZ Legislation API correspondence
# Uses Outlook COM automation with direct iteration

Write-Host "=========================================="
Write-Host "Searching VUW Email for API Credentials"
Write-Host "=========================================="
Write-Host ""

# Initialize Outlook COM object
$outlook = New-Object -ComObject Outlook.Application
Write-Host "OK - Outlook COM initialized"

# Get MAPI namespace
$namespace = $outlook.GetNameSpace("MAPI")
Write-Host "OK - MAPI namespace loaded"
Write-Host ""

# Find VUW mailbox
$vuwMailbox = $null
foreach ($store in $namespace.Stores) {
    if ($store.DisplayName -like "*vuw.ac.nz*") {
        $vuwMailbox = $store
        Write-Host "OK - Found VUW mailbox:" $store.DisplayName
        break
    }
}

if (!$vuwMailbox) {
    Write-Host "ERROR - Could not find VUW mailbox"
    exit 1
}

# Get Inbox folder
$vuwRoot = $vuwMailbox.GetRootFolder()
$inbox = $vuwRoot.Folders.Item("Inbox")

if (!$inbox) {
    Write-Host "ERROR - Could not access Inbox"
    exit 1
}

Write-Host "OK - Accessing Inbox..."
Write-Host "Total items in Inbox:" $inbox.Items.Count
Write-Host ""

# Search terms
$searchTerms = @("legislation", "API", "credentials", "access", "documentation", "developer", "PCO", "therapeutic", "Medicines")

Write-Host "Searching inbox for API-related emails..."
Write-Host ""

$foundEmails = @()
$counter = 0

# Iterate through emails (last 500 for performance)
$maxItems = [Math]::Min(500, $inbox.Items.Count)
Write-Host "Scanning last" $maxItems "emails..."
Write-Host ""

for ($i = $inbox.Items.Count; $i -gt ($inbox.Items.Count - $maxItems); $i--) {
    $counter++
    if ($counter % 50 -eq 0) {
        Write-Host "Scanned:" $counter "of" $maxItems
    }
    
    try {
        $email = $inbox.Items.Item($i)
        
        # Check subject and body for search terms
        $subject = $email.Subject
        $body = $email.Body
        
        foreach ($term in $searchTerms) {
            if ($subject -like "*$term*" -or $body -like "*$term*") {
                # Check if this looks like it could be API-related
                $isRelevant = $false
                
                if ($subject -like "*legislation*" -or $subject -like "*API*" -or $subject -like "*access*" -or $subject -like "*credential*") {
                    $isRelevant = $true
                }
                
                if ($body -like "*legislation.govt.nz*" -or $body -like "*API key*" -or $body -like "*developer*") {
                    $isRelevant = $true
                }
                
                if ($isRelevant) {
                    $emailInfo = [PSCustomObject]@{
                        Subject = $subject
                        Sender = $email.SenderName
                        Date = $email.ReceivedTime
                        HasAttachments = $email.Attachments.Count -gt 0
                    }
                    $foundEmails += $emailInfo
                    Write-Host "  FOUND:" $subject "|" $email.SenderName "|" $email.ReceivedTime
                }
                break
            }
        }
    } catch {
        # Skip emails that can't be accessed
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "Search Results"
Write-Host "=========================================="
Write-Host ""

if ($foundEmails.Count -eq 0) {
    Write-Host "No API-related emails found in last" $maxItems "emails"
} else {
    Write-Host "FOUND:" $foundEmails.Count "potential API credential emails"
    Write-Host ""
    
    # Export to CSV
    $outputFile = Join-Path $PSScriptRoot "vuw_api_emails.csv"
    $foundEmails | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8
    Write-Host "Results exported to:" $outputFile
    Write-Host ""
    
    # Show results
    Write-Host "Emails found:"
    Write-Host "-------------"
    $foundEmails | Sort-Object Date -Descending | Format-Table -Property Date, Subject, Sender, HasAttachments -AutoSize | Out-String | Write-Host
}

# Cleanup
$namespace = $null
$outlook = $null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host ""
Write-Host "Search complete!"
