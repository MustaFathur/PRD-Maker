from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/generate-prd', methods=['POST'])
def generate_prd():
    data = request.json

    # Sample PRD output
    sample_prd_output = {
        "prd_identity": {
            "document_version": "Version 1.0",
            "product_name": "EcoTraveler",
            "document_owner": ["Zio"],
            "developer": ["Daffa", "Nabil"],
            "stakeholder": ["Fathur", "Zio"],
            "document_stage": "draft",
            "created_date": "2024-01-01"
        },
        "project_overview": {
            "overview": "EcoTraveler is an app designed to help eco-conscious travelers find sustainable travel options and activities. It aims to reduce carbon footprints by promoting green travel choices."
        },
        "darci_roles": {
            "decider": [{"person_id": 2, "name": "Daffa", "guidelines": "Make final decisions"}],
            "accountable": [{"person_id": 3, "name": "Nabil", "guidelines": "Ensure project success"}],
            "responsible": [{"person_id": 4, "name": "Fathur", "guidelines": "Complete tasks"}],
            "consulted": [{"person_id": 1, "name": "Zio", "guidelines": "Provide input"}],
            "informed": [{"person_id": 2, "name": "Daffa", "guidelines": "Stay updated"}]
        },
        "project_timeline": {
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "milestones": [
                {
                    "activity": "Research and Development",
                    "start_date": "2024-01-01",
                    "end_date": "2024-03-31",
                    "pic_id": 1
                },
                {
                    "activity": "Design and Prototyping",
                    "start_date": "2024-04-01",
                    "end_date": "2024-06-30",
                    "pic_id": 2
                }
            ]
        },
        "success_metrics": [
            {
                "metric_name": "User Acquisition",
                "definition": "The number of new users acquired each month",
                "actual_value": 100,
                "target_value": 500
            },
            {
                "metric_name": "Engagement Rate",
                "definition": "The percentage of active users",
                "actual_value": 20,
                "target_value": 50
            }
        ],
        "user_stories": [
            {
                "title": "User Registration",
                "user_story": "As a user, I want to register for an account so that I can track my sustainable travel options.",
                "acceptance_criteria": "The registration form should accept email, password, and basic user details.",
                "priority": "High"
            },
            {
                "title": "Search for Green Hotels",
                "user_story": "As a user, I want to search for eco-friendly hotels so that I can book a sustainable place to stay.",
                "acceptance_criteria": "The app should show a list of eco-friendly hotels based on my location and preferences.",
                "priority": "Medium"
            }
        ],
        "ui_ux": {
            "link": "https://www.example.com/ui-design"
        },
        "references": [
            {
                "reference_link": "https://www.example.com/sustainability-research"
            }
        ]
    }

    return jsonify(sample_prd_output)

if __name__ == '__main__':
    app.run(port=5001, debug=True)