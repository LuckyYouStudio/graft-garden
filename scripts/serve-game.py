"""Serve the public game with CORS so the official simulator can fetch its manifest."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
from functools import partial

class GameHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=4199)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--directory", default=str(Path(__file__).resolve().parents[1] / "fruit-machine-ui"))
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.bind, args.port), partial(GameHandler, directory=args.directory))
    print(f"Graft Garden: http://{args.bind}:{args.port}/", flush=True)
    server.serve_forever()

