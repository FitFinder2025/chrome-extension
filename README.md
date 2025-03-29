# chrome-extension
The Chrome extension that easily interfaces with FitFinder

# primary color
rgb=216 228 238
font=Walter Turncoat

# messaging service

ext. to tab:
`{"type": "SELECTOR", "selector":true}` or `{"type": "SELECTOR", "selector":false}` (enables or disables the image selector)

tab to ext.:
`{"type": "END_STATUS", "status":"SUCCESS", "redirect": "*redirect link*"}`
or 
`{"type": "END_STATUS", "status":"FATAL_FAILURE","err":{}}` (fatal error)
or
`{"type": "END_STATUS", "status":"FATAL_UNKNOWN_FAILURE"}` (unknown error)