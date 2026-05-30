
# Database Schema & Entity-Relationship Diagram (ERD)

This document visualizes the database schema designed for the Welldone application, detailing entities, relationships, and data flow.

## Entity-Relationship Diagram

```mermaid
erDiagram
    Users ||--o{ Friends : "sends/receives"
    Users ||--o{ Activities : "creates"
    Users ||--o{ Notifications : "receives"
    Users ||--o{ Messages : "sends/receives"
    Activities ||--o{ Activity_Participants : "has"
    Users ||--o{ Activity_Participants : "participates in"
    
    Users {
        uuid user_id PK
        string username
        string email
        string password_hash
        string profile_pic_url
        string bio
        string fb_id
        string insta_id
        string threads_id
        timestamp created_at
        timestamp updated_at
    }

    Friends {
        uuid friend_id PK
        uuid requester_id FK
        uuid receiver_id FK
        enum status "pending, accepted, declined, blocked"
        timestamp created_at
    }

    Activities {
        uuid activity_id PK
        uuid creator_id FK
        enum type "travel, game, event"
        string title
        string description
        timestamp start_time
        timestamp end_time
        string location
        timestamp created_at
    }

    Activity_Participants {
        uuid id PK
        uuid activity_id FK
        uuid user_id FK
        enum status "invited, joined, declined"
        timestamp invited_at
        timestamp joined_at
        text notes
    }

    Notifications {
        uuid notification_id PK
        uuid user_id FK
        enum type "friend_request, activity_invite, activity_update"
        string message
        boolean is_read
        timestamp created_at
    }

    Messages {
        uuid message_id PK
        uuid sender_id FK
        uuid receiver_id FK
        uuid activity_id FK "Optional"
        text content
        timestamp created_at
    }
```

## Real-Time Data Flow

1.  **Friend Requests**:
    *   User A sends a request -> Insert into `Friends` table (status: pending).
    *   **Trigger**: System creates a `Notification` for User B (type: friend_request).

2.  **Activity Invites**:
    *   User A creates an `Activity`.
    *   User A invites User B -> Insert into `Activity_Participants` (status: invited).
    *   **Trigger**: System creates a `Notification` for User B (type: activity_invite).

3.  **Real-time Updates**:
    *   Frontend subscribes to a WebSocket channel for the specific `user_id`.
    *   When a new row is inserted into `Notifications`, the payload is pushed to the client instantly.
