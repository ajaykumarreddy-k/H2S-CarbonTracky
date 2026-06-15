"""
/api/carbon — Live global carbon emissions.
"""
from __future__ import annotations

import logging
from typing import Any

import httpx
from fastapi import APIRouter
from pydantic import BaseModel

from app.core.rate_limit import limiter

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Carbon Live"])

class GlobalEmissionResponse(BaseModel):
    intensity: int
    index: str
    source: str

@router.get("/global", response_model=GlobalEmissionResponse)
async def get_global_carbon() -> GlobalEmissionResponse:
    """
    Fetch live carbon intensity.
    Uses carbonintensity.org.uk as a free public data source proxy,
    falling back to a static realistic value if unavailable.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("https://api.carbonintensity.org.uk/intensity")
            response.raise_for_status()
            data = response.json()
            
            intensity_data = data["data"][0]["intensity"]
            actual = intensity_data.get("actual") or intensity_data.get("forecast")
            index = intensity_data.get("index", "moderate")
            
            return GlobalEmissionResponse(
                intensity=actual,
                index=index,
                source="live API"
            )
    except Exception as e:
        logger.warning(f"Failed to fetch live carbon data: {e}")
        # Fallback realistic global average gCO2/kWh
        return GlobalEmissionResponse(
            intensity=436, 
            index="high",
            source="fallback"
        )
