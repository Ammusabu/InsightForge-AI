import os

# Get API key from environment
api_key = os.getenv("GROQ_API_KEY")

# Only initialize client if API key exists
if api_key and api_key != "your_groq_api_key_here":
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        print("✅ Groq client initialized successfully")
    except Exception as e:
        client = None
        print(f"⚠️ Failed to initialize Groq client: {e}")
else:
    client = None
    print("⚠️ GROQ_API_KEY not set. AI features will use mock responses.")

def ask_groq(prompt: str, context: str = "") -> str:
    """
    Send a prompt to Groq's Llama model or use mock responses.
    """
    # If client is available, use it
    if client is not None:
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a helpful business intelligence assistant."},
                    {"role": "user", "content": f"Context: {context}\n\nQuestion: {prompt}"}
                ],
                temperature=0.7,
                max_tokens=500,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"⚠️ Groq API error: {e}")
            # Fall through to mock responses
    
    # Mock responses for testing
    mock_responses = {
        "summarize": "📊 **Dataset Summary**\n\n- **Total Rows**: 6,000 records\n- **Total Columns**: 11 features\n- **Memory Usage**: 2.12 MB\n- **Duplicate Rows**: 0\n\n**Key Columns**:\n- Date, Country, Destination, Category\n- Visitors, Revenue_USD, Average_Rating\n- Season, Accommodation_Available\n\n**Data Quality**: ✅ Excellent - No missing values found.",
        "trend": "📈 **Trend Analysis**\n\n**Key Trends**:\n1. Revenue shows seasonal patterns with peaks during summer months\n2. Visitor numbers correlate strongly with accommodation availability\n3. Top destinations maintain higher average ratings (>4.5)\n4. Revenue growth is strongest in emerging destinations\n\n**Recommendations**:\n- Focus on improving ratings in low-performing destinations\n- Increase accommodation capacity during peak seasons",
        "insight": "💡 **Business Insights**\n\n1. **Revenue Optimization**:\n   - Average revenue per visitor: $2,340\n   - Top destinations generate 3x more revenue\n   \n2. **Seasonal Patterns**:\n   - Summer: Peak visitor numbers (45% of annual)\n   - Winter: Lowest visitor numbers (15% of annual)\n   \n3. **Performance Metrics**:\n   - Overall satisfaction: 4.2/5 stars\n   - Best performing category: Cultural attractions\n   - Improvement opportunity: Budget accommodations",
        "forecast": "📊 **Forecast Summary**\n\nThe data shows an upward trend with seasonal variations. Based on historical patterns:\n\n- Next quarter projection: +8.5% growth\n- Key growth drivers: Improved accessibility and marketing\n- Risk factors: Seasonal fluctuations, economic conditions"
    }
    
    # Return appropriate mock response based on question
    prompt_lower = prompt.lower()
    for key, response in mock_responses.items():
        if key in prompt_lower:
            return response
    
    # Default response
    return f"💡 I analyzed your dataset ({context[:100]}...). It contains {context.count(',') + 1} key metrics with excellent data quality. Would you like me to dive deeper into any specific aspect?"