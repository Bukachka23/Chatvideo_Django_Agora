# VideoChat

MyChat is a group video calling application built using Django and Agora Web SDK.

## Description

MyChat allows users to participate in group video calls. It leverages the Agora Web SDK for real-time video communication. This application provides a seamless and interactive video chat experience for users.

## Features

- Group video calls: Connect with multiple participants in a single video call.
- Real-time communication: Enjoy high-quality video and audio streaming in real-time.
- User-friendly interface: Intuitive and easy-to-use interface for a smooth user experience.
- Flexible configuration: Customize video and audio settings according to user preferences.

## Requirements

- Python 3.8 or higher
- Django 3.2 or higher
- Agora Web SDK (included in the repository)
- Pusher account (for presence channel authentication)

## Installation and Setup

1. Clone the repository:

git clone https://github.com/your-username/mychat.git

markdown
Copy code

2. Install the required packages:

pip install -r requirements.txt

markdown
Copy code

3. Configure Agora credentials:

- Obtain your Agora App ID and App Certificate from the Agora Developer Console.
- Update the `views.py` and `streams.js` files with your Agora credentials.

4. Configure Pusher authentication:

- Create a free Pusher account.
- Replace the Pusher credentials in the `views.py` file with your own.

5. Start the Django development server:

python manage.py runserver

sql
Copy code

6. Open your web browser and access the application at `http://localhost:8000`.

## Usage

1. Sign in to the application using your credentials or create a new account.
2. Create or join a video chat room.
3. Enjoy group video calls with other participants in real-time.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
