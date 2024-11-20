import google.generativeai as genai
from datetime import datetime
import json
import os
from typing import List, Dict, Optional

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyDfVIMXcBhsbFugsKCUYQtDA292o8KwZ8s"
genai.configure(api_key=GOOGLE_API_KEY)

# Template structures
PRD_TEMPLATE = {
    "prd_identity": {
        "document_version": "",
        "product_name": "",
        "document_owner": "",
        "developer": "",
        "stakeholder": "",
        "document_stage": ""
    },
    "overview": "",
    "darci": {
        "decider": {
            "persons": [],
            "explanation": ""
        },
        "accountable": {
            "persons": [],
            "explanation": ""
        },
        "responsible": {
            "persons": [],
            "explanation": ""
        },
        "consulted": {
            "persons": [],
            "explanation": ""
        },
        "informed": {
            "persons": [],
            "explanation": ""
        }
    },
    "project_timeline": {
        "start_date": "",
        "end_date": "",
        "pic": ""
    }
}

class PRDMaker:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
        
    def _generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        response = self.model.generate_content(prompt)
        return response.text
    
    def generate_overview(self, product_name: str, context: str) -> str:
        """Generate product overview"""
        prompt = f"""
        Create a comprehensive product overview for {product_name}.
        Context: {context}
        Please provide a clear, concise, yet detailed overview that explains:
        1. The product's purpose
        2. Key features
        3. Target audience
        4. Main value propositions
        
        Format the response in a professional manner suitable for a PRD.
        """
        return self._generate_content(prompt)
    
    def generate_darci_explanations(self, role: str, persons: List[str]) -> str:
        """Generate DARCI role explanations"""
        role_descriptions = {
            "decider": "final decision-making authority",
            "accountable": "overall accountability for deliverables",
            "responsible": "doing the work",
            "consulted": "providing input and feedback",
            "informed": "kept updated on progress"
        }
        
        prompt = f"""
        Generate a clear explanation for the {role.upper()} role in the DARCI framework.
        Assigned persons: {', '.join(persons)}
        Role context: {role_descriptions[role.lower()]}
        
        Explain:
        1. Why these persons are suitable for this role
        2. Their specific responsibilities  
        3. How they should interact with other roles
        
        Keep the explanation concise but informative.
        """
        return self._generate_content(prompt)

class PRDValidator:
    @staticmethod
    def validate_document_stage(stage: str) -> bool:
        """Validate document stage"""
        valid_stages = ["inbox", "planned", "in progress", "draft", "finished"]
        return stage.lower() in valid_stages
    
    @staticmethod
    def validate_dates(start_date: str, end_date: str) -> bool:
        """Validate timeline dates"""
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            return start <= end
        except ValueError:
            return False

class PRDGenerator:
    def __init__(self):
        self.prd_maker = PRDMaker()
        self.validator = PRDValidator()
        
    def create_prd(self, input_data: Dict) -> Dict:
        """Create complete PRD from input data"""
        prd = PRD_TEMPLATE.copy()
        
        # Fill PRD Identity
        prd["prd_identity"].update({
            "document_version": input_data.get("document_version", "1.0"),
            "product_name": input_data["product_name"],
            "document_owner": input_data["document_owner"],
            "developer": input_data["developer"],
            "stakeholder": input_data["stakeholder"],
            "document_stage": input_data["document_stage"]
        })
        
        # Generate Overview
        prd["overview"] = self.prd_maker.generate_overview(
            input_data["product_name"],
            input_data.get("context", "")
        )
        
        # Generate DARCI explanations
        for role in ["decider", "accountable", "responsible", "consulted", "informed"]:
            if role in input_data["darci"]:
                persons = input_data["darci"][role]
                explanation = self.prd_maker.generate_darci_explanations(role, persons)
                prd["darci"][role]["persons"] = persons
                prd["darci"][role]["explanation"] = explanation
        
        # Fill Project Timeline
        prd["project_timeline"].update({
            "start_date": input_data["timeline"]["start_date"],
            "end_date": input_data["timeline"]["end_date"],
            "pic": input_data["timeline"]["pic"]
        })
        
        return prd

# Example usage
def main():
    # Sample input data
    input_data = {
        "document_version": "1.0",
        "product_name": "Smart Task Manager",
        "document_owner": "John Doe",
        "developer": "Jane Smith",
        "stakeholder": "Product Team",
        "document_stage": "draft",
        "context": "A smart task management application for remote teams",
        "darci": {
            "decider": ["John Doe"],
            "accountable": ["Jane Smith"],
            "responsible": ["Dev Team"],
            "consulted": ["UX Team", "Product Team"],
            "informed": ["Stakeholders"]
        },
        "timeline": {
            "start_date": "2024-01-01",
            "end_date": "2024-06-30",
            "pic": "Project Manager"
        }
    }
    
    # Create PRD
    prd_generator = PRDGenerator()
    prd = prd_generator.create_prd(input_data)
    
    # Save to JSON file
    with open('generated_prd.json', 'w') as f:
        json.dump(prd, f, indent=2)

if __name__ == "__main__":
    main()