def calculate_burnout_score(answers: dict) -> dict:
    """Calculate burnout score from assessment answers"""
    reverse_scored = ["q10", "q11"]

    total = 0
    max_total = 0

    for q, value in answers.items():
        max_total += 5
        if q in reverse_scored:
            value = 6 - value
        total += value

    score = int((total / max_total) * 100)

    if score < 33:
        severity = "low"
        summary = "Low indicators of burnout."
    elif score < 66:
        severity = "moderate"
        summary = "Moderate burnout indicators."
    else:
        severity = "high"
        summary = "High burnout indicators."

    return {
        "score": score,
        "severity": severity,
        "summary": summary
    }