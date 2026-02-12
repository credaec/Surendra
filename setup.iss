[Setup]
AppName=Credence Time Tracker
AppVersion=1.0
DefaultDirName={autopf}\CredenceTimeTracker
DefaultGroupName=Credence Time Tracker
OutputDir=.
OutputBaseFilename=CredenceTimeTrackerSetup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
; Core application files
Source: "server\*"; DestDir: "{app}\server"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "dist\*"; DestDir: "{app}\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "service\*"; DestDir: "{app}\service"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "prisma\*"; DestDir: "{app}\prisma"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: ".env"; DestDir: "{app}"; Flags: ignoreversion
Source: "dev.db"; DestDir: "{app}"; Flags: ignoreversion

; Node.js runtime (Portable)
Source: "node.exe"; DestDir: "{app}"; Flags: ignoreversion

; Dependencies (Assuming node_modules is populated and pruned for production)
Source: "node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs

[Run]
; Install the Windows Service
Filename: "{app}\node.exe"; Parameters: "service/install.js"; Flags: runhidden waituntilterminated

[UninstallRun]
; Uninstall the Windows Service
Filename: "{app}\node.exe"; Parameters: "service/uninstall.js"; Flags: runhidden waituntilterminated

[Icons]
Name: "{group}\Time Tracker Web Interface"; Filename: "http://localhost:3000"
Name: "{commondesktop}\Time Tracker"; Filename: "http://localhost:3000"
