# Architectural-Plan-Analysis
Part of an academic projet, the Flask app shows a locally infered LLM model, llama 3.2 vision 11B, used as an assistant to assess architectural house plans.
Current QoL (Quality of Life) features include: 
- A small chat window
- Light/Dark modes
- Visual reasoning (thanks to the multimodal model!)

Some plans for the future:
- Real-time text formatting
- Chat history & new chats
- Better UI

# Prerequisites
- ollama app and the model you want to run
- python >= 3.8 (to be compatible with ollama)

# Install guide
  1. Create a virtual environment: `python -m venv name`
  2. Activate the virtual environment: `.\name\Scripts\activate`
  3. Install dependencies: `pip install -r requirements.txt`
  4. Run the 'run.py' file: `python run.py`
