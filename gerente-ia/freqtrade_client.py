from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List
import httpx
from config import settings


class FreqtradeClient:
    """
    Cliente HTTP assíncrono para comunicação em tempo real com a REST API do Freqtrade.
    Lê trades abertos (/status), histórico de lucro (/profit), performance por moeda (/performance)
    e executa bloqueios de proteção (/locks e /stopbuy).
    """

    def __init__(self) -> None:
        self.base_url = f"{settings.FREQTRADE_API_URL}/api/v1"
        self.auth = httpx.BasicAuth(
            username=settings.FREQTRADE_USERNAME,
            password=settings.FREQTRADE_PASSWORD,
        )

    async def _get(self, endpoint: str, params: Dict[str, Any] | None = None) -> Any:
        async with httpx.AsyncClient(timeout=8.0, auth=self.auth) as client:
            resp = await client.get(f"{self.base_url}{endpoint}", params=params)
            resp.raise_for_status()
            return resp.json()

    async def _post(self, endpoint: str, payload: Dict[str, Any] | None = None) -> Any:
        async with httpx.AsyncClient(timeout=8.0, auth=self.auth) as client:
            resp = await client.post(f"{self.base_url}{endpoint}", json=payload or {})
            resp.raise_for_status()
            return resp.json()

    async def get_open_trades(self) -> List[Dict[str, Any]]:
        """Lê trades abertos em tempo real via GET /api/v1/status."""
        data = await self._get("/status")
        return data if isinstance(data, list) else []

    async def get_profit(self) -> Dict[str, Any]:
        """Lê resumo de lucro geral e métricas via GET /api/v1/profit."""
        data = await self._get("/profit")
        return data if isinstance(data, dict) else {}

    async def get_daily(self, days: int = 7) -> Dict[str, Any]:
        """Lê histórico diário de lucro para cálculo preciso do PnL do dia via GET /api/v1/daily."""
        data = await self._get("/daily", params={"timescale": days})
        return data if isinstance(data, dict) else {}

    async def get_performance(self) -> List[Dict[str, Any]]:
        """Lê performance acumulada por moeda (BTC/USDT:USDT, ETH/USDT:USDT) via GET /api/v1/performance."""
        data = await self._get("/performance")
        return data if isinstance(data, list) else []

    async def get_closed_trades(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Lê histórico recente de trades fechados via GET /api/v1/trades."""
        data = await self._get("/trades", params={"limit": limit})
        if isinstance(data, dict) and "trades" in data:
            return data["trades"]
        return []

    async def get_locks(self) -> Dict[str, Any]:
        """Lista travas ativas via GET /api/v1/locks."""
        data = await self._get("/locks")
        return data if isinstance(data, dict) else {"lock_count": 0, "locks": []}

    async def apply_punishment_lock(
        self,
        reason: str = "Gerente IA: Funcionário TILTADO (Castigo / Proteção de Banca)",
        duration_minutes: int | None = None,
    ) -> Dict[str, Any]:
        """
        Aciona bloqueio temporário de novas entradas na API do Freqtrade:
        1. Cria lock global (*) via POST /api/v1/locks
        2. Aciona POST /api/v1/stopbuy como dupla garantia de proteção da banca
        """
        minutes = duration_minutes or settings.CASTIGO_DURATION_MINUTES
        until_dt = datetime.now(timezone.utc) + timedelta(minutes=minutes)
        until_iso = until_dt.strftime("%Y-%m-%d %H:%M:%SZ")

        results: Dict[str, Any] = {"until": until_iso, "reason": reason}
        try:
            lock_resp = await self._post(
                "/locks",
                payload={
                    "pair": "*",
                    "until": until_iso,
                    "side": "*",
                    "reason": reason,
                },
            )
            results["locks_response"] = lock_resp
        except Exception as exc:
            results["locks_error"] = str(exc)

        try:
            stopbuy_resp = await self._post("/stopbuy")
            results["stopbuy_response"] = stopbuy_resp
        except Exception as exc:
            results["stopbuy_error"] = str(exc)

        return results

    async def release_punishment(self) -> Dict[str, Any]:
        """Libera o Funcionário NFI X8 do castigo recarregando a configuração via /reload_config."""
        return await self._post("/reload_config")


freqtrade_client = FreqtradeClient()

