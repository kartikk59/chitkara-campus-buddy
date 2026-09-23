from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient


endpoint = "https://loveenafoundryws.services.ai.azure.com/api/projects/FoundryProject"

agent_name = "university-support-agent-for-students"
agent_version = "10"


project_client = AIProjectClient(
    endpoint=endpoint,
    credential=DefaultAzureCredential(),
)

openai_client = project_client.get_openai_client()


def create_conversation():
    conversation = openai_client.conversations.create()

    return conversation.id


def ask_agent(message: str, conversation_id: str):

    response = openai_client.responses.create(
        input=[
            {
                "role": "user",
                "content": message
            }
        ],
        
        extra_body={
            "agent_reference": {
                "name": "university-support-agent-for-students",
                "version": "13",
                "type": "agent_reference"
            },
            "conversation": conversation_id
        },
    )

    return response.output_text