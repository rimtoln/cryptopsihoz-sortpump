import http.server, os, sys

OUT = os.path.join(os.path.dirname(__file__), 'frames')
ROOT = sys.argv[2] if len(sys.argv) > 2 else '.'
os.makedirs(OUT, exist_ok=True)


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def do_POST(self):
        n = int(self.headers['Content-Length'])
        name = os.path.basename(self.path)
        with open(os.path.join(OUT, name), 'wb') as f:
            f.write(self.rfile.read(n))
        self.send_response(200)
        self.end_headers()

    def log_message(self, *a):
        pass


http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1])), H).serve_forever()
