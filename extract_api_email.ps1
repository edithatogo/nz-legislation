# Extract full content of NZ Legislation API emails from VUW inbox

Write-Host "=========================================="
Write-Host "Extracting NZ Legislation API Email Content"
Write-Host "=========================================="
Write-Host ""

# Initialize Outlook COM
$outlook = New-Object -ComObject Outlook.Application
$namespace = $outlook.GetNameSpace("MAPI")

# Find VUW mailbox
$vuwMailbox = $null
foreach ($store in $namespace.Stores) {
    if ($store.DisplayName -like "*vuw.ac.nz*") {
        $vuwMailbox = $store
        break
    }
}

if (!$vuwMailbox) {
    Write-Host "ERROR - Could not find VUW mailbox"
    exit 1
}

# Get Inbox
$vuwRoot = $vuwMailbox.GetRootFolder()
$inbox = $vuwRoot.Folders.Item("Inbox")

Write-Host "OK - Accessing VUW Inbox..."
Write-Host ""

# Target emails to extract
$targetSubjects = @(
    "New Legislation API available now",
    "[UNCLASSIFIED] - Update on API and RSS feeds for legislation.govt.nz"
)

Write-Host "Searching for target emails..."
Write-Host ""

foreach ($targetSubject in $targetSubjects) {
    Write-Host "Looking for:" $targetSubject
    Write-Host "----------------------------------------"
    
    foreach ($email in $inbox.Items) {
        if ($email.Subject -like "*$targetSubject*") {
            Write-Host ""
            Write-Host "FOUND EMAIL:"
            Write-Host "============"
            Write-Host "Subject:" $email.Subject
            Write-Host "From:" $email.SenderName
            Write-Host "Date:" $email.ReceivedTime
            Write-Host "To:" $email.To
            Write-Host ""
            Write-Host "BODY:"
            Write-Host "====="
            Write-Host $email.Body
            Write-Host ""
            
            if ($email.Attachments.Count -gt 0) {
                Write-Host "ATTACHMENTS:" $email.Attachments.Count
                foreach ($att in $email.Attachments) {
                    Write-Host "  -" $att.FileName
                }
                Write-Host ""
            }
            
            Write-Host ""
            Write-Host "=========================================="
            Write-Host ""
        }
    }
}

# Cleanup
$namespace = $null
$outlook = $null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Extraction complete!"
