#!/bin/zsh
# Double-click to open the DS showroom properly (served, not file://).
cd "$(dirname "$0")"
(python3 -m http.server 8765 &>/dev/null &)
sleep 0.5
open "http://localhost:8765/v2/gallery/showroom.html"
