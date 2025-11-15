from llama_cpp import Llama


# MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"
# MODEL_NAME = "TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
# MODEL_NAME = "mistralai/Mistral-Nemo-Instruct-2407"
MODEL_NAME = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"

# ---------------------------
# Load Mistral Model & Tokenizer
# ---------------------------
print("Loading Mistral-7B model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,     # use float16 for speed
    device_map="auto"              # auto-assign GPU/CPU/MPS
)

print("Model loaded successfully!\n")


# ---------------------------
# Summarization Function
# ---------------------------
def summarize_text(text: str) -> str:

    prompt = f"""
You are a helpful assistant that summarizes text clearly.

Summarize the following text into:

1. Three short bullet points  
2. One-sentence TL;DR  
3. Three short tags  

Text:
{text}

Return the response in clean readable format.
"""

    inputs = tokenizer(prompt, return_tensors="pt", truncation=True).to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=350,
        temperature=0.3,
        do_sample=False
    )

    summary = tokenizer.decode(output[0], skip_special_tokens=True)
    return summary


# ---------------------------
# Test the summarizer
# ---------------------------
if __name__ == "__main__":
    sample_text = """
    Artificial intelligence is transforming every industry. 
    Machine learning enables automated decision-making 
    and unlocks powerful new applications across healthcare, 
    education, finance, and security.
    """

    print("\n--- SUMMARY OUTPUT ---\n")
    result = summarize_text(sample_text)
    print(result)



#     from llama_cpp import Llama

# MODEL_NAME = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF/mistral-7b-instruct-v0.1.Q4_K_M.gguf"

# llm = Llama(model_path=MODEL_NAME, n_ctx=4096, n_threads=4)

# text = "Your long text here..."

# resp = llm(
#     f"Summarize this:\n{text}",
#     max_tokens=300,
#     temperature=0.6,
# )

# print(resp["choices"][0]["text"])