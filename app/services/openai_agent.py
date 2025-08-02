
# contains the core logic of the AI chatbot behind the routes (user & finance)?

import os
from dotenv import load_dotenv
import openai

# Load environment variables from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# gpt-3.5-turbo (cheaper) or gpt-4o (smarter, more impressive), possibility of change depending on use
MODEL = "gpt-4o"


def get_financial_advice_from_chatbot(user_message: str) -> str:
    """
    Sends user message to the AI chatbot and returns the assistant's response.
    """

    system_prompt = {
        "role": "system",
        "content": (  # make this respond in arabic maybe?
            "You are a friendly and culturally aware financial advisor for young people in Saudi Arabia. "
            "You analyze the input given by the user, and recommend them stocks to invest in."
            "Prioritize local Saudi companies/stocks, and give a brief explanation on why and why not to invest in "
            "Get your stock information from www.saudiexchange.sa mainly, don't use other sources unless necessary."
            "the companies you recommend."
            "Mention how the company is doing, how it operates, what are its growth potentials, competitors, "
            "risk levels, how it'll the user achieve their goals, and whatever else is relevant to the user."
            "Be supportive, never judgmental. Keep advice short and practical "
            "Respond in Arabic if user input is in Arabic, otherwise respond in English."
            "Do not under any circumstances use any markdown or formatting tokens — no *bold*, _underline_, "
            "italics, backticks, headings, bullet markers, or any other markup. Return plain unstyled text only."
            "When the user chooses a company to invest in or asks you for more information on a specific company, "
            "make sure to list the risk tolerance "
            "(considerate/medium/high) and return on investment in percentage."
        )
    }

    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[
                system_prompt,
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=300
        )

        return response.choices[0].message["content"]

    except Exception as e:
        return f"Sorry, I couldn't generate advice at the moment. Error: {str(e)}"