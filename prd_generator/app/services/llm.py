import google.generativeai as genai
from dotenv import load_dotenv
from openai import OpenAI
from enum import Enum
from dataclasses import dataclass
from typing import List
from prd_generator.app.config import Settings
import json

load_dotenv()


@dataclass
class UserPrompt:
    overview: str
    stakeholders: List[str]
    timeline: str


class ModelType(Enum):
    GPT4 = "gpt-4o-mini"
    GEMINI = "gemini-1.5-flash"


class LLMSource:  # TODO : Adjust the system instruction and user prompt
    SYSTEM_INSTRUCTION = """ 
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
    USER_PROMPT_TEMPLATE = """
Given the following information about a product:

Overview: {overview}
Stakeholders: {stakeholders} 
Timeline: {timeline}

Generate a comprehensive PRD in JSON format following this structure:
"title_section": Project title and document and unique project code,
"introduction": Background and problem definition,
"objectives": Vision and Goals
"timeline": Project timeline,
    """

    def __init__(self, model: ModelType):
        self.model = model

    def generate_prd(self, prompt: UserPrompt):
        formatted_prompt = self.USER_PROMPT_TEMPLATE.format(
            overview=prompt.overview,
            stakeholders=prompt.stakeholders,
            timeline=prompt.timeline
        )
        answer = self._generate_response(formatted_prompt)
        return answer

    def _generate_response(self, formatted_prompt: str):  # TODO : Create Structured Outputs && Gemini Logic
        if self.model == ModelType.GPT4:
            client = OpenAI(api_key=Settings.OPENAI_API_KEY)
            chat_completion = client.chat.completions.create(
                model=self.model.value,
                messages=[
                    {"role": "system", "content": self.SYSTEM_INSTRUCTION},
                    {"role": "system", "content": formatted_prompt}
                ]
            )
            return json.loads(chat_completion.choices[0].message.content)


overview = "i want to make an app that focus on cooking instruction, subscription based, so every user can watch a chef cooking an indonesian food"
stakeholders = ["CEO", "Project Manager", "User"]
timeline = "i want to create this project from 1st november 2024 until 20th march 2025"

llm = LLMSource(ModelType.GPT4)
response = llm.generate_prd(UserPrompt(overview, stakeholders, timeline))
print(response)
