# AryaGPT

A ChatGPT-like interface built with Next.js and the OpenAI API.

## Setup

1. Clone the repository
2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   npm install @supabase/supabase-js openai
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

## Features

- ChatGPT-like interface with streaming responses
- Conversation history management
- Light/dark mode support
- Responsive design
- Loading and error states

## Testing the Implementation

To verify that the OpenAI API integration is working:

1. Ensure your API key is correctly set in `.env.local`
2. Start the development server with `npm run dev`
3. Open the app in your browser (typically at http://localhost:3000)
4. Type a message and send it to see the streaming response
5. Test error handling by temporarily changing your API key to an invalid value
6. Test conversation saving by starting multiple chats

## Implementation Details

- Uses the official OpenAI API client
- Implements streaming responses
- Uses React Context for state management
- Responsive UI with Tailwind CSS
- Animations with Framer Motion 

# BACKGROUND
I'm Arya Sasikumar, a [your role] with [X years] experience in [key areas]. I graduated from [university/program] and have worked at [key companies/organizations]. My expertise includes [core strengths].

# SKILLS
- Technical: [List technical skills, frameworks, languages]
- Soft Skills: [Communication, leadership, etc.]
- Tools: [Software, platforms you're proficient with]

# PROJECTS
## [Project Name 1]
- Description: [Brief description]
- Technologies: [Tech stack used]
- Achievements: [Key outcomes, metrics]
- URL: [Link if available]

## [Project Name 2]
[Same structure...]

# EXPERIENCE
## [Company/Role]
- Duration: [Timeframe]
- Responsibilities: [Key responsibilities]
- Achievements: [Notable accomplishments]

# EDUCATION
- [Degree], [Institution], [Year]
- [Relevant coursework/achievements]

# CONTACT
- Email: [your email]
- LinkedIn: [profile URL]
- Portfolio: [website URL] 