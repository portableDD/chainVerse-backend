# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Courses](#courses)
- [Students](#students)
- [Tutor Authentication](./src/docs/tutorAuth.md)
- [Tutor Performance Reports](#tutor-performance-reports)

## Tutor Performance Reports

### Get Course Reports
`GET /tutor/reports/courses`

Retrieve performance reports for all courses owned by the tutor.

**Query Parameters:**
- `interval`: (optional) Filter by time interval (weekly, monthly, quarterly, yearly)

**Response:**
```json
{
    "courses": [
        {
            "id": "course_id",
            "title": "Course Title",
            "totalEnrollments": 100,
            "totalPurchases": 80,
            "rating": 4.5,
            "engagement": 0.75
        }
    ]
}
```

### Get Specific Course Report
`GET /tutor/reports/courses/:id`

Retrieve detailed performance report for a specific course.

**Path Parameters:**
- `id`: Course ID

**Query Parameters:**
- `format`: (optional) Response format ('json' or 'csv')

**Response (JSON):**
```json
{
    "title": "Course Title",
    "description": "Course Description",
    "price": 99.99,
    "rating": 4.5,
    "totalEnrollments": 100,
    "completionRate": 75.5,
    "revenue": 7999.20
}
```

**Response (CSV):**
Downloads a CSV file with the following fields:
- title
- description
- price
- rating
- totalEnrollments
- completionRate
- revenue

### Get Leaderboard
`GET /tutor/reports/leaderboard`

Retrieve a leaderboard based on selected metrics.

**Query Parameters:**
- `metric`: (optional) Sort by metric (purchases, ratings, enrollments, engagement)
- `limit`: (optional) Number of results to return (default: 10)

**Response:**
```json
{
    "leaderboard": [
        {
            "id": "course_id",
            "title": "Course Title",
            "metricValue": 100
        }
    ]
}
```
