import stanza
import sys
import json

# Initialize Stanza pipeline
nlp = stanza.Pipeline(lang='en', processors='tokenize,sentiment')

def get_sentiment(text):
    doc = nlp(text)
    sentiments = [sentence.sentiment for sentence in doc.sentences]
    return sentiments

if __name__ == '__main__':
    input_text = sys.argv[1]
    sentiment_scores = get_sentiment(input_text)
    print(json.dumps(sentiment_scores))
