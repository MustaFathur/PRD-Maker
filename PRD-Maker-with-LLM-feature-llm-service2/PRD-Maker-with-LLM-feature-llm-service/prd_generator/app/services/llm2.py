import google.generativeai as genai
from dotenv import load_dotenv
from openai import OpenAI
from enum import Enum
import sys
import json
import os

sys.path.append('C:\\Capstone Project\\PRD-Maker-with-LLM-feature-llm-service2\\PRD-Maker-with-LLM-feature-llm-service')
from prd_generator.app.config import Settings

load_dotenv()

class ModelType(Enum):
    GPT4 = "gpt-4o-mini"
    GEMINI = "gemini-pro" 

class PRDGenerator:
    SYSTEM_INSTRUCTION = """
    You are an advanced PRD generator. Based on the provided JSON input, create a detailed PRD in JSON format with multiple examples to guide the output.

    # FEW-SHOT EXAMPLES

    ## Example 1: Cooking Instruction App
    ### Input:
    {
        "prd_identity": {
            "document_version": "1.0",
            "product_name": "Cooking Instruction App",
            "document_owner": "Jane Doe",
            "developer": ["Development Team A"],
            "stakeholders": ["CEO", "Project Manager", "User"],
            "document_stage": "Planned"
        },
        "overview": {
            "description": "A subscription-based app for learning Indonesian cooking techniques."
        },
        "darci": {
            "decider": ["Jane Smith"],
            "accountable": ["Michael Johnson"],
            "responsible": ["Alice", "Bob"],
            "consulted": ["Chef Adi"],
            "informed": ["Marketing Team", "Support Team"]
        },
        "project_timeline": {
            "start_date": "2024-11-01",
            "end_date": "2025-03-20"
        }
    }

    ### Output:
    {
        "prd_identity": {
            "document_version": "1.0",
            "product_name": "Cooking Instruction App",
            "document_owner": "Jane Doe",
            "developer": ["Development Team A"],
            "stakeholders": ["CEO", "Project Manager", "User"],
            "document_stage": "Planned"
        },
        "overview": {
            "description": "A subscription-based app for learning Indonesian cooking techniques.",
            "problem_statement": "Many home cooks struggle to learn authentic Indonesian cooking techniques due to lack of accessible, interactive, and expert-guided resources.",
            "objectives": [
                "Provide comprehensive, step-by-step Indonesian cooking tutorials",
                "Create an engaging and interactive learning platform for culinary enthusiasts",
                "Bridge the gap between traditional cooking knowledge and modern learning methods"
            ]
        },
        "darci": {
            "decider": {
                "name": "Jane Smith",
                "responsibilities": [
                    "Final strategic decision-making",
                    "Project direction approval",
                    "Budget allocation"
                ]
            },
            "accountable": {
                "name": "Michael Johnson",
                "responsibilities": [
                    "Overall project delivery",
                    "Quality assurance",
                    "Milestone tracking"
                ]
            },
            "responsible": {
                "team": ["Alice", "Bob"],
                "responsibilities": [
                    "Technical implementation",
                    "Feature development",
                    "System architecture design"
                ]
            },
            "consulted": {
                "expert": "Chef Adi",
                "contributions": [
                    "Culinary content validation",
                    "Cooking technique insights",
                    "Content accuracy review"
                ]
            },
            "informed": {
                "teams": ["Marketing Team", "Support Team"],
                "communication_plan": [
                    "Monthly progress reports",
                    "Major milestone notifications",
                    "Quarterly review meetings"
                ]
            }
        },
        "project_timeline": {
            "start_date": "2024-11-01",
            "end_date": "2025-03-20",
            "milestones": [
                {
                    "name": "Content Strategy",
                    "start_date": "2024-11-01",
                    "end_date": "2024-12-15",
                    "key_deliverables": ["Content outline", "Initial recipe collection"]
                },
                {
                    "name": "Platform Development",
                    "start_date": "2024-12-16",
                    "end_date": "2025-02-28",
                    "key_deliverables": ["App infrastructure", "User interface", "Initial feature set"]
                }
            ]
        },
        "success_metrics": [
            {
                "metric": "User Engagement",
                "definition": "Average time spent on the app per user per week",
                "actual": 0,
                "target": 120
            },
            {
                "metric": "Conversion Rate",
                "definition": "Percentage of free trial users converting to paid subscriptions",
                "actual": 0,
                "target": 25
            },
            {
                "metric": "Recipe Completion Rate",
                "definition": "Percentage of users completing a cooking tutorial",
                "actual": 0,
                "target": 75
            }
        ],
        "user_stories": [
            {
                "title": "Browse Cooking Tutorials",
                "user_story": "As a home cook, I want to browse available cooking tutorials by cuisine type and difficulty level",
                "acceptance_criteria": [
                    "User can filter tutorials by Indonesian region",
                    "Difficulty levels are clearly marked",
                    "Each tutorial shows estimated cooking time"
                ],
                "priority": "High"
            },
            {
                "title": "Interactive Step-by-Step Guide",
                "user_story": "As a user, I want to have an interactive, step-by-step cooking guide with video and text instructions",
                "acceptance_criteria": [
                    "Each step has a video demonstration",
                    "Text instructions accompany video",
                    "Users can mark steps as completed"
                ],
                "priority": "Critical"
            }
        ]
    }

    ## Example 2: E-Learning Platform
    ### Input:
    {
        "prd_identity": {
            "document_version": "1.0",
            "product_name": "TechLearn Platform",
            "document_owner": "John Doe",
            "developer": ["Education Tech Team"],
            "stakeholders": ["University Partners", "Investors", "Students"],
            "document_stage": "Initial Planning"
        },
        "overview": {
            "description": "An adaptive learning platform for technology skills"
        },
        "darci": {
            "decider": ["Sarah Johnson"],
            "accountable": ["Mark Williams"],
            "responsible": ["Emily", "David"],
            "consulted": ["Industry Experts"],
            "informed": ["Curriculum Team", "Sales Team"]
        },
        "project_timeline": {
            "start_date": "2024-09-01",
            "end_date": "2025-06-30"
        }
    }

    ### Output:
    {
        "prd_identity": {
            "document_version": "1.0",
            "product_name": "TechLearn Platform",
            "document_owner": "John Doe",
            "developer": ["Education Tech Team"],
            "stakeholders": ["University Partners", "Investors", "Students"],
            "document_stage": "Initial Planning"
        },
        "overview": {
            "description": "An adaptive learning platform for technology skills",
            "problem_statement": "Traditional learning platforms fail to provide personalized, adaptive learning experiences for technology skills, leading to low engagement and ineffective learning outcomes.",
            "objectives": [
                "Develop an AI-driven adaptive learning platform",
                "Create personalized learning paths for technology skills",
                "Improve student engagement and learning effectiveness"
            ]
        },
        "darci": {
            "decider": {
                "name": "Sarah Johnson",
                "strategic_focus": [
                    "Platform vision alignment",
                    "Partnership approvals",
                    "Long-term product strategy"
                ]
            },
            "accountable": {
                "name": "Mark Williams",
                "responsibilities": [
                    "Project execution oversight",
                    "Resource allocation",
                    "Risk management"
                ]
            },
            "responsible": {
                "team": ["Emily", "David"],
                "roles": [
                    "Technical architecture",
                    "Learning algorithm development",
                    "User experience design"
                ]
            },
            "consulted": {
                "group": "Industry Experts",
                "contributions": [
                    "Curriculum validation",
                    "Emerging technology insights",
                    "Learning trend analysis"
                ]
            },
            "informed": {
                "teams": ["Curriculum Team", "Sales Team"],
                "communication_strategy": [
                    "Bi-weekly progress updates",
                    "Quarterly roadmap presentations",
                    "Feature preview sessions"
                ]
            }
        },
        "project_timeline": {
            "start_date": "2024-09-01",
            "end_date": "2025-06-30",
            "milestones": [
                {
                    "name": "Platform Design",
                    "start_date": "2024-09-01",
                    "end_date": "2024-11-30",
                    "key_deliverables": [
                        "Define technical architecture",
                        "Design adaptive learning algorithms",
                        "Create initial UI/UX prototype"
                    ]
                },
                {
                    "name": "Development & Testing",
                    "start_date": "2024-12-01",
                    "end_date": "2025-04-30",
                    "key_deliverables": [
                        "Build core platform features",
                        "Implement machine learning models",
                        "Conduct alpha and beta testing"
                    ]
                }
            ]
        },
        "success_metrics": [
            {
                "metric": "Learning Progression",
                "definition": "Improvement in skill proficiency after course completion",
                "actual": 0,
                "target": 40
            },
            {
                "metric": "User Retention",
                "definition": "Percentage of users continuing learning after first module",
                "actual": 0,
                "target": 65
            },
            {
                "metric": "Platform Recommendation Accuracy",
                "definition": "Accuracy of AI-driven learning path recommendations",
                "actual": 0,
                "target": 85
            }
        ],
        "user_stories": [
            {
                "title": "Skill Assessment",
                "user_story": "As a student, I want to take an initial skill assessment to get a personalized learning path",
                "acceptance_criteria": [
                    "Assessment covers multiple technology domains",
                    "Provides detailed skill level report",
                    "Generates personalized learning recommendation"
                ],
                "priority": "Critical"
            },
            {
                "title": "Adaptive Learning Path",
                "user_story": "As a learner, I want the platform to adjust my learning path based on my progress and performance",
                "acceptance_criteria": [
                    "Learning path updates in real-time",
                    "Recommends additional resources for weak areas",
                    "Provides difficulty level adjustments"
                ],
                "priority": "High"
            }
        ]
    }

    # Guidelines for PRD Generation
    1. Expand on the provided input details
    2. Add strategic insights and recommendations
    3. Create a comprehensive and structured JSON output
    4. Include additional context and future considerations
    5. Ensure detailed problem statements, objectives, success metrics, and user stories
    """

    def generate_prd_with_openai(self, input_json: dict) -> dict:
        """
        Generate PRD using OpenAI API
        
        Args:
            input_json (dict): Input JSON containing PRD details
        
        Returns:
            dict: Generated PRD JSON
        """
        try:
            client = OpenAI(api_key=Settings.OPENAI_API_KEY)
            chat_completion = client.chat.completions.create(
                model=ModelType.GPT4.value,
                messages=[
                    {"role": "system", "content": self.SYSTEM_INSTRUCTION},
                    {"role": "user", "content": json.dumps(input_json, indent=2)}
                ],
                response_format={"type": "json_object"}
            )
            
            return json.loads(chat_completion.choices[0].message.content)
        
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return {"error": str(e)}

    def generate_prd_with_gemini(self, input_json: dict) -> dict:
        """
        Generate PRD using Gemini API (Free Version)
        
        Args:
            input_json (dict): Input JSON containing PRD details
        
        Returns:
            dict: Generated PRD JSON
        """
        try:
            genai.configure(api_key=Settings.GEMINI_API_KEY)
            
            model = genai.GenerativeModel(model_name=ModelType.GEMINI.value)
            
            full_prompt = (
                f"{self.SYSTEM_INSTRUCTION}\n\n"
                "Please strictly generate the PRD output as a valid JSON format matching the examples provided above.\n\n"
                f"Input JSON:\n{json.dumps(input_json, indent=2)}"
            )
            response = model.generate_content(full_prompt)
            
            prd_output = self.sanitize_gemini_output(response.text)
            return prd_output

        except Exception as e:
            print(f"Gemini API Error: {e}")
            return {"error": str(e)}

    def sanitize_gemini_output(self, raw_text: str) -> dict:
        """
        Sanitizes the raw output from Gemini and attempts to parse it into a valid JSON.
        
        Args:
            raw_text (str): The raw text response from Gemini.
        
        Returns:
            dict: Sanitized JSON output or fallback.
        """
        try:
            sanitized_text = raw_text.strip()
            
            if "{" in sanitized_text and "}" in sanitized_text:
                json_start = sanitized_text.find("{")
                json_end = sanitized_text.rfind("}") + 1
                potential_json = sanitized_text[json_start:json_end]
                
                return json.loads(potential_json)
            else:
                return {
                    "error": "Failed to extract valid JSON structure",
                    "raw_response": sanitized_text
                }
        except Exception as e:
            print(f"Sanitization Error: {e}")
            return {"error": "Sanitization failed", "raw_response": raw_text}

    def generate_prds(self, input_json: dict) -> dict:
        """
        Generate PRDs from both OpenAI and Gemini
        
        Args:
            input_json (dict): Input JSON containing PRD details
        
        Returns:
            dict: PRDs generated by both APIs
        """
        return {
            "openai_prd": self.generate_prd_with_openai(input_json),
            "gemini_prd": self.generate_prd_with_gemini(input_json)
        }

    def save_prd_to_file(self, prd_data: dict, filename: str):
        """
        Save PRD data to a JSON file
        
        Args:
            prd_data (dict): PRD data to be saved
            filename (str): The name of the file to save the PRD data
        """
        try:
            # Menyimpan file JSON
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(prd_data, f, ensure_ascii=False, indent=2)
            print(f"File saved successfully as {filename}")
        except Exception as e:
            print(f"Error saving file {filename}: {e}")

