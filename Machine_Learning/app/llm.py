from dotenv import load_dotenv
from openai import OpenAI
from enum import Enum
import json
from config import Settings

load_dotenv()


class ModelType(Enum):
    GPT4 = "gpt-4o"
    GEMINI = "gemini-pro"


class PRDGenerator:
    SYSTEM_INSTRUCTION = """
    You are an advanced PRD generator. Based on the provided JSON input, create a detailed PRD in JSON format with multiple examples to guide the output.

    # USER PROMPT EXAMPLES
    All of the user prompt will be structured like this:
    {
    "document_version": [version of the document, type: string],
    "product_name": [user product name, type: string],
    "document_owner": [names of the owner of the document, type: list of string],
    "developer": [the development team (can be name of individuals or name of the team), type: list of string],
    "stakeholders": [the stakeholders,type: list of string],
    "document_stage": [stage of the document, type: string],
    "project_overview": [Brief description of the product and its main purpose, type: string],
    "darci_roles": {
        "decider": ["Final Decision Maker Names"],
        "accountable": ["Names of Those Accountable"],
        "responsible": ["Names of Those Doing the Work"],
        "consulted": ["Names of Subject Matter Experts"],
        "informed": ["Teams/Individuals to Keep Updated"]
    },
    "start_date": [the start of the project, type: string date (YYYY-MM-DD)],
    "end_date": [the end of the project, type: string date (YYYY-MM-DD)]
}

    ## Example 1: 
    ### Input
{
    "document_version": "1.0",
    "product_name": "EcoTraveler",
    "document_owner": ["Denis Setyawan"],
    "developer": ["Eric Julianto", "Muhammad Acla", "Rama", "Ramandhika Ilham Pratama"],
    "stakeholders": ["Eric Julianto"],
    "document_stage": "ongoing",
    "project_overview": "A digital sustainable travel product offering travelers a convenient way to reduce environmental impact while promoting local communities and conservation efforts",
    "darci_roles": {
        "decider": ["Eric Julianto"],
        "accountable": ["Denis Setyawan"],
        "responsible": ["Muhammad Acla", "Rama", "Ramandhika Ilham Pratama"],
        "consulted": ["Eric Julianto", "Rama"],
        "informed": ["Eric Julianto"]
    },
    "start_date": "2024-05-14",
    "end_date": "2024-06-28"
}

### Output:
{
    "header": {
        "document_version": "1.0",
        "product_name": "EcoTraveler",
        "document_owner": "Denis Setyawan",
        "developers": [
            "Eric Julianto",
            "Muhammad Acla",
            "Rama",
            "Ramandhika Ilham Pratama"
        ],
        "stakeholders": ["Eric Julianto"],
        "doc_stage": "ongoing",
        "created_date": "2024-05-16"
    },
    "overview": {
        "sections": [
            {
                "title": "Problem Statement",
                "content": "In today's rapidly expanding travel industry, the allure of exploring new destinations and cultures has never been more enticing. However, this growth brings significant challenges, particularly for eco-conscious travelers striving to minimize their environmental footprint and support local communities. The industry's boom often leads to environmental degradation, cultural erosion, and socio-economic imbalances in many popular destinations. As a result, travelers who wish to make responsible choices face a daunting task: the landscape of sustainable travel options is fragmented and inconsistent, making it difficult to plan trips that align with their values."
            },
            {
                "title": "Objective",
                "content": "The objective of this digital sustainable travel product is to offer travelers a convenient and accessible way to reduce their environmental impact while promoting local communities and conservation efforts. To achieve the objective, the startup could take the following approach: Research sustainable travel trends and best practices: The startup could conduct research on sustainable travel trends and best practices to identify the most effective sustainable travel options and experiences to offer.Partner with sustainable travel providers: The startup could partner with sustainable travel providers such as eco-lodges, bike-sharing programs, and green transportation options to offer sustainable travel options to its customers.Provide a carbon footprint calculator: The startup could provide customers with a carbon footprint calculator that estimates their carbon emissions from travel and offers options for offsetting their carbon footprint.Offer educational resources: The startup could provide customers with educational resources on sustainable travel practices, including tips for reducing waste while traveling and the importance of responsible tourism. Promote local communities and conservation efforts: The startup could promote local communities and conservation efforts by offering sustainable tours and activities that support local economies and environmental conservation initiatives."
            }
        ]
    },
    "darci": {
        "roles": [
            {
                "name": "decider",
                "members": ["Eric Julianto"],
                "guidelines": "Have final approval or veto to critical decisions related to the development (e.g. whether the feature get prioritized, additional cost, additional resource, potential PR risk)."
            },
            {
                "name": "accountable",
                "members": ["Denis Setyawan"],
                "guidelines": "Fully accountable to deliver the impact of developing this feature."
            },
            {
                "name": "responsible",
                "members": [
                    "Muhammad Acla",
                    "Rama",
                    "Ramandhika Ilham Pratama"
                ],
                "guidelines": "Responsible to proactively do the work related to the feature development."
            },
            {
                "name": "consulted",
                "members": ["Eric Julianto", "Rama"],
                "guidelines": "Need to be comfortable and aligned with the feature development, and asked for input/feedback. Decider & Accountable need to ensure those in consulted are involved."
            },
            {
                "name": "informed",
                "members": ["Eric Julianto"],
                "guidelines": "FYI role."
            }
        ]
    },
    "project_timeline": {
        "phases": [
            {
                "time_period": "14 - 24 May 2024",
                "activity": "Create PRD and lo-fi design.",
                "pic": "Product Manager"
            },
            {
                "time_period": "4 - 27 June 2024",
                "activity": "Development",
                "pic": "Engineer"
            },
            {
                "time_period": "28 June 2024",
                "activity": "Deployment",
                "pic": "Engineer"
            }
        ]
    },
    "success_metrics": {
        "metrics": [
            {
                "name": "User Acquisition",
                "definition": "Number of new users who sign up for the app and website each month.",
                "current": "0",
                "target": "50/month"
            },
            {
                "name": "Customer Satisfaction",
                "definition": "Average rating out of 5 given by users for their overall experience with the app and website.",
                "current": "0",
                "target": "4.5/5"
            },
            {
                "name": "App Performance",
                "definition": "Average load time of the app (measured in seconds)",
                "current": "0",
                "target": "< 5 seconds"
            },
            {
                "name": "Server Uptime",
                "definition": "Percentage of time the app are operational and accesible",
                "current": "0",
                "target": "90%"
            }
        ]
    },
    "user_stories": {
        "stories": [
            {
                "title": "User Registration",
                "user_story": "As a new user, I want to register an account so that I can access personalized travel recommendations.",
                "acceptance_criteria": "Given the user is on the registration page, when the user enters a valid email and password and clicks 'register', then the system sends a confirmation email and the user can log in after verifying their email.",
                "priority": "high"
            },
            {
                "title": "User Login",
                "user_story": "As a registered user, I want to log into my account so that I can access my saved preferences and bookings.",
                "acceptance_criteria": "Given the user is on the login page,when the user enters their email and password and clicks 'Log In', Then the system grants access to the user's dashboard",
                "priority": "high"
            },
            {
                "title": "Search Eco-friendly Accommodations",
                "user_story": "As a traveler, i want to search for eco-friendly accomodations so that i can choose sustainable lodging options.",
                "acceptance_criteria": "Given the user is on the search page, when the user enters location, dates, and selects sustainability High filters, then the system displays a list nof eco-friendly accommodations with relevant certifications",
                "priority": "high"
            },
            {
                "title": "Book Sustainable Transportation e-Car",
                "user_story": "As a user, I want to book sustainable transportation for e-car to minimize my carbon footprint during travel.",
                "acceptance_criteria": "Given the user is on the transportation booking page, when the user selects a transportation type and chose e-car, then the system confirms the booking and sends a confirmation email and notification.",
                "priority": "high"
            },
            {
                "title": "User Profile Management",
                "user_story": "As a user, I want to manage my profile so that I can update my personal information and preferences.",
                "acceptance_criteria": "Given the user is on the profile management page, when the user updates their information and clicks 'Save',then the system saves the changes and updates the profile immediately.",
                "priority": "medium"
            },
            {
                "title": "Transport Destination",
                "user_story": "As a user, I want to chose or search my destination so that the driver knows where my location is",
                "acceptance_criteria": "Given the user has entered a pickup location, When the user enters a destination, Then the system validates the destination and calculates the route and estimated time of arrival.",
                "priority": "high"
            },
            {
                "title": "Payment Method",
                "user_story": "As a user, I want to chose my payment method to pay for my bookings.",
                "acceptance_criteria": "Given the user is on the payment method page, When the user chose one of payment method, Then the system processes the payment securely and confirms the transaction.",
                "priority": "high"
            }
        ]
    }
}

    ## Example 2:
    ### Input
{
    "document_version": "1.0",
    "product_name": "Palm Oil Ripeness Detection",
    "document_owner": ["Alfizdiana Sholikhah"],
    "developer": [
        "Arthur Hozanna",
        "Fauzan Ihza Fajar",
        "Jordan Marcelino",
        "Rahmatullah",
        "Ramadhan Hirmawan",
        "Sukma Adhi Wijaya"
    ],
    "stakeholders": ["Eric Julianto"],
    "document_stage": "Done",
    "project_overview": "An integrated solution for palm oil maturity detection and monitoring, featuring CLI-based detection, video stream analysis, ESP32 Cam integration, and cloud server connectivity for centralized data processing",
    "darci_roles": {
        "decider": ["Eric Julianto"],
        "accountable": ["Denis Setyawan"],
        "responsible": ["Muhammad Acla", "Rama", "Ramandhika Ilham Pratama"],
        "consulted": ["Eric Julianto", "Rama"],
        "informed": ["Eric Julianto"]
    },
    "start_date": "2024-01-08",
    "end_date": "2024-02-16"
}

    ### Output:
{
  "header": {
    "document_version": "1.0",
    "product_name": "Palm Oil Ripeness Detection",
    "document_owner": "Alfizdiana Sholikhah",
    "developers": [
      "Arthur Hozanna",
      "Fauzan Ihza Fajar",
      "Jordan Marcelino",
      "Rahmatullah",
      "Ramadhan Hirmawan",
      "Sukma Adhi Wijaya"
    ],
    "stakeholders": [
      "Eric Julianto"
    ],
    "doc_stage": "Done",
    "created_date": "2024-02-01"
  },
  "overview": {
    "sections": [
      {
        "title": "Problem Statement",
        "content": "The existing methods for assessing palm oil maturity lack efficiency and automation. Manual processes lead to inaccuracies, delays, and a lack of centralized control. Key issue:\n Inability to obtain a comprehensive palm oil maturity across different plantations.\nincreased manual effort in coordinating maturity assessments and monitoring across various locations."
      },
      {
        "title": "Objective",
        "content": "The primary objective is to create an integrated solution for palm oil maturity detection and monitoring. Specific goals include:\nDevelop a CLI for users to easily detect maturity detection on individual images.\nImplement object counting in video streams to track the number of palm and their maturity levels. Integrate ESP32 Cam into the system for on-field image capture.\nEstablish connectivity with a cloud server for centralized data processing and analysis."
      }
    ]
  },
  "darci": {
    "roles": [
      {
        "name": "decider",
        "members": [
          "Eric Julianto"
        ],
        "guidelines": "Ensures the successful implementation and optimization of the Palm Oil Detection project, making critical decisions related to the integration of YOLOv8, ESP32 Cam, and cloud server functionalities. Examples include determining the model parameters for maturity classification and approving the final deployment strategy."
      },
      {
        "name": "accountable",
        "members": [
          "Denis Setyawan"
        ],
        "guidelines": "Managers the overall project execution, overseeing the deployment, testing and deployment phases. Responsible for coordinating team efforts, ensuring that milestones are met, and resolving any obstacles hindering the project’s progress."
      },
      {
        "name": "responsible",
        "members": [
          "Muhammad Acla",
          "Rama",
          "Ramandhika Ilham Pratama"
        ],
        "guidelines": "Actively engages in the hands-on tasks related to the development and implementation of the CLI, image processing, and video stream analysis. Takes ownership of the technical aspects, working closely with the development team to address challenges and ensure successful feature delivery."
      },
      {
        "name": "consulted",
        "members": [
          "Eric Julianto",
          "Rama"
        ],
        "guidelines": "Collaborates with stakeholders to gather insights and refine the user interface of the CLI. Actively seeks feedback from end-users and domain experts to enhance the overall effectiveness of the palm oil detection system."
      },
      {
        "name": "informed",
        "members": [
          "Eric Julianto"
        ],
        "guidelines": "Maintains open communication challenges, and opportunities related to the project. Actively progress, challenges, and opportunities related to projects. Actively seeks and incorporates feedback from both technical and non-technical perspectives to refine and improve the solution."
      }
    ]
  },
  "project_timeline": {
    "phases": [
      {
        "time_period": "8 Jan",
        "activity": "Grooming",
        "pic": "Product Manager"
      },
      {
        "time_period": "15 Jan - 26 Jan",
        "activity": "System Design and Architecture",
        "pic": "Engineer"
      },
      {
        "time_period": "26 Jan - 9 Feb",
        "activity": "CLI Development and Image Processing",
        "pic": "Engineer"
      },
      {
        "time_period": "9 Feb - 12 Feb",
        "activity": "Implement Flask",
        "pic": "Engineer"
      },
      {
        "time_period": "12 Feb - 16 Feb",
        "activity": "Project Finishing",
        "pic": "Engineer"
      }
    ]
  },
  "success_metrics": {
    "metrics": [
      {
        "name": "Maturity Detection Accuracy",
        "definition": "% of correctly classified palm oil maturity levels.",
        "current": "75% Accuracy",
        "target": "Achieve a maturity detection of 90%"
      },
      {
        "name": "CLI Usability",
        "definition": "User satisfaction with the ease of using the Command Line Interface (CLI) for image-based detection.",
        "current": "80% user satisfaction",
        "target": "90% user satisfaction"
      },
      {
        "name": "ESP32 Cam Integration Success",
        "definition": "Successful integration and functionality of ESP32 Cam for on-field image capture.",
        "current": "Integration Completed",
        "target": "Achieve a fully functional integration with ESP32 Cam."
      },
      {
        "name": "Cloud Server Connectivity Reality",
        "definition": "Reliability of the connection between the system and the cloud server.",
        "current": "95% Reliability.",
        "target": "Achieve 99% connectivity reliability."
      },
      {
        "name": "User Feedback Incorporation",
        "definition": "User Feedback Incorporation. % of user feedback actively incorporated into system improvements.",
        "current": "70% feedback integration.",
        "target": "Achieve 90% feedback incorporate rate."
      },
      {
        "name": "System Performance Enhancement",
        "definition": "Improvement in overall system performance during image and video processing.",
        "current": "60% improvement.",
        "target": "Achieve 80% improvement in system performance."
      }
    ]
  },
  "user_stories": {
    "stories": [
      {
        "title": "Maturity Detection Accuracy Enhancement",
        "user_story": "As a user, I want to instantly and accurately determine the ripeness of my palm fruits using my phone or a dedicated camera, so i can optimize harvest timing and maximize yield.",
        "acceptance_criteria": "Given i have a bunch of palm oil fruits,When i capture a photo using my smartphone app or the ESP32 Cam, Then the system analyzes the fruit characteristics (color, texture, etc.) and provides a clear prediction : Unripe, Underripe, Ripe, Overripe, Abnormal, Empty bunch.",
        "priority": "high"
      },
      {
        "title": "Capture On-Field Seamlessly with ESP32 Cam",
        "user_story": "As a user, I want to easily collect maturity data from various locations in my plantation without manual effort, so I can monitor overall fruit development and make informed harvesting decisions.",
        "acceptance_criteria": "Given the ESP32 Cam is setup in strategic locations, When I configure the ESP32 Cam to capture bunch images at predetermined intervals, Then the system automatically captures images and securely",
        "priority": "high"
      },
      {
        "title": "Centralized Data Management with Reliable Cloud Connectivitys",
        "user_story": "As a user, I want to access and analyze palm oil maturity data from all plantations in one central location, so I can optimize harvesting across regions and make strategic business decisions.",
        "acceptance_criteria": "Given the system maintains a reliable connection ( at least 98%) to the cloud server, even in areas with weak internet, When I access the user-friendly web interface.\nThen I can see data from all plantations securely stored and easily accessible.",
        "priority": "high"
      }
    ]
  }
}

# Guidelines for PRD Generation
1. Data Transformation
   - Convert input into complete PRD sections
   - Ensure all required fields are present and properly formatted
   - Maintain consistent structure across all outputs

2. Content Quality
   - Create clear problem statements and objectives from the overview
   - Generate specific, measurable success metrics
   - Provide detailed, actionable user stories
   - Ensure DARCI roles have clear responsibilities

3. Structure Standards
   - Follow consistent JSON format
   - Include all required sections (header, overview, darci, timeline, metrics, stories)
   - Maintain proper data types
   - Keep section ordering consistent

4. Validation
   - Check all dates are in YYYY-MM-DD format
   - Verify all arrays and objects are properly structured
   - Ensure all fields match expected formats
   - Validate completeness of required information
    """

    USER_PROMPT = """
Given the following information about a product:
{user_input}
Ensure the output is consistent with the structure.
    """

    def generate_prd(self, input_json: dict) -> dict:
        """
        Generate PRD using OpenAI API

        Args:
            input_json (dict): Input JSON containing PRD details

        Returns:
            dict: Generated PRD JSON
        """
        try:
            client = OpenAI(api_key=Settings.OPENAI_API_KEY)
            formatted_prompt = self.USER_PROMPT.format(user_input=json.dumps(input_json, indent=2))
            chat_completion = client.chat.completions.create(
                model=ModelType.GPT4.value,
                messages=[
                    {"role": "system", "content": self.SYSTEM_INSTRUCTION},
                    {"role": "user", "content": formatted_prompt},
                ],
                response_format={"type": "json_object"}
            )

            return json.loads(chat_completion.choices[0].message.content)

        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return {"error": str(e)}

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
        "document_version": "1.0",
        "product_name": "EcoTraveler",
        "document_owner": ["Zio"],
        "developer": ["Daffa", "Rafi"],
        "stakeholders": ["Zio", "Daffa"],
        "document_stage": "Planning",
        "project_overview": "EcoTraveler is an app designed to help eco-conscious travelers find sustainable travel options and activities. It aims to reduce carbon footprints by promoting green travel choices.",
        "darci_roles": {
            "decider": ["Zio"],
            "accountable": ["Daffa"],
            "responsible": ["Rafi"],
            "consulted": ["Zio"],
            "informed": ["Daffa"]
        },
        "start_date": "2024-01-01",
        "end_date": "2024-12-31"
    }
    prd_generator = PRDGenerator()

    # Generate PRD
    results = prd_generator.generate_prd(input_json)

    # Print
    print("OpenAI PRD:")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
