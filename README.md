# Memory Card Game

## Overview
The Memory Card Game is a spaced repetition learning app designed to help users memorize concepts across different levels.

## Key Features
- Multiple difficulty levels (1000, 2000, 3000, 4000)
- Spaced repetition algorithm for optimal learning
- User authentication (Google Sign-In and Anonymous)
- Progress tracking per level and concept

## Core Functionality
1. Users select a level to study
2. Concepts are presented as cards with a concept on one side and an explanation on the other
3. Users flip the card and indicate whether they remembered the concept
4. The app tracks progress and adjusts review intervals based on performance
5. Users can see their progress for each level

## Components
- Header: Displays user info and level progress
- MemoryCardGame: Main game component
- ConceptCard: Displays individual concepts
- GameControls: Allows users to indicate if they remembered a concept
- GroupSummary: Shows results after completing a group of concepts

## Data Flow
1. User authenticates
2. App loads concepts for the selected level
3. User interacts with concepts
4. Progress is updated in Firestore
5. Next review times are calculated based on performance

## Firebase Integration
- Authentication: Manages user sign-in
- Firestore: Stores user progress and concept data

## Redux State Management
- auth: Manages authentication state
- game: Handles game state, including current concepts and progress

## Spaced Repetition Algorithm
The app uses a simple spaced repetition algorithm:
- If a concept is remembered, the review interval doubles
- If a concept is forgotten, the review interval resets to 1 day

## Future Enhancements
- Add more detailed statistics for user performance
- Implement a more sophisticated spaced repetition algorithm
- Allow users to create custom concept decks

## Getting Started
(Add instructions for setting up the project, installing dependencies, and running the app locally)

## Contributing
(Add guidelines for contributing to the project)

## License
(Add license information)
