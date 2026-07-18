import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_groq(prompt: str) -> str:
    """
    Send a prompt to Groq Llama.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            
                {
    "role": "system",
    "content": (
        "You are InsightForge AI, an expert Tourism Analytics Assistant. "
        "Answer questions using only the provided dataset. "
        "Be accurate, concise, and professional. "
        "Respond in plain text only. "
        "Do not use Markdown formatting such as #, ##, *, **, -, or bullet points. "
        "Write in clear sentences and short paragraphs."
    ),
},
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
        max_tokens=500,
    )

    answer = response.choices[0].message.content
    answer = (
    answer.replace("**", "")
          .replace("*", "")
          .replace("###", "")
          .replace("##", "")
          .replace("#", "")
    
    )
    return answer.strip()