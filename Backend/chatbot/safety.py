HIGH_RISK_KEYWORDS = [
    "kill myself",
    "killing myself",
    "suicide",
    "suicidal",
    "end my life",
    "end it all",
    "self harm",
    "self-harm",
    "hurt myself",
    "want to die",
    "don't want to live",
    "do not want to live"
]


def assess_risk(user_message: str) -> str:
    msg = user_message.lower()
    for word in HIGH_RISK_KEYWORDS:
        if word in msg:
            return "high"
    return "low"