def main():
    input_json = {
        "prd_identity": {
            "document_version": "1.0",
            "product_name": "Cooking Instruction App",
            "document_owner": "Jane Doe",
            "developer": ["Development Team A"],
            "stakeholders": ["CEO", "Project Manager", "User"],
            "document_stage": "Planned"
        },
        "overview": {
            "description": "A subscription-based app for learning Indonesian cooking techniques."
        },
        "darci": {
            "decider": ["Jane Smith"],
            "accountable": ["Michael Johnson"],
            "responsible": ["Alice", "Bob"],
            "consulted": ["Chef Adi"],
            "informed": ["Marketing Team", "Support Team"]
        },
        "project_timeline": {
            "start_date": "2024-11-01",
            "end_date": "2025-03-20"
        }
    }

    prd_generator = PRDGenerator()
    
    # Generate PRD
    results = prd_generator.generate_prds(input_json)
    
    # Print
    print("OpenAI PRD:")
    print(json.dumps(results['openai_prd'], indent=2))
    
    print("\nGemini PRD:")
    print(json.dumps(results['gemini_prd'], indent=2))
    
    #Save files
    prd_generator.save_prd_to_file(results['openai_prd'], "openai_prd.json")
    prd_generator.save_prd_to_file(results['gemini_prd'], "gemini_prd.json")

if __name__ == "__main__":
    main()