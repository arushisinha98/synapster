"""
protocol_agent.py
Synapster hackathon — LLM loop
--------------------------------
Receives a patient ailment string, calls the Anthropic API (with web search
for real paper citations), and returns a structured brain stimulation protocol
JSON that the dashboard can consume directly.

Usage (stand-alone test):
    python protocol_agent.py "treatment-resistant depression"

Usage (as a Flask API endpoint):
    pip install flask
    python protocol_agent.py --serve
    Then POST to http://localhost:5001/protocol  with JSON body {"ailment": "..."}
"""

import json
import os
import sys
import argparse
from dotenv import load_dotenv
import anthropic

# ── Load API key from .env ────────────────────────────────────────────────────
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise EnvironmentError(
        "ANTHROPIC_API_KEY not found. Add it to your .env file:\n"
        "  ANTHROPIC_API_KEY=sk-ant-..."
    )

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """
You are a neuromodulation expert specialising in non-invasive brain stimulation.

Given a patient ailment, you recommend an evidence-based brain stimulation protocol.

COORDINATE SYSTEM:
- Use MNI mm space.
- Use the aparc (Desikan-Killiany) parcellation — 68 cortical regions.
- Electrode positions should correspond to realistic cortical surface locations
  within this atlas (e.g. dlPFC is approximately [±30, 45, 30] in MNI).

OUTPUT FORMAT:
Return ONLY a valid JSON object. No preamble, no markdown, no backticks.
The JSON must match this schema exactly:

{
  "modality": "tDCS" | "tACS" | "TI",
  "electrodes": [
    {"pos": [x, y, z], "current_mA": 2.0, "freq_Hz": 10}
  ],
  "rationale": "A concise clinical rationale for this protocol (2-4 sentences).",
  "papers": ["doi or full url", ...]
}

RULES:
- modality must be one of: tDCS, tACS, TI
- Include 2 electrodes minimum (anode + cathode for tDCS/TI; at least 2 for tACS)
- freq_Hz should be 0 for tDCS, and the stimulation frequency for tACS/TI
- current_mA is typically 1.0–2.0 mA for tDCS/tACS, up to 4.0 mA for TI
- papers must be real, verifiable DOIs or URLs — use web search to confirm them
- Return ONLY the JSON. Absolutely nothing else.
"""

# ── Core function ─────────────────────────────────────────────────────────────
def get_protocol(ailment: str) -> dict:
    """
    Call Claude with web search enabled, parse and return the protocol dict.
    Raises ValueError if the response cannot be parsed as valid JSON.
    """
    print(f"[protocol_agent] Querying Claude for ailment: '{ailment}'")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        tools=[
            {
                "type": "web_search_20250305",
                "name": "web_search",
            }
        ],
        messages=[
            {
                "role": "user",
                "content": (
                    f"Patient ailment: {ailment}\n\n"
                    "Search for recent clinical evidence. Return only the protocol JSON."
                ),
            }
        ],
    )

    # Extract text blocks from the response (ignore tool_use blocks)
    text_blocks = [
        block.text
        for block in response.content
        if hasattr(block, "text")
    ]

    if not text_blocks:
        raise ValueError("Claude returned no text content. Check your API key and quota.")

    raw_text = "\n".join(text_blocks).strip()

    # Strip accidental markdown fences just in case
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        protocol = json.loads(raw_text)
    except json.JSONDecodeError as e:
        # Attempt to salvage if there's preamble
        if "{" in raw_text:
            raw_text = raw_text[raw_text.index("{") :]
            raw_text = raw_text.replace(raw_text.split("}")[-1], "").strip()  # Remove trailing garbage
            if not raw_text.endswith("}"): raw_text += "}"
            try:
                protocol = json.loads(raw_text)
            except json.JSONDecodeError:
                pass  # Will raise the original error below
        raise ValueError(
            f"Could not parse Claude's response as JSON.\n"
            f"Raw response:\n{raw_text}\n\nError: {e}"
        )

    print("[protocol_agent] Protocol received successfully.")
    return protocol


# ── Flask server (optional) ───────────────────────────────────────────────────
def run_server():
    """
    Tiny Flask API so Martin's dashboard can call POST /protocol.
    Install flask first: pip install flask flask-cors
    """
    try:
        from flask import Flask, request, jsonify
        from flask_cors import CORS
    except ImportError:
        print("Flask not installed. Run: pip install flask flask-cors")
        sys.exit(1)

    app = Flask(__name__)
    CORS(app)  # Allow the Vite dashboard (different port) to call this

    @app.route("/protocol", methods=["POST"])
    def protocol_endpoint():
        body = request.get_json(force=True)
        ailment = body.get("ailment", "").strip()

        if not ailment:
            return jsonify({"error": "Missing 'ailment' field in request body."}), 400

        try:
            protocol = get_protocol(ailment)
            return jsonify(protocol)
        except ValueError as e:
            return jsonify({"error": str(e)}), 500

    print("[protocol_agent] Starting Flask server on http://localhost:5001")
    print("[protocol_agent] Dashboard should POST to http://localhost:5001/protocol")
    app.run(port=5001, debug=False)


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Synapster LLM protocol agent")
    parser.add_argument(
        "ailment",
        nargs="?",
        help="Patient ailment string (e.g. 'treatment-resistant depression')",
    )
    parser.add_argument(
        "--serve",
        action="store_true",
        help="Run as a Flask HTTP server instead of a one-shot CLI call",
    )
    args = parser.parse_args()

    if args.serve:
        run_server()
    elif args.ailment:
        protocol = get_protocol(args.ailment)
        print(json.dumps(protocol, indent=2))
    else:
        parser.print_help()
