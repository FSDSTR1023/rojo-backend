# rojo-backend

## First steps

    - npm install
    - npm run dev

## Entities

### Recipes

    - id: UUID
    - title: String
    - ingredients: String[]
    - preparation: Object[]
        - title: String
        - description String
    - dificulty:
        - Easy
        - Medium
        - Hard
    - preparationTime:
        - Fast
        - Moderate
        - Long
    - imageUrl: String
    - videoUrl: String
    - categories:
        - Healthy
        - Gluten Free
        - Vegan
        - Vegetarian
        - High Calories
        - Low Calories
        - Lactose Free
        - Paleo
        - Keto
    - opinions: Object[]
        - Text
        - Rating (1-5)
        - User
    - rating: Number (Calculated)
    - createdAt: Date
    - modifiedAt: Date
    - author: User

### Routines (Future)

    - id: UUID
    - title: String
    - exercices: Array
        - explanation: String
        - imageUrl: String
    - dificulty:
        - Easy
        - Medium
        - Hard
    - duration:
        - Fast
        - Moderate
        - Long
    - imageUrl: String
    - videoUrl: String
    - categories:
        - Running
        - Gym
        - Swimming
        - Cycling
        - Crossfit
        - Trail
        - Triatlon
        - Calisthenics
    - opinions:
        - Text
        - Rating
    - rating: Number (1-5) Ej: 4.3
    - createdAt: Date
    - modifiedAt: Date
    - author: User

### User

    - id: UUID
    - name: String
    - lastName: String
    - country: String
    - description: String
    - email: String
    - password: ???
    - userName: String
    - imageUrl: String
    - recipes: Recipe[]
    - favRecipes: Recipe[]
    - following: Users[]
    - followers: Users[]
    - createdAt: Date
