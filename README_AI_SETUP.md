# AI Chat Setup Instructions

The portfolio includes an AI-powered chat feature that can answer questions about Mark's experience, skills, and background.

## Setup OpenAI API (Optional but Recommended)

For the best AI experience, you can use OpenAI's API:

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Open `assets/js/config.json`
3. Replace `YOUR_API_KEY_HERE` with your actual API key

**Note:** The chat will work without an API key using a fallback pattern-matching system, but responses will be more limited.

## How It Works

- **With API Key**: Uses GPT-3.5-turbo to generate intelligent, contextual responses
- **Without API Key**: Uses pattern matching to answer common questions about experience, skills, projects, education, and contact info

## Privacy & Security

- The API key is stored locally in `config.json`
- Never commit your API key to version control
- Add `assets/js/config.json` to your `.gitignore` file

## Cost

OpenAI API usage is pay-as-you-go. For a portfolio chat, costs are typically very low (a few cents per month for normal usage).

