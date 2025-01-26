from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mira_sdk import MiraClient, Flow
from dotenv import load_dotenv
import os
import json
import http.client
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize MiraClient
client = MiraClient(config={"API_KEY": os.getenv("MIRA_API_KEY")})

# Define the flow
flow = Flow(source="./today.yaml")

# Initialize FastAPI app
app = FastAPI()

# Add CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development (replace with specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Input model for API requests
class NewsRequest(BaseModel):
    input1: str
    input2: str
    input3: str

# Helper function to process raw responses
def process_raw_response(raw_response):
    try:
        result = raw_response.get("result", "")
        if not result:
            raise ValueError("Empty result in response")
        
        news_items = result.split("\n\n")  # Split by double newline
        structured_news = [item.strip() for item in news_items]
        return structured_news

    except Exception as e:
        raise ValueError(f"Error processing response: {str(e)}")

# Helper function to translate news items
def translate_news(news_items, target_lang="fr"):
    try:
        conn = http.client.HTTPSConnection("openl-translate.p.rapidapi.com")
        translated_news = []

        for item in news_items:
            payload = json.dumps({"target_lang": target_lang, "text": item})
            headers = {
                'x-rapidapi-key': os.getenv("RAPIDAPI_KEY"),
                'x-rapidapi-host': "openl-translate.p.rapidapi.com",
                'Content-Type': "application/json"
            }
            conn.request("POST", "/translate", body=payload, headers=headers)

            res = conn.getresponse()
            data = res.read()

            # Parse the response
            response = json.loads(data.decode("utf-8"))
            translated_text = response.get("translatedText", "")

            if not translated_text:
                raise ValueError("Translation API returned an empty response.")

            translated_news.append(translated_text)

        return translated_news

    except Exception as e:
        raise ValueError(f"Error during translation: {str(e)}")

# Route to get news
@app.post("/get-news")
async def get_news(request: NewsRequest):
    try:
        # Validate input values
        if not request.input1 or not request.input2 or not request.input3:
            raise HTTPException(status_code=400, detail="Both 'input1' and 'input2' are required and input3 are required.")

        # Call the Mira API
        raw_response = client.flow.test(flow, request.model_dump())
        if not raw_response:
            raise HTTPException(status_code=500, detail="Failed to fetch news from Mira API.")

        # Process the response
        rnews = process_raw_response(raw_response)
        news=[{"news": item.strip() } for item in rnews]
        print(news)

        # Translate the news
        print(request.input3)
        print("&&&")
        rtranslated_news = translate_news(rnews,request.input3)
        # translated_news=[{"news": item.strip() } for item in rtranslated_news]
        translated_news = [{"translated_news": item.strip(), "topic": request.input2} for item in rtranslated_news]

        print("dkgnidrgondth",translated_news)
        # Return structured and translated news
        return {
            "status": "success",
            "input": request.model_dump(),
            "news": news,
            "translated_news": translated_news
        }

    except HTTPException as http_err:
        # Handle expected errors
        raise http_err

    except ValueError as value_err:
        # Handle processing or translation errors
        raise HTTPException(status_code=500, detail=f"Error: {str(value_err)}")

    except Exception as general_err:
        # Catch unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(general_err)}")