import json
from dotenv import load_dotenv
from mira_sdk import MiraClient, Flow
import os

# Load environment variables
load_dotenv()

# Initialize MiraClient with API key from environment variable
client = MiraClient(config={"API_KEY": os.getenv("MIRA_API_KEY")})

# Define the flow
flow = Flow(source="./today.yaml")

# Define the list of topics for input2
topics = ["Technology","Business", "Politics", "Health", "Science"]
# "Business", "Politics", "Health", "Science"
def process_raw_response(raw_response):
    """
    Process the raw API response to structure the news items without bifurcation.
    """
    result = raw_response.get("result", "")
    print(raw_response)
    news_items = result.split("\n\n")  # Split the response into news items using \n\n as the separator
    structured_news = []
    
    for item in news_items:
        structured_news.append({"news": item.strip()})  # Store each news item as a single string
    
    return structured_news



# Iterate over topics, process, and save responses
for topic in topics:
    input_dict = {"input1": "today", "input2": topic}
    raw_response = client.flow.test(flow, input_dict)  # Call the API for the current topic
    print(raw_response)
    # Process the raw response
    structured_news = process_raw_response(raw_response)
    
    # Save the structured news to a JSON file
    filename = f"news_processed_{topic.lower()}.json"
    with open(filename, "w") as f:
        json.dump(structured_news, f, indent=2)

    print(f"Processed and saved news for {topic} to {filename}")
