"""
Internal module present in any app is for admin-only APIs.

Users' internal module:
- Remind (send "Reminder email") signed up users to finish onboarding.
- List all users who have not finished onboarding.
    - Manually approve; fire email function.
    - Add "cause" param; fire email function. Status remains same (unapproved).

Additionally,
- Model to keep track of "potential users" who have not signed up.
    - tags field: "reached out", "not interested", "interested".
- API to modify this model.
"""
