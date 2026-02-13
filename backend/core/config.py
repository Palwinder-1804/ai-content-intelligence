import torch

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

MAX_CHUNK_WORDS = 600
TOP_K_RESULTS = 5
