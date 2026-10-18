# Lokaler Server für die PWA (richtige MIME-Typen, kein Cache für Code).
# Aufruf im Ordner prototype:  python3 tools/serve-pwa.py 8765
# Fürs Handy über HTTPS (ohne Konto):  cloudflared tunnel --url http://localhost:8765   → https://….trycloudflare.com (temporär)
import http.server, functools, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".webmanifest": "application/manifest+json", ".js": "text/javascript; charset=utf-8", ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8"}
    def end_headers(self):
        if self.path.split("?")[0].endswith((".html", ".js", ".css", ".webmanifest", "/")): self.send_header("Cache-Control", "no-cache")
        super().end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
print("Weltuntergangs-Spiel: http://localhost:%d/  (Strg+C beendet)" % port)
http.server.ThreadingHTTPServer(("0.0.0.0", port), functools.partial(H, directory=ROOT)).serve_forever()
