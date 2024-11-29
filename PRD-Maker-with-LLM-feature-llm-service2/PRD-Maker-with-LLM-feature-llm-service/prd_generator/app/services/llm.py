import google.generativeai as genai
from dotenv import load_dotenv
from openai import OpenAI
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict
import sys
import json

# Tambahkan path konfigurasi jika diperlukan
sys.path.append('C:\\Capstone Project\\PRD-Maker-with-LLM-feature-llm-service2\\PRD-Maker-with-LLM-feature-llm-service')
from prd_generator.app.config import Settings

load_dotenv()


@dataclass
class PRDIdentity:
    document_version: str
    product_name: str
    document_owner: str
    developer: List[str]
    stakeholders: List[str]
    document_stage: str


@dataclass
class Overview:
    description: str


@dataclass
class DARCI:
    decider: List[str]
    accountable: List[str]
    responsible: List[str]
    consulted: List[str]
    informed: List[str]


@dataclass
class ProjectTimeline:
    start_date: str
    end_date: str


@dataclass
class UserPrompt:
    prd_identity: PRDIdentity
    overview: Overview
    darci: DARCI
    project_timeline: ProjectTimeline


class ModelType(Enum):
    GPT4 = "gpt-4o-mini"
    GEMINI = "gemini-1.5-flash"


class LLMSource:
    SYSTEM_INSTRUCTION = """
    You are an advanced PRD generator. Based on the provided information, create a detailed PRD in JSON format...
    (instruction truncated for brevity)
    """

    def __init__(self, model: ModelType):
        self.model = model

    def generate_openai_prd(self, formatted_prompt: str):
        """Generate PRD using OpenAI API."""
        client = OpenAI(api_key=Settings.OPENAI_API_KEY)
        chat_completion = client.chat.completions.create(
            model=self.model.value,
            messages=[
                {"role": "system", "content": self.SYSTEM_INSTRUCTION},
                {"role": "user", "content": formatted_prompt}
            ]
        )
        return json.loads(chat_completion.choices[0].message.content)

    def generate_gemini_prd(self, formatted_prompt: str):
      """Generate PRD using Gemini API."""
      genai.configure(api_key=Settings.GEMINI_API_KEY)
      model = genai.GenerativeModel(
          model_name=self.model.value,
          system_instruction=self.SYSTEM_INSTRUCTION
      )
      response = model.generate_content(formatted_prompt)
      
      try:
          # Coba untuk parse response
          if response.candidates:
              # Gunakan text dari kandidat pertama
              json_response = response.candidates[0].text
              return json.loads(json_response)
          else:
              print("No candidates in Gemini response")
              return None
      except json.JSONDecodeError as e:
          print(f"JSON Decode Error: {e}")
          print("Response Text:", response.text)
          return None
      except Exception as e:
          print(f"Gemini API Error: {e}")
          return None

    def generate_prds(self, prompt: UserPrompt):
        """Generate PRD results from both OpenAI and Gemini."""
        formatted_prompt = json.dumps({
            "prd_identity": prompt.prd_identity.__dict__,
            "overview": prompt.overview.__dict__,
            "darci": {
                "decider": prompt.darci.decider,
                "accountable": prompt.darci.accountable,
                "responsible": prompt.darci.responsible,
                "consulted": prompt.darci.consulted,
                "informed": prompt.darci.informed
            },
            "project_timeline": {
                "start_date": prompt.project_timeline.start_date,
                "end_date": prompt.project_timeline.end_date
            }
        }, indent=2)

        # Generate PRDs using both APIs
        openai_result = None
        gemini_result = None

        try:
            openai_result = self.generate_openai_prd(formatted_prompt)
        except Exception as e:
            print(f"OpenAI Error: {e}")

        try:
            gemini_result = self.generate_gemini_prd(formatted_prompt)
        except Exception as e:
            print(f"Gemini Error: {e}")

        return {
            "openai_result": openai_result,
            "gemini_result": gemini_result
        }


# Contoh input
identity = PRDIdentity(
    document_version="1.0",
    product_name="Cooking Instruction App",
    document_owner="Jane Doe",
    developer=["Development Team A"],
    stakeholders=["CEO", "Project Manager", "User"],
    document_stage="Planned"
)

overview = Overview(
    description="A subscription-based app for learning Indonesian cooking techniques."
)

darci = DARCI(
    decider=["Jane Smith"],
    accountable=["Michael Johnson"],
    responsible=["Alice", "Bob"],
    consulted=["Chef Adi"],
    informed=["Marketing Team", "Support Team"]
)

timeline = ProjectTimeline(
    start_date="2024-11-01",
    end_date="2025-03-20"
)

prompt = UserPrompt(
    prd_identity=identity,
    overview=overview,
    darci=darci,
    project_timeline=timeline
)

# Generate PRD results
llm_source = LLMSource(ModelType.GPT4)  # Default model type for initialization
results = llm_source.generate_prds(prompt)

# Output results
print("OpenAI Response:")
print(json.dumps(results['openai_result'], indent=2))

print("\nGemini Response:")
print(json.dumps(results['gemini_result'], indent=2))
