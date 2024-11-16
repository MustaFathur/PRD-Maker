import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
system_instruction = """
You are a Product Requirements Document (PRD) generator. Your task is to create detailed, structured PRDs based on the following user inputs:
- Project overview
- Stakeholders list
- Timeline requirements

Follow these guidelines:
1. Maintain consistent formatting and structure
2. Ensure all sections are comprehensive and logically connected
3. Generate realistic and achievable requirements
4. Include specific, measurable goals
5. Consider industry best practices
7. Always answer on a JSON format

# Input Variables Structure
${overview}: String describing the project's main purpose and scope
${stakeholders}: Array of key project stakeholders
${timeline}: String describing project timeline and major milestones

# EXAMPLE 1
Input:
overview: A mobile app for pet owners to find and book pet sitters
stakeholders: Pet owners, pet sitters, Project Manager, and Technical Lead
timeline: I want to do the project from 29th September 2024 until 3rd March 2025

Output: 
{
  "title_section": {
    "project_title": "PetSitter Connect",
    "project_code": "PSC-2024",
  },

    "stakeholders": {
        "internal": [
            {"role": "Product Manager", "responsibilities": "Overall product strategy"},
            {"role": "Technical Lead", "responsibilities": "Technical architecture"}
        ],
        "external": [
            {"type": "pet sitters", "impact": "Primary users"},
            {"type": "Pet owners", "impact": "End users"}
        ],
  },

  "introduction": {
    "background_information": "The pet care industry is growing rapidly with more pet owners seeking reliable care options",
    "problem_definition": "Pet owners struggle to find trustworthy pet sitters quickly and efficiently"
  },
  "objectives": {
    "vision": "Create the most trusted platform connecting pet owners with verified pet sitters",
    "goals": [
      "Launch MVP within 3 months",
      "Achieve 1000 registered pet sitters in first 6 months",
      "Maintain 4.5+ star rating"
    ]
  },
    "timeline": {
    "start_date": "29-09-2024",
    "end_date": "30-03-2025",
  }
}

"""

overview = "i want to make an app that focus on cooking instruction, subscription based, so every user can watch a chef cooking an indonesian food"
stakeholders = "CEO, Project Manager, User"
timeline = "i want to create this project from 1st november 2024 until 20th march 2025"

user_prompt = f"""
Given the following information about a product:

Overview: ${overview}
Stakeholders: ${stakeholders} 
Timeline: ${timeline}

Generate a comprehensive PRD in JSON format following this structure:

"title_section": Project title and document and unique project code,
"introduction": Background and problem definition,
"objectives": Vision and Goals
"timeline": Project timeline,

"""

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=system_instruction)

response = model.generate_content(user_prompt)
print(response.text)
