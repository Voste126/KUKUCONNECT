import time
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openai
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

openai.api_key = os.getenv('OPENAI_API_KEY')
# Debug print to verify the key is loaded 
# print(f"Loaded OpenAI API key: {os.getenv('OPENAI_API_KEY')}")
class ChatbotResponseView(APIView):
    last_request_time = 0
    min_interval = 1  # Minimum interval between requests in seconds

    def post(self, request):
        current_time = time.time()
        if current_time - self.last_request_time < self.min_interval:
            return Response({"error": "Rate limit exceeded. Please wait and try again."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        try:
            user_input = request.data.get('user_input')
            if not user_input:
                return Response({"error": "No user input provided"}, status=status.HTTP_400_BAD_REQUEST)

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=150
            )
            response_text = response.choices[0].message['content'].strip()
            self.last_request_time = current_time
            return Response({"response": response_text}, status=status.HTTP_200_OK)
        except openai.error.OpenAIError as e:
            logger.error(f"OpenAI error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Error processing chatbot response: {str(e)}")
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
